# Changes Summary - InfluxDB Configuration & Dashboard Updates

## Overview
Fixed InfluxDB configuration, added device separation for GPS data, extended query periods, and improved dashboard display.

---

## 🔧 Files Modified

### 1. `nuxt.config.ts`
**Changes:**
- Updated InfluxDB URL to `http://yaoxiang-ubuntu:8086`
- Added InfluxDB API token
- Changed default bucket from `vessel_data` to `pvm-monitoring`

**Configuration:**
```typescript
influxUrl: 'http://yaoxiang-ubuntu:8086',
influxToken: 'DUcxc8urooet7hwWujbWUVhN-NmPjqGe4NL37AVeIJMVvEFNdrtYhR2pua70Y_QGZvEw58Qkn5hrEySU_AzBlw==',
influxOrg: 'portect',
influxBucket: 'pvm-monitoring',
```

---

### 2. `app/types/influx.ts`
**Changes:**
- Added `priority` field to `VesselGPSData` interface

**New Interface:**
```typescript
export interface VesselGPSData {
  timestamp: string
  device_id: string
  longitude: number
  latitude: number
  altitude: number
  priority: number      // NEW
  sos_signal: boolean
}
```

---

### 3. `app/server/api/influx/query.post.ts`
**Changes:**
- Updated to use runtime config instead of environment variables
- Added debug logging for connection troubleshooting
- Extended default query period from 24 hours to **7 days** (`-7d`)
- Added `priority` field to query and CSV parsing
- Enhanced error messages with full response details

**Key Updates:**
```typescript
// Debug logging
console.log('InfluxDB Config:', { url, org, bucket, tokenLength })
console.log('Flux Query:', fluxQuery)

// Extended query period
fluxQuery += ` |> range(start: ${body.start_time || '-7d'}, ...)`

// Added priority field
fluxQuery += ` |> filter(fn: (r) => r._field =~ /^(longitude|latitude|altitude|priority|sos_signal)$/)`
```

---

### 4. `app/composable/useInfluxData.ts`
**Changes:**
- Changed time unit from hours to days
- Extended default periods:
  - GPS data: 24 hours → **7 days**
  - SOS alerts: N/A → **30 days**
- Increased data limit from 1000 to **5000** records
- Added new methods for device separation

**New Methods:**

#### `getGPSDataByDevice(days = 7)`
Groups GPS data by device ID and sorts by timestamp (newest first).

**Returns:**
```typescript
{
  "24108": [
    { timestamp, device_id, latitude, longitude, altitude, priority, sos_signal },
    ...
  ],
  "63876": [
    { timestamp, device_id, latitude, longitude, altitude, priority, sos_signal },
    ...
  ]
}
```

#### `getVesselsWithSOS(days = 30)`
Gets all SOS alerts from the last 30 days, sorted by timestamp (newest first).

#### `getLatestSOSByDevice(days = 30)`
Gets only the most recent SOS alert for each device.

**Returns:**
```typescript
{
  "24108": { timestamp, device_id, latitude, longitude, ... },
  "63876": { timestamp, device_id, latitude, longitude, ... }
}
```

---

### 5. `app/pages/index.vue`
**Changes:**
- Updated to use new composable methods
- Added device-separated GPS data display
- Added separate SOS alert sections
- Improved UI to show data grouped by device

**New Features:**

#### GPS Data by Device Section
- Shows GPS readings separated by device ID
- Displays device name, number of readings
- Shows last 3 readings per device with:
  - Latitude, Longitude, Altitude
  - Timestamp
  - SOS indicator if active
- Indicates additional readings count

#### SOS Alerts Sections
1. **Recent SOS Alerts (Last 30 Days)**
   - Shows all SOS alerts from the past 30 days
   - Displays up to 10 most recent alerts
   - Shows device ID, coordinates, timestamp

2. **Latest SOS by Device**
   - Shows only the most recent SOS per device
   - Useful for quick status overview

**Data Loading:**
```typescript
const [gpsData, gpsGrouped, sosData, sosGrouped] = await Promise.all([
  getAllVesselGPSData(7),      // 7 days
  getGPSDataByDevice(7),        // Grouped by device
  getVesselsWithSOS(30),        // 30 days of SOS
  getLatestSOSByDevice(30)      // Latest SOS per device
])
```

---

