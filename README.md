# codebook

A social platform for publishing and solving coding problems.

## Features

- **Publish problems**: Share coding challenges with the codebook community.
- **Browse problems**: Explore problems posted by other users.
- **In-browser code editor**: Solve problems directly in your browser using C++, Python, or Java.
- **Sandboxed execution**: Secure and efficient code compilation/execution powered by Piston.

## Tech Stack

- **Frontend/Backend**: Next.js 14+
- **Database**: PostgreSQL
- **Code execution engine**: Engineer-Man/Piston
- **Authentication**: Auth.js with Google OAuth integration

## Deployment

### Prerequisites

Create a `.env.local` file in the root directory of the project and provide the necessary environment variables.

### Starting the application

To download the latest images from Docker Hub and start the stack, run the following commands:

```bash
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml --env-file .env.local up -d
```

Access locally at: http://localhost:3000.

### Stopping the application

To shut down the containers:

```bash
docker compose -f docker-compose.prod.yml down
```
