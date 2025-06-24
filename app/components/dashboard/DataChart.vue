<script setup lang="ts">
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import { computed } from 'vue'
import { Line } from 'vue-chartjs'

const props = defineProps<{
  data: Array<{ x: string, y: number }>
  color: string
  label?: string
  unit?: string
}>()

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
)

const chartData = computed(() => {
  return {
    labels: props.data.map(item => item.x),
    datasets: [
      {
        label: props.label || 'Value',
        data: props.data.map(item => item.y),
        borderColor: props.color,
        backgroundColor: `${props.color}20`,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: props.color,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: props.color,
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2,
      },
    ],
  }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      borderColor: props.color,
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: false,
      callbacks: {
        title: (context: any) => `Time: ${context[0].label}`,
        label: (context: any) => `${props.label || 'Value'}: ${context.parsed.y} ${props.unit || ''}`,
      },
    },
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(0, 0, 0, 0.1)',
        drawBorder: false,
      },
      ticks: {
        color: '#6b7280',
        font: {
          size: 12,
        },
      },
    },
    y: {
      grid: {
        color: 'rgba(0, 0, 0, 0.1)',
        drawBorder: false,
      },
      ticks: {
        color: '#6b7280',
        font: {
          size: 12,
        },
        callback: (value: any) => `${value} ${props.unit || ''}`,
      },
      beginAtZero: false,
    },
  },
  interaction: {
    intersect: false,
    mode: 'index' as const,
  },
}))
</script>

<template>
  <div class="h-48 w-full">
    <div v-if="!data || data.length === 0" class="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-md">
      <p class="text-gray-500 dark:text-gray-400">
        No data available
      </p>
    </div>
    <Line
      v-else
      :data="chartData"
      :options="chartOptions"
      class="w-full h-full"
    />
  </div>
</template>
