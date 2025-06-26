<script setup lang="ts">
import type { CalendarOptions } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import FullCalendar from '@fullcalendar/vue3'
import { computed, onMounted, ref } from 'vue'
import { mockSchedules, mockSites } from '~/data/mockSites'
import type { SiteSchedule } from '~/types/sites'

// Page metadata
definePageMeta({
  title: 'Site Calendar',
  description: 'View and manage all site schedules and activities',
})

// Reactive data
const calendarRef = ref()
const selectedSite = ref('')
const currentView = ref('dayGridMonth')

// Get sites and schedules data
const sites = ref(mockSites)
const schedules = ref(mockSchedules)

// Calendar views
const calendarViews = [
  { label: 'Month', value: 'dayGridMonth' },
  { label: 'Week', value: 'timeGridWeek' },
  { label: 'Day', value: 'timeGridDay' },
]

// Filtered events based on selected site
const filteredEvents = computed(() => {
  if (!schedules.value)
    return []

  let filtered = schedules.value as SiteSchedule[]

  if (selectedSite.value) {
    filtered = filtered.filter(schedule => schedule.siteId === selectedSite.value)
  }

  return filtered.map(schedule => ({
    id: schedule.id,
    title: schedule.title,
    start: getEventDate(schedule),
    end: getEventEndDate(schedule),
    backgroundColor: getEventColor(schedule),
    borderColor: getEventColor(schedule),
    textColor: '#ffffff',
    extendedProps: {
      description: schedule.description,
      type: schedule.type,
      priority: schedule.priority,
      assignedTo: schedule.assignedTo,
      status: schedule.status,
      siteId: schedule.siteId,
    },
  }))
})

// Calendar options
const calendarOptions = computed<CalendarOptions>(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: currentView.value,
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay',
  },
  events: filteredEvents.value,
  height: 'auto',
  aspectRatio: 1.35,
  editable: false,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
  eventClick: handleEventClick,
  eventDidMount: handleEventDidMount,
  eventDidUnmount: handleEventDidUnmount,
  slotMinTime: '06:00:00',
  slotMaxTime: '20:00:00',
  allDaySlot: false,
  slotDuration: '00:30:00',
  slotLabelInterval: '01:00:00',
  nowIndicator: true,
  businessHours: {
    daysOfWeek: [1, 2, 3, 4, 5, 6], // Monday - Saturday
    startTime: '06:00',
    endTime: '18:00',
  },
}))

// Methods
function getEventDate(schedule: SiteSchedule): string {
  // Convert time string to today's date with the specified time
  const today = new Date()
  const [hours, minutes] = schedule.time.replace(/\s*(AM|PM)/i, '').split(':')
  let hour = Number.parseInt(hours)

  // Handle AM/PM
  if (schedule.time.toLowerCase().includes('pm') && hour !== 12) {
    hour += 12
  }
  else if (schedule.time.toLowerCase().includes('am') && hour === 12) {
    hour = 0
  }

  const date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hour, Number.parseInt(minutes))
  return date.toISOString()
}

function getEventEndDate(schedule: SiteSchedule): string {
  // Add 1 hour to the start time for event duration
  const startDate = new Date(getEventDate(schedule))
  startDate.setHours(startDate.getHours() + 1)
  return startDate.toISOString()
}

function getEventColor(schedule: SiteSchedule): string {
  const colorMap: Record<string, string> = {
    red: '#ef4444',
    blue: '#3b82f6',
    green: '#10b981',
    orange: '#f59e0b',
    purple: '#8b5cf6',
    gray: '#6b7280',
    yellow: '#eab308',
    pink: '#ec4899',
  }

  return colorMap[schedule.color] || '#3b82f6'
}

function changeView(view: string) {
  currentView.value = view
  if (calendarRef.value) {
    const calendarApi = calendarRef.value.getApi()
    calendarApi.changeView(view)
  }
}

function filterEvents() {
  // The events will be automatically updated through the computed property
  if (calendarRef.value) {
    const calendarApi = calendarRef.value.getApi()
    calendarApi.refetchEvents()
  }
}

function handleEventClick(info: any) {
  const event = info.event
  const props = event.extendedProps

  // Show event details in a modal or navigate to event details
  console.log('Event clicked:', {
    title: event.title,
    description: props.description,
    type: props.type,
    priority: props.priority,
    assignedTo: props.assignedTo,
    status: props.status,
  })

  // You can implement a modal here to show event details
  alert(`${event.title}\n\nDescription: ${props.description}\nType: ${props.type}\nPriority: ${props.priority}\nAssigned to: ${props.assignedTo}\nStatus: ${props.status}`)
}

function handleEventDidMount(info: any) {
  // Add tooltips or custom styling when events are mounted
  const event = info.event
  const props = event.extendedProps

  // Add title attribute for tooltip
  const element = info.el
  element.title = `${event.title}\n${props.description}\nAssigned to: ${props.assignedTo}`
}

function handleEventDidUnmount(info: any) {
  // Clean up any custom styling or event listeners
  console.log('Event unmounted:', info.event.title)
}

// Lifecycle
onMounted(() => {
  // Initialize calendar
  console.log('Calendar mounted')
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Site Calendar
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          View and manage all site schedules and activities
        </p>
      </div>

      <!-- Calendar Controls -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <!-- Site Filter -->
          <div class="flex items-center gap-4">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filter by Site:
            </label>
            <select
              v-model="selectedSite"
              class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              @change="filterEvents"
            >
              <option value="">
                All Sites
              </option>
              <option
                v-for="site in sites"
                :key="site.id"
                :value="site.id"
              >
                {{ site.name }}
              </option>
            </select>
          </div>

          <!-- View Controls -->
          <div class="flex items-center gap-2">
            <button
              v-for="view in calendarViews"
              :key="view.value"
              class="px-3 py-2 text-sm font-medium rounded-md transition-colors"
              :class="[
                currentView === view.value
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700',
              ]"
              @click="changeView(view.value)"
            >
              {{ view.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Calendar Container -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <FullCalendar
          ref="calendarRef"
          :options="calendarOptions"
          class="calendar-container"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.calendar-container {
  font-family: inherit;
}

:deep(.fc) {
  font-family: inherit;
}

:deep(.fc-toolbar-title) {
  font-size: 1.25rem;
  font-weight: 600;
}

:deep(.fc-button) {
  background-color: #3b82f6;
  border-color: #3b82f6;
  font-weight: 500;
}

:deep(.fc-button:hover) {
  background-color: #2563eb;
  border-color: #2563eb;
}

:deep(.fc-button:focus) {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

:deep(.fc-button-active) {
  background-color: #1d4ed8;
  border-color: #1d4ed8;
}

:deep(.fc-daygrid-day-number) {
  color: #374151;
}

:deep(.fc-col-header-cell) {
  background-color: #f9fafb;
  font-weight: 600;
}

:deep(.fc-event) {
  cursor: pointer;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
}

:deep(.fc-event:hover) {
  opacity: 0.9;
}

:deep(.fc-event-title) {
  font-weight: 600;
}

:deep(.fc-timegrid-slot) {
  height: 40px;
}

:deep(.fc-timegrid-slot-label) {
  font-size: 0.75rem;
  color: #6b7280;
}

/* Dark mode styles */
:deep(.dark .fc-daygrid-day-number) {
  color: #d1d5db;
}

:deep(.dark .fc-col-header-cell) {
  background-color: #374151;
  color: #f9fafb;
}

:deep(.dark .fc-timegrid-slot-label) {
  color: #9ca3af;
}
</style>
