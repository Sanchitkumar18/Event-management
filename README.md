# Event Management API

## Overview
Event Management API is a RESTful service that facilitates user authentication, event creation, and registration processes. The API supports role-based access control and QR code-based attendance tracking.

## Deployed URL
https://event-management-kost.onrender.com

## Tech Stack
- Node.js
- Express.js
- MongoDB (Mongoose ODM)
- JSON Web Token (JWT) for authentication
- bcrypt.js for password hashing
- QR Code generation and scanning

## Installation & Setup

### Prerequisites
- Node.js installed
- MongoDB instance (local or cloud-based)

### Clone the Repository
```sh
git clone https://github.com/your-repo/Event-Management.git
cd Event-Management
```

### Install Dependencies
```sh
npm install
```

### Environment Variables
Create a `.env` file and define the necessary environment variables:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### Running the Server
#### Development Mode (with auto-restart using nodemon)
```sh
npm run server
```
#### Production Mode
```sh
npm start
```

## API Endpoints

### Authentication
#### Create a role-based user
**Endpoint:** `POST /api/auth/createuser`
```json
{
  "name": "Shyam",
  "email": "organiser5@example.com",
  "password": "Sk12345",
  "role": "organizer"
}
```

#### User Login
**Endpoint:** `POST /api/auth/login`
```json
{
  "email": "organiser5@example.com",
  "password": "Sk12345"
}
```

### Events Management
#### Fetch all events
**Endpoint:** `GET /api/event/fetchall`
```json
[
    {
        "_id": "67c9da42ad49e009bf396892",
        "title": "Debate competition 2025",
        "description": "A Tech event",
        "date": "2025-12-18T00:00:00.000Z",
        "location": "Anna Auditorium",
        "event_type": "public",
        "organizer": "67c9d6a48c1b43006889e4f7",
        "attendees": [
            "67c9ccee65d71c13c091439d"
        ],
        "attended": [
            "67c9ccee65d71c13c091439d"
        ],
        "tickets": [
            {
                "tier": "Regular",
                "price": 150,
                "available_quantity": 100,
                "_id": "67c9da42ad49e009bf396893"
            }
        ],
        "__v": 2
    }
]
```
#### Create an event (Only Organizers)
**Endpoint:** `POST /api/event/create`
```json
{
  "title": "Debate competition 2025",
  "description": "A Tech event",
  "date": "2025-12-18",
  "location": "Anna Auditorium",
  "event_type": "public",
  "tickets": [
    { "tier": "Regular", "price": 150, "available_quantity": 100 }
  ]
}
```

#### Update an event (Only Organizers)
**Endpoint:** `PUT /api/event/update/{eventId}`

#### Delete an event (Only Organizers)
**Endpoint:** `DELETE /api/event/delete/{eventId}`

### Registration & Attendance
#### Register for an event
**Endpoint:** `POST /api/registration/register/{eventId}`

#### QR Code Scanning (Only Organizers)
**Endpoint:** `POST /api/registration/scan`
```json
{
  "qrData": "{\"eventId\": \"eventId\", \"userId\": \"userId\"}"
}
```



