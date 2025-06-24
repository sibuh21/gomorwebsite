import bcrypt from "bcryptjs";
import prisma from "../app/lib/client";



async function main() {
   
        const hashedPassword = await bcrypt.hash("sibuh", 10);
        await prisma.user.upsert({
            create:{
                first_name:"sibuh",
                last_name:"desalew",
                email: "sibuh@gmail.com",
                password: hashedPassword,
                phone:"251918171615",
                role: "ADMIN"
            },
            update:{
                first_name:"sibuh",
                last_name:"desalew",
                email: "sibuh@gmail.com",
                password: hashedPassword,
                phone:"251918171615",
                role: "ADMIN"
            },
            where:{
                email:"sibuh@gmail.com"
            }
        })
        
        console.log("Admin user seeded.");
}

main().catch((e) => {
        console.error(e);
    })
    
