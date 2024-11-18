# Setup Guide

## Prerequisites

### Required Software
- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- Git

### Required Accounts
- MongoDB Atlas (for production database)

## Local Development Setup

### 1. Clone the Repository
```bash
git clone https://github.com/michael-s-dev/palabrotas.git
cd your-project
```

### 2. Environment Variables
Create `.env` files in both client and server directories:

```bash
.env
MONGO_URI=your-mongo-uri
PORT=your-port
ORIGIN=your-origin
SECRET=your-secret
ENV=your-environment
```

### 3. Install Dependencies

```bash
cd server && npm install
cd client && npm install
```
### 4. Database Setup
1. Start MongoDB locally
2. The application will create necessary collections on first run

### 5. Run Development Servers
```bash
cd server && npm run dev
cd client && npm run dev
```
