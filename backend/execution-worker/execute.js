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
    console.log(testCases);
    const container = await createDockerContainer(language, code, testCases[0].input);
    await container.start();
    const tle = setTimeout(async () => {
        console.log("TLE");
        await container.stop();
        await container.remove();
        return;
    }, 2000);

    const containerExitStatus = await container.wait();
    const logs = await container.logs({ stdout: true, stderr: true });
    let success = containerExitStatus.StatusCode === 0 ? true : false;
    const correctResult = logs == testCases[0].output;
    console.log(correctResult)
    clearTimeout(tle);

    console.log({
        success,
        message: success ? "Code executed succesfully" : "An error occurred",
        data: {
            logs: logs.toString(),
        },
    });
    await container.remove();
};

export { executeFromQueue };
