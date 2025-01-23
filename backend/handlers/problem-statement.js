import prisma from "db-interface";

const getProblemStatementsHandler = async (req, res) => {
    var problemStatements = await prisma.problemStatement.findMany({
        include: {
            _count: {
                select: {
                    submissions: {
                        where: {
                            userId: req.user.id,
                            success: true,
                        },
                    },
                },
            },
        },
    });
    problemStatements = problemStatements.map((problemStatement) => {
        problemStatement.solved = problemStatement._count.submissions > 0;
        problemStatement._count = undefined;
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

const getProblemStatementByIdHandler = async (req, res) => {
    const { problemStatementId } = req.params;
    if (!problemStatementId) {
        return res.status(400).json({
            success: false,
            message: "Problem Statement Id is required",
            data: null,
        });
    }
    const { withHidden } = req.query;
    var problemStatement = await prisma.problemStatement.findUnique({
        where: { id: problemStatementId },
        include: {
            testCase:
                withHidden && req.user.admin
                    ? true
                    : {
                          where: { hidden: false },
                      },
            _count: {
                select: {
                    submissions: {
                        where: {
                            userId: req.user.id,
                            success: true,
                        },
                    },
                },
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
    problemStatement.solved = problemStatement._count.submissions > 0;
    problemStatement._count = undefined;
    res.json({
        success: true,
        message: "Fetched problem statement",
        data: { problemStatement },
    });
};

const newProblemStatementHandler = async (req, res) => {
    const { title, description, difficulty, testCases } = req.body;
    if (
        !title ||
        !description ||
        !difficulty ||
        !testCases ||
        title.trim() == "" ||
        description.trim() == "" ||
        !["Easy", "Medium", "Hard"].includes(difficulty.trim()) ||
        testCases.length == 0
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Title, description, difficulty and testcases are required",
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

const editProblemStatementHandler = async (req, res) => {
    const { problemStatementId } = req.params;
    if (!problemStatementId) {
        return res.status(400).json({
            success: false,
            message: "Problem Statement Id is required",
            data: null,
        });
    }
    const { title, description, difficulty, testCases } = req.body;
    if (
        !title ||
        !description ||
        !difficulty ||
        !testCases ||
        title.trim() == "" ||
        description.trim() == "" ||
        !["Easy", "Medium", "Hard"].includes(difficulty.trim()) ||
        testCases.length == 0
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Title, description, difficulty and testcases are required",
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

const deleteProblemStatementHandler = async (req, res) => {
    const { problemStatementId } = req.params;
    if (!problemStatementId) {
        return res.status(400).json({
            success: false,
            message: "Problem Statement Id is required",
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
    getProblemStatementsHandler,
    getProblemStatementByIdHandler,
    newProblemStatementHandler,
    editProblemStatementHandler,
    deleteProblemStatementHandler,
};
