# Port Monitoring Dashboard

A real-time port monitoring dashboard that connects to InfluxDB for vessel GPS data and PostgreSQL for vessel information.

## Features

- **Real-time GPS Tracking**: Auto-refreshing vessel GPS data with coordinates, altitude, and SOS signals (updates every second)
- **Vessel Management**: Vessel information stored in PostgreSQL
- **SOS Alert System**: Real-time monitoring of emergency signals
- **Dashboard Overview**: Clean, modern dashboard showing vessel locations and status
- **Time Range Selection**: View GPS data from last 1, 6, 12, or 24 hours
- **Device Filtering**: Filter GPS data by individual device or view all devices
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode Support**: Automatic dark/light mode switching

## Architecture

### Data Sources

1. **InfluxDB**: Time-series database for vessel GPS data
   - Device ID (primary identifier)
   - GPS coordinates (longitude, latitude, altitude)
   - Priority level (1-3)
   - SOS signal (boolean flag)
   - Timestamp

2. **PostgreSQL**: Relational database for vessel information
   - Device ID (primary key)
   - Hull Identification Number
   - Vessel Type (Cargo Ship, Container Ship, Tanker, Passenger, Fishing, Tug)

## Setup

### Prerequisites

- Node.js 18+
- pnpm (or npm)
- Access to InfluxDB server
- Access to PostgreSQL server

### Installation

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Configure database credentials:**
   
   Edit `nuxt.config.ts` and update the database credentials to match your setup:
   
   ```typescript
   runtimeConfig: {
     // PostgreSQL Configuration
     postgresUrl: 'postgresql://username:password@hostname:5432/database',
     postgresUser: 'your_username',
     postgresPassword: 'your_password',
     postgresDb: 'your_database',
     
     // InfluxDB Configuration
     influxUrl: 'http://your-influx-server:8086',
     influxToken: 'your_influx_token',
     influxOrg: 'your_org_name',
     influxBucket: 'your_bucket_name',
   }
   ```

3. **Start the development server:**
   ```bash
   pnpm dev
   ```

4. **Open your browser:**
   ```
   http://localhost:3000
   ```

### Quick Start (Default Configuration)

The application comes pre-configured with default credentials. If you're using the default setup:
- Just run `pnpm install` and `pnpm dev`
- The app will connect to the pre-configured databases
- No additional configuration needed!

## Database Schema

### InfluxDB Bucket (`pvm-monitoring`)

Vessel GPS data with the following fields:
- **Fields**: 
  - `longitude` (float): GPS longitude coordinate
  - `latitude` (float): GPS latitude coordinate
  - `altitude` (float): Altitude in meters
  - `priority` (float): Priority level (1 = high, 2 = normal, 3 = low)
  - `sos_signal` (boolean): Emergency SOS flag
- **Tags**: 
  - `device_id` (string): Unique device identifier
- **Timestamp**: Auto-generated timestamp for each data point

### PostgreSQL Tables

**`vessels`** table:
- `deviceid` (VARCHAR, Primary Key): Unique device identifier
- `hullidentificationnumber` (VARCHAR): Hull Identification Number
- `vesseltype` (VARCHAR): Type of vessel (Cargo Ship, Container Ship, Tanker, Passenger, Fishing, Tug)

## API Endpoints

### Server API Endpoints

- `POST /api/influx/query`: Query InfluxDB for vessel GPS data
  - Request body: `{ start_time, end_time, device_id?, limit?, offset? }`
  - Returns: CSV data parsed into JSON format
  
- `POST /api/postgres/query`: Query PostgreSQL for vessel information
  - Request body: SQL query configuration
  - Returns: Query results in JSON format

## Development

### Project Structure

```
app/
├── components/
│   ├── common/         # Shared UI components (AppCard, Button, Modal)
│   ├── dashboard/      # Dashboard-specific components
│   └── Navigation/     # Navigation components (SideNav, TopNav)
├── composable/
│   ├── useInfluxData.ts    # InfluxDB data management
│   └── usePostgresData.ts  # PostgreSQL data management
├── pages/
│   └── index.vue       # Main dashboard page
├── server/api/
│   ├── influx/         # InfluxDB API endpoints
│   └── postgres/       # PostgreSQL API endpoints
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

### Key Files

- **`app/pages/index.vue`**: Main dashboard with real-time GPS tracking and auto-refresh
- **`app/composable/useInfluxData.ts`**: Manages InfluxDB queries and data caching
- **`app/composable/usePostgresData.ts`**: Manages PostgreSQL queries
- **`app/server/api/influx/query.post.ts`**: Server-side InfluxDB query handler
- **`app/server/api/postgres/query.post.ts`**: Server-side PostgreSQL query handler
- **`nuxt.config.ts`**: Application configuration and database credentials

### Auto-Refresh System

The dashboard automatically updates every second with an optimized incremental update system:

1. **Initial Load**: Fetches full time range (1-24 hours based on selection)
2. **Auto-Refresh**: Every second, fetches only the last 30 seconds of new data
3. **Smart Merging**: Deduplicates and merges new data with existing data
4. **Memory Management**: Automatically trims old data beyond selected time range
5. **Efficiency**: ~99% reduction in data transfer compared to full reloads

### Data Flow

1. **GPS Data Collection**: Devices continuously send GPS coordinates, altitude, priority, and SOS status to InfluxDB
2. **Vessel Information**: Static vessel data (HIN, type) stored in PostgreSQL
3. **Dashboard Loading**: Initial page load fetches both PostgreSQL and InfluxDB data in parallel
4. **Real-time Updates**: Auto-refresh system keeps GPS data current without full page reloads
5. **SOS Monitoring**: Automatic detection and highlighting of emergency signals
6. **Error Handling**: Clear distinction between connection errors and "no data available" scenarios

### Error Handling

The application provides clear error messages:
- **Connection Errors** (Red): Actual database connection failures with specific error details
- **No Data Warnings** (Yellow): Successfully connected but no data in selected time range
- **Retry Functionality**: Easy retry buttons for connection errors

## Deployment

### Production Deployment

1. **Update Database Credentials**: Edit `nuxt.config.ts` with production database URLs
2. **Build the Application**:
   ```bash
   pnpm build
   ```
3. **Start Production Server**:
   ```bash
   pnpm start
   ```

### Deployment Platforms

The application can be deployed to:
- **Vercel** (recommended for Nuxt apps)
- **Netlify**
- **AWS / Google Cloud / Azure**
- Any platform supporting Node.js applications

**Important**: Update database credentials in `nuxt.config.ts` before deploying to production!

## License

Private project - All rights reserved.