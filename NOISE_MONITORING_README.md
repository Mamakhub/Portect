# Noise Monitoring with CSV Data

This project includes a comprehensive noise monitoring system that can load and visualize noise data from CSV files.

## Features

- **CSV Data Loading**: Load noise data from CSV files with automatic parsing
- **Real-time Charts**: Interactive charts using Chart.js with Vue.js integration
- **Data Analysis**: Automatic calculation of average, min, max noise levels
- **Status Indicators**: Color-coded status based on noise levels
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode Support**: Full dark mode compatibility

## CSV File Format

The system expects CSV files with the following structure:

```csv
timestamp,noise_level,location,device_id
2024-01-01T00:00:00,45.2,Office A,DEV001
2024-01-01T00:05:00,47.8,Office A,DEV001
...
```

### Required Columns:
- `timestamp`: ISO 8601 datetime format
- `noise_level`: Numeric value (decibels)
- `location`: String identifier for the location
- `device_id`: String identifier for the device

## Usage

### 1. Place CSV Files
Put your CSV files in the `public/data/` directory. The system will automatically load them.

### 2. Access the Noise Monitoring Page
Navigate to `/noise-monitoring` in your application to view the dashboard.

### 3. Using the Composable

```typescript
// In your Vue component
const {
  data,
  loading,
  error,
  chartData,
  averageNoiseLevel,
  maxNoiseLevel,
  minNoiseLevel,
  noiseLevelStatus,
  loadCsvData
} = useCsvData()

// Load data from a CSV file
onMounted(() => {
  loadCsvData('/data/your-noise-data.csv')
})
```

### 4. Using the Chart Component

```vue
<template>
  <DashboardDataChart
    :data="chartData"
    color="#3b82f6"
  />
</template>
```

## Chart Configuration

The chart component supports the following props:

- `data`: Array of data points with `x` (time) and `y` (noise level) properties
- `color`: Hex color code for the chart line and points

## Noise Level Status

The system automatically categorizes noise levels:

- **Low**: < 50 dB (Green)
- **Moderate**: 50-70 dB (Yellow)
- **High**: > 70 dB (Red)

## Dependencies

- `chart.js`: Chart rendering library
- `vue-chartjs`: Vue.js wrapper for Chart.js
- `@vueuse/core`: Vue composition utilities

## File Structure

```
app/
├── composable/
│   └── useCsvData.ts          # CSV data handling composable
├── components/
│   └── dashboard/
│       ├── ChartCard.vue      # Chart card wrapper
│       └── DataChart.vue      # Chart.js integration
├── types/
│   └── noise.ts              # TypeScript type definitions
├── pages/
│   └── noise-monitoring.vue  # Demo page
└── public/
    └── data/
        └── noise-data.csv    # Sample CSV data
```

## Customization

### Adding New Chart Types

1. Import additional Chart.js components in `DataChart.vue`
2. Register them with `ChartJS.register()`
3. Create new chart components or modify existing ones

### Modifying Data Processing

Edit the `parseCsv` function in `useCsvData.ts` to handle different CSV formats or add data transformations.

### Styling

The chart styling can be customized by modifying the `chartOptions` computed property in `DataChart.vue`. The system uses UnoCSS for styling and supports dark mode.

## Troubleshooting

### CSV Loading Issues
- Ensure the CSV file is in the `public/data/` directory
- Check that the file path in `loadCsvData()` is correct
- Verify the CSV format matches the expected structure

### Chart Display Issues
- Make sure Chart.js and vue-chartjs are properly installed
- Check browser console for JavaScript errors
- Verify that the data array is not empty

### Performance
- For large datasets, consider implementing data pagination
- Use data sampling for real-time updates
- Implement virtual scrolling for large tables
