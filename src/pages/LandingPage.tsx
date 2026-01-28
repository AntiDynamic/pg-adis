import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Rating } from '../components/ui/Rating';
import { 
  VerifiedIcon, 
  SearchIcon, 
  ShieldIcon, 
  UsersIcon,
  FoodIcon,
  SparklesIcon,
  CheckIcon 
} from '../components/ui/Icons';

/**
 * LANDING PAGE - Main entry point for users
 * 
 * Sections:
 * 1. Hero with search
 * 2. Trust indicators
 * 3. Value propositions
 * 4. Social proof
 * 5. CTA
 */

export const LandingPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Navigation */}
      <nav className="border-b border-gray-800 backdrop-blur-xl bg-dark-900/80 sticky top-0 z-50">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-trust-500 rounded-xl flex items-center justify-center">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">PGLife</span>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              <Link to="/pg-listing" className="text-gray-300 hover:text-white transition">Find PG</Link>
              <Link to="/roommate-matching" className="text-gray-300 hover:text-white transition">Match Roommates</Link>
              <Link to="/mess-discovery" className="text-gray-300 hover:text-white transition">Discover Food</Link>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">Sign In</Button>
              <Link to="/pg-listing">
                <Button variant="primary" size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            {/* Trust Badge */}
            <Badge variant="verified" icon={<VerifiedIcon className="w-4 h-4" />} className="mb-6">
              Trusted by 50,000+ students across India
            </Badge>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance">
              Find Your Perfect{' '}
              <span className="text-gradient">Student Home</span>
              <br />
              in Minutes
            </h1>

            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Verified PGs · Smart Roommate Matching · Quality Mess Food
              <br />
              Everything you need to thrive in your new city.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Search by city, area, or university..."
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    icon={<SearchIcon />}
                  />
                </div>
                <Link to="/pg-listing">
                  <Button variant="primary" size="lg" className="md:w-auto w-full">
                    Search PGs
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quick City Links */}
            <div className="flex flex-wrap justify-center gap-3">
              <span className="text-gray-500 text-sm">Popular:</span>
              {['Mumbai', 'Bangalore', 'Delhi', 'Pune', 'Hyderabad'].map((city) => (
                <button
                  key={city}
                  className="px-4 py-2 bg-surface hover:bg-surface-hover rounded-lg text-sm text-gray-300 border border-gray-700 transition"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 border-y border-gray-800">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-trust-400 mb-2">50K+</div>
              <div className="text-gray-400 text-sm">Verified Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-trust-400 mb-2">10K+</div>
              <div className="text-gray-400 text-sm">Verified PGs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-trust-400 mb-2">95%</div>
              <div className="text-gray-400 text-sm">Match Success</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-trust-400 mb-2">25+</div>
              <div className="text-gray-400 text-sm">Cities Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <Badge variant="new" className="mb-4">Why Choose PGLife</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Everything You Need,
              <br />
              <span className="text-gradient">All in One Place</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <Card hoverable elevated className="text-center p-8">
              <div className="w-16 h-16 bg-trust-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 verified-glow">
                <ShieldIcon className="w-8 h-8 text-trust-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">100% Verified PGs</h3>
              <p className="text-gray-400 leading-relaxed">
                Every PG is physically verified by our team. Real photos, honest reviews, transparent pricing.
              </p>
              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-trust-400">
                <CheckIcon className="w-4 h-4" />
                <span>Physical verification</span>
              </div>
            </Card>

            {/* Feature 2 */}
            <Card hoverable elevated className="text-center p-8">
              <div className="w-16 h-16 bg-trust-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 verified-glow">
                <UsersIcon className="w-8 h-8 text-trust-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Roommate Matching</h3>
              <p className="text-gray-400 leading-relaxed">
                AI-powered compatibility matching based on lifestyle, habits, and preferences. Find your perfect match.
              </p>
              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-trust-400">
                <CheckIcon className="w-4 h-4" />
                <span>95% compatibility rate</span>
              </div>
            </Card>

            {/* Feature 3 */}
            <Card hoverable elevated className="text-center p-8">
              <div className="w-16 h-16 bg-trust-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 verified-glow">
                <FoodIcon className="w-8 h-8 text-trust-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Quality Mess Discovery</h3>
              <p className="text-gray-400 leading-relaxed">
                Find the best mess food near you. Daily menus, hygiene ratings, and honest student reviews.
              </p>
              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-trust-400">
                <CheckIcon className="w-4 h-4" />
                <span>5000+ rated messes</span>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof - Testimonials */}
      <section className="section-padding bg-gradient-to-b from-dark-900 to-dark-800">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Students Say
            </h2>
            <p className="text-gray-400">Real reviews from real students</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Priya Sharma",
                role: "Engineering Student, Mumbai",
                rating: 5,
                text: "Found my perfect PG in just 2 days! The verification process gave me confidence, and my roommate match has been amazing."
              },
              {
                name: "Rahul Kumar",
                role: "MBA Student, Bangalore",
                rating: 5,
                text: "The mess discovery feature is a game-changer. No more experimenting with random places. Quality food ratings are spot-on!"
              },
              {
                name: "Sneha Patel",
                role: "Medical Student, Pune",
                rating: 5,
                text: "Moving to a new city was stressful, but PGLife made it so easy. The area safety info and verified listings are incredibly helpful."
              }
            ].map((testimonial, idx) => (
              <Card key={idx} className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-trust-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name[0]}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-100">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                  </div>
                  <VerifiedIcon className="w-5 h-5 text-trust-400" />
                </div>
                <Rating rating={testimonial.rating} size="sm" showValue={false} className="mb-3" />
                <p className="text-gray-300 leading-relaxed">{testimonial.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding">
        <div className="container-custom">
          <Card className="p-12 text-center bg-gradient-to-br from-surface to-surface-elevated border-trust-500/20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Find Your Perfect Home?
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Join 50,000+ students who found their ideal PG, roommates, and food through PGLife
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg">
                Get Started for Free
              </Button>
              <Button variant="outline" size="lg">
                View PG Listings
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-trust-500 rounded-lg flex items-center justify-center">
                  <SparklesIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-gradient">PGLife</span>
              </div>
              <p className="text-gray-400 text-sm">
                Making student living easier, one match at a time.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">For Students</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-trust-400 transition">Find PG</a></li>
                <li><a href="#" className="hover:text-trust-400 transition">Match Roommates</a></li>
                <li><a href="#" className="hover:text-trust-400 transition">Discover Food</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-trust-400 transition">About Us</a></li>
                <li><a href="#" className="hover:text-trust-400 transition">How it Works</a></li>
                <li><a href="#" className="hover:text-trust-400 transition">Safety</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-trust-400 transition">Help Center</a></li>
                <li><a href="#" className="hover:text-trust-400 transition">Contact Us</a></li>
                <li><a href="#" className="hover:text-trust-400 transition">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            © 2026 PGLife. Built for Indian students, by students.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
