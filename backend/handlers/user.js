import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const userDataHandler = (req, res) => {
    res.json({
        success: true,
        message: "User found",
        data: req.user,
    });
};

const getUserByIdHandler = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({
            success: false,
            message: "User Id is required",
            data: null,
        });
    }
    const user = await prisma.user.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            name: true,
            points: true,
            submissions: {
                orderBy: {
                    time: "desc",
                },
                select: {
                    id: true,
                    language: true,
                    problemStatementId: true,
                    success: true,
                    time: true,
                },
            },
        },
    });
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
            data: null,
        });
    }
    res.json({
        success: true,
        message: "User found",
        data: {
            user,
        },
    });
};

const getUserSubmissionsHandler = async (req, res) => {
    const { page } = req.query;
    const limit = 10;
    const start =
        !isNaN(page) && parseInt(page) > 1 ? (parseInt(page) - 1) * limit : 0;
    console.log(page, start);
    const submissions = await prisma.submission.findMany({
        where: {
            userId: req.user.id,
        },
        select: {
            id: true,
            code: true,
            language: true,
            status: true,
            success: true,
            execTime: true,
            problemStatement: {
                select: {
                    id: true,
                    title: true,
                    difficulty: true,
                },
            },
        },
        skip: start,
        take: limit,
    });
    console.log(submissions);
    return res.json({
        success: true,
        message: "Submissions fetched",
        data: { submissions },
    });
};

export { userDataHandler, getUserByIdHandler, getUserSubmissionsHandler };
