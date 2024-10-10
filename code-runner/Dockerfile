FROM ubuntu:latest

WORKDIR /usr/code-runner
RUN apt update
RUN apt install gcc g++ nodejs python3 -y
COPY executor.py executor.py

CMD ["bash"]