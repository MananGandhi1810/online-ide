import { PrismaClient } from "@prisma/client";
import { sendQueueMessage } from "../utils/queue-manager.js";
import { randomNum } from "../utils/generate_otp.js";
import { get, set } from "../utils/keyvalue-db.js";

const languages = ["python", "c", "cpp", "java"];

const prisma = new PrismaClient();

const queueCodeHandler = async (req, res, isTempRun = false) => {
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
        var submissionId;
        const initialData = {
            problemStatementId,
            language,
            code,
            userId: req.user.id,
        };
        if (!isTempRun) {
            const submission = await prisma.submission.create({
                data: initialData,
            });
            submissionId = submission.id;
        } else {
            submissionId = (await randomNum(10)).toString();
            await set(
                `temp-${submissionId}`,
                JSON.stringify({ ...initialData, status: "Queued" }),
            );
        }
        const data = {
            code,
            language,
            problemStatementId,
            submissionId: submissionId,
            userId: req.user.id,
            temp: isTempRun,
        };
        await sendQueueMessage("execute", JSON.stringify(data));
        await res.json({
            success: true,
            message: "Code is queued",
            data: { submissionId: submissionId },
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

const checkExecutionHandler = async (req, res, isTempRun = false) => {
    const { submissionId } = req.params;
    if (!submissionId || submissionId.trim() == "") {
        return res.status(400).json({
            success: false,
            message: "Submission ID is compulsory",
            data: null,
        });
    }
    var submission;
    if (!isTempRun) {
        submission = await prisma.submission.findUnique({
            where: { id: submissionId, userId: req.user.id },
        });
    } else {
        submission = JSON.parse(await get(`temp-${submissionId}`));
        if (submission.userId != req.user.id) {
            submission = null;
        }
    }
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
            logs: isTempRun ? submission.output : undefined,
        },
    });
};

export { queueCodeHandler, checkExecutionHandler };
