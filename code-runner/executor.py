import subprocess
import sys


def get_exec_command(filename):
    if filename.endswith(".py"):
        return f"python3 {filename}"
    if filename.endswith(".cpp"):
        return f"g++ {filename} -o output && output"
    if filename.endswith(".c"):
        return f"gcc {filename} -o output && output"
    return []


with open("input.txt", "r") as f:
    [filename, *input_data] = f.read().strip().split("\n---")

for data in input_data:
    process = subprocess.run(
        get_exec_command(filename),
        shell=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        input=data.strip().encode(),
    )
    if process.stderr:
        print(process.stderr.decode(), file=sys.stderr)
    else:
        print(process.stdout.decode())
