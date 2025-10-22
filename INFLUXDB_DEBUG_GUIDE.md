# InfluxDB Connection Debugging Guide

## Current Issue: 401 Unauthorized Error

You're getting a `401 Unauthorized` error when connecting to InfluxDB. This guide will help you identify and fix the issue.

---

## Step 1: Verify InfluxDB is Running

On the Linux machine (`yaoxiang-ubuntu`):

```bash
docker ps | grep influx
```

**Expected output**: Should show an InfluxDB container running on port 8086

---

## Step 2: Check InfluxDB Health

```bash
curl http://localhost:8086/health
```

Or from Windows:
```powershell
Invoke-WebRequest -Uri http://yaoxiang-ubuntu:8086/health
```

**Expected output**: `{"status":"ok"}` or similar health response

---

## Step 3: Verify Organization Name

The 401 error is often caused by incorrect organization name. Let's check:

### Option A: Using InfluxDB CLI

```bash
docker exec -it <influxdb_container_name> influx org list
```

This will show you the actual organization names in your InfluxDB.

### Option B: Using the Web UI

1. Open http://yaoxiang-ubuntu:8086 in your browser
2. Login to InfluxDB
3. Go to Settings → Organizations
4. Note the exact organization name

**Current config**: `portect`  
**Action**: Update `nuxt.config.ts` if the organization name is different

---

## Step 4: Verify API Token

The token must be valid and have the correct permissions.

### Check Token via Web UI:

1. Open http://yaoxiang-ubuntu:8086
2. Login to InfluxDB  
3. Go to Settings → API Tokens
4. Find your token or create a new one with:
   - Read access to bucket `pvm-monitoring`
   - Organization: (your org name)

### Check Token via CLI:

```bash
docker exec -it <influxdb_container_name> influx auth list
```

**Current token**: `DUcxc8urooet7hwWujbWUVhN-NmPjqGe4NL37AVeIJMVvEFNdrtYhR2pua70Y_QGZvEw58Qkn5hrEySU_AzBlw==`

**Action**: If the token is incorrect, update it in `nuxt.config.ts`

---

## Step 5: Verify Bucket Name

```bash
docker exec -it <influxdb_container_name> influx bucket list
```

This will show all available buckets. Look for `pvm-monitoring`.

**Current config**: `pvm-monitoring`  
**Action**: Update `nuxt.config.ts` if the bucket name is different

---

## Step 6: Test InfluxDB Connection Manually

### Using curl:

```bash
curl -X POST "http://yaoxiang-ubuntu:8086/api/v2/query?org=portect" \
  -H "Authorization: Token DUcxc8urooet7hwWujbWUVhN-NmPjqGe4NL37AVeIJMVvEFNdrtYhR2pua70Y_QGZvEw58Qkn5hrEySU_AzBlw==" \
  -H "Content-Type: application/vnd.flux" \
  -H "Accept: application/csv" \
  -d 'from(bucket: "pvm-monitoring") |> range(start: -1h) |> limit(n: 1)'
```

**If you get 401**: The organization name, token, or bucket is incorrect  
**If you get data**: The connection works, issue is in your Nuxt app

---

## Step 7: Check Server Logs

When running your Nuxt dev server, check the console output. You should see:

```
InfluxDB Config: {
  url: 'http://yaoxiang-ubuntu:8086',
  org: 'portect',
  bucket: 'pvm-monitoring',
  tokenLength: 88
}
Flux Query: from(bucket: "pvm-monitoring") |> range(start: -7d, stop: now()) ...
```

This will help identify what values are actually being used.

---

## Common Fixes

### Fix 1: Wrong Organization Name

If the org is different (e.g., `my-org` instead of `portect`):

**Update `nuxt.config.ts`:**
```typescript
influxOrg: process.env.INFLUX_ORG || 'my-org', // Change this
```

### Fix 2: Wrong Token

If you need to create a new token:

1. Open http://yaoxiang-ubuntu:8086
2. Login
3. Go to Settings → API Tokens → Generate Token
4. Select "Read/Write Token"
5. Grant read access to bucket `pvm-monitoring`
6. Copy the new token
7. Update `nuxt.config.ts`:

```typescript
influxToken: process.env.INFLUX_TOKEN || 'YOUR_NEW_TOKEN_HERE',
```

### Fix 3: Wrong Bucket Name

If the bucket is named differently:

**Check available buckets:**
```bash
docker exec -it <influxdb_container_name> influx bucket list
```

**Update `nuxt.config.ts`:**
```typescript
influxBucket: process.env.INFLUX_BUCKET || 'actual-bucket-name',
```

### Fix 4: Create the Bucket

If the bucket `pvm-monitoring` doesn't exist:

```bash
docker exec -it <influxdb_container_name> influx bucket create \
  -n pvm-monitoring \
  -o portect \
  -r 30d
```

Or create it via the Web UI:
1. Open http://yaoxiang-ubuntu:8086
2. Go to Data → Buckets
3. Click "Create Bucket"
4. Name: `pvm-monitoring`
5. Retention: 30 days (or as needed)

---

## Step 8: Verify Configuration in Code

Make sure `nuxt.config.ts` has the correct values:

```typescript
runtimeConfig: {
  influxUrl: process.env.INFLUX_URL || 'http://yaoxiang-ubuntu:8086',
  influxToken: process.env.INFLUX_TOKEN || 'YOUR_ACTUAL_TOKEN',
  influxOrg: process.env.INFLUX_ORG || 'YOUR_ACTUAL_ORG',
  influxBucket: process.env.INFLUX_BUCKET || 'pvm-monitoring',
}
```

---

## Quick Diagnostic Checklist

- [ ] InfluxDB container is running
- [ ] Port 8086 is accessible from Windows machine
- [ ] Organization name is correct
- [ ] API token is valid and has read permissions
- [ ] Bucket `pvm-monitoring` exists
- [ ] Token has access to the bucket
- [ ] `nuxt.config.ts` has correct values

---

## Still Having Issues?

### Enable Detailed Logging

The code already has debug logging. Check your server console for:

1. **InfluxDB Config** - Shows what values are being used
2. **Flux Query** - Shows the actual query being sent
3. **InfluxDB Response Error** - Shows the full error response

### Check Network Connectivity

```bash
# From Windows
ping yaoxiang-ubuntu
telnet yaoxiang-ubuntu 8086
```

### Check Docker Logs

```bash
docker logs <influxdb_container_name> --tail 50
```

---

## Example: Correct Configuration

Here's an example of what a working configuration looks like:

```typescript
// nuxt.config.ts
influxUrl: 'http://yaoxiang-ubuntu:8086',
influxToken: 'AbCdEf123456...',  // Your actual token (88 characters)
influxOrg: 'my-org',               // Your actual org name
influxBucket: 'pvm-monitoring',    // Your bucket name
```

---

## Next Steps After Fixing

Once you've fixed the 401 error:

1. Restart your Nuxt dev server
2. Refresh the dashboard
3. You should now see GPS data separated by device (24108, 63876)
4. SOS alerts will show for the last 30 days
5. GPS data will show for the last 7 days

---

## Contact Points

If you're still stuck, check:
1. Server console logs (look for "InfluxDB Config" and error details)
2. InfluxDB container logs
3. Network connectivity between Windows and Linux machine

