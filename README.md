# JWT Token Refresher

A Node.js backend service for handling JWT token refreshing.

## Features

- User registration and login.
- JWT authentication with access and refresh tokens.
- Refresh token rotation.
- Protected routes.

## Installation

1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Set up a MongoDB database.
4.  Create a `.env` file with the following variables:
    -   `ACCESS_TOKEN_SECRET`: A secret key for signing access tokens.
    -   `REFRESH_TOKEN_SECRET`: A secret key for signing refresh tokens.
    - `MONGODB_URI`: The connection string to your MongoDB database.  (e.g., `mongodb://localhost:27017/jwt-refresher`)
5.  Run the server: `npm start`

## Endpoints

-   `POST /api/auth/register`: Register a new user.
-   `POST /api/auth/login`: Login and receive access and refresh tokens.
-   `POST /api/auth/token`: Refresh an access token using a refresh token.
-   `POST /api/auth/logout`: Logout and invalidate the refresh token.
-   `GET /api/auth/protected`: A protected route that requires a valid access token.
