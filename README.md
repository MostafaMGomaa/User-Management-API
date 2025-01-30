# User Management API

A user management system implementing RESTful API best practices with JWT authentication and repository pattern.

# Table of Contents

- [Features](#features)
  - [Core Functionality](#core-functionality)
  - [API Endpoints](#api-endpoints)
- [Technical Stack](#technical-stack)
- [Installation](#installation)
- [Architectural Overview](#architectural-overview)
  - [Repository Pattern Implementation](#repository-pattern-implementation)
  - [Layer Responsibilities](#layer-responsibilities)
- [Most Frequent Login Problem](#most-frequency-login-problem)
  - [Problem](#problem)
  - [Solution 1: Simple Counter with Timestamp](#solution-1-simple-counter-with-timestamp)
    - [Pros](#pros)
    - [Cons](#cons)
  - [Solution 2: Separate `user_logins` Table with Timestamp](#solution-2-separate-user_logins-table-with-timestamp)
    - [Pros](#pros-1)
    - [Cons](#cons-1)
  - [Improvement](#improvement)

## Features

### Core Functionality

- **User Registration & Authentication**
  - JWT-based authentication/authorization
  - Email verification workflow
  - Password hashing with bcrypt
- **User Management**
  - CRUD operations with proper authorization
  - Admin-protected routes
  - Advanced user statistics
- **Security**
  - SQL injection prevention
  - Input validation/sanitization

### API Endpoints

| Category           | Method | Endpoint          | Description                | Access |
| ------------------ | ------ | ----------------- | -------------------------- | ------ |
| **Authentication** | POST   | `/auth/register`  | Register new user          | Public |
|                    | POST   | `/auth/login`     | User login                 | Public |
|                    | POST   | `/auth/verify`    | Verify user email          | Public |
| **Users**          | GET    | `/users`          | List all users (paginated) | Admin  |
|                    | GET    | `/users/top`      | Top 3 active users         | Admin  |
|                    | GET    | `/users/inactive` | Inactive users             | Admin  |
|                    | GET    | `/users/:id`      | Get user details           | Admin  |
|                    | PATCH  | `/users/:id`      | Update user details        | Admin  |
|                    | DELETE | `/users/:id`      | Delete user                | Admin  |

[![Postman Documentation](https://img.shields.io/badge/Postman-API_Documentation-FF6C37?logo=postman)](https://documenter.getpostman.com/view/36996315/2sAYX2NjDy)

## Technical Stack

- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL + TypeORM
- **Authentication**: JWT, bcrypt
- **Validation**: class-validator, class-transformer
- **Architecture**: Repository Pattern, Layered Architecture
- **Tools**: Postman

## Installation

```bash
# Clone repository
git clone https://github.com/yourusername/user-management-api.git
cd user-management-api

# Install dependencies
npm install

# Setup environment (create .env file)
cp .env.example .env

# Start development server
npm run dev
```

## Architectural Overview

This system implements a clean, layered architecture with strict separation of concerns, designed for maintainability and scalability:

1. Repository Pattern Implementation

- Database Abstraction: The repository layer abstracts all SQL operations, creating a clear boundary between business logic and data access
- Swappable Data Sources: Postgresql implementation can be replaced with any SQL/NoSQL database without affecting service layers
- Type-Safe Operations: Generic repository interface ensures consistent data access patterns

2. Layer Responsibilities

- Routes: Define API endpoints and middlewares
- Controllers: Handle HTTP requests/responses
- Services: Contain core business logic
- Repositories: Manage database operations
- DTOs: Validate and transform request data
- Entities: Define database schema structure

## Most Frequency Login Problem

### Problem

To find the most frequently logging users and inactive users.

### Solution 1: Simple Counter with Timestamp

This approach updates a counter in the user table each time a user logs in. Given the task, which focuses on identifying the **top 3 users by login frequency** and a **list of inactive users** (who haven't logged in for the past hour or month), this solution is sufficient because it fulfills the requirements of the task efficiently without needing complex queries or additional tracking.

This approach is easy to set up and is sufficient for small systems. However, as the system scales, it can lead to performance issues, as all users' data are stored in the same table. Additionally, it doesn't track user activity or login trends, which is important for larger systems requiring analytics and insights.

#### Pros

- **Simple and quick to implement**.
- **Low storage cost**.
- Suitable for small systems where detailed user activity is not necessary.

#### Cons

- Can lead to **performance issues in large systems** (locks issue).
- **No tracking of user history** (e.g., login times).
- Not useful for **analytics or peak login time detection**.

### Solution 2: Separate `user_logins` Table with Timestamp

A new table is created to track each user login, including the timestamp. This solution helps with tracking user activity and analytics in large systems.

#### Pros

- Tracks **user login history** and provides valuable data for **analytics** (peak login times, activity trends).
- Scales better for **large systems**, as it avoids row-level locking issues.
- Facilitates **fraud detection** and other user activity monitoring.

#### Cons

- **Higher storage costs** due to additional records in the database.
- Requires **periodic cleanup** of old data to avoid excessive storage use.
- Can lead to slower queries when calculating most frequent users if not properly optimized.

### Improvement

To optimize the design:

- Use **async messaging tools** like **RabbitMQ** or **Kafka** to process logins asynchronously, reducing the load on the main system and avoiding locking issues.
- Implement a **cache (e.g., Redis)** to maintain the login counter in memory with Write-Back strategy, avoiding frequent updates to the disk-based database. This can significantly reduce database load by first writing to the cache and then asynchronously updating the database.
