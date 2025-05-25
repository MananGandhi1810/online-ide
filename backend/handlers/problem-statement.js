import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
        delete problemStatement._count;
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
            starterCode: {
                select: {
                    code: true,
                    language: true,
                },
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
    delete problemStatement._count;
    res.json({
        success: true,
        message: "Fetched problem statement",
        data: { problemStatement },
    });
};

const newProblemStatementHandler = async (req, res) => {
    const { title, description, difficulty, testCases, starterCode } = req.body;
    if (
        !title ||
        !description ||
        !difficulty ||
        !testCases ||
        !starterCode ||
        title.trim() == "" ||
        description.trim() == "" ||
        !["Easy", "Medium", "Hard"].includes(difficulty.trim()) ||
        testCases.length == 0
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Title, description, difficulty, testcases and starterCode are required",
            data: null,
        });
    }
    const allowedLanguages = ["python", "c", "cpp", "java"];
    const providedLanguages = Object.keys(starterCode).map((lang) =>
        lang.toLowerCase(),
    );
    if (providedLanguages.length !== 4) {
        return res.status(400).json({
            success: false,
            message: "Starter code must be provided for exactly 4 languages",
            data: null,
        });
    }
    const invalidLanguages = providedLanguages.filter(
        (lang) => !allowedLanguages.includes(lang),
    );
    if (invalidLanguages.length > 0) {
        return res.status(400).json({
            success: false,
            message: `Invalid languages: ${invalidLanguages.join(", ")}. Only python, c, cpp, java are allowed`,
            data: null,
        });
    }

    const missingLanguages = allowedLanguages.filter(
        (lang) => !providedLanguages.includes(lang),
    );
    if (missingLanguages.length > 0) {
        return res.status(400).json({
            success: false,
            message: `Missing languages: ${missingLanguages.join(", ")}. All 4 languages (python, c, cpp, java) are required`,
            data: null,
        });
    }
    const codeToUse = {};
    for (const [lang, code] of Object.entries(starterCode)) {
        codeToUse[lang.toLowerCase()] = code;
    }
    const problemStatement = await prisma.problemStatement.create({
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
            starterCode: {
                create: Object.entries(codeToUse).map(([language, code]) => ({
                    language,
                    code: code || "",
                })),
            },
            createdById: req.user.id,
        },
    });
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
    const { title, description, difficulty, testCases, starterCode } = req.body;
    if (
        !title ||
        !description ||
        !difficulty ||
        !testCases ||
        !starterCode ||
        title.trim() == "" ||
        description.trim() == "" ||
        !["Easy", "Medium", "Hard"].includes(difficulty.trim()) ||
        testCases.length == 0
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Title, description, difficulty, testcases and starterCode are required",
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

    const allowedLanguages = ["python", "c", "cpp", "java"];
    const providedLanguages = Object.keys(starterCode).map((lang) =>
        lang.toLowerCase(),
    );

    if (providedLanguages.length !== 4) {
        return res.status(400).json({
            success: false,
            message: "Starter code must be provided for exactly 4 languages",
            data: null,
        });
    }

    const invalidLanguages = providedLanguages.filter(
        (lang) => !allowedLanguages.includes(lang),
    );
    if (invalidLanguages.length > 0) {
        return res.status(400).json({
            success: false,
            message: `Invalid languages: ${invalidLanguages.join(", ")}. Only python, c, cpp, java are allowed`,
            data: null,
        });
    }

    const missingLanguages = allowedLanguages.filter(
        (lang) => !providedLanguages.includes(lang),
    );
    if (missingLanguages.length > 0) {
        return res.status(400).json({
            success: false,
            message: `Missing languages: ${missingLanguages.join(", ")}. All 4 languages (python, c, cpp, java) are required`,
            data: null,
        });
    }

    const codeToUse = {};
    for (const [lang, code] of Object.entries(starterCode)) {
        codeToUse[lang.toLowerCase()] = code;
    }

    await prisma.testcase.deleteMany({
        where: { problemStatementId: problemStatementId },
    });
    await prisma.starterCode.deleteMany({
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
            starterCode: {
                create: Object.entries(codeToUse).map(([language, code]) => ({
                    language,
                    code: code || "",
                })),
            },
        },
    });

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

    await prisma.problemStatement.delete({
        where: { id: problemStatementId },
    });

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
