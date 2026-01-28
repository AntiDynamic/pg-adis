/**
 * Script to geocode PCU address and get exact coordinates
 * Run this to verify the correct location
 */

import { geocodeAddress } from './geocoding';

async function verifyPCULocation() {
  console.log('🔍 Geocoding PCU address...\n');

  const pcuAddress =
    'Plot No. 44, 49, 50, Mohitewadi Road, Mohitewadi, Pune, Maharashtra 412106, India';

  const result = await geocodeAddress(pcuAddress);

  if (result) {
    console.log('✅ Location found!\n');
    console.log('Coordinates:');
    console.log(`  Latitude:  ${result.lat}`);
    console.log(`  Longitude: ${result.lng}`);
    console.log('\nFormatted Address:');
    console.log(`  ${result.formattedAddress}`);
    console.log('\n📋 Copy this to mockData.ts:');
    console.log(`  lat: ${result.lat},`);
    console.log(`  lng: ${result.lng},`);
  } else {
    console.log('❌ Could not find location for this address');
    console.log('Try simplifying the address or checking for typos');
  }
}

// Alternative addresses to try
const alternativeAddresses = [
  'Pimpri Chinchwad University, Mohitewadi, Pune',
  'PCU Pune, Talegaon',
  'Mohitewadi Road, Pune 412106',
];

async function tryAlternatives() {
  console.log('\n🔄 Trying alternative address formats...\n');

  for (const address of alternativeAddresses) {
    console.log(`Testing: ${address}`);
    const result = await geocodeAddress(address);

    if (result) {
      console.log(`  ✅ Found: ${result.lat}, ${result.lng}`);
    } else {
      console.log(`  ❌ Not found`);
    }

    // Rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1100));
  }
}

// Run verification
verifyPCULocation().then(() => tryAlternatives());
