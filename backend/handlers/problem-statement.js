import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getProblemStatements = async (req, res) => {
    const problemStatements = await prisma.problemStatement.findMany({
        select: {
            id: true,
            title: true,
            difficulty: true,
        },
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

export { getProblemStatements, getProblemStatementById, newProblemStatement };
