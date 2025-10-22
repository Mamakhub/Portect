<script setup lang="ts">
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
/* Global styles can be added here */

/* Page transition animations */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease-in-out;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.page-enter-to,
.page-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/* Ensure smooth transitions for layout changes */
* {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Custom Scrollbar Styles */
.scrollbar-thin::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 4px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: rgb(209, 213, 219); /* gray-300 */
  border-radius: 4px;
  transition: background 0.2s;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: rgb(156, 163, 175); /* gray-400 */
}

/* Dark mode scrollbar */
.dark .scrollbar-thin::-webkit-scrollbar-thumb {
  background: rgb(75, 85, 99); /* gray-600 */
}

.dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: rgb(107, 114, 128); /* gray-500 */
}

/* Firefox scrollbar */
.scrollbar-thin {
  scrollbar-width: thin;
  scrollbar-color: rgb(209, 213, 219) transparent;
}

.dark .scrollbar-thin {
  scrollbar-color: rgb(75, 85, 99) transparent;
}
</style>
