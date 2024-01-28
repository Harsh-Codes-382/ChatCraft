import {PrismaClient} from '@prisma/client';

let prismainstance = null;

const getPrismaInstance = ()=>{
    if(!prismainstance){    // If there is no prismaInstance then create new  instance & if prismaInstance is present then just return it;
        prismainstance = new PrismaClient();
    }
    return prismainstance;
}

export default getPrismaInstance;