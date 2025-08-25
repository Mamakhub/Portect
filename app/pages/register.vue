<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({ layout: 'auth' })

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const router = useRouter()

function handleRegister() {
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match.'
    return
  }
  error.value = ''
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen w-full flex">
    <!-- Left: Logo, Title, Description -->
    <div class="hidden md:flex w-1/2 h-screen bg-tenang-200 flex-col items-center justify-center p-0 m-0">
      <div class="flex flex-col items-center justify-center w-full h-full px-16">
        <img src="~/assets/logo.png" alt="Portect Logo" class="mb-12 mt-8 max-w-[640px] w-2/3 h-auto mx-auto">
        <div class="w-48 border-t-4 mb-8 self-start border-tenang-primary" />
        <div class="mt-6 w-full">
          <h1 class="text-5xl font-bold mb-4 text-left w-full text-tenang-primary">
            Portect
          </h1>
          <p class="text-lg text-left max-w-xl text-tenang-primary">
            A comprehensive administration panel for port and vessel connectivity, ensuring secure communication and efficient maritime operations management.
          </p>
        </div>
      </div>
    </div>
    <!-- Right: Register Form -->
    <div class="flex flex-col justify-center items-center w-full md:w-1/2 h-screen bg-login-form">
      <div class="w-full px-12 max-w-lg">
        <h2 class="text-3xl font-bold text-white mb-2">
          Create your account
        </h2>
        <p class="mb-8 text-gray-300">
          Sign up to get started
        </p>
        <form class="space-y-6" @submit.prevent="handleRegister">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input v-model="email" type="email" required class="mt-1 block w-full rounded-lg border border-gray-700 bg-[#232b36] text-white shadow-sm focus:(border-tenang-accent ring-2 ring-tenang-accent) px-4 py-3 transition-all duration-150">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <input v-model="password" type="password" required class="mt-1 block w-full rounded-lg border border-gray-700 bg-[#232b36] text-white shadow-sm focus:(border-tenang-accent ring-2 ring-tenang-accent) px-4 py-3 transition-all duration-150">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
            <input v-model="confirmPassword" type="password" required class="mt-1 block w-full rounded-lg border border-gray-700 bg-[#232b36] text-white shadow-sm focus:(border-tenang-accent ring-2 ring-tenang-accent) px-4 py-3 transition-all duration-150">
          </div>
          <div v-if="error" class="text-red-400 text-sm">
            {{ error }}
          </div>
          <button type="submit" class="w-full py-3 px-4 bg-tenang-accent hover:bg-tenang-300 text-tenang-900 font-bold rounded-lg shadow-lg transition-all duration-150 text-lg mt-2">
            Register
          </button>
        </form>
        <div class="mt-6 text-center text-sm text-gray-400">
          Already have an account?
          <NuxtLink to="/login" class="text-tenang-accent hover:underline">
            Login
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
