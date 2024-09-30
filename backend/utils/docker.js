import dockerode from "dockerode";

const docker = dockerode();

const cleanStr = (str) => {
    return str.replaceAll('"', '\\"');
};

const getExecutionCommand = (language, code, input) => {
    let cmd;
    code = cleanStr(code);
    input = cleanStr(input);
    switch (language) {
        case "cpp":
            cmd = [
                "bash",
                "-c",
                `echo "Manan" > /dev/stdin && echo "${code}" > myapp.cpp && g++ -o myapp myapp.cpp && ./myapp`,
            ];
            break;

        case "javascript":
            cmd = ["node", "-e", code];
            break;

        case "python":
            cmd = [
                "bash",
                "-c",
                `echo "${code}" > myapp.py && python3 myapp.py <<< "${input}"`,
            ];
            break;

        case "c":
            cmd = [
                "bash",
                "-c",
                `echo "Manan" > /dev/stdin && echo "${code}" > myapp.c && gcc -o myapp myapp.c && ./myapp`,
            ];
            break;

        default:
            cmd = [];
            break;
    }
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
