import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getEditorials = async (req, res) => {
    const { problemStatementId } = req.params;
    const editorials = await prisma.editorial.findMany({
        where: {
            problemStatementId,
            hidden: false,
        },
        select: {
            id: true,
            title: true,
            createdAt: true,
        },
    });
    res.json({
        success: true,
        message: "Editorials found succesfully",
        data: {
            editorials,
        },
    });
};

const getEditorialById = async (req, res) => {
    const { problemStatementId, editorialId } = req.params;
    const editorial = await prisma.editorial.findUnique({
        where: {
            problemStatementId,
            id: editorialId,
            hidden: false,
        },
    });
    if (!editorial) {
        return res.status(404).json({
            success: false,
            message: "Editorial not found",
            data: null,
        });
    }
    res.json({
        success: true,
        message: "Editorial found",
        data: {
            editorial,
        },
    });
};

const newEditorial = async (req, res) => {
    const { problemStatementId } = req.params;
    const { title, content } = req.body;
    if (!title || !content || !title.trim() || !content.trim()) {
        return res.status(400).json({
            success: false,
            message: "Title and Content are required",
            data: null,
        });
    }
    const successfulSubmissionCount = await prisma.submission.count({
        where: {
            problemStatementId,
            userId: req.user.id,
            success: true,
        },
    });
    if (successfulSubmissionCount == 0) {
        return res.status(403).json({
            success: false,
            message:
                "You cannot submit an editorial without succesfully solving this problem statement",
            data: null,
        });
    }
    const alreadySubmitted = await prisma.editorial.findFirst({
        where: {
            problemStatementId,
            userId: req.user.id,
            hidden: false,
        },
    });
    if (alreadySubmitted) {
        return res.status(403).json({
            success: false,
            message: "You can only submit 1 Editorial per Problem Statement",
            data: null,
        });
    }
    var editorial;
    try {
        editorial = await prisma.editorial.create({
            data: {
                title,
                content,
                problemStatementId: problemStatementId,
                userId: req.user.id,
            },
        });
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: "Could not create editorial",
            data: null,
        });
    }
    res.json({
        success: true,
        message: "Editorial submitted succesfully",
        data: {
            id: editorial.id,
        },
    });
};

const deleteEditorial = async (req, res) => {};

const updateEditorial = async (req, res) => {};

export {
    getEditorials,
    getEditorialById,
    newEditorial,
    deleteEditorial,
    updateEditorial,
};
