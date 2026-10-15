import 'dotenv/config';
import bcrypt from 'bcrypt';
import prisma from '../src/lib/prisma.js';

const categories = [
    { slug: 'plumbing', name: 'Plumbing', services: ['Fix leak', 'Install water heater', 'Unblock drain'] },
    { slug: 'electrical', name: 'Electrical', services: ['Wiring repait', 'Install lighting', 'Fuse box fix'] },
    { slug: 'carpentry', name: 'Carpentry', services: ['Furniture repair', 'Door installation', 'Custom Cabinets'] }
];

async function main() {
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)
    await prisma.user.upsert({
        where: { email: process.env.ADMIN_EMAIL },
        update: {},
        create: { name: 'Admin', email: process.env.ADMIN_EMAIL, passwordHash, role: 'ADMIN' }
    })

    for (const category of categories) {
        const { services, ...others } = category

        const { id: categoryId } = await prisma.category.upsert({
            where: { slug: category.slug},
            update: {},
            create: { ...others }
        })

        for (const name of services) {
            try {
                await prisma.service.create({ data: { name, categoryId}})
            } catch (error) {
                if (error?.code === 'P2002') continue;
                throw error;
            }
        }
    }
}

main().finally(() => prisma.$disconnect())
