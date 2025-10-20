# Port Monitoring Dashboard

A simplified port monitoring dashboard that connects to InfluxDB for vessel GPS data and PostgreSQL for vessel information.

## Features

- **Real-time GPS Tracking**: Vessel GPS data with coordinates, altitude, and SOS signals
- **Vessel Management**: Simple vessel information stored in PostgreSQL
- **SOS Alert System**: Real-time monitoring of emergency signals
- **Dashboard Overview**: Clean, modern dashboard showing vessel locations and status
- **Responsive Design**: Works on desktop and mobile devices

## Architecture

### Data Sources

1. **InfluxDB**: Time-series database for vessel GPS data
   - Device ID (primary identifier)
   - GPS coordinates (longitude, latitude, altitude)
   - SOS signal (boolean flag)
   - Timestamp

2. **PostgreSQL**: Relational database for vessel information
   - Device ID (primary key)
   - Hull Identification Number
   - Vessel Type (container, bulk, tanker, passenger, fishing, tug)

## Setup

### Prerequisites

- Node.js 18+
- pnpm
- InfluxDB (running on localhost:8086)
- PostgreSQL (running on localhost:5432)

### Installation

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

### Environment Variables

```env
# InfluxDB Configuration
INFLUX_URL=http://localhost:8086
INFLUX_TOKEN=your_influx_token_here
INFLUX_ORG=portect
INFLUX_BUCKET=sensor_data

# PostgreSQL Configuration
POSTGRES_URL=postgresql://localhost:5432/portect
POSTGRES_USER=portect
POSTGRES_PASSWORD=portect
POSTGRES_DB=portect
```

## Database Schema

### InfluxDB Bucket

- **vessel_data**: Vessel GPS data
  - Fields: `longitude`, `latitude`, `altitude`, `sos_signal`
  - Tags: `device_id`

### PostgreSQL Tables

- **vessels**: Vessel information
  - `device_id` (Primary Key)
  - `hull_identification_number`
  - `vessel_type`

## API Endpoints

- `POST /api/influx/query`: Query InfluxDB vessel GPS data
- `POST /api/postgres/query`: Query PostgreSQL vessel data

## Development

### Project Structure

```
app/
├── components/          # Reusable UI components
├── composable/         # Vue composables for data management
├── pages/              # Application pages
├── server/api/         # API endpoints
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

### Key Files

- `app/pages/index.vue`: Main dashboard page with vessel GPS tracking
- `app/composable/useInfluxData.ts`: InfluxDB vessel GPS data management
- `app/composable/usePostgresData.ts`: PostgreSQL vessel data management
- `app/types/influx.ts`: InfluxDB vessel GPS type definitions
- `app/types/postgres.ts`: PostgreSQL vessel type definitions

### Data Flow

1. **Vessel GPS Data**: Devices send GPS coordinates, altitude, and SOS status to InfluxDB
2. **Vessel Information**: Static vessel data (HIN, type) stored in PostgreSQL
3. **Dashboard**: Real-time display of vessel locations, SOS alerts, and vessel types
4. **SOS Monitoring**: Automatic detection and highlighting of emergency signals

## Deployment

The application can be deployed to any platform that supports Node.js applications. Make sure to configure the environment variables for your production databases.

## License

Private project - All rights reserved.