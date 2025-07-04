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

// Get sites and schedules data
const sites = ref(mockSites)
const schedules = ref(mockSchedules)

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
  initialView: 'dayGridMonth',
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
  // Use dateOffset if present, otherwise use today
  const today = new Date()
  const offset = (schedule as any).dateOffset || 0
  const eventDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset)
  const [hours, minutes] = schedule.time.replace(/\s*(AM|PM)/i, '').split(':')
  let hour = Number.parseInt(hours)

  // Handle AM/PM
  if (schedule.time.toLowerCase().includes('pm') && hour !== 12) {
    hour += 12
  }
  else if (schedule.time.toLowerCase().includes('am') && hour === 12) {
    hour = 0
  }

  eventDate.setHours(hour, Number.parseInt(minutes))
  return eventDate.toISOString()
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
  // TODO: Implement a modal for event details if needed
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
        <h1 class="text-3xl font-bold text-tenang-primary dark:text-tenang-primary-dark mb-2">
          Site Calendar
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          View and manage all site schedules and activities
        </p>
      </div>

      <!-- Calendar Controls -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <!-- Site Filter -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
            Filter by Site:
          </label>
          <select
            v-model="selectedSite"
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-tenang-primary/50 dark:focus:ring-tenang-primary-dark/50 focus:border-tenang-primary dark:focus:border-tenang-primary-dark transition-colors min-w-[200px]"
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
  background: transparent;
}

:deep(.fc) {
  font-family: inherit;
  background: transparent;
}

/* Main calendar background */
:deep(.fc) {
  background: #fff;
}
:deep(.dark .fc) {
  background: #111827;
}

/* Toolbar/Header */
:deep(.fc-header-toolbar) {
  background: #f9fafb;
  border-radius: 0.75rem 0.75rem 0 0;
  padding: 0.75rem 1.5rem 0.5rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}
:deep(.dark .fc-header-toolbar) {
  background: #1f2937;
  border-bottom: 1px solid #374151;
}

:deep(.fc-toolbar-title) {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
}
:deep(.dark .fc-toolbar-title) {
  color: #f3f4f6;
}

/* Toolbar buttons container */
:deep(.fc-button-group) {
  background: #f9fafb;
  border-radius: 0.5rem;
  padding: 0.25rem;
  border: none;
  box-shadow: none;
}
:deep(.dark .fc-button-group) {
  background: #374151;
}

/* Individual toolbar buttons - default state */
:deep(.fc-button) {
  background: transparent !important;
  border: none !important;
  color: #6b7280 !important;
  font-weight: 500 !important;
  font-size: 0.875rem !important;
  border-radius: 0.375rem !important;
  margin: 0 !important;
  padding: 0.5rem 1rem !important;
  transition: all 0.2s !important;
  box-shadow: none !important;
  text-transform: none !important;
}

:deep(.dark .fc-button) {
  color: #9ca3af !important;
}

/* Active/Primary button state - ONLY these should be green */
:deep(.fc-button-active) {
  background: #017359 !important;
  color: #ffffff !important;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
}

:deep(.dark .fc-button-active) {
  background: #BED9D2 !important;
  color: #000000 !important;
}

/* Hover states for NON-active buttons */
:deep(.fc-button:hover:not(.fc-button-active)) {
  background: #ffffff !important;
  color: #017359 !important;
}

:deep(.dark .fc-button:hover:not(.fc-button-active)) {
  background: #4b5563 !important;
  color: #BED9D2 !important;
}

/* Navigation buttons (prev/next/today) styling */
:deep(.fc-prev-button),
:deep(.fc-next-button),
:deep(.fc-today-button) {
  background: #f3f4f6 !important;
  color: #374151 !important;
  border-radius: 0.375rem !important;
  margin-right: 0.25rem !important;
}

:deep(.dark .fc-prev-button),
:deep(.dark .fc-next-button),
:deep(.dark .fc-today-button) {
  background: #4b5563 !important;
  color: #f3f4f6 !important;
}

:deep(.fc-prev-button:hover),
:deep(.fc-next-button:hover),
:deep(.fc-today-button:hover) {
  background: #017359 !important;
  color: #ffffff !important;
}

:deep(.dark .fc-prev-button:hover),
:deep(.dark .fc-next-button:hover),
:deep(.dark .fc-today-button:hover) {
  background: #BED9D2 !important;
  color: #000000 !important;
}

/* Grid and cell backgrounds */
:deep(.fc-scrollgrid) {
  background: transparent;
}
:deep(.fc-daygrid-day), :deep(.fc-timegrid-slot) {
  background: #fff;
  border-color: #e5e7eb;
}
:deep(.dark .fc-daygrid-day), :deep(.dark .fc-timegrid-slot) {
  background: #23272f;
  border-color: #374151;
}

:deep(.fc-col-header-cell) {
  background: #f3f4f6;
  color: #374151;
  font-weight: 700;
  border-bottom: 1px solid #e5e7eb;
}
:deep(.dark .fc-col-header-cell) {
  background: #23272f;
  color: #f3f4f6;
  border-bottom: 1px solid #374151;
}

:deep(.fc-daygrid-day-number) {
  color: #374151;
  font-weight: 600;
}
:deep(.dark .fc-daygrid-day-number) {
  color: #f3f4f6;
}

/* Event tiles */
:deep(.fc-event) {
  cursor: pointer;
  border-radius: 0.5rem;
  font-size: 0.92rem;
  font-weight: 600;
  padding: 4px 10px;
  margin-bottom: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-shadow: 0 2px 8px 0 rgba(59,130,246,0.08);
  border: none;
  transition: background 0.2s, color 0.2s;
}
:deep(.fc-event-enhanced) {
  box-shadow: 0 2px 8px 0 rgba(59,130,246,0.15);
  border: none;
}
:deep(.dark .fc-event), :deep(.dark .fc-event-enhanced) {
  background: #2563eb !important;
  color: #fff !important;
  box-shadow: 0 2px 8px 0 rgba(37,99,235,0.18);
  border: none;
}
:deep(.fc-event-short-title) {
  color: inherit;
  font-weight: 600;
  font-size: 0.92rem;
  letter-spacing: 0.01em;
}

:deep(.fc-event:hover) {
  opacity: 0.96;
  filter: brightness(1.08);
}

/* Today highlight */
:deep(.fc-day-today) {
  background: #f0f9f6;
}
:deep(.dark .fc-day-today) {
  background: #1e293b;
  border: 1.5px solid #BED9D2;
}

/* More link */
:deep(.fc-more-link) {
  color: #017359;
  font-weight: 600;
}
:deep(.dark .fc-more-link) {
  color: #BED9D2;
}

/* Time labels */
:deep(.fc-timegrid-slot-label) {
  font-size: 0.85rem;
  color: #6b7280;
}
:deep(.dark .fc-timegrid-slot-label) {
  color: #9ca3af;
}

/* Misc */
:deep(.fc .fc-bg-event) {
  opacity: 0.15;
}
:deep(.fc .fc-highlight) {
  background: #01735933;
}
:deep(.dark .fc .fc-highlight) {
  background: #BED9D255;
}
</style>
