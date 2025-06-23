<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Modal Component</h1>
      <p class="text-gray-600 dark:text-gray-300">Examples of the Modal component usage</p>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Modal</h2>
      <button
        @click="showBasicModal = true"
        class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium"
      >
        Open Basic Modal
      </button>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Form Modal</h2>
      <button
        @click="showFormModal = true"
        class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium"
      >
        Open Form Modal
      </button>
    </div>

    <!-- Basic Modal -->
    <Modal v-if="showBasicModal" @close="showBasicModal = false">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Basic Modal Example
        </h3>
      </template>
      <template #body>
        <p class="text-gray-600 dark:text-gray-300">
          This is a basic modal example. You can add any content here.
        </p>
      </template>
      <template #footer>
        <button
          @click="showBasicModal = false"
          class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Close
        </button>
      </template>
    </Modal>

    <!-- Form Modal -->
    <Modal v-if="showFormModal" @close="showFormModal = false">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Form Modal Example
        </h3>
      </template>
      <template #body>
        <form @submit.prevent="handleFormSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
            <input
              v-model="formData.name"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              v-model="formData.email"
              type="email"
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
            <textarea
              v-model="formData.message"
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
        </form>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-3">
          <button
            @click="showFormModal = false"
            class="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            @click="handleFormSubmit"
            class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Submit
          </button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
// Reactive data
const showBasicModal = ref(false)
const showFormModal = ref(false)
const formData = ref({
  name: '',
  email: '',
  message: ''
})

// Methods
const handleFormSubmit = () => {
  console.log('Form submitted:', formData.value)
  showFormModal.value = false
  // Reset form
  formData.value = {
    name: '',
    email: '',
    message: ''
  }
}

definePageMeta({
  title: 'Modal Component'
})
</script>