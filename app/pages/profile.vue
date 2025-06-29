<script setup lang="ts">
import { Icon } from '@iconify/vue'

// Reactive data
const isEditing = ref(false)
const isChangingPassword = ref(false)
const showDeleteConfirm = ref(false)
const isLoading = ref(false)
const showSuccessMessage = ref(false)
const successMessage = ref('')

// User profile data
const userProfile = ref({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '+1 (555) 123-4567',
  company: 'Tenang Technologies',
  position: 'System Administrator',
  location: 'Kuala Lumpur, Malaysia',
  timezone: 'Asia/Kuala_Lumpur',
  bio: 'Experienced system administrator with expertise in environmental monitoring systems and IoT technologies.',
  avatar: null as string | null,
})

// Form data for editing
const editForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  position: '',
  location: '',
  timezone: '',
  bio: '',
})

// Password change form
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// Validation errors
const errors = ref<Record<string, string>>({})
const passwordErrors = ref<Record<string, string>>({})

// Computed
const fullName = computed(() => {
  return `${userProfile.value.firstName} ${userProfile.value.lastName}`
})

const userInitials = computed(() => {
  return `${userProfile.value.firstName[0]}${userProfile.value.lastName[0]}`.toUpperCase()
})

// Methods
function startEditing() {
  editForm.value = { ...userProfile.value }
  isEditing.value = true
  errors.value = {}
}

function cancelEditing() {
  isEditing.value = false
  errors.value = {}
}

function validateForm() {
  errors.value = {}

  if (!editForm.value.firstName.trim()) {
    errors.value.firstName = 'First name is required'
  }

  if (!editForm.value.lastName.trim()) {
    errors.value.lastName = 'Last name is required'
  }

  if (!editForm.value.email.trim()) {
    errors.value.email = 'Email is required'
  }
  else if (!/^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(editForm.value.email)) {
    errors.value.email = 'Please enter a valid email address'
  }

  return Object.keys(errors.value).length === 0
}

async function saveProfile() {
  if (!validateForm())
    return

  isLoading.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Update profile data while preserving avatar
    userProfile.value = {
      ...editForm.value,
      avatar: userProfile.value.avatar,
    }

    isEditing.value = false
    showSuccessMessage.value = true
    successMessage.value = 'Profile updated successfully!'

    setTimeout(() => {
      showSuccessMessage.value = false
    }, 3000)
  }
  catch (error) {
    console.error('Error updating profile:', error)
  }
  finally {
    isLoading.value = false
  }
}

function startPasswordChange() {
  isChangingPassword.value = true
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  }
  passwordErrors.value = {}
}

function cancelPasswordChange() {
  isChangingPassword.value = false
  passwordErrors.value = {}
}

function validatePasswordForm() {
  passwordErrors.value = {}

  if (!passwordForm.value.currentPassword) {
    passwordErrors.value.currentPassword = 'Current password is required'
  }

  if (!passwordForm.value.newPassword) {
    passwordErrors.value.newPassword = 'New password is required'
  }
  else if (passwordForm.value.newPassword.length < 8) {
    passwordErrors.value.newPassword = 'Password must be at least 8 characters'
  }

  if (!passwordForm.value.confirmPassword) {
    passwordErrors.value.confirmPassword = 'Please confirm your new password'
  }
  else if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordErrors.value.confirmPassword = 'Passwords do not match'
  }

  return Object.keys(passwordErrors.value).length === 0
}

async function changePassword() {
  if (!validatePasswordForm())
    return

  isLoading.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    isChangingPassword.value = false
    showSuccessMessage.value = true
    successMessage.value = 'Password changed successfully!'

    setTimeout(() => {
      showSuccessMessage.value = false
    }, 3000)
  }
  catch (error) {
    console.error('Error changing password:', error)
  }
  finally {
    isLoading.value = false
  }
}

function handleAvatarUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      userProfile.value.avatar = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

function confirmDeleteAccount() {
  showDeleteConfirm.value = true
}

function cancelDeleteAccount() {
  showDeleteConfirm.value = false
}

async function deleteAccount() {
  isLoading.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Redirect to logout
    if (process.client) {
      localStorage.removeItem('mockLoggedIn')
      window.location.href = '/login'
    }
  }
  catch (error) {
    console.error('Error deleting account:', error)
    isLoading.value = false
  }
}

// Initialize form data
onMounted(() => {
  editForm.value = { ...userProfile.value }
})

definePageMeta({
  title: 'Profile',
})
</script>

