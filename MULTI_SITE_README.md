# Multi-Site Construction Monitoring System

A comprehensive monitoring system for multiple construction sites with individual schedules, alerts, and sensor data.

## 🎯 **Why Mock Data for Prototyping?**

### **Advantages of Mock Data:**
✅ **Fast Development** - No database setup or configuration needed
✅ **Version Control** - Data changes are tracked in Git
✅ **Easy Testing** - Consistent data across all environments
✅ **No Dependencies** - Works immediately without external services
✅ **Flexible Structure** - Easy to modify data structure as requirements evolve
✅ **Demo Ready** - Perfect for presentations and demos

### **When to Consider a Database:**
- When you need real-time data updates from sensors
- When multiple users need to access/modify data simultaneously
- When you need complex queries and data relationships
- When you're ready for production deployment

## 🏗️ **System Architecture**

### **Data Structure**
```
Site Data
├── ConstructionSite (Basic Info)
├── SiteSchedule (Daily Tasks)
├── SiteAlert (Notifications)
├── NoiseData (Sensor Readings)
└── DustData (Sensor Readings)
```

### **Mock Data Features**
- **5 Construction Sites** with different characteristics
- **Realistic Sensor Data** with trends and variance
- **Dynamic Schedules** with priorities and status
- **Active Alerts** with severity levels
- **Site-specific Statistics** and analytics

## 📊 **Site Information**

### **Active Sites:**
1. **KLCC Tower Extension** - Commercial project (35% progress)
2. **Putrajaya Bridge Project** - Infrastructure (65% progress)
3. **Subang Jaya Residential Complex** - Residential (15% progress)
4. **Port Klang Industrial Zone** - Industrial (80% progress)

### **Inactive Sites:**
5. **Cyberjaya Tech Campus** - Commercial (5% progress)

## 🎛️ **Features**

### **Multi-Site Dashboard**
- Site selector dropdown
- Overview of all sites
- Quick navigation to site details
- Real-time statistics

### **Site-Specific Pages**
- Detailed site information
- Individual sensor charts
- Site-specific alerts and schedules
- Progress tracking

### **Interactive Elements**
- Alert acknowledgment and resolution
- Schedule status updates
- Real-time data visualization
- Priority-based color coding

## 📁 **File Structure**

```
app/
├── data/
│   └── mockSites.ts              # Comprehensive mock data
├── composable/
│   └── useMultiSiteData.ts       # Multi-site data management
├── types/
│   └── sites.ts                  # TypeScript interfaces
├── pages/
│   ├── index.vue                 # Main dashboard
│   └── site/[id].vue             # Site-specific page
└── components/
    └── dashboard/
        ├── ChartCard.vue         # Chart wrapper
        └── DataChart.vue         # Chart component
```

## 🚀 **Usage**

### **1. Main Dashboard**
Navigate to `/` to see the overview dashboard with:
- Site selector
- Noise and dust charts
- Summary cards
- Map view
- Schedule overview

### **2. Site-Specific View**
Click "View Details" or navigate to `/site/[site-id]` for:
- Detailed site information
- Individual sensor data
- Site-specific alerts
- Today's schedule
- Progress tracking

### **3. Using the Composable**

```typescript
const {
  sites,
  selectedSite,
  selectedSiteData,
  activeAlerts,
  todaySchedules,
  selectSite,
  acknowledgeAlert,
  resolveAlert,
  updateScheduleStatus,
} = useMultiSiteData()

// Select a site
selectSite('site-001')

// Handle alerts
acknowledgeAlert('alert-001', 'Current User')
resolveAlert('alert-001', 'Current User')

// Update schedules
updateScheduleStatus('sch-001', 'completed')
```

## 📈 **Data Generation**

### **Sensor Data Generation**
The system generates realistic sensor data with:
- **Base levels** specific to each site
- **Variance** to simulate real-world fluctuations
- **Trends** (stable, increasing, decreasing, fluctuating)
- **Time-series** data with 5-minute intervals

### **Example Data Patterns:**
- **KLCC**: Fluctuating noise (68±15 dB), stable dust (0.28±0.1 mg/m³)
- **Putrajaya Bridge**: Increasing noise (72±20 dB), fluctuating dust (0.42±0.15 mg/m³)
- **Port Klang**: High noise (85±25 dB), increasing dust (0.65±0.2 mg/m³)

## 🎨 **UI Components**

### **Status Indicators**
- **Active**: Green (operational)
- **Inactive**: Yellow (paused)
- **Completed**: Gray (finished)

### **Alert Severity**
- **Critical**: Red (immediate action required)
- **High**: Orange (urgent attention needed)
- **Medium**: Yellow (moderate priority)
- **Low**: Green (routine notification)

### **Schedule Priority**
- **Critical**: Red (must complete today)
- **High**: Orange (important)
- **Medium**: Yellow (normal priority)
- **Low**: Green (flexible timing)

## 🔧 **Customization**

### **Adding New Sites**
1. Add site data to `mockSites` array in `mockSites.ts`
2. Generate sensor data using helper functions
3. Add schedules and alerts as needed

### **Modifying Data Patterns**
Edit the data generation functions to change:
- Base sensor levels
- Variance ranges
- Trend patterns
- Time intervals

### **Extending Features**
- Add new sensor types
- Create custom alert types
- Implement new schedule categories
- Add site-specific configurations

## 🚦 **Navigation**

### **Available Routes:**
- `/` - Main dashboard with site selector
- `/site/[id]` - Site-specific monitoring page
- `/noise-monitoring` - Global noise monitoring
- `/dust-monitoring` - Global dust monitoring

### **Site IDs:**
- `site-001` - KLCC Tower Extension
- `site-002` - Putrajaya Bridge Project
- `site-003` - Subang Jaya Residential Complex
- `site-004` - Port Klang Industrial Zone
- `site-005` - Cyberjaya Tech Campus

## 🔄 **State Management**

### **Reactive Data**
- Site selection state
- Alert status updates
- Schedule progress tracking
- Real-time statistics

### **Data Persistence**
- Mock data is reactive and updates in real-time
- Changes persist during the session
- Easy to reset or modify data

## 🎯 **Next Steps for Production**

### **Database Migration**
When ready for production, consider:
1. **PostgreSQL** for relational data
2. **Redis** for real-time caching
3. **Time-series database** for sensor data
4. **Message queue** for real-time updates

### **API Development**
- RESTful APIs for CRUD operations
- WebSocket connections for real-time data
- Authentication and authorization
- Data validation and sanitization

### **Real-time Features**
- Live sensor data streaming
- Push notifications for alerts
- Real-time collaboration
- Mobile app integration

## 🛠️ **Development Commands**

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📝 **Mock Data Structure**

The mock data system provides:
- **5 Construction Sites** with realistic details
- **8 Scheduled Tasks** across all sites
- **5 Active Alerts** with different severities
- **185 Sensor Readings** per site (37 data points each)
- **Dynamic Status Updates** for alerts and schedules

This comprehensive mock data system allows for full prototyping and demonstration of the multi-site monitoring capabilities without any external dependencies!
