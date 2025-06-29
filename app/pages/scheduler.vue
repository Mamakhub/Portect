<script setup lang="ts">
import type { CalendarOptions } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import FullCalendar from '@fullcalendar/vue3'
import { computed, ref } from 'vue'
import { mockSites } from '~/data/mockSites'

const sites = ref(mockSites)
const selectedSiteId = ref('')
const customSite = ref('')
const showCustomSite = ref(false)

const projectOptions = computed(() => {
  if (!selectedSiteId.value)
    return []
  // For demo, just use a static list per site
  const siteProjects: Record<string, string[]> = {
    'site-001': ['KLCC Tower Extension', 'KLCC Custom'],
    'site-002': ['Putrajaya Bridge Project'],
    'site-003': ['Subang Jaya Residential Complex'],
    'site-004': ['Port Klang Industrial Zone'],
    'site-005': ['Cyberjaya Tech Campus'],
  }
  return (siteProjects[selectedSiteId.value] || []).concat('Other (Custom)')
})
const selectedProject = ref('')
const customProject = ref('')
const showCustomProject = ref(false)

const dueDate = ref('')

const baseTaskCategories = ['Inspection', 'Maintenance', 'Installation', 'Calibration', 'Other (Custom)']
const taskCategories = ref([...baseTaskCategories])
const customCategory = ref('')
const showCustomCategory = ref(false)

const priorities = ['Low', 'Medium', 'High']

const taskForm = ref({
  name: '',
  category: '',
  duration: '',
  priority: '',
})
const tasks = ref<any[]>([])

function addTask() {
  let category = taskForm.value.category
  if (category === 'Other (Custom)') {
    category = customCategory.value
    if (category && !taskCategories.value.includes(category)) {
      taskCategories.value.splice(taskCategories.value.length - 1, 0, category)
    }
  }
  if (!taskForm.value.name || !category || !taskForm.value.duration || !taskForm.value.priority)
    return
  tasks.value.push({ ...taskForm.value, category })
  taskForm.value = { name: '', category: '', duration: '', priority: '' }
  customCategory.value = ''
  showCustomCategory.value = false
}

// Random Task Generator
function generateRandomTasks(count = 5) {
  const randomNames = ['Check Sensors', 'Install Device', 'Calibrate Meter', 'Inspect Area', 'Replace Filter', 'Noise Survey', 'Dust Sampling', 'Safety Briefing', 'Site Cleaning', 'Equipment Test']
  const randomCategories = baseTaskCategories.slice(0, -1)
  const randomPriorities = priorities
  for (let i = 0; i < count; i++) {
    const name = randomNames[Math.floor(Math.random() * randomNames.length)]
    const category = randomCategories[Math.floor(Math.random() * randomCategories.length)]
    const duration = (Math.floor(Math.random() * 4) + 1).toString()
    const priority = randomPriorities[Math.floor(Math.random() * randomPriorities.length)]
    tasks.value.push({ name, category, duration, priority })
  }
}

const isLoading = ref(false)
const showSchedule = ref(false)
const optimizedSchedule = ref<any[]>([])
const calendarEvents = ref<any[]>([])

function generateSchedule() {
  if (!dueDate.value)
    return
  isLoading.value = true
  showSchedule.value = false
  setTimeout(() => {
    // Mock: assign tasks to days before due date
    const start = new Date()
    const end = new Date(dueDate.value)
    const days: Date[] = []
    let d = new Date(start)
    while (d <= end) {
      days.push(new Date(d))
      d = new Date(d)
      d.setDate(d.getDate() + 1)
    }
    optimizedSchedule.value = tasks.value.map((task, i) => {
      const day = days[i % days.length]
      return {
        ...task,
        day: day.toLocaleDateString(),
        time: `${8 + (i % 4) * 2}:00`,
      }
    })
    // Calendar events
    calendarEvents.value = optimizedSchedule.value.map(task => ({
      id: `task-${Math.random().toString(36).substr(2, 9)}`,
      title: task.name,
      start: `${formatDateForCalendar(task.day)}T${task.time.padStart(5, '0')}`,
      end: `${formatDateForCalendar(task.day)}T${(Number.parseInt(task.time) + Number.parseInt(task.duration)).toString().padStart(2, '0')}:00`,
      backgroundColor: getPriorityColor(task.priority),
      borderColor: getPriorityColor(task.priority),
      textColor: '#fff',
      extendedProps: {
        description: `Task: ${task.name}`,
        type: task.category,
        priority: task.priority,
        assignedTo: 'Project Team',
        status: 'pending',
        duration: task.duration,
      },
    }))
    isLoading.value = false
    showSchedule.value = true
  }, 1800)
}
function formatDateForCalendar(dateStr: string) {
  // Converts locale date string to yyyy-mm-dd
  const d = new Date(dateStr)
  return d.toISOString().split('T')[0]
}
function getPriorityColor(priority: string) {
  return priority === 'High' ? '#ef4444' : priority === 'Medium' ? '#f59e0b' : '#10b981'
}

