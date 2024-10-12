import { createDockerContainer } from "../utils/docker.js";
import { PrismaClient } from "@prisma/client";
import { get, set } from "../utils/keyvalue-db.js";

const prisma = new PrismaClient();

const executeFromQueue = async (message, channel) => {
    const { code, language, submissionId, problemStatementId, temp } =
        JSON.parse(message);
    if (
        code.trim() == "" ||
        language.trim() == "" ||
        (submissionId.trim() == "" && !temp) ||
        problemStatementId.trim() == ""
    ) {
        return;
    }
    const problemStatement = await prisma.problemStatement.findUnique({
        where: { id: problemStatementId },
        include: {
            testCase: temp
                ? {
                      where: {
                          hidden: false,
                      },
                  }
                : true,
        },
    });
    if (!problemStatement) {
        return;
    }
    const submission = await prisma.submission.findUnique({
        where: { id: submissionId },
    });
    if (!submission && !temp) {
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
        expectedResult += "---";
    });
    await container.start();
    const start = process.hrtime();
    const tle = setTimeout(async () => {
        try {
            await container.stop();
        } catch (e) {
            console.log(e);
        }
        const result = {
            status: "TimeLimitExceeded",
            success: false,
        };
        if (temp) {
            const prevData = JSON.parse(await get(`temp-${submissionId}`));
            await set(
                `temp-${submissionId}`,
                JSON.stringify({ ...prevData, ...result }),
                60 * 5,
            );
        } else {
            await prisma.submission.update({
                where: { id: submissionId },
                data: {
                    status: "TimeLimitExceeded",
                    success: false,
                },
            });
        }
    }, process.env.TLE);
    await container.wait();
    clearTimeout(tle);
    const end = process.hrtime();
    const ms = (end[0] - start[0]) * 1e3 + (end[1] - start[1]) * 1e-6;
    console.log(`Executed ${submissionId} in ${ms}ms`);
    const rawLogs = String(
        await container.logs({ stdout: true, stderr: true }),
    );
    const logs = rawLogs
        .replace(/\r?\n|\r/g, "")
        .normalize()
        .toLowerCase();
    const correctResult = logs == expectedResult;
    try {
        const result = {
            output: rawLogs,
            status: "Executed",
            success: correctResult,
            execTime: ms,
        };
        if (temp) {
            const prevData = JSON.parse(await get(`temp-${submissionId}`));
            result.output = result.output.split("---");
            result.output = result.output.filter(
                (o) => o.trim().normalize() != "",
            );
            await set(
                `temp-${submissionId}`,
                JSON.stringify({ ...prevData, ...result }),
                60 * 5,
            );
        } else {
            await prisma.submission.update({
                where: { id: submissionId },
                data: result,
            });
        }
    } catch (e) {
        console.log(e);
    }
    await container.remove();
};

export { executeFromQueue };
