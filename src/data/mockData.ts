// Mock data with real coordinates for Indian universities and PGs

export interface University {
  id: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
  address?: string;
}

export interface PG {
  id: string;
  name: string;
  lat: number;
  lng: number;
  universityId: string; // Which university this PG is near
  rent: number;
  rating: number;
  verified: boolean;
  verificationStatus?: 'pending_verification' | 'verified' | 'rejected' | 'resubmission_required'; // Owner verification status
  gender: 'male' | 'female' | 'unisex';
  amenities: string[];
  distance: number; // Distance from university in km
  ownerId?: string; // Added for owner tracking
}

export interface Student {
  id: string;
  name: string;
  universityId: string;
  budgetMin: number;
  budgetMax: number;
  sleepSchedule: number; // 1-5 (1=early bird, 5=night owl)
  cleanliness: number; // 1-5 (1=messy, 5=very clean)
  foodHabit: 'veg' | 'non-veg' | 'vegan';
  smoking: boolean;
  drinking: boolean;
  studyHours: number; // 1-5 (1=minimal, 5=intensive)
}

// Real universities in major Indian cities
export const universities: University[] = [
  // Mumbai
  {
    id: 'iit-bombay',
    name: 'IIT Bombay',
    city: 'Mumbai',
    lat: 19.1334,
    lng: 72.9133,
  },
  {
    id: 'mumbai-university',
    name: 'University of Mumbai',
    city: 'Mumbai',
    lat: 18.9750,
    lng: 72.8258,
  },
  // Bangalore
  {
    id: 'iisc-bangalore',
    name: 'IISc Bangalore',
    city: 'Bangalore',
    lat: 13.0221,
    lng: 77.5671,
  },
  {
    id: 'bangalore-university',
    name: 'Bangalore University',
    city: 'Bangalore',
    lat: 12.9596,
    lng: 77.4991,
  },
  // Delhi
  {
    id: 'delhi-university',
    name: 'Delhi University (North Campus)',
    city: 'Delhi',
    lat: 28.6877,
    lng: 77.2095,
  },
  {
    id: 'jnu-delhi',
    name: 'Jawaharlal Nehru University',
    city: 'Delhi',
    lat: 28.5403,
    lng: 77.1659,
  },
  // Pune - Universities
  {
    id: 'sppu-pune',
    name: 'Savitribai Phule Pune University',
    city: 'Pune',
    lat: 18.5466,
    lng: 73.8250,
  },
  {
    id: 'adypu-pune',
    name: 'Ajeenkya D Y Patil University',
    city: 'Pune',
    lat: 18.7064,
    lng: 73.8958,
  },
  {
    id: 'dpu-pune',
    name: 'Dr. D Y Patil Dnyan Prasad University',
    city: 'Pune',
    lat: 18.6017,
    lng: 73.7354,
  },
  {
    id: 'siu-pune',
    name: 'Symbiosis International University',
    city: 'Pune',
    lat: 18.5089,
    lng: 73.8046,
  },
  {
    id: 'sau-pune',
    name: 'Spicer Adventist University',
    city: 'Pune',
    lat: 18.5584,
    lng: 73.8076,
  },
  {
    id: 'christ-pune',
    name: 'Christ University - Pune (Lavasa Campus)',
    city: 'Pune',
    lat: 18.4081,
    lng: 73.5080,
  },
  {
    id: 'paiu-pune',
    name: 'Dr. P. A. Inamdar University',
    city: 'Pune',
    lat: 18.5314,
    lng: 73.8446,
  },
  {
    id: 'vu-pune',
    name: 'Vishwakarma University',
    city: 'Pune',
    lat: 18.4574,
    lng: 73.8543,
  },
  {
    id: 'pcu-pune',
    name: 'Pimpri Chinchwad University (PCU)',
    city: 'Pune',
    lat: 18.728565,
    lng: 73.674178,
    address: '49 50, Plot No. 44, Mohitewadi Rd, Mohitewadi, Maharashtra 412106',
  },
  
  // Pune - Engineering Colleges
  {
    id: 'aissms-pune',
    name: 'AISSMS College of Engineering',
    city: 'Pune',
    lat: 18.5285,
    lng: 73.8748,
  },
  {
    id: 'coep-pune',
    name: 'College of Engineering Pune (COEP)',
    city: 'Pune',
    lat: 18.5290,
    lng: 73.8567,
  },
  {
    id: 'i2it-pune',
    name: 'International Institute of Information Technology (I²IT)',
    city: 'Pune',
    lat: 18.5204,
    lng: 73.8567,
  },
  {
    id: 'vit-pune',
    name: 'Vishwakarma Institute of Technology (VIT)',
    city: 'Pune',
    lat: 18.4633,
    lng: 73.8679,
  },
  {
    id: 'viit-pune',
    name: 'Vishwakarma Institute of Information Technology (VIIT)',
    city: 'Pune',
    lat: 18.4580,
    lng: 73.9093,
  },
  {
    id: 'scoe-pune',
    name: 'Sinhgad College of Engineering',
    city: 'Pune',
    lat: 18.4628,
    lng: 73.8160,
  },
  {
    id: 'mit-pune',
    name: 'MIT College of Engineering',
    city: 'Pune',
    lat: 18.5287,
    lng: 73.8081,
  },
  {
    id: 'dypit-pune',
    name: 'Dr. D. Y. Patil Institute of Technology',
    city: 'Pune',
    lat: 18.6421,
    lng: 73.7640,
  },
  {
    id: 'cummins-pune',
    name: "MKSSS Cummins College of Engineering for Women",
    city: 'Pune',
    lat: 18.5074,
    lng: 73.8232,
  },
  {
    id: 'mmcoe-pune',
    name: "Marathwada Mitra Mandal's College of Engineering",
    city: 'Pune',
    lat: 18.5096,
    lng: 73.8229,
  },
  {
    id: 'scscoe-pune',
    name: 'Shri Chhatrapati Shivajiraje College of Engineering',
    city: 'Pune',
    lat: 18.4457,
    lng: 73.8654,
  },
  {
    id: 'pccoer-pune',
    name: 'Pimpri Chinchwad College of Engineering & Research',
    city: 'Pune',
    lat: 18.6515,
    lng: 73.7598,
  },
  {
    id: 'pccoe-pune',
    name: 'Pimpri Chinchwad College of Engineering (PCCOE)',
    city: 'Pune',
    lat: 18.6298,
    lng: 73.8088,
  },
  
  // Pune - Arts, Science & Commerce Colleges
  {
    id: 'fergusson-pune',
    name: 'Fergusson College',
    city: 'Pune',
    lat: 18.5196,
    lng: 73.8343,
  },
  {
    id: 'garware-pune',
    name: 'Abasaheb Garware College of Arts & Science',
    city: 'Pune',
    lat: 18.5089,
    lng: 73.8279,
  },
  {
    id: 'wadia-pune',
    name: 'Nowrosjee Wadia College',
    city: 'Pune',
    lat: 18.5314,
    lng: 73.8749,
  },
  {
    id: 'modern-pune',
    name: 'Modern College of Arts, Science and Commerce',
    city: 'Pune',
    lat: 18.5304,
    lng: 73.8431,
  },
  {
    id: 'cwit-pune',
    name: 'Cusrow Wadia Institute of Technology',
    city: 'Pune',
    lat: 18.5314,
    lng: 73.8750,
  },
  {
    id: 'abeda-pune',
    name: 'Abeda Inamdar College For Girls',
    city: 'Pune',
    lat: 18.5195,
    lng: 73.8553,
  },
  {
    id: 'shahu-pune',
    name: "A.B.M.S. Parishad's Shri Shahu Mandir Mahavidyalaya",
    city: 'Pune',
    lat: 18.5204,
    lng: 73.8567,
  },
  {
    id: 'bmcc-pune',
    name: 'Brihan Maharashtra College of Commerce (BMCC)',
    city: 'Pune',
    lat: 18.5204,
    lng: 73.8560,
  },
  
  // Pune - Management & Professional Institutes
  {
    id: 'nibm-pune',
    name: 'National Institute of Bank Management (NIBM)',
    city: 'Pune',
    lat: 18.4574,
    lng: 73.9093,
  },
  {
    id: 'imdr-pune',
    name: 'Institute of Management Development & Research (IMDR)',
    city: 'Pune',
    lat: 18.5204,
    lng: 73.8343,
  },
  {
    id: 'nia-pune',
    name: 'National Insurance Academy (NIA)',
    city: 'Pune',
    lat: 18.5089,
    lng: 73.8279,
  },
  {
    id: 'sit-pune',
    name: 'Symbiosis Institute of Technology (SIT)',
    city: 'Pune',
    lat: 18.5611,
    lng: 73.7373,
  },
  // Chennai
  {
    id: 'iit-madras',
    name: 'IIT Madras',
    city: 'Chennai',
    lat: 12.9914,
    lng: 80.2336,
  },
  // Hyderabad
  {
    id: 'hyderabad-university',
    name: 'University of Hyderabad',
    city: 'Hyderabad',
    lat: 17.4575,
    lng: 78.3266,
  },
];

