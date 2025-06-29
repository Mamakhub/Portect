<script setup lang="ts">
import { useRouter } from 'nuxt/app'
import { onMounted, ref } from 'vue'

definePageMeta({ layout: 'auth' })

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

onMounted(() => {
  if (process.client && localStorage.getItem('mockLoggedIn') === 'true') {
    router.replace('/')
  }
})

function handleLogin() {
  if (email.value === 'test@example.com' && password.value === 'test12345') {
    error.value = ''
    localStorage.setItem('mockLoggedIn', 'true')
    router.push('/')
  }
  else {
    error.value = 'Invalid email or password. Try test@example.com / test12345.'
  }
}
</script>

<template>
  <div class="min-h-screen w-full flex">
    <!-- Left: Logo, Title, Description -->
    <div class="hidden md:flex w-1/2 h-screen bg-tenang-green flex-col items-center justify-center p-0 m-0">
      <div class="flex flex-col items-center justify-center w-full h-full px-16">
        <img src="~/assets/logo.png" alt="TenangSite Logo" class="mb-12 mt-8 max-w-[320px] w-2/3 h-auto mx-auto">
        <div class="w-48 border-t-4 mb-8 self-start" style="border-color: #84e4a8;" />
        <div class="mt-6 w-full">
          <h1 class="text-5xl font-bold mb-4 text-left w-full" style="color: #84e4a8;">
            TenangSite
          </h1>
          <p class="text-lg text-left max-w-xl" style="color: #84e4a8;">
            A smart management platform that ensures a calm, organized construction environment for everyone — from workers on-site to people nearby.
          </p>
        </div>
      </div>
    </div>
    <!-- Right: Login Form -->
    <div class="flex flex-col justify-center items-center w-full md:w-1/2 h-screen bg-login-form">
      <div class="w-full px-12 max-w-lg">
        <h2 class="text-3xl font-bold text-white mb-2">
          Login to your account
        </h2>
        <p class="mb-8 text-gray-300">
          Enter your credentials to continue
        </p>
        <form class="space-y-6" @submit.prevent="handleLogin">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input v-model="email" type="email" required class="mt-1 block w-full rounded-lg border border-gray-700 bg-[#232b36] text-white shadow-sm focus:(border-tenang-accent ring-2 ring-tenang-accent) px-4 py-3 transition-all duration-150">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <input v-model="password" type="password" required class="mt-1 block w-full rounded-lg border border-gray-700 bg-[#232b36] text-white shadow-sm focus:(border-tenang-accent ring-2 ring-tenang-accent) px-4 py-3 transition-all duration-150">
          </div>
          <div v-if="error" class="text-red-400 text-sm">
            {{ error }}
          </div>
          <button type="submit" class="w-full py-3 px-4 bg-tenang-accent hover:bg-[#6fd19a] text-[#136355] font-bold rounded-lg shadow-lg transition-all duration-150 text-lg mt-2">
            Login
          </button>
        </form>
        <div class="mt-6 text-center text-sm text-gray-400">
          Don't have an account?
          <NuxtLink to="/register" class="text-tenang-accent hover:underline">
            Register
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-tenang-green {
  background: #136355;
}
.bg-login-form {
  background: #181c24;
}
</style>
