import { PrismaClient } from "@prisma/client";
import { Roles_Enum } from "../util";

 const prisma = new PrismaClient()
async function main(){
   

    const users={
        name:'sabari',
        password:'12345',
        Email:'krsabari1123@gmail.com',
        role:{connect:{role_name:Roles_Enum.ROLE_USER }}
    }

    await prisma.user.upsert({
        where: { Email: users.Email },
        update:{},
        create:users
    })

    console.log('user created successfully')
}



main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
