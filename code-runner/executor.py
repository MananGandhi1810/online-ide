import subprocess
import sys


def get_compile_command(filename):
    if filename.endswith(".py"):
        return f""
    if filename.endswith(".cpp"):
        return f"g++ {filename} -o output"
    if filename.endswith(".c"):
        return f"gcc {filename} -o output"
    if filename.endswith(".java"):
        return f"javac {filename}"


def get_exec_command(filename):
    if filename.endswith(".py"):
        return f"python3 {filename}"
    if filename.endswith(".cpp"):
        return f"./output"
    if filename.endswith(".c"):
        return f"./output"
    if filename.endswith(".java"):
        return f'java $(ls | grep ".class$" | head -1 | sed -e "s/.class$//")'


with open("input.txt", "r") as f:
    [filename, *input_data] = f.read().strip().split("\n---")

try:
    compile_process = subprocess.run(
        get_compile_command(filename),
        shell=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    if compile_process.stderr:
        print(compile_process.stderr.decode(), file=sys.stderr)
        exit()
    else:
        print(compile_process.stdout.decode())
except:
    print("Could not execute code", file=sys.stderr)
    exit()

for data in input_data:
    try:
        execute_process = subprocess.run(
            get_exec_command(filename),
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            input=data.strip().encode(),
        )
        if execute_process.stderr:
            print(execute_process.stderr.decode(), file=sys.stderr)
        else:
            print(execute_process.stdout.decode())
        print("---")
    except:
        print("Could not execute code", file=sys.stderr)
        exit()