// PGs near universities (real coordinates within 1-5 km radius)
export const pgs: PG[] = [
  // Near IIT Bombay
  {
    id: 'pg-1',
    name: 'Shree Ganesh PG',
    lat: 19.1289,
    lng: 72.9089,
    universityId: 'iit-bombay',
    rent: 8500,
    rating: 4.2,
    verified: true,
    verificationStatus: 'verified',
    ownerId: 'owner_1',
    gender: 'male',
    amenities: ['WiFi', 'Meals', 'AC', 'Laundry'],
    distance: 0.8,
  },
  {
    id: 'pg-2',
    name: 'Comfort Stay Ladies PG',
    lat: 19.1401,
    lng: 72.9201,
    universityId: 'iit-bombay',
    rent: 9500,
    rating: 4.5,
    verified: true,
    verificationStatus: 'verified',
    ownerId: 'owner_2',
    gender: 'female',
    amenities: ['WiFi', 'Meals', 'AC', 'Security', 'Gym'],
    distance: 1.2,
  },
  {
    id: 'pg-3',
    name: 'Student Hub PG',
    lat: 19.1267,
    lng: 72.9245,
    universityId: 'iit-bombay',
    rent: 7000,
    rating: 3.8,
    verified: false,
    verificationStatus: 'pending_verification',
    ownerId: 'owner_3',
    gender: 'unisex',
    amenities: ['WiFi', 'Parking'],
    distance: 1.5,
  },
  // Near Mumbai University
  {
    id: 'pg-4',
    name: 'Marine Drive PG',
    lat: 18.9689,
    lng: 72.8189,
    universityId: 'mumbai-university',
    rent: 12000,
    rating: 4.6,
    verified: true,
    gender: 'unisex',
    amenities: ['WiFi', 'AC', 'Sea View', 'Meals'],
    distance: 1.0,
  },
  {
    id: 'pg-5',
    name: 'Churchgate Student Home',
    lat: 18.9823,
    lng: 72.8312,
    universityId: 'mumbai-university',
    rent: 10500,
    rating: 4.1,
    verified: true,
    gender: 'female',
    amenities: ['WiFi', 'Meals', 'Security'],
    distance: 1.8,
  },
  // Near IISc Bangalore
  {
    id: 'pg-6',
    name: 'Malleswaram Boys PG',
    lat: 13.0156,
    lng: 77.5634,
    universityId: 'iisc-bangalore',
    rent: 7500,
    rating: 4.0,
    verified: true,
    gender: 'male',
    amenities: ['WiFi', 'Meals', 'Laundry'],
    distance: 1.0,
  },
  {
    id: 'pg-7',
    name: 'RV Nagar Ladies PG',
    lat: 13.0289,
    lng: 77.5723,
    universityId: 'iisc-bangalore',
    rent: 8500,
    rating: 4.4,
    verified: true,
    gender: 'female',
    amenities: ['WiFi', 'Meals', 'AC', 'Security'],
    distance: 0.9,
  },
  {
    id: 'pg-8',
    name: 'Tech Park PG',
    lat: 13.0167,
    lng: 77.5589,
    universityId: 'iisc-bangalore',
    rent: 9000,
    rating: 4.3,
    verified: true,
    gender: 'unisex',
    amenities: ['WiFi', 'AC', 'Gym', 'Parking'],
    distance: 1.5,
  },
  // Near Bangalore University
  {
    id: 'pg-9',
    name: 'Jnanabharathi PG',
    lat: 12.9534,
    lng: 77.5045,
    universityId: 'bangalore-university',
    rent: 6500,
    rating: 3.9,
    verified: false,
    gender: 'male',
    amenities: ['WiFi', 'Meals'],
    distance: 0.7,
  },
  {
    id: 'pg-10',
    name: 'Green Campus PG',
    lat: 12.9678,
    lng: 77.4923,
    universityId: 'bangalore-university',
    rent: 7000,
    rating: 4.0,
    verified: true,
    gender: 'unisex',
    amenities: ['WiFi', 'Meals', 'Garden'],
    distance: 1.2,
  },
  // Near Delhi University
  {
    id: 'pg-11',
    name: 'North Campus Boys PG',
    lat: 28.6945,
    lng: 77.2134,
    universityId: 'delhi-university',
    rent: 9000,
    rating: 4.2,
    verified: true,
    gender: 'male',
    amenities: ['WiFi', 'Meals', 'AC'],
    distance: 0.8,
  },
  {
    id: 'pg-12',
    name: 'Hudson Lane Ladies PG',
    lat: 28.6823,
    lng: 77.2178,
    universityId: 'delhi-university',
    rent: 10000,
    rating: 4.5,
    verified: true,
    gender: 'female',
    amenities: ['WiFi', 'Meals', 'AC', 'Security'],
    distance: 1.0,
  },
  {
    id: 'pg-13',
    name: 'GTB Nagar Student Home',
    lat: 28.6912,
    lng: 77.2056,
    universityId: 'delhi-university',
    rent: 8500,
    rating: 4.0,
    verified: true,
    gender: 'unisex',
    amenities: ['WiFi', 'Meals', 'Parking'],
    distance: 0.5,
  },
  // Near JNU
  {
    id: 'pg-14',
    name: 'Munirka Student PG',
    lat: 28.5512,
    lng: 77.1723,
    universityId: 'jnu-delhi',
    rent: 7500,
    rating: 3.8,
    verified: true,
    gender: 'male',
    amenities: ['WiFi', 'Meals'],
    distance: 1.3,
  },
  {
    id: 'pg-15',
    name: 'Vasant Kunj Ladies PG',
    lat: 28.5334,
    lng: 77.1589,
    universityId: 'jnu-delhi',
    rent: 9500,
    rating: 4.3,
    verified: true,
    gender: 'female',
    amenities: ['WiFi', 'Meals', 'AC', 'Security', 'Garden'],
    distance: 1.8,
  },
  // Near Pune University
  {
    id: 'pg-16',
    name: 'Kothrud Boys PG',
    lat: 18.5423,
    lng: 73.8156,
    universityId: 'pune-university',
    rent: 6500,
    rating: 4.0,
    verified: true,
    gender: 'male',
    amenities: ['WiFi', 'Meals', 'Laundry'],
    distance: 0.9,
  },
  {
    id: 'pg-17',
    name: 'Paud Road Ladies PG',
    lat: 18.5534,
    lng: 73.8301,
    universityId: 'pune-university',
    rent: 7500,
    rating: 4.4,
    verified: true,
    gender: 'female',
    amenities: ['WiFi', 'Meals', 'AC', 'Security'],
    distance: 1.1,
  },
  // Near SPPU Pune
  {
    id: 'pg-sppu-1',
    name: 'Ganeshkhind Premium PG',
    lat: 18.5489,
    lng: 73.8267,
    universityId: 'sppu-pune',
    rent: 8500,
    rating: 4.5,
    verified: true,
    verificationStatus: 'verified',
    gender: 'unisex',
    amenities: ['WiFi', 'AC', 'Meals', 'Laundry', 'Parking'],
    distance: 0.5,
  },
  {
    id: 'pg-sppu-2',
    name: 'University Road Ladies PG',
    lat: 18.5401,
    lng: 73.8198,
    universityId: 'sppu-pune',
    rent: 7000,
    rating: 4.2,
    verified: true,
    verificationStatus: 'verified',
    gender: 'female',
    amenities: ['WiFi', 'Meals', 'Security', 'Laundry'],
    distance: 1.2,
  },
  {
    id: 'pg-sppu-3',
    name: 'Pashan Boys Hostel',
    lat: 18.5378,
    lng: 73.8089,
    universityId: 'sppu-pune',
    rent: 6500,
    rating: 3.9,
    verified: true,
    gender: 'male',
    amenities: ['WiFi', 'Meals', 'Study Room'],
    distance: 1.8,
  },
  // Near I2IT Pune
  {
    id: 'pg-i2it-1',
    name: 'Shivajinagar Student PG',
    lat: 18.5245,
    lng: 73.8512,
    universityId: 'i2it-pune',
    rent: 9000,
    rating: 4.4,
    verified: true,
    verificationStatus: 'verified',
    gender: 'unisex',
    amenities: ['WiFi', 'AC', 'Meals', 'Gym', 'Parking'],
    distance: 0.6,
  },
  {
    id: 'pg-i2it-2',
    name: 'Deccan Modern Living',
    lat: 18.5167,
    lng: 73.8445,
    universityId: 'i2it-pune',
    rent: 10000,
    rating: 4.6,
    verified: true,
    verificationStatus: 'verified',
    gender: 'unisex',
    amenities: ['WiFi', 'AC', 'Meals', 'Housekeeping', 'Security'],
    distance: 0.8,
  },
  // Near COEP Pune
  {
    id: 'pg-coep-1',
    name: 'Shivajinagar Boys PG',
    lat: 18.5312,
    lng: 73.8601,
    universityId: 'coep-pune',
    rent: 7500,
    rating: 4.1,
    verified: true,
    gender: 'male',
    amenities: ['WiFi', 'Meals', 'Laundry'],
    distance: 0.4,
  },
  {
    id: 'pg-coep-2',
    name: 'JM Road Ladies Accommodation',
    lat: 18.5256,
    lng: 73.8489,
    universityId: 'coep-pune',
    rent: 8500,
    rating: 4.3,
    verified: true,
    verificationStatus: 'verified',
    gender: 'female',
    amenities: ['WiFi', 'AC', 'Meals', 'Security', 'Laundry'],
    distance: 0.9,
  },
  // Near VIT Pune
  {
    id: 'pg-vit-1',
    name: 'Bibwewadi Student Home',
    lat: 18.4689,
    lng: 73.8612,
    universityId: 'vit-pune',
    rent: 6000,
    rating: 4.0,
    verified: true,
    gender: 'male',
    amenities: ['WiFi', 'Meals', 'Parking'],
    distance: 0.7,
  },
  {
    id: 'pg-vit-2',
    name: 'Dhankawadi Premium PG',
    lat: 18.4578,
    lng: 73.8745,
    universityId: 'vit-pune',
    rent: 7500,
    rating: 4.4,
    verified: true,
    verificationStatus: 'verified',
    gender: 'unisex',
    amenities: ['WiFi', 'AC', 'Meals', 'Gym', 'Security'],
    distance: 1.0,
  },
  // Near MIT Pune
  {
    id: 'pg-mit-1',
    name: 'Kothrud Boys Hostel',
    lat: 18.5089,
    lng: 73.8123,
    universityId: 'mit-pune',
    rent: 6500,
    rating: 3.8,
    verified: true,
    gender: 'male',
    amenities: ['WiFi', 'Meals', 'Laundry'],
    distance: 1.2,
  },
  {
    id: 'pg-mit-2',
    name: 'Paud Road Premium Ladies PG',
    lat: 18.5156,
    lng: 73.8234,
    universityId: 'mit-pune',
    rent: 8000,
    rating: 4.5,
    verified: true,
    verificationStatus: 'verified',
    gender: 'female',
    amenities: ['WiFi', 'AC', 'Meals', 'Security', 'Housekeeping'],
    distance: 0.9,
  },
  // Near Symbiosis Pune
  {
    id: 'pg-siu-1',
    name: 'Senapati Bapat Road PG',
    lat: 18.5123,
    lng: 73.8078,
    universityId: 'siu-pune',
    rent: 9500,
    rating: 4.6,
    verified: true,
    verificationStatus: 'verified',
    gender: 'unisex',
    amenities: ['WiFi', 'AC', 'Meals', 'Gym', 'Security', 'Parking'],
    distance: 0.6,
  },
  {
    id: 'pg-siu-2',
    name: 'Model Colony Student Living',
    lat: 18.5034,
    lng: 73.8123,
    universityId: 'siu-pune',
    rent: 8500,
    rating: 4.3,
    verified: true,
    gender: 'female',
    amenities: ['WiFi', 'AC', 'Meals', 'Security', 'Laundry'],
    distance: 1.0,
  },
  // Near PCU Pune
  {
    id: 'pg-pcu-1',
    name: 'Talegaon Boys Hostel',
    lat: 18.7298,
    lng: 73.6725,
    universityId: 'pcu-pune',
    rent: 5500,
    rating: 4.0,
    verified: true,
    gender: 'male',
    amenities: ['WiFi', 'Meals', 'AC', 'Laundry'],
    distance: 0.5,
  },
  {
    id: 'pg-pcu-2',
    name: 'Mohitewadi Ladies PG',
    lat: 18.7265,
    lng: 73.6758,
    universityId: 'pcu-pune',
    rent: 6000,
    rating: 4.3,
    verified: true,
    gender: 'female',
    amenities: ['WiFi', 'Meals', 'AC', 'Security', 'Gym'],
    distance: 0.6,
  },
  {
    id: 'pg-pcu-3',
    name: 'PCU Campus View PG',
    lat: 18.7312,
    lng: 73.6695,
    universityId: 'pcu-pune',
    rent: 5000,
    rating: 3.8,
    verified: false,
    gender: 'male',
    amenities: ['WiFi', 'Meals', 'Parking'],
    distance: 0.8,
  },
  {
    id: 'pg-pcu-4',
    name: 'Sate Student Accommodation',
    lat: 18.7278,
    lng: 73.6802,
    universityId: 'pcu-pune',
    rent: 6500,
    rating: 4.5,
    verified: true,
    gender: 'unisex',
    amenities: ['WiFi', 'Meals', 'AC', 'Security', 'Study Room'],
    distance: 0.9,
  },
  {
    id: 'pg-pcu-5',
    name: 'Talegaon Girls Residence',
    lat: 18.7325,
    lng: 73.6718,
    universityId: 'pcu-pune',
    rent: 5800,
    rating: 4.2,
    verified: true,
    gender: 'female',
    amenities: ['WiFi', 'Meals', 'Security', 'Laundry'],
    distance: 1.0,
  },
  {
    id: 'pg-pcu-6',
    name: 'Highway View Co-living',
    lat: 18.7245,
    lng: 73.6785,
    universityId: 'pcu-pune',
    rent: 7000,
    rating: 4.4,
    verified: true,
    gender: 'unisex',
    amenities: ['WiFi', 'Meals', 'AC', 'Gym', 'Common Area'],
    distance: 1.2,
  },
  // Near COEP Pune
  {
    id: 'pg-18',
    name: 'Shivajinagar PG',
    lat: 18.5234,
    lng: 73.8489,
    universityId: 'coep-pune',
    rent: 7000,
    rating: 3.9,
    verified: true,
    gender: 'male',
    amenities: ['WiFi', 'Meals'],
    distance: 0.8,
  },
  {
    id: 'pg-19',
    name: 'Deccan Student Home',
    lat: 18.5378,
    lng: 73.8623,
    universityId: 'coep-pune',
    rent: 8000,
    rating: 4.2,
    verified: true,
    gender: 'unisex',
    amenities: ['WiFi', 'Meals', 'AC', 'Parking'],
    distance: 1.3,
  },
  // Near IIT Madras
  {
    id: 'pg-20',
    name: 'Adyar Boys PG',
    lat: 12.9967,
    lng: 80.2289,
    universityId: 'iit-madras',
    rent: 7500,
    rating: 4.1,
    verified: true,
    gender: 'male',
    amenities: ['WiFi', 'Meals', 'AC'],
    distance: 0.7,
  },
  {
    id: 'pg-21',
    name: 'Velachery Ladies PG',
    lat: 12.9845,
    lng: 80.2401,
    universityId: 'iit-madras',
    rent: 8500,
    rating: 4.3,
    verified: true,
    gender: 'female',
    amenities: ['WiFi', 'Meals', 'AC', 'Security'],
    distance: 1.2,
  },
  // Near Hyderabad University
  {
    id: 'pg-22',
    name: 'Gachibowli Student PG',
    lat: 17.4489,
    lng: 78.3345,
    universityId: 'hyderabad-university',
    rent: 7000,
    rating: 4.0,
    verified: true,
    gender: 'male',
    amenities: ['WiFi', 'Meals', 'Laundry'],
    distance: 1.1,
  },
  {
    id: 'pg-23',
    name: 'HITEC City Ladies PG',
    lat: 17.4612,
    lng: 78.3189,
    universityId: 'hyderabad-university',
    rent: 8500,
    rating: 4.4,
    verified: true,
    gender: 'female',
    amenities: ['WiFi', 'Meals', 'AC', 'Security', 'Gym'],
    distance: 1.5,
  },
  // Near VIIT Pune
  {
    id: 'pg-viit-1',
    name: 'Kondhwa Student Home',
    lat: 18.4612,
    lng: 73.9045,
    universityId: 'viit-pune',
    rent: 6500,
    rating: 4.1,
    verified: true,
    verificationStatus: 'verified',
    gender: 'male',
    amenities: ['WiFi', 'Meals', 'Laundry', 'Study Room'],
    distance: 0.5,
  },
  {
    id: 'pg-viit-2',
    name: 'NIBM Road Ladies PG',
    lat: 18.4523,
    lng: 73.9178,
    universityId: 'viit-pune',
    rent: 7500,
    rating: 4.4,
    verified: true,
    verificationStatus: 'verified',
    gender: 'female',
    amenities: ['WiFi', 'AC', 'Meals', 'Security', 'Gym'],
    distance: 1.0,
  },
  // Near Sinhgad College
  {
    id: 'pg-scoe-1',
    name: 'Vadgaon Boys Hostel',
    lat: 18.4656,
    lng: 73.8134,
    universityId: 'scoe-pune',
    rent: 5500,
    rating: 3.9,
    verified: true,
    gender: 'male',
    amenities: ['WiFi', 'Meals', 'Parking'],
    distance: 0.4,
  },
  {
    id: 'pg-scoe-2',
    name: 'Sinhgad Road Premium PG',
    lat: 18.4689,
    lng: 73.8201,
    universityId: 'scoe-pune',
    rent: 7000,
    rating: 4.3,
    verified: true,
    verificationStatus: 'verified',
    gender: 'unisex',
    amenities: ['WiFi', 'AC', 'Meals', 'Security', 'Laundry'],
    distance: 0.8,
  },
];

