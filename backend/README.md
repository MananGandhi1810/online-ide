# Express Authentication Template

This is a simple Express app which uses JWT based authentication.

## Features

-   User registration
-   User login
-   Email Verification
-   Authentication Middleware
-   Password Reset

## Tech Stack

-   Node.js
-   Express
-   PostgreSQL
-   Prisma ORM
-   Resend Email API
-   Argon2 Password Hashing

## How to use

### Local Development

1. Clone the repository
2. Install dependencies using `npm install`
3. Rename `.env.example` to `.env` and fill in the required details
4. Run the server using `npm start` or `npm run dev` (for development)

### Docker

1. Clone the repository
2. Rename `.env.example` to `.env` and fill in the required details
3. Run `npm run docker:build` to build the Docker image
4. Run the following command to run the Docker container

```bash
docker run --env-file .env.prod --name <container name> -d --network=<network name> -p 3000:3000 express-app
```

## Contributing

1. Fork the repository
2. Open an issue or feature request
3. Create a new branch (`git checkout -b feature`)
4. Commit your changes (`git commit -am 'Add new feature'`)
5. Push to the branch (`git push origin feature`)
6. Create a new Pull Request
7. Get your changes merged
