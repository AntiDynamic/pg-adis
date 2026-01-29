import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface PG {
  id: string;
  name: string;
  address: string;
  rent: number;
  lat: number;
  lng: number;
  verification_status: string;
  images?: string[];
}

export function VerifiedPGList() {
  const [pgs, setPgs] = useState<PG[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVerifiedPGs();
  }, []);

  async function fetchVerifiedPGs() {
    try {
      setLoading(true);
      setError(null);

      // Fetch verified PGs
      const { data: pgsData, error: pgsError } = await supabase
        .from('pgs')
        .select('*')
        .eq('verification_status', 'verified');

      if (pgsError) throw pgsError;

      // Fetch images for each PG
      const pgsWithImages = await Promise.all(
        (pgsData || []).map(async (pg) => {
          const { data: mediaData } = await supabase
            .from('pg_media')
            .select('url')
            .eq('pg_id', pg.id)
            .eq('type', 'image')
            .limit(1)
            .single();

          return {
            ...pg,
            images: mediaData ? [mediaData.url] : []
          };
        })
      );

      setPgs(pgsWithImages);
    } catch (err) {
      console.error('Error fetching PGs:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch PGs');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Error: {error}</p>
        <Button onClick={fetchVerifiedPGs} variant="outline" className="mt-2">
          Retry
        </Button>
      </div>
    );
  }

  if (pgs.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No verified PGs found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pgs.map((pg) => (
        <Card key={pg.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          {pg.images && pg.images.length > 0 && (
            <img
              src={pg.images[0]}
              alt={pg.name}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-4">
            <h3 className="text-xl font-semibold text-gray-100 mb-2">{pg.name}</h3>
            <p className="text-gray-400 text-sm mb-2">{pg.address}</p>
            <div className="flex items-center justify-between mt-4">
              <span className="text-2xl font-bold text-blue-600">₹{pg.rent.toLocaleString()}</span>
              <span className="text-xs text-green-500 font-medium">✓ Verified</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
