# Ticket Booking System

A simple full-stack ticket booking system.

The system allows users to:

- View available ticket tiers

- Book tickets safely without double booking

- Handle concurrent booking scenarios correctly

## Tech Stack

### Frontend:
- React
- TypeScript
- Vite

### Backend:
- Node.js
- Express
- TypeScript

### Database:
- PostgreSQL

## Project Structure
ticket-booking-system/
│
├── frontend/ # React application
├── backend/ # Express + PostgreSQL API
│
└── README.md

## Backend API

### Health Check
-- GET /health
Returns server and database connection status.

### Get Available Tickets
-- GET /tickets
Returns all ticket tiers with price and remaining availability.

### Example response:
```json
[
  {
    "tier": "VIP",
    "price": 100,
    "available": 98
  }
]
``` 

### Book Tickets
-- POST /book

### Request body:
```json
{
  "tier": "VIP",
  "quantity": 2
}
``` 

### Success response:
```json
{
  "message": "Booking successful",
  "ticket": {
    "tier": "VIP",
    "price": 100,
    "available": 98
  }
}
``` 

### Failure response (not enough tickets):
```json
{
  "error": "Not enough tickets available"
}
``` 

## Concurrency and Double Booking Prevention

To prevent double booking, ticket availability is updated using a single atomic SQL update query.

```sql
UPDATE tickets
SET available = available - $1
WHERE tier = $2 AND available >= $1
RETURNING *;
```

The update checks availability and reduces the ticket count in one operation.
If multiple users try to book at the same time, only one request succeeds when availability is limited.

If no rows are updated, the booking is rejected safely.

## Running the Project Locally

### Prerequisites:

- Node.js
- PostgreSQL

### Backend Setup

1. Navigate to backend folder
cd backend

2. Install dependencies
npm install

3. Create a .env file with the following values
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=ticket_booking

4. Initialize the database
Run the SQL file located at backend/sql/init.sql
This creates the required tables and seed data.

5. Start backend server
npm run dev

6. Backend runs on
http://localhost:3001

### Frontend Setup

1.Navigate to frontend folder
cd frontend

2. Install dependencies
npm install

3. Start frontend
npm run dev

4. Frontend runs on
http://localhost:5173


## Non-functional Requirements & Design Intent

### Availability (99.99% Design Intent)

This system is designed with high availability as a goal, though it is deployed as a single-region setup for this assignment.
In a production environment, 99.99% availability could be achieved by:

1. Deploying the backend as stateless services behind a load balancer

2. Running multiple backend instances across availability zones

3. Using managed PostgreSQL with automatic failover and replication

4. Applying health checks and auto-scaling policies

5. Separating frontend and backend deployments so UI remains available even during backend issues

Because the application logic is stateless, new instances can be added or replaced without downtime.


### Scale Assumptions (1,000,000 DAU, ~50,000 Concurrent Users)

The system is designed assuming high read traffic and bursty booking traffic.
Scaling approach:

1. Ticket catalog (GET /tickets) is read-heavy and can be cached aggressively using an in-memory cache or CDN

2. Booking requests (POST /book) are write-sensitive and go directly to the database

3. Horizontal scaling of backend services allows handling large concurrent traffic

4. PostgreSQL can be scaled using read replicas for reads and a primary node for writes

5. Database indexes on tier ensure fast lookup and updates

Because booking logic is handled atomically at the database level, scaling backend instances does not introduce race conditions.


### Performance (Booking p95 < 500ms)

Performance targets are met by keeping booking logic minimal and database-driven.

Key design choices:

1. Single SQL query for booking reduces round trips

2. No external service calls during booking

3. Connection pooling via PostgreSQL driver

4. Minimal request validation logic

Most booking requests complete within one database transaction, keeping latency well under the target threshold.


### Double Booking Prevention Under Race Conditions

Double booking is prevented at the database level using an atomic update query.

Instead of:

- Fetching availability

- Then updating availability

The system performs both actions in a single SQL statement:

UPDATE tickets
SET available = available - quantity
WHERE tier = tier AND available >= quantity
RETURNING *;

This ensures:

1. Concurrent requests cannot oversell tickets

2. Only one request succeeds when availability is limited

3. Failed updates are safely detected by checking affected rows

This approach is safe even under high concurrency and does not rely on application-level locks.

Code comments in the booking endpoint explicitly document this behavior to make the intent clear.



## Notes

1. Currency is displayed in USD for all users

2. Payment is simulated and always succeeds as per assignment instructions

3. UI and backend are intentionally simple to keep focus on correctness and concurrency handling