import { PrismaClient } from "@prisma/client";
import { sendQueueMessage } from "../utils/queue-manager.js";

const languages = ["python", "javascript", "c", "cpp"];

const prisma = new PrismaClient();

const queueCode = async (req, res) => {
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

const checkExecution = async (req, res) => {
    const {submissionId} = req.params;
    if (!submissionId || submissionId.trim() == "") {
        return res.status(400).json({
            success: false,
            message: "Submission ID is compulsory",
            data: null,
        });
    }
    const submission = await prisma.submission.findUnique({
        where: { id: submissionId, userId: req.user.id },
    });
    if (!submission) {
        return res.status(404).json({
            success: false,
            message: "Submission not found",
            data: null,
        });
    }
    var message;
    switch (submission.status) {
        case "Executed":
            message = "Submission executed";
            break;
        case "Executing":
            message = "Submission executing";
            break;
        case "Queued":
            message = "Waiting for submission to be executed";
            break;
        case "TimeLimitExceeded":
            message = "Time limit exceeded";
            break;
        default:
            message = "Submission status unknown";
    }
    res.json({
        success: submission.status == "Executed",
        message,
        data: {
            status: submission.status,
            success: submission.success,
        },
    });
};

export { queueCode, checkExecution };
