import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import PGProofUpload from '../components/PGProofUpload';
import { PGOwnerSignupData, RoomType } from '../types';

type SignupStep = 1 | 2 | 3;

export default function PGOwnerSignupPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<SignupStep>(1);
  const [formData, setFormData] = useState<PGOwnerSignupData>({
    ownerInfo: {
      name: '',
      email: '',
      phone: '',
      alternatePhone: '',
      aadharNumber: ''
    },
    pgDetails: {
      name: '',
      genderType: 'unisex',
      address: {
        street: '',
        area: '',
        city: '',
        state: '',
        pincode: ''
      },
      totalBeds: 0,
      availableBeds: 0,
      roomTypes: [],
      rent: 0,
      securityDeposit: 0,
      amenities: [],
      rules: [],
      messIncluded: false,
      noticePeriod: 30
    },
    proofs: {
      ownershipDoc: null,
      roomPhotos: [],
      videoWalkthrough: null
    }
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [customRule, setCustomRule] = useState('');

  const availableAmenities = [
    'WiFi', 'AC', 'Laundry', 'Geyser', 'Refrigerator', 
    'TV', 'Parking', 'Security', 'Backup Power', 'Water Purifier'
  ];

  // Step 1: Owner Basic Info + OTP
  const validateStep1 = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.ownerInfo.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.ownerInfo.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Valid email is required';
    }
    if (!formData.ownerInfo.phone.match(/^\d{10}$/)) {
      newErrors.phone = 'Valid 10-digit phone number required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStep1Submit = () => {
    if (validateStep1()) {
      // In real app: Send OTP, verify, then proceed
      alert('OTP sent to ' + formData.ownerInfo.phone + ' (Demo: Auto-verified)');
      setCurrentStep(2);
    }
  };

  // Step 2: PG Details
  const validateStep2 = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.pgDetails.name.trim()) {
      newErrors.pgName = 'PG name is required';
    }
    if (!formData.pgDetails.address.street.trim()) {
      newErrors.street = 'Street address is required';
    }
    if (!formData.pgDetails.address.area.trim()) {
      newErrors.area = 'Area is required';
    }
    if (!formData.pgDetails.address.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (formData.pgDetails.totalBeds < 1) {
      newErrors.totalBeds = 'At least 1 bed required';
    }
    if (formData.pgDetails.rent < 1000) {
      newErrors.rent = 'Rent must be at least ₹1000';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStep2Submit = () => {
    if (validateStep2()) {
      setCurrentStep(3);
    }
  };

  // Step 3: Proof Upload
  const handleProofUploadComplete = (proofs: PGOwnerSignupData['proofs']) => {
    const finalData = {
      ...formData,
      proofs
    };

    // Save to backend (mock)
    console.log('Submitting PG Owner Signup:', finalData);
    
    // Simulate API call
    setTimeout(() => {
      alert('✓ PG listing submitted successfully! Status: Pending Verification\n\nYou will receive an email within 24-48 hours once verification is complete.');
      navigate('/');
    }, 1000);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-4 mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition ${
              step === currentStep
                ? 'bg-trust-500 text-white'
                : step < currentStep
                ? 'bg-green-500 text-white'
                : 'bg-surface-elevated text-gray-500'
            }`}
          >
            {step < currentStep ? '✓' : step}
          </div>
          {step < 3 && (
            <div
              className={`w-16 h-1 ${
                step < currentStep ? 'bg-green-500' : 'bg-surface-elevated'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <Card className="p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-100 mb-6">Owner Information</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Full Name <span className="text-red-400">*</span>
          </label>
          <Input
            value={formData.ownerInfo.name}
            onChange={(e) => setFormData({
              ...formData,
              ownerInfo: { ...formData.ownerInfo, name: e.target.value }
            })}
            placeholder="Enter your full name"
          />
          {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email <span className="text-red-400">*</span>
          </label>
          <Input
            type="email"
            value={formData.ownerInfo.email}
            onChange={(e) => setFormData({
              ...formData,
              ownerInfo: { ...formData.ownerInfo, email: e.target.value }
            })}
            placeholder="your.email@example.com"
          />
          {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Phone Number <span className="text-red-400">*</span>
          </label>
          <Input
            value={formData.ownerInfo.phone}
            onChange={(e) => setFormData({
              ...formData,
              ownerInfo: { ...formData.ownerInfo, phone: e.target.value }
            })}
            placeholder="10-digit mobile number"
            maxLength={10}
          />
          {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Alternate Phone (Optional)
          </label>
          <Input
            value={formData.ownerInfo.alternatePhone}
            onChange={(e) => setFormData({
              ...formData,
              ownerInfo: { ...formData.ownerInfo, alternatePhone: e.target.value }
            })}
            placeholder="Alternate contact number"
            maxLength={10}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Aadhar Number (Optional - for KYC)
          </label>
          <Input
            value={formData.ownerInfo.aadharNumber}
            onChange={(e) => setFormData({
              ...formData,
              ownerInfo: { ...formData.ownerInfo, aadharNumber: e.target.value }
            })}
            placeholder="12-digit Aadhar number"
            maxLength={12}
          />
        </div>

        <Button variant="primary" onClick={handleStep1Submit} fullWidth>
          Send OTP & Continue →
        </Button>
      </div>
    </Card>
  );

  const renderStep2 = () => (
    <Card className="p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-100 mb-6">PG Details</h2>
      
      <div className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              PG Name <span className="text-red-400">*</span>
            </label>
            <Input
              value={formData.pgDetails.name}
              onChange={(e) => setFormData({
                ...formData,
                pgDetails: { ...formData.pgDetails, name: e.target.value }
              })}
              placeholder="e.g., Sunshine Boys PG"
            />
            {errors.pgName && <p className="text-red-400 text-sm mt-1">{errors.pgName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Gender Type <span className="text-red-400">*</span>
            </label>
            <select
              value={formData.pgDetails.genderType}
              onChange={(e) => setFormData({
                ...formData,
                pgDetails: { ...formData.pgDetails, genderType: e.target.value as 'male' | 'female' | 'unisex' }
              })}
              className="w-full bg-surface-elevated border border-gray-700 rounded-lg px-4 py-3 text-gray-100"
            >
              <option value="male">Male Only</option>
              <option value="female">Female Only</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Mess Included?
            </label>
            <select
              value={formData.pgDetails.messIncluded ? 'yes' : 'no'}
              onChange={(e) => setFormData({
                ...formData,
                pgDetails: { ...formData.pgDetails, messIncluded: e.target.value === 'yes' }
              })}
              className="w-full bg-surface-elevated border border-gray-700 rounded-lg px-4 py-3 text-gray-100"
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>

        {/* Address */}
        <div className="border-t border-gray-800 pt-6">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">Address</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Street Address <span className="text-red-400">*</span>
              </label>
              <Input
                value={formData.pgDetails.address.street}
                onChange={(e) => setFormData({
                  ...formData,
                  pgDetails: {
                    ...formData.pgDetails,
                    address: { ...formData.pgDetails.address, street: e.target.value }
                  }
                })}
                placeholder="House/Building number and street name"
              />
              {errors.street && <p className="text-red-400 text-sm mt-1">{errors.street}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Area/Locality <span className="text-red-400">*</span>
              </label>
              <Input
                value={formData.pgDetails.address.area}
                onChange={(e) => setFormData({
                  ...formData,
                  pgDetails: {
                    ...formData.pgDetails,
                    address: { ...formData.pgDetails.address, area: e.target.value }
                  }
                })}
                placeholder="e.g., Kothrud"
              />
              {errors.area && <p className="text-red-400 text-sm mt-1">{errors.area}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                City <span className="text-red-400">*</span>
              </label>
              <Input
                value={formData.pgDetails.address.city}
                onChange={(e) => setFormData({
                  ...formData,
                  pgDetails: {
                    ...formData.pgDetails,
                    address: { ...formData.pgDetails.address, city: e.target.value }
                  }
                })}
                placeholder="e.g., Pune"
              />
              {errors.city && <p className="text-red-400 text-sm mt-1">{errors.city}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">State</label>
              <Input
                value={formData.pgDetails.address.state}
                onChange={(e) => setFormData({
                  ...formData,
                  pgDetails: {
                    ...formData.pgDetails,
                    address: { ...formData.pgDetails.address, state: e.target.value }
                  }
                })}
                placeholder="e.g., Maharashtra"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Pincode</label>
              <Input
                value={formData.pgDetails.address.pincode}
                onChange={(e) => setFormData({
                  ...formData,
                  pgDetails: {
                    ...formData.pgDetails,
                    address: { ...formData.pgDetails.address, pincode: e.target.value }
                  }
                })}
                placeholder="6-digit pincode"
                maxLength={6}
              />
            </div>
          </div>
        </div>

        {/* Capacity & Pricing */}
        <div className="border-t border-gray-800 pt-6">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">Capacity & Pricing</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Total Beds <span className="text-red-400">*</span>
              </label>
              <Input
                type="number"
                value={formData.pgDetails.totalBeds}
                onChange={(e) => setFormData({
                  ...formData,
                  pgDetails: { ...formData.pgDetails, totalBeds: parseInt(e.target.value) || 0 }
                })}
                placeholder="Total capacity"
              />
              {errors.totalBeds && <p className="text-red-400 text-sm mt-1">{errors.totalBeds}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Available Beds
              </label>
              <Input
                type="number"
                value={formData.pgDetails.availableBeds}
                onChange={(e) => setFormData({
                  ...formData,
                  pgDetails: { ...formData.pgDetails, availableBeds: parseInt(e.target.value) || 0 }
                })}
                placeholder="Currently available"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Monthly Rent (₹) <span className="text-red-400">*</span>
              </label>
              <Input
                type="number"
                value={formData.pgDetails.rent}
                onChange={(e) => setFormData({
                  ...formData,
                  pgDetails: { ...formData.pgDetails, rent: parseInt(e.target.value) || 0 }
                })}
                placeholder="Starting rent"
              />
              {errors.rent && <p className="text-red-400 text-sm mt-1">{errors.rent}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Security Deposit (₹)
              </label>
              <Input
                type="number"
                value={formData.pgDetails.securityDeposit}
                onChange={(e) => setFormData({
                  ...formData,
                  pgDetails: { ...formData.pgDetails, securityDeposit: parseInt(e.target.value) || 0 }
                })}
                placeholder="Refundable deposit"
              />
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="border-t border-gray-800 pt-6">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">Amenities</h3>
          <div className="grid grid-cols-3 gap-3">
            {availableAmenities.map((amenity) => (
              <label
                key={amenity}
                className="flex items-center gap-2 p-3 bg-surface-elevated rounded-lg cursor-pointer hover:bg-trust-500/10 transition"
              >
                <input
                  type="checkbox"
                  checked={selectedAmenities.includes(amenity)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedAmenities([...selectedAmenities, amenity]);
                    } else {
                      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
                    }
                  }}
                  className="w-4 h-4"
                />
                <span className="text-gray-300">{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <Button variant="outline" onClick={() => setCurrentStep(1)} fullWidth>
            ← Back
          </Button>
          <Button variant="primary" onClick={handleStep2Submit} fullWidth>
            Continue to Upload Proofs →
          </Button>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-surface py-12 px-4">
      <div className="container-custom max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-100 mb-2">Register Your PG</h1>
          <p className="text-gray-400">Complete verification to list your property</p>
        </div>

        {renderStepIndicator()}

        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && (
          <div className="max-w-4xl mx-auto">
            <PGProofUpload
              onComplete={handleProofUploadComplete}
              onBack={() => setCurrentStep(2)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
