# Post-Server

## About

#### Link to the frontend: https://github.com/pheroom/posts

Posts is a production-ready, multi-user blogging platform built with the MEAN (MongoDB, Express, React, Node.js) stack. The application is designed to handle multiple users with different roles and provides a robust authentication system.
Features:

User Signup / Signin: New users can sign up and existing users can sign in to access the platform.
JWT based Authentication System: Secure authentication using JSON Web Tokens.
Role Based Authorization System: Differentiated access for users and admins.
User Profile: Personalized user profiles.
Multiple User Authorization System: Support for multiple user roles and permissions.
Admin / User Dashboard Privilege: Separate dashboards for admins and users with respective privileges.
Image Uploads: Support for uploading images to posts.
Load More Posts: Pagination functionality to load more blogs.

## Tech Stack:

[NodeJs](https://nodejs.org/en),
[Express](https://expressjs.com/ru/),
[MongoDB](https://www.mongodb.com/),
[JWT (JSON Web Token)](https://jwt.io/)

### Usage
You can access the following endpoints on http://localhost:8000/api

You can access the static files on http://localhost:8000/static

#### Authentication

| Method | Path               |   
|--------|--------------------|  
| post   | /auth/registration | 
| post   | /auth/login             | 
| get    | /auth/check             |

#### Users

| Method | Path                     |   
|--------|--------------------------|  
| get    | /users?limit=10&page=1   | 
| get    | /users/:id               | 
| put    | /users                   | 
| delete | /users/:id               | 
| put    | /users/:id/follow        |
| put    | /users/:id/unfollow      |
| put    | /users/favourites/:pid   |
| put    | /users/unfavourites/:pid |
| put    | /users/:id/block         |
| put    | /users/:id/unblock       |

#### Posts

| Method | Path                     |   
|--------|--------------------------|  
| get    | /posts?limit=10&page=1   | 
| get    | /posts/:id               | 
| post   | /posts                   | 
| delete | /posts/:id               | 
| put    | /posts/:id/like          |
| put    | /posts/:id/unlike        |
| get    | /posts/:id/comments      |
| post   | /posts/:id/comments      |
| delete | /posts/:id/comments/:cid |
| put    | /comments/:cid/like      |
| put    | /comments/:cid/unlike    |

### Start locally

> Add the requirements in the .env file

```bash
git clone https://github.com/pheroom/posts-server.git
cd posts-server
npm install
npm run start
```

This will start the development server on `http://localhost:8000/`. This should reload automatically when you make changes to the code, but no code is perfect, so sometimes you may need to restart it. xd
    