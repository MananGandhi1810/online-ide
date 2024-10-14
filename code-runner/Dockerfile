FROM ubuntu:latest

WORKDIR /usr/code-runner
RUN apt update
RUN apt install gcc g++ -y
RUN apt install nodejs -y
RUN apt install python3 -y
RUN apt install default-jdk -y
COPY executor.py executor.py

CMD ["bash"]