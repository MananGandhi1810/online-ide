FROM ubuntu:latest

WORKDIR /usr/code-runner
RUN apt update
RUN apt install gcc g++ nodejs python3 default-jdk golang-go -y
COPY executor.py executor.py

CMD ["bash"]