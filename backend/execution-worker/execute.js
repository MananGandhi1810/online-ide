import { createDockerContainer } from "../utils/docker.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const executeFromQueue = async (message, channel) => {
    const { code, language, submissionId, problemStatementId } =
        JSON.parse(message);
    if (
        code.trim() == "" ||
        language.trim() == "" ||
        submissionId.trim() == "" ||
        problemStatementId.trim() == ""
    ) {
        return;
    }
    const problemStatement = await prisma.problemStatement.findUnique({
        where: { id: problemStatementId },
        include: { testCase: true },
    });
    if (!problemStatement) {
        return;
    }
    const submission = await prisma.submission.findUnique({
        where: { id: submissionId },
    });
    if (!submission) {
        return;
    }
    const testCases = problemStatement.testCase;
    const container = await createDockerContainer(
        language,
        code,
        testCases.map((testCase) => testCase.input),
    );
    var expectedResult = "";
    testCases.forEach((testCase) => {
        expectedResult += testCase.output
            .replace(/\r?\n|\r/g, "")
            .normalize()
            .toLowerCase();
    });
    await container.start();
    const start = process.hrtime();
    const tle = setTimeout(async () => {
        try {
            await container.stop();
        } catch (e) {
            console.log(e);
        }
        await prisma.submission.update({
            where: { id: submissionId },
            data: {
                status: "TimeLimitExceeded",
                success: false,
            },
        });
    }, process.env.TLE);
    await container.wait();
    clearTimeout(tle);
    const end = process.hrtime();
    const ms = (end[0] - start[0]) * 1e3 + (end[1] - start[1]) * 1e-6;
    console.log(`Executed ${submissionId} in ${ms}ms`);
    const logs = String(await container.logs({ stdout: true, stderr: true }))
        .replace(/\r?\n|\r/g, "")
        .normalize()
        .toLowerCase();
    const correctResult = logs == expectedResult;
    try {
        await prisma.submission.update({
            where: { id: submissionId },
            data: {
                output: logs,
                status: "Executed",
                success: correctResult,
                execTime: ms,
            },
        });
    } catch (e) {
        console.log(e);
    }
    await container.remove();
};

export { executeFromQueue };
