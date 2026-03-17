# Smart Environment Dashboard System

A comprehensive web application for monitoring environmental parameters in real time, built with Next.js, TypeScript, Tailwind CSS, and Prisma.

## Features

- Real-time environmental data monitoring
- Interactive dashboards with charts and visualizations
- Sensor management and data collection
- User roles: Administrator, Environmental Analyst, Public User, Field Technician
- Historical data analysis
- Alert system for environmental conditions

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, Recharts
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT (planned)
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   npx tsx prisma/seed.ts
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `app/` - Next.js app directory with pages and API routes
- `components/` - React components
- `lib/` - Utility functions and database client
- `prisma/` - Database schema and seed files

## API Endpoints

- `GET /api/sensors` - List all sensors
- `POST /api/sensors` - Create a new sensor
- `GET /api/data` - Get sensor data
- `POST /api/data` - Add sensor data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT
