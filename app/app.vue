<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const showLogout = computed(() => {
  if (process.client) {
    return localStorage.getItem('mockLoggedIn') === 'true' && !['/login', '/register'].includes(route.path)
  }
  return false
})

function logout() {
  if (process.client) {
    localStorage.removeItem('mockLoggedIn')
  }
  router.replace('/login')
}
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
      <button
        v-if="showLogout"
        @click="logout"
        class="fixed top-4 right-4 z-50 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow-lg"
      >
        Logout
      </button>
    </NuxtLayout>
  </div>
</template>

<style>
/* Global styles can be added here */
</style>