// Calendar Modal
const showCalendarModal = ref(false)
const calendarRef = ref()

function openCalendarModal() {
  showCalendarModal.value = true
}
function closeCalendarModal() {
  showCalendarModal.value = false
}

// Calendar options for modal
const calendarOptions = computed<CalendarOptions>(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'timeGridWeek',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay',
  },
  events: calendarEvents.value,
  height: 500,
  aspectRatio: 1.35,
  editable: false,
  selectable: false,
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

// Event handlers
function handleEventClick(info: any) {
  const event = info.event
  const props = event.extendedProps

  console.log('Event clicked:', {
    title: event.title,
    description: props.description,
    type: props.type,
    priority: props.priority,
    assignedTo: props.assignedTo,
    status: props.status,
    duration: props.duration,
  })
}

function handleEventDidMount(info: any) {
  const event = info.event
  const props = event.extendedProps

  // Add title attribute for tooltip
  const element = info.el
  element.title = `${event.title}\n${props.description}\nPriority: ${props.priority}\nDuration: ${props.duration} hours`
}

function handleEventDidUnmount(info: any) {
  console.log('Event unmounted:', info.event.title)
}
</script>

<template>
  <div class="p-6 max-w-5xl mx-auto">
    <h1 class="text-2xl font-bold mb-6 text-primary-700">
      Project Scheduler
    </h1>
    <!-- Site & Project Selection -->
    <div class="flex flex-col md:flex-row gap-4 mb-6">
      <div class="flex-1">
        <label class="block text-sm font-medium mb-1">Site</label>
        <select v-model="selectedSiteId" class="w-full border rounded px-3 py-2" @change="showCustomSite = selectedSiteId === 'custom'">
          <option value="" disabled>
            Select site
          </option>
          <option v-for="site in sites" :key="site.id" :value="site.id">
            {{ site.name }}
          </option>
          <option value="custom">
            Other (Custom)
          </option>
        </select>
        <input v-if="showCustomSite" v-model="customSite" type="text" placeholder="Enter custom site name" class="mt-2 w-full border rounded px-3 py-2">
      </div>
      <div class="flex-1">
        <label class="block text-sm font-medium mb-1">Project</label>
        <select v-model="selectedProject" :disabled="!selectedSiteId" class="w-full border rounded px-3 py-2" @change="showCustomProject = selectedProject === 'Other (Custom)'">
          <option value="" disabled>
            Select project
          </option>
          <option v-for="project in projectOptions" :key="project">
            {{ project }}
          </option>
        </select>
        <input v-if="showCustomProject" v-model="customProject" type="text" placeholder="Enter custom project name" class="mt-2 w-full border rounded px-3 py-2">
      </div>
      <div class="flex-1">
        <label class="block text-sm font-medium mb-1">Due Date</label>
        <input v-model="dueDate" type="date" class="w-full border rounded px-3 py-2">
      </div>
    </div>

    <!-- Task Addition -->
    <div class="bg-white rounded shadow border p-4 mb-6">
      <h2 class="font-semibold mb-2">
        Add Task
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <input v-model="taskForm.name" type="text" placeholder="Task name" class="border rounded px-3 py-2">
        <div>
          <select v-model="taskForm.category" class="border rounded px-3 py-2" @change="showCustomCategory = taskForm.category === 'Other (Custom)'">
            <option value="" disabled>
              Select category
            </option>
            <option v-for="cat in taskCategories" :key="cat">
              {{ cat }}
            </option>
          </select>
          <input v-if="showCustomCategory" v-model="customCategory" type="text" placeholder="Enter custom category" class="mt-2 w-full border rounded px-3 py-2">
        </div>
        <input v-model="taskForm.duration" type="number" min="1" placeholder="Duration (hr)" class="border rounded px-3 py-2">
        <select v-model="taskForm.priority" class="border rounded px-3 py-2">
          <option value="" disabled>
            Priority
          </option>
          <option v-for="p in priorities" :key="p">
            {{ p }}
          </option>
        </select>
      </div>
      <div class="flex gap-2">
        <button class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded transition-colors" @click="addTask">
          Add Task
        </button>
        <button class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition-colors" @click="() => generateRandomTasks(5)">
          Generate Random Tasks
        </button>
      </div>
    </div>

    <!-- Task List -->
    <div v-if="tasks.length" class="mb-6">
      <h2 class="font-semibold mb-2">
        Task List
      </h2>
      <table class="w-full border text-sm">
        <thead>
          <tr class="bg-gray-100">
            <th class="p-2 border">
              #
            </th>
            <th class="p-2 border">
              Task
            </th>
            <th class="p-2 border">
              Category
            </th>
            <th class="p-2 border">
              Duration (hr)
            </th>
            <th class="p-2 border">
              Priority
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(task, i) in tasks" :key="i">
            <td class="p-2 border">
              {{ i + 1 }}
            </td>
            <td class="p-2 border">
              {{ task.name }}
            </td>
            <td class="p-2 border">
              {{ task.category }}
            </td>
            <td class="p-2 border">
              {{ task.duration }}
            </td>
            <td class="p-2 border">
              {{ task.priority }}
            </td>
          </tr>
        </tbody>
      </table>
      <button v-if="showSchedule" class="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded mb-4" @click="openCalendarModal">
        View in Calendar
      </button>
    </div>

    <!-- Generate Schedule Button -->
    <div class="mb-6">
      <button :disabled="!tasks.length || isLoading || !dueDate" class="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed" @click="generateSchedule">
        Generate Optimized Schedule
      </button>
    </div>

    <!-- Loading Spinner -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-10">
      <svg class="animate-spin h-10 w-10 text-primary-600 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
      <div class="text-primary-700 font-medium">
        Generating optimized schedule...
      </div>
    </div>

    <!-- Optimized Schedule Table -->
    <div v-if="showSchedule" class="mt-6">
      <h2 class="font-semibold mb-2">
        Optimized Schedule (Mock)
      </h2>
      <table class="w-full border text-sm mb-8">
        <thead>
          <tr class="bg-gray-100">
            <th class="p-2 border">
              Task
            </th>
            <th class="p-2 border">
              Category
            </th>
            <th class="p-2 border">
              Duration (hr)
            </th>
            <th class="p-2 border">
              Priority
            </th>
            <th class="p-2 border">
              Day
            </th>
            <th class="p-2 border">
              Start Time
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(task, i) in optimizedSchedule" :key="i">
            <td class="p-2 border">
              {{ task.name }}
            </td>
            <td class="p-2 border">
              {{ task.category }}
            </td>
            <td class="p-2 border">
              {{ task.duration }}
            </td>
            <td class="p-2 border">
              {{ task.priority }}
            </td>
            <td class="p-2 border">
              {{ task.day }}
            </td>
            <td class="p-2 border">
              {{ task.time }}
            </td>
          </tr>
        </tbody>
      </table>
      <button v-if="showSchedule" class="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded mb-4" @click="openCalendarModal">
        View in Calendar
      </button>
    </div>

    <!-- Calendar Modal -->
    <div v-if="showCalendarModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-4xl w-full relative">
        <button class="absolute top-2 right-2 text-gray-500 hover:text-gray-900 dark:hover:text-white text-2xl" @click="closeCalendarModal">
          &times;
        </button>
        <h2 class="text-xl font-semibold mb-4">
          Schedule Calendar
        </h2>
        <client-only>
          <FullCalendar
            v-if="showSchedule"
            ref="calendarRef"
            :options="calendarOptions"
          />
        </client-only>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Calendar styling for the modal */
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