<template>
  <div class="space-y-6">
    <!-- Success Message -->
    <div
      v-if="showSuccessMessage"
      class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4"
    >
      <div class="flex items-center">
        <Icon icon="heroicons:check-circle" class="w-5 h-5 text-green-400 mr-2" />
        <p class="text-green-800 dark:text-green-200">
          {{ successMessage }}
        </p>
      </div>
    </div>

    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-tenang-primary dark:text-tenang-primary-dark">
        Profile
      </h1>
      <p class="text-gray-600 dark:text-gray-300">
        Manage your personal information and account settings
      </p>
    </div>

    <!-- Profile Information -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          Personal Information
        </h2>
        <button
          v-if="!isEditing"
          class="bg-tenang-primary dark:bg-tenang-primary-dark hover:bg-tenang-primary/90 dark:hover:bg-tenang-primary-dark/90 text-white dark:text-black px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-tenang-primary focus:ring-offset-2"
          @click="startEditing"
        >
          Edit Profile
        </button>
        <div v-else class="flex gap-2">
          <button
            class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            @click="cancelEditing"
          >
            Cancel
          </button>
          <button
            class="bg-tenang-primary dark:bg-tenang-primary-dark hover:bg-tenang-primary/90 dark:hover:bg-tenang-primary-dark/90 text-white dark:text-black px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-tenang-primary focus:ring-offset-2"
            :disabled="isLoading"
            @click="saveProfile"
          >
            <Icon v-if="isLoading" icon="heroicons:arrow-path" class="w-4 h-4 mr-2 animate-spin" />
            Save Changes
          </button>
        </div>
      </div>

      <div class="p-6">
        <div v-if="!isEditing" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Avatar Section -->
          <div class="flex items-center space-x-4">
            <div class="relative">
              <div
                v-if="userProfile.avatar"
                class="w-20 h-20 rounded-full bg-cover bg-center"
                :style="{ backgroundImage: `url(${userProfile.avatar})` }"
              />
              <div
                v-else
                class="w-20 h-20 bg-tenang-primary dark:bg-tenang-primary-dark rounded-full flex items-center justify-center text-white dark:text-black font-semibold text-xl"
              >
                {{ userInitials }}
              </div>
            </div>
            <div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                {{ fullName }}
              </h3>
              <p class="text-gray-500 dark:text-gray-400">
                {{ userProfile.position }}
              </p>
              <p class="text-gray-500 dark:text-gray-400">
                {{ userProfile.company }}
              </p>
            </div>
          </div>

          <!-- Contact Information -->
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <p class="text-gray-900 dark:text-white">
                {{ userProfile.email }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
              <p class="text-gray-900 dark:text-white">
                {{ userProfile.phone }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
              <p class="text-gray-900 dark:text-white">
                {{ userProfile.location }}
              </p>
            </div>
          </div>

          <!-- Bio -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
            <p class="text-gray-900 dark:text-white">
              {{ userProfile.bio }}
            </p>
          </div>
        </div>

        <!-- Edit Form -->
        <div v-else class="space-y-6">
          <!-- Avatar Upload -->
          <div class="flex items-center space-x-4">
            <div class="relative">
              <div
                v-if="userProfile.avatar"
                class="w-20 h-20 rounded-full bg-cover bg-center"
                :style="{ backgroundImage: `url(${userProfile.avatar})` }"
              />
              <div
                v-else
                class="w-20 h-20 bg-tenang-primary dark:bg-tenang-primary-dark rounded-full flex items-center justify-center text-white dark:text-black font-semibold text-xl"
              >
                {{ userInitials }}
              </div>
              <label
                class="absolute bottom-0 right-0 bg-tenang-primary dark:bg-tenang-primary-dark text-white dark:text-black rounded-full p-1 cursor-pointer hover:bg-tenang-primary/90 dark:hover:bg-tenang-primary-dark/90"
              >
                <Icon icon="heroicons:camera" class="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleAvatarUpload"
                >
              </label>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Click the camera icon to upload a new photo
              </p>
            </div>
          </div>

          <!-- Form Fields -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
              <input
                v-model="editForm.firstName"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-tenang-primary focus:border-tenang-primary transition-colors"
                :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.firstName }"
                placeholder="Enter your first name"
              >
              <p v-if="errors.firstName" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ errors.firstName }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
              <input
                v-model="editForm.lastName"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-tenang-primary focus:border-tenang-primary transition-colors"
                :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.lastName }"
                placeholder="Enter your last name"
              >
              <p v-if="errors.lastName" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ errors.lastName }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input
                v-model="editForm.email"
                type="email"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-tenang-primary focus:border-tenang-primary transition-colors"
                :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.email }"
                placeholder="Enter your email address"
              >
              <p v-if="errors.email" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ errors.email }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
              <input
                v-model="editForm.phone"
                type="tel"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-tenang-primary focus:border-tenang-primary transition-colors"
                placeholder="Enter your phone number"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company</label>
              <input
                v-model="editForm.company"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-tenang-primary focus:border-tenang-primary transition-colors"
                placeholder="Enter your company name"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Position</label>
              <input
                v-model="editForm.position"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-tenang-primary focus:border-tenang-primary transition-colors"
                placeholder="Enter your job title"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
              <input
                v-model="editForm.location"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-tenang-primary focus:border-tenang-primary transition-colors"
                placeholder="Enter your location"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Timezone</label>
              <select
                v-model="editForm.timezone"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-tenang-primary focus:border-tenang-primary transition-colors"
              >
                <option value="Asia/Kuala_Lumpur">
                  Asia/Kuala_Lumpur (UTC+8)
                </option>
                <option value="Asia/Singapore">
                  Asia/Singapore (UTC+8)
                </option>
                <option value="Asia/Jakarta">
                  Asia/Jakarta (UTC+7)
                </option>
                <option value="Asia/Bangkok">
                  Asia/Bangkok (UTC+7)
                </option>
                <option value="UTC">
                  UTC (UTC+0)
                </option>
              </select>
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
              <textarea
                v-model="editForm.bio"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-tenang-primary focus:border-tenang-primary transition-colors resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Password Change -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          Security
        </h2>
        <button
          v-if="!isChangingPassword"
          class="bg-tenang-primary dark:bg-tenang-primary-dark hover:bg-tenang-primary/90 dark:hover:bg-tenang-primary-dark/90 text-white dark:text-black px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-tenang-primary focus:ring-offset-2"
          @click="startPasswordChange"
        >
          Change Password
        </button>
        <div v-else class="flex gap-2">
          <button
            class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            @click="cancelPasswordChange"
          >
            Cancel
          </button>
          <button
            class="bg-tenang-primary dark:bg-tenang-primary-dark hover:bg-tenang-primary/90 dark:hover:bg-tenang-primary-dark/90 text-white dark:text-black px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-tenang-primary focus:ring-offset-2"
            :disabled="isLoading"
            @click="changePassword"
          >
            <Icon v-if="isLoading" icon="heroicons:arrow-path" class="w-4 h-4 mr-2 animate-spin" />
            Update Password
          </button>
        </div>
      </div>

      <div v-if="isChangingPassword" class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
            <input
              v-model="passwordForm.currentPassword"
              type="password"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-tenang-primary focus:border-tenang-primary transition-colors"
              :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': passwordErrors.currentPassword }"
              placeholder="Enter your current password"
            >
            <p v-if="passwordErrors.currentPassword" class="mt-1 text-sm text-red-600 dark:text-red-400">
              {{ passwordErrors.currentPassword }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
            <input
              v-model="passwordForm.newPassword"
              type="password"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-tenang-primary focus:border-tenang-primary transition-colors"
              :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': passwordErrors.newPassword }"
              placeholder="Enter your new password"
            >
            <p v-if="passwordErrors.newPassword" class="mt-1 text-sm text-red-600 dark:text-red-400">
              {{ passwordErrors.newPassword }}
            </p>
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
            <input
              v-model="passwordForm.confirmPassword"
              type="password"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-tenang-primary focus:border-tenang-primary transition-colors"
              :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': passwordErrors.confirmPassword }"
              placeholder="Confirm your new password"
            >
            <p v-if="passwordErrors.confirmPassword" class="mt-1 text-sm text-red-600 dark:text-red-400">
              {{ passwordErrors.confirmPassword }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Account Management -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          Account Management
        </h2>
      </div>
      <div class="p-6">
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900 dark:text-white">
                Account Status
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Your account is active and verified
              </p>
            </div>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Active
            </span>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900 dark:text-white">
                Member Since
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                January 2024
              </p>
            </div>
          </div>

          <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
            <button
              class="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded px-2 py-1"
              @click="confirmDeleteAccount"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Account Confirmation Modal -->
    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="cancelDeleteAccount"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4"
        @click.stop
      >
        <div class="flex items-center mb-4">
          <div class="flex-shrink-0">
            <Icon icon="heroicons:exclamation-triangle" class="w-6 h-6 text-red-600" />
          </div>
          <div class="ml-3">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              Delete Account
            </h3>
          </div>
        </div>
        <div class="mb-4">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
          </p>
        </div>
        <div class="flex justify-end space-x-3">
          <button
            class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            @click="cancelDeleteAccount"
          >
            Cancel
          </button>
          <button
            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            :disabled="isLoading"
            @click="deleteAccount"
          >
            <Icon v-if="isLoading" icon="heroicons:arrow-path" class="w-4 h-4 mr-2 animate-spin" />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
