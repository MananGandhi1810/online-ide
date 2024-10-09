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
        await Promise.all(
            containers.map((container) => container.stop()),
        ).catch((e) => console.log(e));
        await prisma.submission.update({
            where: { id: submissionId },
            data: {
                status: "TimeLimitExceeded",
                success: false,
            },
        });
    }, 3000);
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
    const correctResult = execResult.every((result, i) => {
        return (
            String(result.logs)
                .replace(/\r?\n|\r/g, "")
                .normalize() ==
            testCases[i].output.replace(/\r?\n|\r/g, "").normalize()
        );
    });
    try {
        const logs = execResult.map((result) => result.logs);
        await prisma.submission.update({
            where: { id: submissionId },
            data: {
                output: logs.map((log) => log.toString()),
                status: "Executed",
                success: correctResult,
            },
        });
    } catch (e) {
        console.log(e);
    }
    await Promise.all(containers.map((container) => container.remove()));
};

export { executeFromQueue };
