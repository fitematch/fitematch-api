# fitematch-api

The **fitematch-api** magane users, jobs and applications.

---

## Stack

- **[Node.js](https://nodejs.org/)**
- **[NestJS](https://nestjs.com/)**
- **[TypeScript](https://www.typescriptlang.org/)**
- **[MongoDB](https://www.mongodb.com/)**
- **[Mongoose](https://mongoosejs.com/)**
- **[Swagger](https://swagger.io/)**
- **[Jest](https://jestjs.io/)**
- **[Docker](https://www.docker.com/)**

---

## API Documentation

Interactive API documentation is available via Swagger:

```
http://localhost:3000/docs
```

---

## Environment Variables

Create a `.env` file based on `.env.example`.

Example:

```
# Application host URL:
JOB_API_URL=http://localhost:3000

# Host port bound to the API container:
APPLICATION_BIND_PORT=3000

# API container port:
APPLICATION_PORT=3000

# JWT secret used to sign access tokens:
JWT_SECRET=dev-secret-change-me

# MongoDB database URI:
DATABASE_URI=mongodb://database:27017/fitematch

# MongoDB database schema:
DATABASE_NAME=fitematch

# MongoDB host bind port:
DATABASE_BIND_PORT=27017

# MongoDB container port:
DATABASE_PORT=27017
```

---

## Running with Docker

Start the full environment:

```
docker-compose up -d --build
```

---

## Testing

The project includes a comprehensive testing strategy focused on business logic.

Run tests:

```
npm run test
```

Run test coverage:

```
npm run test:cov
```

---

## Related Services

This API is part of the FitMatch ecosystem:

- `fitematch-site` → Frontend website application.
- `fitematch-dashboard` → Dashboard application.

---
