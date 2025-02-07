import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
    const user = await prisma.user.findUnique({
        where: { email: "ardumanan@gmail.com" },
    });
    await prisma.problemStatement.updateMany({
        data: { createdById: user.id },
    });
};

main()