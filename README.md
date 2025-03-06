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

## Request
```json
{
  "name": "Shyam",
  "email": "organiser5@example.com",
  "password": "Sk12345",
  "role": "organizer"
}
```
## Response
```json
{
    "success": true,
    "authtoken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjdjOWQ2YTQ4YzFiNDMwMDY4ODllNGY3Iiwicm9sZSI6Im9yZ2FuaXplciJ9LCJpYXQiOjE3NDEyODA5MzJ9.BRM6dnjJfnsj8EZw9BgUUUSB1_cXervyz-yh8VKah9o"
}
```

#### User Login
**Endpoint:** `POST /api/auth/login`
## Request
```json
{
  "email": "organiser5@example.com",
  "password": "Sk12345"
}
```
## Response
```json
{
    "success": true,
    "authtoken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjdjOWQ2YTQ4YzFiNDMwMDY4ODllNGY3Iiwicm9sZSI6Im9yZ2FuaXplciJ9LCJpYXQiOjE3NDEyODEyMTd9.l2FFsKZj5K9rlm3SwLDQyVQC67LuDivX_j7NwLDlbvE"
}
```
#### Get user data
**Endpoint:** `POST /api/auth/getuser`
## Response
```json
{
    "_id": "67c9d6a48c1b43006889e4f7",
    "name": "Shyam",
    "email": "organiser5@example.com",
    "role": "organizer",
    "createdAt": "2025-03-06T17:08:52.176Z",
    "updatedAt": "2025-03-06T17:08:52.176Z",
    "__v": 0
}
```

### Events Management
#### Fetch all events
**Endpoint:** `GET /api/event/fetchall`
## Response
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
## Request
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
## Response
```json
{
{
    "title": "Debate competition 2025",
    "description": "A Tech event",
    "date": "2025-12-18T00:00:00.000Z",
    "location": "Anna Auditorium",
    "event_type": "public",
    "organizer": "67c9d6a48c1b43006889e4f7",
    "attendees": [],
    "attended": [],
    "tickets": [
        {
            "tier": "Regular",
            "price": 150,
            "available_quantity": 100,
            "_id": "67c9da42ad49e009bf396893"
        }
    ],
    "_id": "67c9da42ad49e009bf396892",
    "__v": 0
}
```

#### Update an event (Only Organizers)
**Endpoint:** `PUT /api/event/update/{eventId}`
## Request
```json
{
{
    "title": "Drawing competition 2025",
    "description": "A Tech event",
    "date": "2025-12-18",
    "location": "Anna Auditorium",
    "event_type": "public",
    "tickets": [
        { "tier": "Regular", "price": 150, "available_quantity": 100 }
    ]
}
```
## Response
```json
{
    "_id": "67c9d958ad49e009bf396888",
    "title": "Drawing competition 2025",
    "description": "A Tech event",
    "date": "2025-12-18T00:00:00.000Z",
    "location": "Anna Auditorium",
    "event_type": "public",
    "organizer": "67c9d6a48c1b43006889e4f7",
    "attendees": [],
    "attended": [],
    "tickets": [
        {
            "tier": "Regular",
            "price": 150,
            "available_quantity": 100,
            "_id": "67c9da0cad49e009bf39688e"
        }
    ],
    "__v": 0
}
```

#### Delete an event (Only Organizers)
**Endpoint:** `DELETE /api/event/delete/{eventId}`
## Response
```json
{
    "message": "Event deleted successfully"
}
```
### Registration & Attendance
#### Register for an event
**Endpoint:** `POST /api/registration/register/{eventId}`
## Response
```json
{
    "message": "Registration successful",
    "qrCode": "data:image/png;base64,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"
}
```

#### QR Code Scanning (Only Organizers)
**Endpoint:** `POST /api/registration/scan`
## Request
```json
{
    "qrData": "{\"eventId\": \"67c9da42ad49e009bf396892\", \"userId\": \"67c9ccee65d71c13c091439d\"}"
}

```
## Response
```json
{
    "message": "Attendance marked successfully"
}
```