## 📊 Query Period Changes

| Data Type | Old Period | New Period | Limit |
|-----------|-----------|-----------|-------|
| GPS Data | 24 hours | **7 days** | 5000 records |
| SOS Alerts | N/A | **30 days** | 5000 records |

---

## 🎯 Device Separation Features

### Before:
- All GPS data shown in a single list
- No separation by device
- Hard to track individual vessels

### After:
- GPS data grouped by device ID (24108, 63876)
- Each device shows its own readings
- Latest 3 readings per device displayed
- Total reading count visible per device
- SOS alerts separated and latest per device

---

## 🐛 Debugging Enhancements

### Added Server-Side Logging:
```javascript
// Logs configuration on each request
InfluxDB Config: { url, org, bucket, tokenLength }

// Logs the Flux query being executed
Flux Query: from(bucket: "pvm-monitoring") |> range(start: -7d) ...

// Logs detailed errors
InfluxDB Response Error: { status, statusText, body }
```

**Where to see logs:** Check your terminal/console where `npm run dev` is running

---

## 🔍 Current Issue: 401 Unauthorized

**Problem:** InfluxDB is returning 401 Unauthorized error

**Possible causes:**
1. ❌ Incorrect organization name (current: `portect`)
2. ❌ Invalid API token
3. ❌ Bucket `pvm-monitoring` doesn't exist
4. ❌ Token doesn't have access to the bucket

**Solution:** See `INFLUXDB_DEBUG_GUIDE.md` for step-by-step troubleshooting

---

## ✅ What Works Now

- ✅ PostgreSQL connection with 2 vessels (24108, 63876)
- ✅ Dashboard displays vessel information
- ✅ GPS data query extended to 7 days
- ✅ SOS alerts query extended to 30 days
- ✅ Device separation logic implemented
- ✅ Priority field added to data structure
- ✅ Enhanced error logging for debugging

---

## ⚠️ What Needs Fixing

- ⚠️ InfluxDB authentication (401 error)
- ⚠️ Verify organization name
- ⚠️ Verify API token validity
- ⚠️ Confirm bucket existence

---

## 🚀 Next Steps

1. **Fix InfluxDB Connection**
   - Follow `INFLUXDB_DEBUG_GUIDE.md`
   - Verify org name, token, and bucket

2. **Test with Sample Data**
   - Once connected, add GPS data for devices 24108 and 63876
   - Test SOS signal functionality

3. **Verify Dashboard**
   - Check GPS data separated by device
   - Verify SOS alerts display
   - Confirm 7-day and 30-day periods are working

---

## 📝 Configuration Files

### Environment Variables (Optional)
Create `.env` file if you want to override defaults:

```bash
INFLUX_URL=http://yaoxiang-ubuntu:8086
INFLUX_TOKEN=your-actual-token-here
INFLUX_ORG=your-org-name
INFLUX_BUCKET=pvm-monitoring
```

### Documentation Created
- ✅ `INFLUXDB_DEBUG_GUIDE.md` - Troubleshooting guide
- ✅ `CHANGES_SUMMARY.md` - This file

---

## 💡 Priority Field Usage (Future)

The `priority` field has been added to the schema but is not currently used in sorting. When you need to sort all devices together by priority:

```typescript
// Example: Sort all GPS data by priority
const allGPSData = await getAllVesselGPSData(7)
const sortedByPriority = allGPSData.sort((a, b) => b.priority - a.priority)
```

This can be implemented later when you need to display all vessels together sorted by priority level.

---

## 🎨 Dashboard Improvements

### Visual Enhancements:
- Device-specific sections with borders
- Animated SOS indicators (pulsing red dot)
- Reading counts per device
- Clearer timestamp display
- Better error states with icons

### Data Organization:
- GPS data: Separated by device → Last 3 readings per device
- SOS alerts: Two views (all alerts + latest per device)
- Automatic sorting by timestamp (newest first)

---

## Summary

All code changes have been implemented successfully. The main remaining task is to fix the InfluxDB authentication issue by verifying the organization name, API token, and bucket name. Once that's resolved, the dashboard will display:

- GPS data from the last 7 days, separated by device (24108, 63876)
- SOS alerts from the last 30 days
- Latest SOS status per device
- Full vessel information from PostgreSQL

Check the server console logs for debugging information when you restart the dev server.

