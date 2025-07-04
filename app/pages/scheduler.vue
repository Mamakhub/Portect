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
const isGeneratingTasks = ref(false)

// Check if required fields are completed
const isRequiredFieldsCompleted = computed(() => {
  const siteSelected = selectedSiteId.value && (selectedSiteId.value !== 'custom' || customSite.value.trim())
  const projectSelected = selectedProject.value && (selectedProject.value !== 'Other (Custom)' || customProject.value.trim())
  const dueDateSelected = dueDate.value
  return siteSelected && projectSelected && dueDateSelected
})

// Scroll to and highlight incomplete fields
function scrollToIncompleteFields() {
  // Find the site selection section
  const siteSection = document.querySelector('.container .bg-white.rounded-lg.shadow-sm')
  if (siteSection) {
    siteSection.scrollIntoView({ behavior: 'smooth', block: 'center' })

    // Add highlight effect
    siteSection.classList.add('ring-2', 'ring-red-500', 'ring-opacity-50')
    setTimeout(() => {
      siteSection.classList.remove('ring-2', 'ring-red-500', 'ring-opacity-50')
    }, 3000)
  }
}

function addTask() {
  if (!isRequiredFieldsCompleted.value) {
    scrollToIncompleteFields()
    return
  }

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
  if (!isRequiredFieldsCompleted.value) {
    scrollToIncompleteFields()
    return
  }

  isGeneratingTasks.value = true

  // Simulate async task generation with loading delay
  setTimeout(() => {
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
    isGeneratingTasks.value = false
  }, 1200) // 1.2 second delay for loading animation
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

function openDatePicker(event: Event) {
  // Programmatically open the date picker
  const input = event.target as HTMLInputElement
  try {
    if (input.showPicker) {
      input.showPicker()
    }
    else {
      input.click()
    }
  }
  catch {
    // Fallback to click if showPicker is not supported
    input.click()
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-tenang-primary dark:text-tenang-primary-dark mb-6">
        Project Scheduler
      </h1>
      <!-- Site & Project Selection -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-semibold text-gray-900 dark:text-white">
            Project Configuration
          </h2>
          <span v-if="!isRequiredFieldsCompleted" class="text-sm text-red-600 dark:text-red-400 font-medium">
            * All fields required to add tasks
          </span>
        </div>
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Site <span class="text-red-500">*</span></label>
            <select v-model="selectedSiteId" class="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" @change="showCustomSite = selectedSiteId === 'custom'">
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
            <input v-if="showCustomSite" v-model="customSite" type="text" placeholder="Enter custom site name" class="mt-2 w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Project <span class="text-red-500">*</span></label>
            <select v-model="selectedProject" :disabled="!selectedSiteId" class="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" @change="showCustomProject = selectedProject === 'Other (Custom)'">
              <option value="" disabled>
                Select project
              </option>
              <option v-for="project in projectOptions" :key="project">
                {{ project }}
              </option>
            </select>
            <input v-if="showCustomProject" v-model="customProject" type="text" placeholder="Enter custom project name" class="mt-2 w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Due Date <span class="text-red-500">*</span></label>
            <input
              v-model="dueDate"
              type="date"
              placeholder="Select due date"
              class="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-tenang-primary/50 dark:focus:ring-tenang-primary-dark/50 focus:border-tenang-primary dark:focus:border-tenang-primary-dark transition-colors cursor-pointer"
              :min="new Date().toISOString().split('T')[0]"
              @click="openDatePicker"
              @focus="openDatePicker"
            >
          </div>
        </div>
      </div>

      <!-- Task Addition -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h2 class="font-semibold mb-4 text-gray-900 dark:text-white">
          Add Task
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <input v-model="taskForm.name" type="text" placeholder="Task name" class="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
          <div>
            <select v-model="taskForm.category" class="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" @change="showCustomCategory = taskForm.category === 'Other (Custom)'">
              <option value="" disabled>
                Select category
              </option>
              <option v-for="cat in taskCategories" :key="cat">
                {{ cat }}
              </option>
            </select>
            <input v-if="showCustomCategory" v-model="customCategory" type="text" placeholder="Enter custom category" class="mt-2 w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
          </div>
          <input v-model="taskForm.duration" type="number" min="1" placeholder="Duration (hr)" class="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
          <select v-model="taskForm.priority" class="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option value="" disabled>
              Priority
            </option>
            <option v-for="p in priorities" :key="p">
              {{ p }}
            </option>
          </select>
        </div>
        <div class="flex gap-2">
          <button
            :disabled="!isRequiredFieldsCompleted"
            class="bg-tenang-primary dark:bg-tenang-primary-dark hover:bg-tenang-primary/90 dark:hover:bg-tenang-primary-dark/90 text-white dark:text-black px-4 py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-tenang-primary dark:disabled:hover:bg-tenang-primary-dark"
            @click="addTask"
          >
            Add Task
          </button>
          <button
            :disabled="!isRequiredFieldsCompleted || isGeneratingTasks"
            class="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white px-4 py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-200 dark:disabled:hover:bg-gray-600 flex items-center gap-2"
            @click="() => generateRandomTasks(5)"
          >
            <svg v-if="isGeneratingTasks" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <span>{{ isGeneratingTasks ? 'Generating Tasks...' : 'Auto-Generate Project Tasks' }}</span>
          </button>
        </div>
      </div>

      <!-- Task Generation Loading Spinner -->
      <div v-if="isGeneratingTasks" class="flex flex-col items-center justify-center py-6">
        <svg class="animate-spin h-8 w-8 text-tenang-primary dark:text-tenang-primary-dark mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        <div class="text-tenang-primary dark:text-tenang-primary-dark font-medium">
          Generating project-specific tasks...
        </div>
      </div>

      <!-- Task List -->
      <div v-if="tasks.length" class="mb-6">
        <h2 class="font-semibold mb-4 text-gray-900 dark:text-white">
          Task List
        </h2>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-gray-50 dark:bg-gray-700">
                <th class="p-3 border-b border-gray-200 dark:border-gray-600 text-left text-gray-700 dark:text-gray-300">
                  #
                </th>
                <th class="p-3 border-b border-gray-200 dark:border-gray-600 text-left text-gray-700 dark:text-gray-300">
                  Task
                </th>
                <th class="p-3 border-b border-gray-200 dark:border-gray-600 text-left text-gray-700 dark:text-gray-300">
                  Category
                </th>
                <th class="p-3 border-b border-gray-200 dark:border-gray-600 text-left text-gray-700 dark:text-gray-300">
                  Duration (hr)
                </th>
                <th class="p-3 border-b border-gray-200 dark:border-gray-600 text-left text-gray-700 dark:text-gray-300">
                  Priority
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(task, i) in tasks" :key="i" class="border-b border-gray-200 dark:border-gray-600">
                <td class="p-3 text-gray-900 dark:text-white">
                  {{ i + 1 }}
                </td>
                <td class="p-3 text-gray-900 dark:text-white">
                  {{ task.name }}
                </td>
                <td class="p-3 text-gray-900 dark:text-white">
                  {{ task.category }}
                </td>
                <td class="p-3 text-gray-900 dark:text-white">
                  {{ task.duration }}
                </td>
                <td class="p-3 text-gray-900 dark:text-white">
                  {{ task.priority }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Generate Schedule Button -->
      <div class="mb-6">
        <button :disabled="!tasks.length || isLoading || !dueDate" class="bg-tenang-primary dark:bg-tenang-primary-dark hover:bg-tenang-primary/90 dark:hover:bg-tenang-primary-dark/90 text-white dark:text-black px-6 py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed" @click="generateSchedule">
          Generate Optimized Schedule
        </button>
      </div>

      <!-- Loading Spinner -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-10">
        <svg class="animate-spin h-10 w-10 text-tenang-primary dark:text-tenang-primary-dark mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        <div class="text-tenang-primary dark:text-tenang-primary-dark font-medium">
          Generating optimized schedule...
        </div>
      </div>

      <!-- Optimized Schedule Table -->
      <div v-if="showSchedule" class="mt-6">
        <h2 class="font-semibold mb-4 text-gray-900 dark:text-white">
          Optimized Schedule (Mock)
        </h2>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-gray-50 dark:bg-gray-700">
                <th class="p-3 border-b border-gray-200 dark:border-gray-600 text-left text-gray-700 dark:text-gray-300">
                  Task
                </th>
                <th class="p-3 border-b border-gray-200 dark:border-gray-600 text-left text-gray-700 dark:text-gray-300">
                  Category
                </th>
                <th class="p-3 border-b border-gray-200 dark:border-gray-600 text-left text-gray-700 dark:text-gray-300">
                  Duration (hr)
                </th>
                <th class="p-3 border-b border-gray-200 dark:border-gray-600 text-left text-gray-700 dark:text-gray-300">
                  Priority
                </th>
                <th class="p-3 border-b border-gray-200 dark:border-gray-600 text-left text-gray-700 dark:text-gray-300">
                  Day
                </th>
                <th class="p-3 border-b border-gray-200 dark:border-gray-600 text-left text-gray-700 dark:text-gray-300">
                  Start Time
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(task, i) in optimizedSchedule" :key="i" class="border-b border-gray-200 dark:border-gray-600">
                <td class="p-3 text-gray-900 dark:text-white">
                  {{ task.name }}
                </td>
                <td class="p-3 text-gray-900 dark:text-white">
                  {{ task.category }}
                </td>
                <td class="p-3 text-gray-900 dark:text-white">
                  {{ task.duration }}
                </td>
                <td class="p-3 text-gray-900 dark:text-white">
                  {{ task.priority }}
                </td>
                <td class="p-3 text-gray-900 dark:text-white">
                  {{ task.day }}
                </td>
                <td class="p-3 text-gray-900 dark:text-white">
                  {{ task.time }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <button v-if="showSchedule" class="bg-tenang-primary dark:bg-tenang-primary-dark hover:bg-tenang-primary/90 dark:hover:bg-tenang-primary-dark/90 text-white dark:text-black px-4 py-2 rounded mb-4 transition-colors" @click="openCalendarModal">
          View in Calendar
        </button>
      </div>

      <!-- Calendar Modal -->
      <CommonModal
        :is-open="showCalendarModal"
        title="Schedule Calendar"
        size="full"
        @close="closeCalendarModal"
      >
        <client-only>
          <FullCalendar
            v-if="showSchedule"
            ref="calendarRef"
            :options="calendarOptions"
          />
        </client-only>
      </CommonModal>
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

/* Date input styling for better dark mode support */
input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(0.5);
  cursor: pointer;
}

.dark input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(1);
}

input[type="date"]::-webkit-datetime-edit-fields-wrapper {
  color: inherit;
}

input[type="date"]::-webkit-datetime-edit-text {
  color: inherit;
}

input[type="date"]::-webkit-datetime-edit-month-field,
input[type="date"]::-webkit-datetime-edit-day-field,
input[type="date"]::-webkit-datetime-edit-year-field {
  color: inherit;
}

/* Ensure date input placeholder works */
input[type="date"]:not([value])::-webkit-datetime-edit {
  color: #9ca3af;
  font-weight: 500;
}

.dark input[type="date"]:not([value])::-webkit-datetime-edit {
  color: #d1d5db;
  font-weight: 500;
}

/* Make placeholder more visible */
input[type="date"]::placeholder {
  color: #6b7280;
  font-weight: 500;
  opacity: 1;
}

.dark input[type="date"]::placeholder {
  color: #9ca3af;
  font-weight: 500;
  opacity: 1;
}

/* Ensure input doesn't look disabled when empty */
input[type="date"]:not([value]) {
  color: #6b7280;
  font-weight: 500;
}

.dark input[type="date"]:not([value]) {
  color: #9ca3af;
  font-weight: 500;
}

/* Make placeholder text non-selectable and non-focusable */
input[type="date"]::placeholder {
  color: #6b7280;
  font-weight: 500;
  opacity: 1;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  pointer-events: none;
}

.dark input[type="date"]::placeholder {
  color: #9ca3af;
  font-weight: 500;
  opacity: 1;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  pointer-events: none;
}

/* Prevent text selection on empty date inputs */
input[type="date"]:not([value]) {
  color: #6b7280;
  font-weight: 500;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.dark input[type="date"]:not([value]) {
  color: #9ca3af;
  font-weight: 500;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}
</style>
