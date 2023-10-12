import prisma from '../libs/prisma/prisma.js';
import VerificationStatusSeeder from './seeds/VerificationStatusSeeder.js';
import VerificationTypeSeeder from './seeds/VerificationTypeSeeder.js';

async function main() {
  const seeders = [VerificationStatusSeeder, VerificationTypeSeeder];

  await prisma.$transaction(async (tx) => {
    for (const seeder of seeders) {
      const instance = new seeder(tx);
      await instance.run();
    }
  });
}

main().then().catch(console.log);
