/**
 * PG OWNER VERIFICATION SYSTEM - INTEGRATION EXAMPLE
 * 
 * This file demonstrates how to integrate the PG Owner Verification System
 * into your existing React application.
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import PGOwnerSignupPage from './pages/PGOwnerSignupPage';
import PGListingPage from './pages/PGListingPage';
import { getVerifiedPGs } from './data/mockData';
import VerificationStatusBadge from './components/VerificationStatusBadge';

// ============================================================
// EXAMPLE 1: Add Owner Signup Route
// ============================================================

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Existing routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/browse-pgs" element={<PGListingPage />} />
        
        {/* NEW: PG Owner signup route */}
        <Route path="/become-owner" element={<PGOwnerSignupPage />} />
      </Routes>
    </BrowserRouter>
  );
}

// ============================================================
// EXAMPLE 2: Update Dashboard to Show Only Verified PGs
// ============================================================

function DashboardPage() {
  // ❌ OLD: Shows all PGs (including unverified)
  // const pgs = pgs.filter(pg => pg.city === userCity);
  
  // ✅ NEW: Shows only verified PGs
  const verifiedPGs = getVerifiedPGs().filter(pg => pg.city === userCity);
  
  return (
    <div>
      <h1>Available PGs in {userCity}</h1>
      {verifiedPGs.map(pg => (
        <PGCard key={pg.id} pg={pg} />
      ))}
    </div>
  );
}

// ============================================================
// EXAMPLE 3: Add Verification Badge to PG Cards
// ============================================================

function PGCard({ pg }: { pg: PG }) {
  return (
    <div className="pg-card">
      <img src={pg.images[0]} alt={pg.name} />
      
      <div className="pg-header">
        <h3>{pg.name}</h3>
        
        {/* Show verification badge */}
        {pg.verificationStatus === 'verified' && (
          <VerificationStatusBadge status="verified" size="sm" />
        )}
      </div>
      
      <p>₹{pg.rent}/month</p>
    </div>
  );
}

// ============================================================
// EXAMPLE 4: Owner Dashboard - Show All PGs with Status
// ============================================================

