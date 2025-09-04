import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed Categories
  await prisma.category.createMany({
    data: [
      { code: 'ROAD', name_eng: 'Road Maintenance', name_np: 'सडक मर्मत', is_active: true },
      { code: 'WATER', name_eng: 'Water Supply', name_np: 'पानी आपूर्ति', is_active: true },
      { code: 'WASTE', name_eng: 'Waste Management', name_np: 'फोहोर व्यवस्थापन', is_active: true },
    ],
  });

  // Seed Wards
  await prisma.ward.createMany({
    data: [
      { code: 'WARD-01', name_eng: 'Ward 1', name_np: 'वार्ड १' },
      { code: 'WARD-02', name_eng: 'Ward 2', name_np: 'वार्ड २' },
      { code: 'WARD-03', name_eng: 'Ward 3', name_np: 'वार्ड ३' },
    ],
  });

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });