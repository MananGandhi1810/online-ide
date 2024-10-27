import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getLeaderboardHandler = async (req, res) => {
    const topTenUsers = await prisma.user.findMany({
        where: {
            points: {
                gt: 0,
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
            leaderboard: topTenUsers,
        },
    });
};

const getUserPointsHandler = async (req, res) => {
    res.json({
        success: true,
        message: "Fetched points succesfully",
        data: {
            points: req.user.points,
        },
    });
};

export { getLeaderboardHandler, getUserPointsHandler };
