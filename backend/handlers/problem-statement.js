import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getProblemStatements = async (req, res) => {
    res.json({
        success: true,
        message: "Fetched problem statements",
        data: null,
    });
};

const getProblemStatementById = async (req, res) => {
    res.json({
        success: true,
        message: "Fetched problem statement",
        data: null,
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
