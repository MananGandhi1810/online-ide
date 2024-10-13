import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getProblemStatements = async (req, res) => {
    var problemStatements = await prisma.problemStatement.findMany({
        include: {
            submissions: {
                where: { userId: req.user.id },
                select: { success: true },
            },
        },
    });
    problemStatements = problemStatements.map((problemStatement) => {
        problemStatement.solved = problemStatement.submissions.some(
            (submission) => submission.success,
        );
        problemStatement.submissions = undefined;
        return problemStatement;
    });
    res.json({
        success: true,
        message: "Fetched problem statements",
        data: {
            problemStatements,
        },
    });
};

const getProblemStatementById = async (req, res) => {
    const { problemStatementId } = req.params;
    if (!problemStatementId) {
        return res.status(400).json({
            success: false,
            message: "Problem Statement Id is compulsory",
            data: null,
        });
    }
    const problemStatement = await prisma.problemStatement.findUnique({
        where: { id: problemStatementId },
        include: {
            testCase: {
                where: { hidden: false },
            },
        },
    });
    if (!problemStatement) {
        return res.status(404).json({
            success: false,
            message: "Problem Statement not found",
            data: null,
        });
    }
    res.json({
        success: true,
        message: "Fetched problem statement",
        data: { problemStatement },
    });
};

const newProblemStatement = async (req, res) => {
    const { title, description, difficulty, testCases } = req.body;
    if (
        !title ||
        title.trim() == "" ||
        !description ||
        description.trim() == "" ||
        !difficulty ||
        !["Easy", "Medium", "Hard"].includes(difficulty.trim()) ||
        !testCases ||
        testCases.length == 0
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Title, description, difficulty and testcases are compulsory",
            data: null,
        });
    }
    var problemStatement;
    try {
        problemStatement = await prisma.problemStatement.create({
            data: {
                title,
                description,
                difficulty,
                testCase: {
                    create: testCases.map((testCase) => {
                        return {
                            input: testCase.input,
                            output: testCase.output,
                            hidden: testCase.hidden ?? true,
                        };
                    }),
                },
            },
        });
    } catch (e) {
        console.log("An error occurred", e);
        return res.status(500).json({
            success: false,
            message: "An error occurred",
            data: null,
        });
    }
    res.json({
        success: true,
        message: "Created problem statement",
        data: {
            id: problemStatement.id ?? "",
        },
    });
};

const editProblemStatement = async (req, res) => {
    const { problemStatementId } = req.params;
    if (!problemStatementId) {
        return res.status(400).json({
            success: false,
            message: "Problem Statement Id is compulsory",
            data: null,
        });
    }
    const { title, description, difficulty, testCases } = req.body;
    if (
        !title ||
        title.trim() == "" ||
        !description ||
        description.trim() == "" ||
        !difficulty ||
        !["Easy", "Medium", "Hard"].includes(difficulty.trim()) ||
        !testCases ||
        testCases.length == 0
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Title, description, difficulty and testcases are compulsory",
            data: null,
        });
    }
    var problemStatement = await prisma.problemStatement.findUnique({
        where: { id: problemStatementId },
    });
    if (!problemStatement) {
        return res.status(404).json({
            success: false,
            message: "This problem statement was not found",
            data: null,
        });
    }
    try {
        await prisma.testcase.deleteMany({
            where: { problemStatementId: problemStatementId },
        });
        problemStatement = await prisma.problemStatement.update({
            where: { id: problemStatementId },
            data: {
                title,
                description,
                difficulty,
                testCase: {
                    create: testCases.map((testCase) => {
                        return {
                            input: testCase.input,
                            output: testCase.output,
                            hidden: testCase.hidden ?? true,
                        };
                    }),
                },
            },
        });
    } catch (e) {
        console.log("An error occurred", e);
        return res.status(500).json({
            success: false,
            message: "An error occurred",
            data: null,
        });
    }
    res.json({
        success: true,
        message: "Updated problem statement",
        data: {
            problemStatement,
        },
    });
};

const deleteProblemStatement = async (req, res) => {
    const { problemStatementId } = req.params;
    if (!problemStatementId) {
        return res.status(400).json({
            success: false,
            message: "Problem Statement Id is compulsory",
            data: null,
        });
    }
    const problemStatement = await prisma.problemStatement.findUnique({
        where: {
            id: problemStatementId,
        },
    });
    if (!problemStatement) {
        return res.status(404).json({
            success: false,
            message: "Problem Statement not found",
            data: null,
        });
    }
    try {
        await prisma.problemStatement.delete({
            where: { id: problemStatementId },
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "An error occurred",
            data: null,
        });
    }
    res.json({
        success: true,
        message: "Problem Statement deleted successfully",
        data: {},
    });
};

export {
    getProblemStatements,
    getProblemStatementById,
    newProblemStatement,
    editProblemStatement,
    deleteProblemStatement,
};
