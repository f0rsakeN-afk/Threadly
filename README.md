# Threadly

Threadly is a backend application designed to mimic the functionality of Reddit. It provides APIs for user authentication, subreddit management, post creation, and comment handling.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [API Documentation](#api-documentation)
  - [Authentication Routes](#authentication-routes)
  - [Subreddit Routes](#subreddit-routes)
  - [Post Routes](#post-routes)
  - [Comment Routes](#comment-routes)
- [Technologies Used](#technologies-used)

---

## Features

- User registration and login with JWT-based authentication.
- Subreddit creation, update, and deletion.
- Post creation and retrieval by subreddit.
- Comment creation, update, and deletion with ownership validation.

---

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/f0rsakeN-afk/Threadly.git
   cd Threadly
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and configure the required variables (e.g., database connection, JWT secret).

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Build for production:

   ```bash
   npm run build
   ```

6. Start the production server:
   ```bash
   npm start
   ```

---

## API Documentation

### Authentication Routes

| Method | Endpoint          | Description                | Protected |
| ------ | ----------------- | -------------------------- | --------- |
| POST   | `/register`       | Register a new user        | No        |
| POST   | `/login`          | Login and get a JWT token  | No        |
| POST   | `/forgotPassword` | Request a password reset   | No        |
| POST   | `/resetPassword`  | Reset the user's password  | No        |
| PATCH  | `/updatePassword` | Update the user's password | Yes       |

---

### Subreddit Routes

| Method | Endpoint | Description                    | Protected |
| ------ | -------- | ------------------------------ | --------- |
| GET    | `/`      | Get all subreddits             | No        |
| POST   | `/`      | Create a new subreddit         | Yes       |
| PATCH  | `/:id`   | Update a subreddit (ownership) | Yes       |
| DELETE | `/:id`   | Delete a subreddit (ownership) | Yes       |

---

### Post Routes

| Method | Endpoint   | Description                 | Protected |
| ------ | ---------- | --------------------------- | --------- |
| GET    | `/r/:slug` | Get posts by subreddit slug | No        |
| POST   | `/`        | Create a new post           | Yes       |

---

### Comment Routes

| Method | Endpoint   | Description                      | Protected |
| ------ | ---------- | -------------------------------- | --------- |
| GET    | `/:postId` | Get comments for a specific post | No        |
| POST   | `/`        | Create a new comment             | Yes       |
| PATCH  | `/:id`     | Update a comment (ownership)     | Yes       |
| DELETE | `/:id`     | Delete a comment (ownership)     | Yes       |

---

## Technologies Used

- **Node.js**: Backend runtime.
- **Express**: Web framework.
- **Prisma**: ORM for database management.
- **PostgreSQL**: Relational database
- **TypeScript**: Type safety.
- **JWT**: Authentication.
- **Zod**: Schema validation.

---
