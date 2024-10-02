import { PrismaClient } from "@prisma/client";
import { createDockerContainer } from "../utils/docker.js";
import { sendQueueMessage } from "../utils/queue-manager.js";

const languages = ["python", "javascript", "c", "cpp"];

const prisma = new PrismaClient();

const executeCode = async (req, res) => {
    const { problemStatementId, language } = req.params;
    if (!language || !languages.includes(language)) {
        return res.status(404).json({
            success: false,
            message: "Invalid Language",
            data: null,
        });
    }
    if (!problemStatementId) {
        return res.status(404).json({
            success: false,
            message: "Problem statement is necessary",
            data: null,
        });
    }
    const problemStatement = await prisma.problemStatement.findUnique({
        where: { id: problemStatementId },
    });
    if (!problemStatement) {
        return res.status(404).json({
            success: false,
            message: "Problem Statement not found",
            data: null,
        });
    }
    const { code } = req.body;
    if (!code) {
        return res.status(400).json({
            success: false,
            message: "Code cannot be empty",
            data: null,
        });
    }
    try {
        const submission = await prisma.submission.create({
            data: {
                problemStatementId,
                language,
                code,
                userId: req.user.id,
            },
        });
        await sendQueueMessage(
            "execute",
            JSON.stringify({
                code,
                language,
                problemStatementId,
                submissionId: submission.id,
                userId: req.user.id,
            }),
        );
        await res.json({
            success: true,
            message: "Code is queued",
            data: { submissionId: submission.id },
        });
    } catch (e) {
        console.log("Error occurred when submitting code", e);
        await res.status(500).json({
            success: false,
            message: "Error occurred when submitting code",
            data: null,
        });
    }
};

export { executeCode };
