require('dotenv').config();
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { PrismaLibSql } = require('@prisma/adapter-libsql');

// Create Prisma adapter with URL
const dbPath = path.resolve(__dirname, 'prisma/dev.db');
const adapter = new PrismaLibSql({ url: `file:${dbPath}` });

// Create Prisma client with adapter
const prisma = new PrismaClient({ adapter });

const services = ['API', 'Database', 'Auth', 'Payment'];
const severities = ['SEV1', 'SEV2', 'SEV3', 'SEV4'];
const statuses = ['OPEN', 'MITIGATED', 'RESOLVED'];

const ownerNames = [
  'John Smith',
  'Sarah Johnson',
  'Michael Brown',
  'Emily Davis',
  'David Wilson',
  'Jessica Martinez',
  'James Anderson',
  'Amanda Taylor',
  'Robert Thomas',
  'Jennifer Garcia',
  'William Jackson',
  'Elizabeth White',
  'Richard Harris',
  'Maria Martin',
  'Charles Thompson',
  'Lisa Robinson',
  'Christopher Lee',
  'Nancy Clark',
  'Daniel Rodriguez',
  'Betty Lewis',
];

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomName() {
  return getRandomItem(ownerNames);
}

async function main() {
  console.log('Starting to seed database...');

  const incidents = [];

  for (let i = 1; i <= 200; i++) {
    incidents.push({
      title: `Incident ${i}`,
      service: getRandomItem(services),
      severity: getRandomItem(severities),
      status: getRandomItem(statuses),
      owner: getRandomName(),
      summary: 'Test incident',
    });
  }

  // Insert all incidents
  await prisma.incident.createMany({
    data: incidents,
  });

  console.log('Successfully seeded 200 incidents!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

