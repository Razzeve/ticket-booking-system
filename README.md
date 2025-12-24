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
