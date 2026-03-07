MarketNest – MERN Marketplace Application
Project Overview

MarketNest is a full-stack MERN marketplace platform where Brands (Sellers) can manage their products and Customers (Users) can browse and search products.

The platform implements secure authentication, role-based authorization, product management, and marketplace browsing with server-side filtering and pagination.

This project demonstrates a production-ready architecture with separate frontend and backend deployments.

Live Application Links
Frontend (Vercel) - https://marketnest-seven.vercel.app

Backend API(Render) - https://marketnest-goea.onrender.com

Github Repository - https://github.com/hema-latha-reddy/Marketnest

Architecture Explanation

The application follows a client-server architecture using the MERN stack.

Frontend

React (Vite) application responsible for:

User authentication interface

Brand dashboard

Product creation and management

Marketplace browsing

Product search and filtering

Frontend communicates with the backend through REST APIs using Axios.

Backend

Node.js + Express API server responsible for:

Authentication & authorization

Product management

Business logic

Database communication

Database

MongoDB Atlas cloud database stores:

Users

Products

Product images

Product ownership details

Deployment Architecture

Frontend → Vercel
Backend → Render
Database → MongoDB Atlas

The architecture ensures scalability, separation of concerns, and cloud deployment readiness.

Authentication Flow

The application implements secure JWT-based authentication.

1. Signup

Users create an account with:

Name

Email

Password

Role (Brand or Customer)

Password is hashed using bcrypt before storing in the database.

2. Login

User submits credentials.

Backend:

Verifies email

Compares hashed password

Generates JWT Access Token
Token is stored in the browser and used for protected requests.

3. Protected Routes

Certain routes require authentication:

Brand dashboard

Product creation

Product editing

Product deletion

Middleware verifies the JWT token before allowing access.

4. Role-Based Authorization

The application restricts access using role middleware.

Brand users can:

Create products

Edit their products

Archive products

View dashboard summary

Customers can:

Browse marketplace

Search products

Filter by category

View product details

Customers cannot modify products.

Folder Structure Overview

Marketnest
│
├── backend
│   ├── config
│   │   └── db.js
│   │
│   ├── controllers
│   │   ├── authController.js
│   │   └── productController.js
│   │
│   ├── middleware
│   │   ├── authMiddleware.js
│   │   ├── role.js
│   │   └── uploadMiddleware.js
│   │
│   ├── models
│   │   ├── User.js
│   │   └── Product.js
│   │
│   ├── routes
│   │   ├── authRoutes.js
│   │   └── productRoutes.js
│   │
│   ├── server.js
│   └── package.json
│
├── frontend
│   ├── src
│   │   ├── components
│   │   │   └── Navbar.jsx
│   │   │
│   │   ├── pages
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Marketplace.jsx
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
└── README.md

Brand (Seller) Capabilities

After login, Brand users can:

Access Brand Dashboard

Create new products

Upload multiple product images

Set product status (draft or published)

Edit only their own products

Archive products (soft delete)

Dashboard Summary

The dashboard shows:

Total products

Published products

Archived products

Ownership enforcement ensures that brands cannot modify products belonging to other users.

Customer (User) Capabilities

After login, customers can:

Browse marketplace products

View product details

Search products by name

Filter products by category

Navigate through server-side pagination

Customers cannot edit or delete products.

Security Decisions

Several security mechanisms were implemented:

Password Hashing

User passwords are securely stored using bcrypt hashing.

JWT Authentication

All protected routes require a valid JWT token.

Role-Based Authorization

Middleware restricts access based on user role:

Brand users can manage products

Customers can only browse products

Ownership Enforcement

Brands can only:

Edit their own products

Archive their own products

Environment Variables

Sensitive credentials such as:

MongoDB connection string

JWT secret

are stored in environment variables and not exposed in the code.

Image Upload Handling

Product images are handled using:

Multer middleware

Cloud storage configuration

Images are stored and retrieved via backend APIs.

Deployment
Backend Deployment

Platform: Render

Backend API URL: https://marketnest-goea.onrender.com

Frontend Deployment

Platform: Vercel

Frontend URL: https://marketnest-seven.vercel.app

Database

MongoDB Atlas cloud database.


AI Tools Usage

AI tools were used during development to assist with:

Debugging backend errors

Optimizing React UI structure

Improving deployment configuration

Generating documentation and architecture explanation

However, all application logic, authentication flow, and database integration were implemented and tested manually.

Conclusion

MarketNest demonstrates a secure, scalable MERN marketplace system with role-based access control, cloud deployment, and a clean separation between frontend and backend services.

This project highlights practical skills in:

MERN stack development

Authentication & authorization

REST API design

Cloud deployment

Secure application architecture

Commands for execution:
Frontend - npm run dev
Backend - npx nodemon server.js