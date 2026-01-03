import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/auth.utils';

const prisma = new PrismaClient();

async function main() {
    const args = process.argv.slice(2);
    if (args.length < 3) {
        console.error('Usage: npm run create-admin <email> <password> <name>');
        process.exit(1);
    }

    const [email, password, name] = args;

    console.log(`Creating admin user: ${email}`);

    try {
        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.upsert({
            where: { email },
            update: {
                role: 'admin',
                password: hashedPassword,
                name
            },
            create: {
                email,
                password: hashedPassword,
                name,
                role: 'admin'
            }
        });

        console.log(`✅ Admin user ${user.email} created/updated successfully.`);
    } catch (error) {
        console.error('❌ Error creating admin user:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
