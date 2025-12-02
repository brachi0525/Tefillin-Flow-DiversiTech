import { testEntityApi } from './testApi';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

const uniqueEmail = `test-${Date.now()}@example.com`; 

testEntityApi({
  name: 'Soldier',
  endpoint: '/api/soldiers',
  sample: {
    name: 'Test Soldier',
    phone: '+972501234567',
    email: uniqueEmail,
    address: 'Base Camp',
    dominant_hand: 'right',
    current_status: 'registered',
  },
  update: {
    address: 'Updated Camp'
  },
  requiredFields: ['name', 'phone', 'email', 'address', 'dominant_hand', 'current_status'],
  uniqueFields: ['email'],
});


testEntityApi({
  name: 'User',
  endpoint: '/api/users',
  sample: {
    email: 'test@example.com',
    name: 'Test User',
    phone: '+972501234567',
    role: 'admin',
    status: 'active',
    profile_image_url: 'https://example.com/image.jpg',
    google_id: 'google-uid-123',
  },
  update: {
    name: 'Updated User',
    phone: '0509999999',
  },
  requiredFields: ['email', 'name', 'role', 'status'],
});

// testEntityApi({
//   name: 'Location',
//   endpoint: '/api/locations',
//   sample: {
//     name: 'Base A',
//     phone: '+972501234567',
//     address: 'IDF Base A',
//     inventory: { tefilin: 5 },
//     rabbi_id: '11111111-1111-1111-1111-111111111111',
//   },
//   update: {
//     name: 'Updated Base A',
//     phone: '0507654321',
//   },
//   requiredFields: ['name'],
// });

// testEntityApi({
//   name: 'Tefilin',
//   endpoint: '/api/tefilin',
//   sample: {
//     barcode: 'ABC123456',
//     scribeName: 'Rabbi Cohen',
//     checkerName: 'Rabbi Levi',
//     productionDate: '2023-01-01',
//     status: 'with_checker',
//     locationId: '22222222-2222-2222-2222-222222222222',
//     soldierID: '33333333-3333-3333-3333-333333333333',
//     parchmentImageUrls: ['https://img.com/1', 'https://img.com/2'],
//     donorID: '44444444-4444-4444-4444-444444444444',
//     donorName: 'Moshe',
//     inMemoryOf: 'Yitzhak Ben Sarah',
//   },
//   update: {
//     status: 'with_checker',
//   },
//   requiredFields: ['barcode', 'status'],
// });
