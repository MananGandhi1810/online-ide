# Online IDE

Online IDE, built using Express.js and React.js

## Features

-   JWT Based User Authentication
    -   Register
    -   Login
    -   Email token verification
    -   Forgot password with OTP
-   Code Editor
    -   Syntax Highlighting
    -   3 Language Support (Python, C, C++)
-   Sandboxed Code Execution
    -   Docker container for each code execution
    -   Limit time used by code
-   Verify output against test cases
-   Save code to local storage

## Tech Stack

-   Express.js (Backend + Execution Worker)
-   Python (for code execution on the container)
-   React.js (Frontend)
-   Redis (for internal messaging, storing OTPs, saving code execution results)
-   PostgreSQL (with Prisma ORM)
-   Docker (with docker-compose)
-   Dockerode (for managing docker containers)
-   Resend (for sending emails)
-   Shadcn/UI (for frontend components)
