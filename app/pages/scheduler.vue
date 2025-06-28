<script setup lang="ts">
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
      title: task.name,
      start: `${formatDateForCalendar(task.day)}T${task.time.padStart(5, '0')}`,
      end: `${formatDateForCalendar(task.day)}T${(Number.parseInt(task.time) + Number.parseInt(task.duration)).toString().padStart(2, '0')}:00`,
      backgroundColor: getPriorityColor(task.priority),
      borderColor: getPriorityColor(task.priority),
      textColor: '#fff',
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
function openCalendarModal() {
  showCalendarModal.value = true
}
function closeCalendarModal() {
  showCalendarModal.value = false
}

const calendarPlugins = [dayGridPlugin, timeGridPlugin, interactionPlugin]
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
            :plugins="calendarPlugins"
            initial-view="timeGridWeek"
            :events="calendarEvents"
            :header-toolbar="{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }"
            :height="500"
            :aspect-ratio="1.35"
            :editable="false"
            :selectable="false"
            :day-max-events="true"
            :weekends="true"
          />
        </client-only>
      </div>
    </div>
  </div>
</template>
