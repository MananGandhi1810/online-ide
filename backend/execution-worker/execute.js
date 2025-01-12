import { createDockerContainer } from "../utils/docker.js";
import { PrismaClient } from "@prisma/client";
import { get, set } from "../utils/keyvalue-db.js";

const prisma = new PrismaClient();

const executeFromQueue = async (message, channel) => {
    const {
        code,
        language,
        submissionId,
        problemStatementId,
        temp,
        testcase,
        containsTestCase,
    } = JSON.parse(message);
    if (
        code == "" ||
        language == "" ||
        submissionId == "" ||
        problemStatementId == "" ||
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
        include: {
            User: true,
        },
    });
    if (!submission && !temp) {
        return;
    }
    var testCases;
    var expectedResult;
    if (containsTestCase && temp) {
        testCases = [{ input: testcase }];
    } else {
        testCases = problemStatement.testCase;
        expectedResult = "";
        testCases.forEach((testCase) => {
            expectedResult += testCase.output
                .replace(/\r?\n|\r/g, "")
                .normalize()
                .toLowerCase();
            expectedResult += "---";
        });
    }
    const container = await createDockerContainer(
        language,
        code,
        testCases.map((testCase) => testCase.input),
    );
    await container.start();
    const start = process.hrtime();
    var didTLE = false;
    var didRun = false;
    const tle = new Promise((resolve, reject) => {
        setTimeout(
            async () => {
                if (didRun) {
                    return;
                }
                resolve();
                didTLE = true;
                const result = {
                    status: "TimeLimitExceeded",
                    success: false,
                };
                if (temp) {
                    const prevData = JSON.parse(
                        await get(`temp-${submissionId}`),
                    );
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
                try {
                    await container.kill();
                    await container.remove();
                } catch (e) {}
            },
            language == "java" ? process.env.TLE + 2000 : process.env.TLE,
        );
    });
    const wait = new Promise(async (resolve, reject) => {
        await container.wait();
        didRun = true;
        resolve();
    });
    await Promise.race([tle, wait]);
    if (didTLE) {
        return;
    }
    const rawLogs = String(
        await container.logs({ stdout: true, stderr: true }),
    );
    const logs = rawLogs
        .replace(/\r?\n|\r/g, "")
        .normalize()
        .toLowerCase();
    const end = process.hrtime();
    const ms = (end[0] - start[0]) * 1e3 + (end[1] - start[1]) * 1e-6;
    console.log(`Executed ${submissionId} in ${ms}ms`);
    var correctResult = false;
    try {
        const result = {
            output: rawLogs,
            status: "Executed",
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
            correctResult = logs == expectedResult;
            result.success = correctResult;
            await prisma.submission.update({
                where: { id: submissionId },
                data: result,
            });
        }
    } catch (e) {
        console.log(e);
    }
    try {
        await container.remove();
    } catch (e) {}
    if (correctResult && !temp) {
        const isSolvedByUser = await prisma.submission.count({
            where: {
                problemStatementId,
                userId: submission.User.id,
                success: true,
            },
        });
        if (isSolvedByUser == 1) {
            const failedAttempts = await prisma.submission.count({
                where: {
                    problemStatementId,
                    userId: submission.User.id,
                    success: false,
                },
            });
            await prisma.user.update({
                where: {
                    id: submission.User.id,
                },
                data: {
                    points: {
                        increment: failedAttempts == 0 ? 10 : 5,
                    },
                },
                select: {
                    points: true,
                },
            });
        }
    }
};

export { executeFromQueue };
