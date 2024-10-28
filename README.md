# Online IDE

Online IDE, built using Express.js and React.js

## Features

-   JWT Based User Authentication
    -   Register
    -   Login
    -   Email token verification
    -   Forgot password with OTP
-   Code Editor
    -   Syntax Highlighting (with Shiki.js)
    -   4 Languages Supported (Python, C, C++, Java)
    -   Problem Statements rendered as Markdown, with support for code blocks
    -   Sample Test Cases for each problem with expected output
-   Sandboxed Code Execution
    -   Docker container for each code execution
    -   Limit time used by code
-   Test code against sample test cases before submission
-   Verify output against hidden test cases
-   Save code to local storage
-   AI Assistant
    -   LLaMA will provide hints for the problem statement, with access to the code written by the user as context
    -   Streaming response from the AI Assistant, for a more interactive experience
-   Points
    -   +10 if the user solves a problem statement in the first submission
    -   +5 if the user solves a problem statement in more than one submission
    -   no points awarded if user solves a problem statement correctly more than once
-   Leaderboard ranking based on points

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
-   Shiki.js with Monaco Editor (for code editing with syntax highlighting)
-   Meta LLaMA 3.1B (CloudFlare Workers AI)

## Setup

You can either use the docker-compose file to run the project or run the backend and frontend separately.

### Using Docker Compose

-   Clone the repository
-   Copy the `.env.example` file to `.env` and fill in the required values in both `frontend` and `backend` directories.
-   Run `docker compose up` in the root directory
-   The project will be running on `localhost:8000`

### Running Backend and Frontend Separately

> [!NOTE]
> You will still need to have Docker installed on your system.

-   Clone the repository
-   Copy the `.env.example` file to `.env` and fill in the required values in both `frontend` and `backend` directories.
-   Run the backend server
    -   Navigate to the `backend` directory
    -   Run `npm install`
    -   Run `npm run dev`
-   The backend server will be running on `localhost:3000`
-   Run the frontend server
    -   Navigate to the `frontend` directory
    -   Run `npm install`
    -   Run `npm start`
-   The project will be running on `localhost:5173`

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
