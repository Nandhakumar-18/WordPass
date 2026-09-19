# Workpass MVP

A full-stack web application built with React, Vite, Express, and tRPC.

## 🚀 Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, Radix UI, React Query
- **Backend:** Node.js, Express, tRPC
- **Database:** MySQL, Drizzle ORM
- **Package Manager:** pnpm

## 📦 Getting Started

### Prerequisites

- Node.js (v20+ recommended)
- [pnpm](https://pnpm.io/installation)
- A MySQL database

### Installation

1. Clone the repository and install dependencies:
```bash
pnpm install
```

2. Set up your environment variables. You will need a database connection string and authentication secrets.

### Database Setup

To push your database schema to your MySQL instance:
```bash
pnpm run db:push
```

### Development

Start the development server with hot-reloading:
```bash
pnpm run dev
```
The application will be available at `http://localhost:3000`.

## 🏗️ Build for Production

To build the application for production:
```bash
pnpm run build
```

To start the production server:
```bash
pnpm start
```