// Mock student profiles for roommate matching
export const students: Student[] = [
  {
    id: 'student-1',
    name: 'Rahul Kumar',
    universityId: 'iit-bombay',
    budgetMin: 7000,
    budgetMax: 10000,
    sleepSchedule: 2, // Early bird
    cleanliness: 4,
    foodHabit: 'veg',
    smoking: false,
    drinking: false,
    studyHours: 5,
  },
  {
    id: 'student-2',
    name: 'Priya Sharma',
    universityId: 'iit-bombay',
    budgetMin: 8000,
    budgetMax: 12000,
    sleepSchedule: 4, // Night owl
    cleanliness: 5,
    foodHabit: 'veg',
    smoking: false,
    drinking: false,
    studyHours: 4,
  },
  {
    id: 'student-3',
    name: 'Arjun Patel',
    universityId: 'iisc-bangalore',
    budgetMin: 6000,
    budgetMax: 9000,
    sleepSchedule: 3,
    cleanliness: 3,
    foodHabit: 'non-veg',
    smoking: false,
    drinking: true,
    studyHours: 3,
  },
  {
    id: 'student-4',
    name: 'Sneha Reddy',
    universityId: 'iisc-bangalore',
    budgetMin: 7000,
    budgetMax: 10000,
    sleepSchedule: 2,
    cleanliness: 4,
    foodHabit: 'non-veg',
    smoking: false,
    drinking: false,
    studyHours: 5,
  },
  {
    id: 'student-5',
    name: 'Amit Singh',
    universityId: 'delhi-university',
    budgetMin: 8000,
    budgetMax: 11000,
    sleepSchedule: 4,
    cleanliness: 2,
    foodHabit: 'veg',
    smoking: true,
    drinking: true,
    studyHours: 2,
  },
];

