import { createDockerContainer } from "../utils/docker.js";
import { sendQueueMessage } from "../utils/queue-manager.js";

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
    await sendQueueMessage(
        "execute",
        JSON.stringify({
            code,
            language,
        }),
    );
    res.json({
        success: true,
        message: "Code is queued",
        data: null,
    });
};

export { executeCode };
