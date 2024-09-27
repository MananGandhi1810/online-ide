import dockerode from "dockerode";

const docker = dockerode();

const getExecutionCommand = (language, code) => {
    let cmd;

    switch (language) {
        case "cpp":
            cmd = [
                "bash",
                "-c",
                `echo "${code}" > myapp.cpp && g++ -o myapp myapp.cpp && ./myapp`,
            ];
            console.log(cmd);
            break;
        case "javascript":
            cmd = ["node", "-e", code];
            break;

        case "python":
            cmd = [
                "bash",
                "-c",
                `echo "${code}" > myapp.py && python3 myapp.py`,
            ];
            break;

        case "c":
            cmd = [
                "bash",
                "-c",
                `echo "${code}" > myapp.c && gcc -o myapp myapp.c && ./myapp`,
            ];
            break;

        default:
            cmd = [];
            break;
    }

    return cmd;
};

const createDockerContainer = async (language, code) => {
    return await docker.createContainer({
        Image: process.env.CODE_RUNNER_CONTAINER,
        Cmd: getExecutionCommand(language, code),
        Tty: true,
    });
};

export { createDockerContainer };
