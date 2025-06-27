<script setup lang="ts">
import Footer from '~/components/Footer.vue'

const isSidebarExpanded = ref(true)
const showMobileSidebar = ref(false)

function toggleMobileSidebar() {
  showMobileSidebar.value = !showMobileSidebar.value
}

onMounted(() => {
  const handleResize = () => {
    if (window.innerWidth < 1024) {
      isSidebarExpanded.value = false
    }
  }
  handleResize()
  window.addEventListener('resize', handleResize)
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })
})
</script>

<template>
  <div class="h-screen bg-gray-50 dark:bg-gray-900">
    <div class="flex h-full">
      <!-- Side Navigation Bar -->
      <SideNavigationBar
        :is-expanded="isSidebarExpanded"
        :show-mobile-sidebar="showMobileSidebar"
        @update:is-expanded="isSidebarExpanded = $event"
        @update:show-mobile-sidebar="showMobileSidebar = $event"
      />

      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col min-w-0">
        <!-- Top Navigation Bar -->
        <TopNavigationBar @toggle-sidebar="toggleMobileSidebar" />

        <!-- Page Content -->
        <main class="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
          <div class="p-4 sm:p-6 lg:p-8">
            <slot />
          </div>
        </main>

        <!-- Footer -->
        <Footer />
      </div>
    </div>
  </div>
</template>
