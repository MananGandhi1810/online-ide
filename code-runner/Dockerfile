FROM ubuntu:latest

WORKDIR /usr/code-runner
RUN apt update
RUN apt install gcc g++ nodejs python3 -y
RUN npx prisma
COPY executor.py executor.py

CMD ["bash"]