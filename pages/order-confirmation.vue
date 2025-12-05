<template>
  <div class="container mx-auto px-6 py-12" v-gsap>
    <div class="max-w-2xl mx-auto text-center">
      <svg class="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
      </svg>
      <h1 class="text-3xl font-bold mb-4">Vielen Dank für Ihre Bestellung!</h1>
      <p class="text-gray-600 mb-8">Wir haben Ihnen eine Bestätigungs-E-Mail gesendet.</p>
      <button @click="$emit('navigate', 'Home')" class="btn bg-[#D8127D] text-white">
        Zurück zur Startseite
      </button>
    </div>
  </div>
</template>

<script setup>
// Emits
defineEmits(['navigate'])
</script>

<style scoped>
.btn {
  @apply inline-block px-6 py-3 rounded-lg font-semibold text-center transition duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2;
}
</style>
