import dockerode from "dockerode";

const docker = dockerode();

const filenames = {
    python: "code.py",
    cpp: "code.cpp",
    c: "code.c",
    java: "code.java",
};

const cleanStr = (str) => {
    return str.replaceAll('"', '\\"');
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
    return await docker.createContainer({
        Image: process.env.CODE_RUNNER_CONTAINER,
        Cmd: getExecutionCommand(language, code, input),
        Tty: true,
        HostConfig: {
            NetworkMode: "online-ide_no-internet",
            Memory: 128 * 1024 * 1024,
            PidsLimit: 64,
        },
    });
};

export { createDockerContainer };
