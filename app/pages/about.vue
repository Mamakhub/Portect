<script setup lang="ts">
import { Icon } from '@iconify/vue'
import QrcodeVue from 'qrcode.vue'
import type { Ref } from 'vue'
import { computed, ref } from 'vue'
import AppCard from '~/components/common/AppCard.vue'
import Modal from '~/components/common/Modal.vue'

// No runtime config needed for team page

// Social links for each member (replace with real links)
type TeamMember = 'Leon Then' | 'Anson Kiu' | 'Chong Yi Jian' | 'Go Yao Xiang'
type SocialType = 'linkedin' | 'instagram' | 'gmail'

const teamLinks: Record<TeamMember, Record<SocialType, string>> = {
  'Leon Then': {
    linkedin: 'https://www.linkedin.com/in/leon-then/',
    instagram: 'https://www.instagram.com/itsleonnnnn/',
    gmail: 'mailto:leonthen0218@gmail.com',
  },
  'Anson Kiu': {
    linkedin: 'https://linkedin.com/in/anson-kiu-98b130256',
    instagram: 'https://www.instagram.com/ansonkiu1202/',
    gmail: 'mailto:ansonkiu0212@gmail.com',
  },
  'Chong Yi Jian': {
    linkedin: 'https://www.linkedin.com/in/yi-jian-chong-587653255/',
    instagram: 'https://www.instagram.com/yijian.ezean/',
    gmail: 'mailto:mrchongyijian@gmail.com',
  },
  'Go Yao Xiang': {
    linkedin: 'https://www.linkedin.com/in/go-yao-xiang-a54aa1255/',
    instagram: 'https://www.instagram.com/yao_xiang_0115/',
    gmail: 'mailto:goyaoxiang@gmail.com',
  },
}

const showQrModal = ref(false)
const qrModalTitle = ref('')
const qrValue = ref('')
const showAllQrModal = ref(false)
const allQrMember: Ref<TeamMember | null> = ref(null)

const colorMode = useColorMode()
const qrBgColor = computed(() => '#ffffff')
const qrFgColor = computed(() => '#000000')

function handleSocialClick(name: TeamMember, type: SocialType) {
  const link = teamLinks[name][type]
  if (link) {
    // Copy to clipboard
    navigator.clipboard.writeText(link)
    // Show QR modal
    qrModalTitle.value = `${name} - ${type.charAt(0).toUpperCase() + type.slice(1)}`
    qrValue.value = link
    showQrModal.value = true
  }
}

function closeQrModal() {
  showQrModal.value = false
}

function openAllQrModal(name: TeamMember) {
  allQrMember.value = name
  showAllQrModal.value = true
}

function closeAllQrModal() {
  showAllQrModal.value = false
  allQrMember.value = null
}
</script>

