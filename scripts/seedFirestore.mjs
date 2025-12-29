import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Firebase config (same as app)
const firebaseConfig = {
  apiKey: "AIzaSyAMln3tQo1eLNZpXJI_P_P8v91Iing7wt4",
  authDomain: "sisfo-bc3d6.firebaseapp.com",
  projectId: "sisfo-bc3d6",
  storageBucket: "sisfo-bc3d6.firebasestorage.app",
  messagingSenderId: "934576182862",
  appId: "1:934576182862:web:aaa4acba2f763bd9aad51f",
  measurementId: "G-KDPHXD5FLF",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const roleNames = [
  'Admin',
  'Warehouse Manager',
  'Receiving Clerk',
  'Shipping Clerk',
  'Inventory Controller',
  'Quality Inspector',
  'Forklift Operator',
  'Supplier Manager',
  'Procurement',
  'Production Planner',
  'Store Manager',
  'Logistics Coordinator',
  'Returns Specialist',
  'Palletizer',
  'Safety Officer',
  'Maintenance Technician',
  'IT Support',
  'Customer Service',
  'Purchasing Manager',
];

const departments = [
  { id: 'dept-1', name: 'Warehouse' },
  { id: 'dept-2', name: 'Receiving' },
  { id: 'dept-3', name: 'Shipping' },
  { id: 'dept-4', name: 'Quality' },
  { id: 'dept-5', name: 'Procurement' },
];

async function seed() {
  try {
    console.log('Seeding roles...');
    for (let i = 0; i < roleNames.length; i++) {
      const id = `role-${i + 1}`;
      const role = {
        id,
        name: roleNames[i],
        description: `${roleNames[i]} role for WMS operations`,
        permissions: [],
        departmentId: departments[(i % departments.length)].id,
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'roles', id), role);
      console.log('Wrote role', id);
    }

    console.log('Seeding departments...');
    for (const d of departments) {
      await setDoc(doc(db, 'departments', d.id), { ...d, createdAt: new Date().toISOString() });
      console.log('Wrote dept', d.id);
    }

    console.log('Seeding users (2 per role)...');
    for (let i = 0; i < roleNames.length; i++) {
      const roleId = `role-${i + 1}`;
      const slug = roleNames[i].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      for (let n = 1; n <= 2; n++) {
        const id = `${roleId}-u${n}`;
        const user = {
          id,
          email: `${slug}${n}@example.com`,
          displayName: `${roleNames[i]} ${n}`,
          roleIds: [roleId],
          departmentIds: [departments[i % departments.length].id],
          isActive: true,
          createdAt: new Date().toISOString(),
        };
        await setDoc(doc(db, 'users', id), user);
        console.log('Wrote user', id);
      }
    }

    console.log('Seeding complete.');
    process.exit(0);
  } catch (e) {
    console.error('Seeding failed:', e);
    process.exit(1);
  }
}

seed();
