import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getCurrentStandings = async (req, res) => {
    const topTenUsers = await prisma.user.findMany({
        where: {
            NOT: {
                points: {
                    equals: 0,
                },
            },
        },
        orderBy: {
            points: "desc",
        },
        select: {
            id: true,
            name: true,
            points: true,
        },
    });
    res.json({
        success: true,
        message: "Leaderboard loaded succesfully",
        data: {
            topTenUsers,
        },
    });
};

const getUserPoints = async (req, res) => {
    res.json({
        success: true,
        message: "Fetched points succesfully",
        data: {
            points: req.user.points,
        },
    });
};

export { getCurrentStandings, getUserPoints };