<template>
  <div class="max-w-6xl mx-auto py-12 px-4 space-y-10">
    <!-- Team Section (wider) -->
    <div class="max-w-6xl mx-auto">
      <AppCard>
        <template #header>
          <h1 class="text-3xl md:text-4xl font-bold text-tenang-primary dark:text-tenang-primary-dark text-center w-full">
            Meet the Team
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-300 text-center mt-2">
            Get to know the people behind this project
          </p>
        </template>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-4">
          <!-- Leon Then (CEO) -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col p-6">
            <div class="flex flex-col items-center flex-1">
              <img src="/assets/Leon Then _ Portrait.png" alt="Leon Then" class="w-32 h-32 object-cover rounded-xl mb-4 shadow-md cursor-pointer" @click="openAllQrModal('Leon Then')">
              <h2 class="text-xl font-semibold text-tenang-primary dark:text-tenang-primary-dark mb-1">
                Leon Then
              </h2>
              <h3 class="text-base font-medium text-gray-900 dark:text-white mb-1">
                CEO
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 text-center mb-3">
                Leading the vision and strategy to deliver innovative, reliable, and user-centric site management solutions.
              </p>
            </div>
            <div class="flex gap-4 mt-auto justify-center pt-2">
              <button title="Copy LinkedIn & Show QR" class="text-gray-700 dark:text-gray-200 hover:text-tenang-primary transition-colors" @click="handleSocialClick('Leon Then', 'linkedin')">
                <Icon icon="mdi:linkedin" class="w-6 h-6" />
              </button>
              <button title="Copy Instagram & Show QR" class="text-gray-700 dark:text-gray-200 hover:text-tenang-primary transition-colors" @click="handleSocialClick('Leon Then', 'instagram')">
                <Icon icon="mdi:instagram" class="w-6 h-6" />
              </button>
              <button title="Copy Gmail & Show QR" class="text-gray-700 dark:text-gray-200 hover:text-tenang-primary transition-colors" @click="handleSocialClick('Leon Then', 'gmail')">
                <Icon icon="mdi:gmail" class="w-6 h-6" />
              </button>
            </div>
          </div>
          <!-- Anson Kiu (CIO) -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col p-6">
            <div class="flex flex-col items-center flex-1">
              <img src="/assets/Anson Kiu.jpg" alt="Anson Kiu" class="w-32 h-32 object-cover rounded-xl mb-4 shadow-md cursor-pointer" @click="openAllQrModal('Anson Kiu')">
              <h2 class="text-xl font-semibold text-tenang-primary dark:text-tenang-primary-dark mb-1">
                Anson Kiu
              </h2>
              <h3 class="text-base font-medium text-gray-900 dark:text-white mb-1">
                CIO
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 text-center mb-3">
                Driving information strategy and digital transformation to empower smarter, data-driven decisions.
              </p>
            </div>
            <div class="flex gap-4 mt-auto justify-center pt-2">
              <button title="Copy LinkedIn & Show QR" class="text-gray-700 dark:text-gray-200 hover:text-tenang-primary transition-colors" @click="handleSocialClick('Anson Kiu', 'linkedin')">
                <Icon icon="mdi:linkedin" class="w-6 h-6" />
              </button>
              <button title="Copy Instagram & Show QR" class="text-gray-700 dark:text-gray-200 hover:text-tenang-primary transition-colors" @click="handleSocialClick('Anson Kiu', 'instagram')">
                <Icon icon="mdi:instagram" class="w-6 h-6" />
              </button>
              <button title="Copy Gmail & Show QR" class="text-gray-700 dark:text-gray-200 hover:text-tenang-primary transition-colors" @click="handleSocialClick('Anson Kiu', 'gmail')">
                <Icon icon="mdi:gmail" class="w-6 h-6" />
              </button>
            </div>
          </div>
          <!-- Chong Yi Jian (CTO) -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col p-6">
            <div class="flex flex-col items-center flex-1">
              <img src="/assets/Chong Yi Jian.png" alt="Chong Yi Jian" class="w-32 h-32 object-cover rounded-xl mb-4 shadow-md cursor-pointer" @click="openAllQrModal('Chong Yi Jian')">
              <h2 class="text-xl font-semibold text-tenang-primary dark:text-tenang-primary-dark mb-1">
                Chong Yi Jian
              </h2>
              <h3 class="text-base font-medium text-gray-900 dark:text-white mb-1">
                CTO
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 text-center mb-3">
                Spearheading technological innovation and ensuring seamless integration of advanced monitoring and scheduling systems.
              </p>
            </div>
            <div class="flex gap-4 mt-auto justify-center pt-2">
              <button title="Copy LinkedIn & Show QR" class="text-gray-700 dark:text-gray-200 hover:text-tenang-primary transition-colors" @click="handleSocialClick('Chong Yi Jian', 'linkedin')">
                <Icon icon="mdi:linkedin" class="w-6 h-6" />
              </button>
              <button title="Copy Instagram & Show QR" class="text-gray-700 dark:text-gray-200 hover:text-tenang-primary transition-colors" @click="handleSocialClick('Chong Yi Jian', 'instagram')">
                <Icon icon="mdi:instagram" class="w-6 h-6" />
              </button>
              <button title="Copy Gmail & Show QR" class="text-gray-700 dark:text-gray-200 hover:text-tenang-primary transition-colors" @click="handleSocialClick('Chong Yi Jian', 'gmail')">
                <Icon icon="mdi:gmail" class="w-6 h-6" />
              </button>
            </div>
          </div>
          <!-- Go Yao Xiang (CMO) -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col p-6">
            <div class="flex flex-col items-center flex-1">
              <img src="/assets/Go Yao Xiang.png" alt="Go Yao Xiang" class="w-32 h-32 object-cover rounded-xl mb-4 shadow-md cursor-pointer" @click="openAllQrModal('Go Yao Xiang')">
              <h2 class="text-xl font-semibold text-tenang-primary dark:text-tenang-primary-dark mb-1">
                Go Yao Xiang
              </h2>
              <h3 class="text-base font-medium text-gray-900 dark:text-white mb-1">
                CMO
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 text-center mb-3">
                Crafting and executing creative marketing strategies to communicate the value and impact of our platform.
              </p>
            </div>
            <div class="flex gap-4 mt-auto justify-center pt-2">
              <button title="Copy LinkedIn & Show QR" class="text-gray-700 dark:text-gray-200 hover:text-tenang-primary transition-colors" @click="handleSocialClick('Go Yao Xiang', 'linkedin')">
                <Icon icon="mdi:linkedin" class="w-6 h-6" />
              </button>
              <button title="Copy Instagram & Show QR" class="text-gray-700 dark:text-gray-200 hover:text-tenang-primary transition-colors" @click="handleSocialClick('Go Yao Xiang', 'instagram')">
                <Icon icon="mdi:instagram" class="w-6 h-6" />
              </button>
              <button title="Copy Gmail & Show QR" class="text-gray-700 dark:text-gray-200 hover:text-tenang-primary transition-colors" @click="handleSocialClick('Go Yao Xiang', 'gmail')">
                <Icon icon="mdi:gmail" class="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </AppCard>
    </div>
    <!-- System Features & Functions Section -->
    <AppCard>
      <template #header>
        <h2 class="text-2xl md:text-3xl font-bold text-tenang-primary dark:text-tenang-primary-dark text-center w-full">
          System Features & Functions
        </h2>
      </template>
      <div>
        <p class="text-center text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto text-lg">
          <span class="font-semibold text-tenang-primary dark:text-tenang-primary-dark">TenangSite</span> is your all-in-one digital platform for modern site management, monitoring, and scheduling. Designed for teams who value efficiency, safety, and data-driven decision making, TenangSite empowers you to seamlessly oversee multiple project sites, monitor real-time environmental conditions, and optimize your workflow—all from a single, intuitive dashboard.<br><br>
          Whether you're managing construction, industrial, or environmental projects, TenangSite provides the tools you need to stay compliant, proactive, and connected. Our platform not only streamlines daily operations but also enhances collaboration, transparency, and accountability across your organization. Discover how TenangSite can help you create safer, smarter, and more sustainable project environments.
        </p>
        <ul class="space-y-3 max-w-xl mx-auto">
          <li class="flex items-center gap-2">
            <span class="text-tenang-primary dark:text-tenang-primary-dark text-lg">✔</span>
            <span class="text-gray-800 dark:text-gray-200">Real-time environmental monitoring (dust, noise, and more)</span>
          </li>
          <li class="flex items-center gap-2">
            <span class="text-tenang-primary dark:text-tenang-primary-dark text-lg">✔</span>
            <span class="text-gray-800 dark:text-gray-200">Automated project scheduling and task optimization</span>
          </li>
          <li class="flex items-center gap-2">
            <span class="text-tenang-primary dark:text-tenang-primary-dark text-lg">✔</span>
            <span class="text-gray-800 dark:text-gray-200">Multi-site management with centralized dashboard</span>
          </li>
          <li class="flex items-center gap-2">
            <span class="text-tenang-primary dark:text-tenang-primary-dark text-lg">✔</span>
            <span class="text-gray-800 dark:text-gray-200">Customizable alerts and notifications for site events</span>
          </li>
          <li class="flex items-center gap-2">
            <span class="text-tenang-primary dark:text-tenang-primary-dark text-lg">✔</span>
            <span class="text-gray-800 dark:text-gray-200">Comprehensive reporting and analytics</span>
          </li>
          <li class="flex items-center gap-2">
            <span class="text-tenang-primary dark:text-tenang-primary-dark text-lg">✔</span>
            <span class="text-gray-800 dark:text-gray-200">User-friendly interface with dark mode support</span>
          </li>
        </ul>
      </div>
    </AppCard>
    <!-- QR Code Modal -->
    <Modal :is-open="showQrModal" :title="qrModalTitle" size="sm" @close="closeQrModal">
      <div class="flex flex-col items-center justify-center">
        <div :class="colorMode.value === 'dark' ? 'bg-white p-4 rounded-lg' : ''">
          <QrcodeVue :value="qrValue" :size="180" class="mb-4" :background="qrBgColor" :foreground="qrFgColor" />
        </div>
        <div class="text-xs text-gray-500 dark:text-gray-400 break-all text-center">
          {{ qrValue }}
        </div>
        <div class="mt-2 text-green-600 text-sm">
          Link copied to clipboard!
        </div>
      </div>
    </Modal>
    <!-- All Contact QR Modal -->
    <Modal :is-open="showAllQrModal" :title="allQrMember ? `${allQrMember} - Contact Info` : ''" size="xl" @close="closeAllQrModal">
      <div v-if="allQrMember" class="flex flex-col items-center p-8">
        <!-- Enhanced image section with background -->
        <div class="bg-[#017359]/10 rounded-2xl p-6 mb-6 shadow-lg">
          <img
            :src="
              allQrMember === 'Leon Then' ? '/_nuxt/assets/Leon Then _ Portrait.png'
              : allQrMember === 'Anson Kiu' ? '/_nuxt/assets/Anson Kiu.jpg'
                : allQrMember === 'Chong Yi Jian' ? '/_nuxt/assets/Chong Yi Jian.png'
                  : '/_nuxt/assets/Go Yao Xiang.png'"
            :alt="allQrMember"
            class="w-36 h-36 object-cover rounded-xl shadow-lg border-4 border-white"
          >
        </div>
        <h2 class="text-2xl font-bold text-tenang-primary dark:text-tenang-primary-dark mb-12">
          {{ allQrMember }}
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-12 w-full max-w-4xl">
          <div class="flex flex-col items-center bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div :class="colorMode.value === 'dark' ? 'bg-white p-3 rounded-lg' : ''">
              <QrcodeVue :value="teamLinks[allQrMember].linkedin" :size="140" :background="qrBgColor" :foreground="qrFgColor" />
            </div>
            <div class="flex items-center gap-2 mt-4 text-sm font-semibold text-tenang-primary dark:text-tenang-primary-dark">
              <Icon icon="mdi:linkedin" class="w-5 h-5" /> LinkedIn
            </div>
          </div>
          <div class="flex flex-col items-center bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div :class="colorMode.value === 'dark' ? 'bg-white p-3 rounded-lg' : ''">
              <QrcodeVue :value="teamLinks[allQrMember].instagram" :size="140" :background="qrBgColor" :foreground="qrFgColor" />
            </div>
            <div class="flex items-center gap-2 mt-4 text-sm font-semibold text-tenang-primary dark:text-tenang-primary-dark">
              <Icon icon="mdi:instagram" class="w-5 h-5" /> Instagram
            </div>
          </div>
          <div class="flex flex-col items-center bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div :class="colorMode.value === 'dark' ? 'bg-white p-3 rounded-lg' : ''">
              <QrcodeVue :value="teamLinks[allQrMember].gmail" :size="140" :background="qrBgColor" :foreground="qrFgColor" />
            </div>
            <div class="flex items-center gap-2 mt-4 text-sm font-semibold text-tenang-primary dark:text-tenang-primary-dark">
              <Icon icon="mdi:gmail" class="w-5 h-5" /> Gmail
            </div>
          </div>
        </div>
      </div>
    </Modal>
    <!-- Back to Home Button -->
    <div class="flex justify-center pt-8">
      <NuxtLink
        to="/"
        class="bg-tenang-primary dark:bg-tenang-primary-dark hover:bg-tenang-primary/80 dark:hover:bg-tenang-primary-dark/80 text-white dark:text-black px-6 py-3 rounded-lg font-medium transition-colors shadow"
      >
        Back to Home
      </NuxtLink>
    </div>
  </div>
</template>
