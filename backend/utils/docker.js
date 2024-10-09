import dockerode from "dockerode";

const docker = dockerode();

const cleanStr = (str) => {
    return str.replaceAll('"', '\\"');
};

const getExecutionCommand = (language, code, input) => {
    let cmd;
    code = cleanStr(code);
    var filename = "";
    switch (language) {
        case "python":
            filename = "code.py";
            break;
        case "cpp":
            filename = "code.cpp";
            break;
        case "c":
            filename = "code.c";
            break;
    }
    var input_str = filename + "\n---\n";
    input.forEach((line, i) => {
        console.log(line);
        input_str += cleanStr(line);
        input_str += i != input.length - 1 ? "\n---\n" : "";
    });
    console.log(input_str);
    cmd = [
        "bash",
        "-c",
        `echo "${input_str}" >> input.txt && echo "${code}" >> ${filename} && python3 ./executor.py`,
    ];
    return cmd;
};

const createDockerContainer = async (language, code, input) => {
    return await docker.createContainer({
        Image: process.env.CODE_RUNNER_CONTAINER,
        Cmd: getExecutionCommand(language, code, input),
        Tty: true,
    });
};

export { createDockerContainer };
