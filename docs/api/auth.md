# Authentication API

## Overview
The authentication system uses Passport.js for secure user authentication. All authenticated endpoints require a valid authentication token to be included in the request header.

## Endpoints

### Register New User
```
http
POST /api/auth/register
json
{
"username": "string",
"email": "string",
"password": "string"
}
**Response:** `200 OK`
json
{
"id": "string",
"username": "string",
"email": "string",
}
```
### Login User
```
POST /api/auth/login
json
{
"email": "string",
"password": "string"
}
```