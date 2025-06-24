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
  loadCsvData,
  loading,
} = useCsvData()

// Load noise data from CSV
onMounted(async () => {
  console.log('Loading CSV data...')
  await loadCsvData('/data/noise-data.csv')
  console.log('CSV data loaded:', noiseChartData.value)
})

// Fallback data for noise chart when CSV is loading
const fallbackNoiseData = [
  { x: '00:00', y: 45 },
  { x: '01:00', y: 48 },
  { x: '02:00', y: 52 },
  { x: '03:00', y: 47 },
  { x: '04:00', y: 50 },
]

// Use fallback data when CSV is loading or empty
const displayNoiseData = computed(() => {
  if (loading.value || noiseChartData.value.length === 0) {
    return fallbackNoiseData
  }
  return noiseChartData.value
})

// Mock Data for Dust (keeping original format)
const dustData = [
  { x: '00:00', y: 0.3 },
  { x: '01:00', y: 0.4 },
  { x: '02:00', y: 0.2 },
  { x: '03:00', y: 0.6 },
  { x: '04:00', y: 0.8 },
  { x: '05:00', y: 1.1 },
  { x: '06:00', y: 0.9 },
  { x: '07:00', y: 0.7 },
  { x: '08:00', y: 0.5 },
]

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
      />
      <DashboardChartCard
        title="Dust Level"
        value="0.82 mg/m^3"
        :chart-data="dustData"
        chart-color="#FBBF24"
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
