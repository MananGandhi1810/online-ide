FROM alpine:latest

WORKDIR /usr/code-runner
RUN apk update
RUN apk add gcc g++
RUN apk add nodejs
RUN apk add python3
RUN apk add openjdk11
RUN apk add bash
RUN adduser -D code-runner
USER code-runner
COPY executor.py executor.py
