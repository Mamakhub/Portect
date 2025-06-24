<script setup lang="ts">
import { computed, onMounted } from 'vue'

// Page metadata
definePageMeta({
  title: 'Dashboard',
})

// CSV Data for Noise
const {
  chartData: noiseChartData,
  averageNoiseLevel,
  loadCsvData: loadNoiseCsvData,
  loading: noiseLoading,
} = useCsvData()

// CSV Data for Dust
const {
  chartData: dustChartData,
  averageDustLevel,
  loadCsvData: loadDustCsvData,
  loading: dustLoading,
} = useDustData()

// Load data from CSV files
onMounted(async () => {
  console.log('Loading CSV data...')
  await Promise.all([
    loadNoiseCsvData('/data/noise-data.csv'),
    loadDustCsvData('/data/dust-data.csv'),
  ])
  console.log('CSV data loaded:', { noise: noiseChartData.value, dust: dustChartData.value })
})

// Fallback data for noise chart when CSV is loading
const fallbackNoiseData = [
  { x: '00:00', y: 45 },
  { x: '01:00', y: 48 },
  { x: '02:00', y: 52 },
  { x: '03:00', y: 47 },
  { x: '04:00', y: 50 },
]

// Fallback data for dust chart when CSV is loading
const fallbackDustData = [
  { x: '00:00', y: 0.3 },
  { x: '01:00', y: 0.4 },
  { x: '02:00', y: 0.2 },
  { x: '03:00', y: 0.6 },
  { x: '04:00', y: 0.8 },
]

// Use fallback data when CSV is loading or empty
const displayNoiseData = computed(() => {
  if (noiseLoading.value || noiseChartData.value.length === 0) {
    return fallbackNoiseData
  }
  return noiseChartData.value
})

// Use fallback data when CSV is loading or empty
const displayDustData = computed(() => {
  if (dustLoading.value || dustChartData.value.length === 0) {
    return fallbackDustData
  }
  return dustChartData.value
})

const scheduleItems = [
  { time: '8:00 AM', title: 'Zone A Inspection', color: 'blue' },
  { time: '9:00 AM', title: 'Zone B Inspection', color: 'blue' },
  { time: '10:00 AM', title: 'Zone C Inspection', color: 'blue' },
  { time: '11:00 AM', title: 'Lunch Break', color: 'purple' },
  { time: '1:00 PM', title: 'Zone A Inspection', color: 'blue' },
  { time: '2:00 PM', title: 'Zone B Inspection', color: 'blue' },
  { time: '3:00 PM', title: 'Zone C Inspection', color: 'blue' },
]

function handleAcknowledge() {
  console.log('Alert acknowledged')
  // Add logic to dismiss the alert
}
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Main Content Column -->
    <div class="lg:col-span-2 space-y-6">
      <DashboardChartCard
        title="Noise Level"
        :value="`${averageNoiseLevel || '--'} dBA`"
        :chart-data="displayNoiseData"
        chart-color="#F87171"
        label="Noise Level"
        unit="dB"
      />
      <DashboardChartCard
        title="Dust Level"
        :value="`${averageDustLevel || '--'} mg/m³`"
        :chart-data="displayDustData"
        chart-color="#FBBF24"
        label="Dust Level"
        unit="mg/m³"
      />
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardSensorsSummaryCard
          :dust-active="12"
          :dust-inactive="5"
          :noise-active="15"
          :noise-inactive="2"
          last-updated="18 May 2025, 11:05AM (GMT+8)"
        />
        <DashboardAlertCard
          :alert-count="1"
          message="Thresholds are exceeded at Zone B. Kindly inspect the zone and take necessary actions."
          @acknowledge="handleAcknowledge"
        />
      </div>
    </div>

    <!-- Right Sidebar Column -->
    <div class="space-y-6">
      <DashboardMapCard />
      <DashboardScheduleCard>
        <DashboardScheduleItem
          v-for="(item, index) in scheduleItems"
          :key="index"
          :time="item.time"
          :title="item.title"
          :color="item.color"
        />
      </DashboardScheduleCard>
    </div>
  </div>
</template>