// ========== PG PROOF, REVIEWS & TRUST SYSTEM MOCK DATA ==========

export interface PGMediaData {
  id: string;
  pgId: string;
  type: 'photo' | 'video';
  title: string;
  description?: string;
  url: string;
  category: 'room' | 'washroom' | 'common-area' | 'food' | 'other';
  uploadedBy: 'owner' | 'verified-admin';
  verified: boolean;
  verifiedAt?: string;
  uploadedAt: string;
}

export interface StudentReviewData {
  id: string;
  pgId: string;
  userId: string;
  userName: string;
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  description: string;
  stayDuration: {
    months: number;
    from: string;
    to: string;
  };
  aspects?: {
    cleanliness: number;
    foodQuality: number;
    ownerBehavior: number;
    maintenance: number;
  };
  verified: boolean;
  helpful: number;
  unhelpful: number;
  createdAt: string;
}

// Mock PG Media - Photos and Videos with Better Images
export const pgMedia: PGMediaData[] = [
  // PG 1 - Skyrise Apartments
  {
    id: 'media-1',
    pgId: 'pg-1',
    type: 'photo',
    title: 'Single Bedroom - Spacious & Bright',
    description: 'Well-lit single room with study desk, cupboard, and comfortable bed. Perfect for students. Taken on 2024-12-14',
    url: '/images/single-room.svg',
    category: 'room',
    uploadedBy: 'owner',
    verified: true,
    verifiedAt: '2024-12-15',
    uploadedAt: '2024-12-14',
  },
  {
    id: 'media-2',
    pgId: 'pg-1',
    type: 'photo',
    title: 'Modern Bathroom - Clean & Hygienic',
    description: 'Attached bathroom with 24/7 hot water, geysers, and daily cleaning. Verified by admin on 2024-12-15',
    url: '/images/bathroom.svg',
    category: 'washroom',
    uploadedBy: 'verified-admin',
    verified: true,
    verifiedAt: '2024-12-15',
    uploadedAt: '2024-12-14',
  },
  {
    id: 'media-3',
    pgId: 'pg-1',
    type: 'video',
    title: '🎥 30-Second Room Walkthrough Video',
    description: 'Quick video tour of the room - Shows bed, study area, cupboard, and natural lighting. Length: 45 seconds',
    url: '/images/building-exterior.svg',
    category: 'room',
    uploadedBy: 'owner',
    verified: true,
    verifiedAt: '2024-12-15',
    uploadedAt: '2024-12-13',
  },
  {
    id: 'media-4',
    pgId: 'pg-1',
    type: 'photo',
    title: 'Comfortable Common Lounge',
    description: 'Spacious shared lounge with TV, sofa seating, and gaming area. Great for relaxation and socializing.',
    url: '/images/lounge.svg',
    category: 'common-area',
    uploadedBy: 'owner',
    verified: true,
    verifiedAt: '2024-12-15',
    uploadedAt: '2024-12-14',
  },

  // PG 2 - BombayBliss
  {
    id: 'media-5',
    pgId: 'pg-2',
    type: 'photo',
    title: 'Double Sharing Bedroom - Cozy Setup',
    description: 'Comfortable double-sharing room with two separate beds, individual lockers, and ventilated windows.',
    url: '/images/double-sharing.svg',
    category: 'room',
    uploadedBy: 'owner',
    verified: true,
    verifiedAt: '2024-12-10',
    uploadedAt: '2024-12-09',
  },
  {
    id: 'media-6',
    pgId: 'pg-2',
    type: 'photo',
    title: 'Kitchen & Mess - Hygienic Food Area',
    description: 'Professional kitchen with trained cooks, daily menu variety, and strict hygiene standards. Verified by admin.',
    url: '/images/kitchen.svg',
    category: 'food',
    uploadedBy: 'verified-admin',
    verified: true,
    verifiedAt: '2024-12-10',
    uploadedAt: '2024-12-09',
  },

  // PG 3 - Garden Vista
  {
    id: 'media-7',
    pgId: 'pg-3',
    type: 'photo',
    title: 'Triple Sharing Dorm - Spacious & Airy',
    description: 'Large triple-sharing room with individual beds, study tables, lockers, and good cross-ventilation.',
    url: '/images/triple-dorm.svg',
    category: 'room',
    uploadedBy: 'owner',
    verified: true,
    verifiedAt: '2024-12-08',
    uploadedAt: '2024-12-07',
  },
];

