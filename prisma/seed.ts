// const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
import prisma from "@/app/lib/client";

// const prisma = new PrismaClient();


async function main() {
    const adminExists = await prisma.user.findUnique({
        where: { email: "sibuh@gmail.com" },
    });

    if (!adminExists) {
        const hashedPassword = await bcrypt.hash("sibuh", 10);
        await prisma.user.create({
            data: {
                first_name:"sibuh",
                last_name:"desalew",
                email: "sibuh@gmail.com",
                password: hashedPassword,
                phone:"251918171615",
                role: "ADMIN",
            },
        });
        console.log("Admin user seeded.");
    }
}

main().catch((e) => {
        console.error(e);
    })
    
