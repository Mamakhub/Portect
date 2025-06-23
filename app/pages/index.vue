<script setup lang="ts">
// Page metadata
definePageMeta({
  title: 'Dashboard',
})

// Mock Data
const noiseData = [
  { x: 0, y: 30 },
  { x: 1, y: 40 },
  { x: 2, y: 25 },
  { x: 3, y: 50 },
  { x: 4, y: 45 },
  { x: 5, y: 60 },
  { x: 6, y: 90 },
  { x: 7, y: 70 },
  { x: 8, y: 55 },
]
const dustData = [
  { x: 0, y: 0.3 },
  { x: 1, y: 0.4 },
  { x: 2, y: 0.2 },
  { x: 3, y: 0.6 },
  { x: 4, y: 0.8 },
  { x: 5, y: 1.1 },
  { x: 6, y: 0.9 },
  { x: 7, y: 0.7 },
  { x: 8, y: 0.5 },
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
        value="78 dBA"
        :chart-data="noiseData"
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