// Mock Student Reviews
export const studentReviews: StudentReviewData[] = [
  {
    id: 'review-1',
    pgId: 'pg-1',
    userId: 'student-1',
    userName: 'Rahul Kumar',
    rating: 5,
    title: 'Best PG in Mumbai! Highly recommended',
    description: 'Stayed here for 8 months during my internship. The owner is extremely cooperative and the room is very clean. Food quality is consistently good. Perfect for students looking for a home away from home.',
    stayDuration: {
      months: 8,
      from: '2023-06-01',
      to: '2024-02-01',
    },
    aspects: {
      cleanliness: 5,
      foodQuality: 4,
      ownerBehavior: 5,
      maintenance: 5,
    },
    verified: true,
    helpful: 24,
    unhelpful: 2,
    createdAt: '2024-02-15',
  },
  {
    id: 'review-2',
    pgId: 'pg-1',
    userId: 'student-2',
    userName: 'Priya Sharma',
    rating: 4,
    title: 'Good PG with excellent maintenance',
    description: 'Lived here for 6 months. The room is spacious and well-maintained. Hot water is always available. The only thing is that the WiFi can be a bit slow during peak hours. Overall, a solid choice.',
    stayDuration: {
      months: 6,
      from: '2023-10-01',
      to: '2024-04-01',
    },
    aspects: {
      cleanliness: 4,
      foodQuality: 3,
      ownerBehavior: 4,
      maintenance: 4,
    },
    verified: true,
    helpful: 18,
    unhelpful: 1,
    createdAt: '2024-04-20',
  },
  {
    id: 'review-3',
    pgId: 'pg-2',
    userId: 'student-3',
    userName: 'Arjun Patel',
    rating: 3,
    title: 'Average PG, decent amenities',
    description: 'Stayed for 4 months. The room is okay but a bit crowded in the double-sharing configuration. Food is decent, nothing special. Owner is responsive but takes time for maintenance issues.',
    stayDuration: {
      months: 4,
      from: '2024-01-01',
      to: '2024-05-01',
    },
    aspects: {
      cleanliness: 3,
      foodQuality: 3,
      ownerBehavior: 3,
      maintenance: 2,
    },
    verified: true,
    helpful: 12,
    unhelpful: 5,
    createdAt: '2024-05-10',
  },
  {
    id: 'review-4',
    pgId: 'pg-3',
    userName: 'Sneha Reddy',
    userId: 'student-4',
    rating: 4,
    title: 'Great value for budget',
    description: 'Perfect for a student budget. The dorm setup is clean and the owner is very student-friendly. Location is great for accessing the university. Mess food could be better but overall good experience.',
    stayDuration: {
      months: 10,
      from: '2023-08-01',
      to: '2024-06-01',
    },
    aspects: {
      cleanliness: 4,
      foodQuality: 2,
      ownerBehavior: 5,
      maintenance: 3,
    },
    verified: true,
    helpful: 31,
    unhelpful: 3,
    createdAt: '2024-06-15',
  },
  {
    id: 'review-5',
    pgId: 'pg-1',
    userId: 'student-5',
    userName: 'Amit Singh',
    rating: 5,
    title: 'Excellent experience, would come back!',
    description: 'Lived here for 5 months during my placement. The rooms are spacious, owner is understanding, and the maintenance is impeccable. Hot water available 24/7. Highly recommended for working professionals too.',
    stayDuration: {
      months: 5,
      from: '2024-02-01',
      to: '2024-07-01',
    },
    aspects: {
      cleanliness: 5,
      foodQuality: 4,
      ownerBehavior: 5,
      maintenance: 5,
    },
    verified: true,
    helpful: 27,
    unhelpful: 1,
    createdAt: '2024-07-22',
  },
];

