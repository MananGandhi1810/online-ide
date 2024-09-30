FROM ubuntu:latest

WORKDIR /usr/code-runner
RUN apt update
RUN apt install gcc g++ nodejs python3 -y

USER "code-runner"

CMD [ "bash" ]