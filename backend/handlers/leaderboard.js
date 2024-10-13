import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getCurrentStandings = async (req, res) => {
    const topTenUsers = await prisma.user.findMany({
        include: {
            _count: {
                select: {
                    submissions: {
                        where: {
                            success: true,
                        },
                    },
                },
            },
        },
        where: {
            submissions: {
                some: {
                    success: true,
                },
            },
        },
        orderBy: {
            submissions: {
                _count: "desc",
            },
        },
        take: 10,
    });
    res.json({
        success: true,
        message: "Leaderboard loaded succesfully",
        data: {
            topTenUsers,
        },
    });
};

export { getCurrentStandings };
