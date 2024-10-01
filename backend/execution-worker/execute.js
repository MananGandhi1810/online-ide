import { createDockerContainer } from "../utils/docker.js";

const executeFromQueue = async (message) => {
    const { code, language } = JSON.parse(message);
    const input = Date.now().toString();
    const container = await createDockerContainer(language, code, input);
    await container.start();
    const tle = setTimeout(async () => {
        console.log("sending a tle");
        res.json({
            success: false,
            message: "Time Limit Exceeded",
            data: null,
        });
        await container.stop();
        await container.remove();
        return;
    }, 4000);

    const containerExitStatus = await container.wait();
    const logs = await container.logs({ stdout: true, stderr: true });
    let success = containerExitStatus.StatusCode === 0 ? true : false;
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
