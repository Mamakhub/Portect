<script setup lang="ts">
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import FullCalendar from '@fullcalendar/vue3'
import { ref } from 'vue'

const calendarPlugins = [dayGridPlugin, timeGridPlugin, interactionPlugin]
const calendarEvents = ref([
  { title: 'Test Event', start: new Date().toISOString() },
])
</script>

<template>
  <div class="p-8">
    <!-- Fallback: FullCalendar CDN CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fullcalendar/common@6.1.17/main.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fullcalendar/daygrid@6.1.17/main.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fullcalendar/timegrid@6.1.17/main.min.css">
    <client-only>
      <FullCalendar
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
</template>
