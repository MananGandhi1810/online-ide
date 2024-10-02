import { createDockerContainer } from "../utils/docker.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const executeFromQueue = async (message) => {
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
    const containers = await Promise.all(
        testCases.map(async (testCase) => {
            return await createDockerContainer(language, code, testCase.input);
        }),
    );
    const tle = setTimeout(async () => {
        console.log("TLE");
        await prisma.submission.update({
            where: { id: submissionId },
            data: {
                status: "TimeLimitExceeded",
                success: false,
            },
        });
        return;
    }, 2000);
    const execResult = await Promise.all(
        containers.map(async (container) => {
            await container.start();
            const containerExitStatus = await container.wait();
            const logs = await container.logs({ stdout: true, stderr: true });
            const success = containerExitStatus.StatusCode === 0 ? true : false;
            return { success, logs };
        }),
    );
    clearTimeout(tle);
    const success = execResult.every((result) => result.success);
    const correctResult = execResult.every(
        (result, i) => result.logs == testCases[i].output,
    );
    const logs = execResult.map((result) => result.logs);
    console.log({
        success,
        message: success ? "Code executed succesfully" : "An error occurred",
        data: {
            correctResult,
            logs: logs.map((log) => log.toString()),
        },
    });
    await prisma.submission.update({
        where: { id: submissionId },
        data: {
            output: logs.map((log) => log.toString()),
            status: "Executed",
            success: correctResult,
        },
    });
    await Promise.all(containers.map((container) => container.remove()));
};

export { executeFromQueue };