// Function to get reviews for a specific PG
export function getPGReviews(pgId: string) {
  return studentReviews.filter((review) => review.pgId === pgId);
}

// Function to calculate PG review summary
export function getPGReviewSummary(pgId: string) {
  const reviews = getPGReviews(pgId);
  if (reviews.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { five: 0, four: 0, three: 0, two: 0, one: 0 },
    };
  }

  const ratingDistribution = { five: 0, four: 0, three: 0, two: 0, one: 0 };
  let totalRating = 0;

  reviews.forEach((review) => {
    totalRating += review.rating;
    if (review.rating === 5) ratingDistribution.five++;
    else if (review.rating === 4) ratingDistribution.four++;
    else if (review.rating === 3) ratingDistribution.three++;
    else if (review.rating === 2) ratingDistribution.two++;
    else ratingDistribution.one++;
  });

  return {
    averageRating: (totalRating / reviews.length).toFixed(1),
    totalReviews: reviews.length,
    ratingDistribution,
  };
}

// Function to get media for a specific PG
export function getPGMediaByPGId(pgId: string) {
  return pgMedia.filter((media) => media.pgId === pgId);
}

// Function to calculate distance between coordinates
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// ========== PG OWNER VERIFICATION UTILITIES ==========

/**
 * Filter only verified PGs for student dashboard and map
 * Unverified/pending PGs should NOT appear in student searches
 */
export function getVerifiedPGs(): PG[] {
  return pgs.filter(
    (pg) => pg.verificationStatus === 'verified' || (pg.verified && !pg.verificationStatus)
  );
}

/**
 * Get PGs by owner ID (for owner dashboard)
 */
export function getPGsByOwner(ownerId: string): PG[] {
  return pgs.filter((pg) => pg.ownerId === ownerId);
}

/**
 * Check if user is within same city or nearby (< 50km) for interaction options
 */
export function isUserNearPG(
  userLat: number,
  userLng: number,
  pgLat: number,
  pgLng: number
): { isNearby: boolean; distanceKm: number } {
  const distance = calculateDistance(userLat, userLng, pgLat, pgLng);
  return {
    isNearby: distance < 50,
    distanceKm: Math.round(distance * 10) / 10
  };
}
