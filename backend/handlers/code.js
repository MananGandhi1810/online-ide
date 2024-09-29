import { createDockerContainer } from "../utils/docker.js";

const languages = ["python", "javascript", "c", "cpp"];

const executeCode = async (req, res) => {
    const { language } = req.params;
    if (!language || !languages.includes(language)) {
        return res.status(400).json({
            success: false,
            message: "Invalid Language",
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
        data: {
            logs: logs.toString(),
        },
    });
};

export { executeCode };
