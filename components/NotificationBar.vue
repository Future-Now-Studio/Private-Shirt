<template>
  <div class="bg-gray-900 text-white text-center py-2 text-sm font-medium overflow-hidden relative h-8" data-aos="fade-down">
    <transition name="slide-fade" mode="out-in">
      <span :key="currentNotificationMessage">{{ notificationMessages[currentNotificationMessage] }}</span>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// State
const notificationMessages = ref([
  'Kostenfreier Versand ab 50€',
  'Abholung im Store am nächsten Tag bei Bestellungen bis 12 Uhr'
])
const currentNotificationMessage = ref(0)
let notificationInterval = null

// Methods
const startNotificationSlider = () => {
  notificationInterval = setInterval(() => {
    currentNotificationMessage.value = (currentNotificationMessage.value + 1) % notificationMessages.value.length
  }, 5000) // Change message every 5 seconds
}

// Lifecycle
onMounted(() => {
  startNotificationSlider()
})

onUnmounted(() => {
  if (notificationInterval) {
    clearInterval(notificationInterval)
  }
})
</script>

<style scoped>
/* Notification Slider Transitions */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease;
  position: absolute;
  width: 100%;
}
.slide-fade-enter-from {
  transform: translateY(100%);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

/* Top notification bar styles */
.bg-gray-900.text-white.text-center.py-2.text-sm.font-medium.overflow-hidden.relative.h-8 {
  background-color: #D8127D !important;
  color: #fff !important;
}
</style>
