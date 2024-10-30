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

export { userDataHandler, getUserByIdHandler };
