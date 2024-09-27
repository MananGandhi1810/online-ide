import { createDockerContainer } from "../utils/docker.js";

const executeCode = async (req, res) => {
    const { language } = req.params;
    const { code } = req.body;
    const container = await createDockerContainer(language, code);
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
    }, 4000);

    const containerExitStatus = await container.wait();
    const logs = await container.logs({ stdout: true, stderr: true });
    let success = containerExitStatus.StatusCode === 0 ? true : false;
    clearTimeout(tle);
    await container.remove();

    res.json({
        success,
        message: success ? "Code executed succesfully" : "An error occurred",
        data: { logs: logs.toString() },
    });
};

export { executeCode };