/* Toolbar buttons */
:deep(.fc-button) {
  background: #e5e7eb;
  border: none;
  color: #374151;
  font-weight: 600;
  border-radius: 0.5rem;
  margin-right: 0.5rem;
  transition: background 0.2s, color 0.2s;
  box-shadow: none;
}
:deep(.fc-button-active), :deep(.fc-button-primary) {
  background: #2563eb;
  color: #fff;
}
:deep(.fc-button:hover) {
  background: #3b82f6;
  color: #fff;
}
:deep(.dark .fc-button) {
  background: #374151;
  color: #f3f4f6;
}
:deep(.dark .fc-button-active), :deep(.dark .fc-button-primary) {
  background: #2563eb;
  color: #fff;
}
:deep(.dark .fc-button:hover) {
  background: #3b82f6;
  color: #fff;
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
  background: #dbeafe;
}
:deep(.dark .fc-day-today) {
  background: #1e293b;
  border: 1.5px solid #2563eb;
}

/* More link */
:deep(.fc-more-link) {
  color: #2563eb;
  font-weight: 600;
}
:deep(.dark .fc-more-link) {
  color: #60a5fa;
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
  background: #2563eb33;
}
:deep(.dark .fc .fc-highlight) {
  background: #2563eb55;
}
</style>