function OwnerDashboard({ ownerId }: { ownerId: string }) {
  const ownerPGs = getPGsByOwner(ownerId);
  
  return (
    <div>
      <h1>My PG Listings</h1>
      
      {ownerPGs.map(pg => (
        <div key={pg.id} className="owner-pg-card">
          <h3>{pg.name}</h3>
          
          {/* Show verification status to owner */}
          <VerificationStatusBadge 
            status={pg.verificationStatus || 'pending_verification'} 
            size="md"
            showLabel={true}
          />
          
          {/* Status-specific messages */}
          {pg.verificationStatus === 'pending_verification' && (
            <p className="text-yellow-600">
              ⏳ Under review. You'll hear from us within 24-48 hours.
            </p>
          )}
          
          {pg.verificationStatus === 'verified' && (
            <p className="text-green-600">
              ✓ Live and visible to students!
            </p>
          )}
          
          {pg.verificationStatus === 'rejected' && (
            <p className="text-red-600">
              ✕ Rejected. Check your email for details and resubmit.
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

// ============================================================
// EXAMPLE 5: Map Integration - Only Show Verified PGs
// ============================================================

function PGMap() {
  // Only plot verified PGs on the map
  const verifiedPGs = getVerifiedPGs();
  
  return (
    <MapContainer>
      {verifiedPGs.map(pg => (
        <Marker 
          key={pg.id}
          position={[pg.lat, pg.lng]}
          icon={pg.verificationStatus === 'verified' ? verifiedIcon : defaultIcon}
        >
          <Popup>
            <h4>{pg.name}</h4>
            <VerificationStatusBadge status="verified" size="sm" />
            <p>₹{pg.rent}/month</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

// ============================================================
// EXAMPLE 6: Search & Filter - Exclude Unverified PGs
// ============================================================

function SearchPGs({ city, maxRent }: { city: string; maxRent: number }) {
  const results = getVerifiedPGs()
    .filter(pg => pg.city === city)
    .filter(pg => pg.rent <= maxRent)
    .sort((a, b) => a.rent - b.rent);
  
  return (
    <div>
      <h2>Found {results.length} verified PGs</h2>
      {results.map(pg => <PGCard key={pg.id} pg={pg} />)}
    </div>
  );
}

// ============================================================
// EXAMPLE 7: Add "List Your PG" CTA to Landing Page
// ============================================================

function LandingPage() {
  return (
    <div>
      <Hero />
      
      {/* Existing CTAs for students */}
      <Button href="/browse-pgs">Find a PG</Button>
      <Button href="/find-roommates">Find Roommates</Button>
      
      {/* NEW: CTA for PG owners */}
      <div className="owner-cta bg-trust-500/10 border border-trust-500/20 rounded-xl p-8 mt-8">
        <h3 className="text-2xl font-bold mb-2">Own a PG?</h3>
        <p className="text-gray-400 mb-4">
          List your property and reach thousands of verified students
        </p>
        <Button href="/become-owner" variant="primary">
          Register Your PG →
        </Button>
      </div>
    </div>
  );
}

// ============================================================
// EXAMPLE 8: Admin Verification Panel (Backend Integration)
// ============================================================

function AdminVerificationPanel() {
  const pendingPGs = pgs.filter(pg => pg.verificationStatus === 'pending_verification');
  
  const handleVerify = async (pgId: string, approved: boolean, reason?: string) => {
    await fetch('/api/admin/verify-pg', {
      method: 'POST',
      body: JSON.stringify({
        pgId,
        status: approved ? 'verified' : 'rejected',
        rejectionReason: reason
      })
    });
    
    // Refresh list
    window.location.reload();
  };
  
  return (
    <div className="admin-panel">
      <h1>Pending Verifications ({pendingPGs.length})</h1>
      
      {pendingPGs.map(pg => (
        <div key={pg.id} className="verification-card">
          <h3>{pg.name}</h3>
          <p>Owner: {pg.ownerId}</p>
          
          {/* Show proofs */}
          <div className="proofs">
            <h4>Ownership Document:</h4>
            <img src={pg.ownershipProof?.ownershipDocument.fileUrl} alt="Document" />
            
            <h4>Room Photos:</h4>
            <div className="grid grid-cols-3 gap-2">
              {pg.ownershipProof?.roomPhotos.map((photo, i) => (
                <img key={i} src={photo.url} alt={`Room ${i+1}`} />
              ))}
            </div>
            
            <h4>Video Walkthrough:</h4>
            <video controls src={pg.ownershipProof?.videoWalkthrough.url} />
          </div>
          
          {/* Action buttons */}
          <div className="actions">
            <button 
              onClick={() => handleVerify(pg.id, true)}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              ✓ Approve
            </button>
            <button 
              onClick={() => {
                const reason = prompt('Rejection reason:');
                if (reason) handleVerify(pg.id, false, reason);
              }}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              ✕ Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// EXAMPLE 9: Backend API Endpoints (Node.js/Express)
// ============================================================

/*
// api/routes/pgOwner.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Submit new PG listing
router.post('/submit-pg', 
  upload.fields([
    { name: 'ownershipDoc', maxCount: 1 },
    { name: 'roomPhotos', maxCount: 10 },
    { name: 'videoWalkthrough', maxCount: 1 }
  ]),
  async (req, res) => {
    const { ownerInfo, pgDetails } = req.body;
    const files = req.files;
    
    // Create PG listing
    const newPG = await PG.create({
      ...pgDetails,
      ownerId: ownerInfo.id,
      verificationStatus: 'pending_verification',
      verified: false,
      ownershipProof: {
        ownershipDocument: files.ownershipDoc[0],
        roomPhotos: files.roomPhotos,
        videoWalkthrough: files.videoWalkthrough[0]
      }
    });
    
    // Send notification email
    await sendEmail(ownerInfo.email, 'PG Submission Received', 
      'Your PG listing is under review. We will notify you within 24-48 hours.');
    
    res.json({ success: true, pgId: newPG.id });
  }
);

// Admin verification endpoint
router.post('/admin/verify-pg', requireAdmin, async (req, res) => {
  const { pgId, status, rejectionReason } = req.body;
  
  await PG.update(pgId, {
    verificationStatus: status,
    verified: status === 'verified',
    verifiedAt: status === 'verified' ? new Date() : null,
    rejectionReason
  });
  
  // Notify owner
  const pg = await PG.findById(pgId);
  const owner = await Owner.findById(pg.ownerId);
  
  await sendEmail(owner.email, 
    status === 'verified' ? 'PG Verified!' : 'PG Verification Update',
    status === 'verified' 
      ? 'Congratulations! Your PG is now live and visible to students.'
      : `Your PG submission was not approved. Reason: ${rejectionReason}`
  );
  
  res.json({ success: true });
});

module.exports = router;
*/

// ============================================================
// BEST PRACTICES SUMMARY
// ============================================================

/*
1. ✅ ALWAYS use getVerifiedPGs() for student-facing pages
2. ✅ Show verification badges on PG cards
3. ✅ Keep owner dashboard separate with all statuses visible
4. ✅ Send email notifications on status changes
5. ✅ Implement admin panel for manual verification
6. ✅ Store original file names to detect duplicates
7. ✅ Geo-verify coordinates with Google Maps API
8. ✅ Rate limit: Max 3 submissions per owner per month
9. ✅ Ban policy: 3 strikes for fake documents
10. ✅ Re-verify yearly to maintain trust

Security First. Trust Always.
*/

export default App;
