import dockerode from "dockerode";

const docker = dockerode();

const filenames = {
    python: "code.py",
    cpp: "code.cpp",
    c: "code.c",
    java: "code.java",
};

const cleanStr = (str) => {
    const replacements = {
        "\\": "\\\\",
        '"': '\\"',
        "`": "\\`",
        "\$": "\\$",
    };
    let cleaned = String(str);
    for (const [key, value] of Object.entries(replacements)) {
        cleaned = cleaned.replaceAll(key, value);
    }
    return cleaned;
};

const setupExecutionEngine = async () => {
    const allImages = await docker.listImages({ all: true });
    const executionImageExists = allImages.some((container) =>
        container.RepoTags.includes(process.env.CODE_RUNNER_CONTAINER)
    );
    if (!executionImageExists) {
        console.log("Pulling code runner Docker image...");
        try {
            await docker.pull(process.env.CODE_RUNNER_CONTAINER);
        } catch (error) {
            console.error("Error pulling Docker image:", error);
            console.error(
                `Please run 'docker pull ${process.env.CODE_RUNNER_CONTAINER}' manually.`
            );
            process.exit(1);
        }
    }
    console.log("Execution engine setup complete.");
};

const getExecutionCommand = (language, code, input) => {
    let cmd;
    code = cleanStr(code);
    const filename = filenames[language];
    var input_str = filename + "\n---\n";
    input.forEach((line, i) => {
        input_str += cleanStr(line);
        input_str += i != input.length - 1 ? "\n---\n" : "";
    });
    cmd = [
        "bash",
        "-c",
        `echo "${input_str}" > input.txt && echo "${code}" > ${filename} && python3 executor.py`,
    ];
    return cmd;
};

const createDockerContainer = async (language, code, input) => {
    try {
        return await docker.createContainer({
            Image: process.env.CODE_RUNNER_CONTAINER,
            Cmd: getExecutionCommand(language, code, input),
            Tty: true,
            Hostname: "hehe-you-wont-be-able-to-hack-me",
            User: "notroot",
            HostConfig: {
                NetworkMode: "none",
                Memory: 128 * 1024 * 1024,
                PidsLimit: 16,
            },
        });
    } catch (error) {
        console.error("Error creating Docker container:", error);
        return null;
    }
};

export { setupExecutionEngine, createDockerContainer };
