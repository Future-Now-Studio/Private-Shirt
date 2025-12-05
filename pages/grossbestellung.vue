<template>
  <div class="bg-white" v-gsap>
    <div class="container mx-auto px-6 py-16">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl font-bold text-center mb-4">Großbestellungen für Ihr Business</h1>
        <p class="text-xl text-gray-600 text-center mb-12">Perfekt für Firmen, Vereine, Events und Merchandise.</p>

        <div class="grid md:grid-cols-3 gap-8 text-center mb-16">
          <div v-for="benefit in b2bBenefits" :key="benefit.title" class="p-4">
            <div class="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 mx-auto mb-4">
              <svg v-html="benefit.icon" class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"></svg>
            </div>
            <h3 class="text-lg font-semibold">{{ benefit.title }}</h3>
            <p class="text-sm text-gray-500">{{ benefit.description }}</p>
          </div>
        </div>

        <div class="bg-gray-50 p-8 rounded-xl border border-gray-200">
          <h2 class="text-2xl font-bold mb-6 text-center">Unverbindliche Anfrage stellen</h2>
          <form @submit.prevent="submitForm" class="space-y-6">
            <div class="grid md:grid-cols-2 gap-6">
              <input v-model="formData.company" type="text" placeholder="Firma / Name*" class="form-input" required>
              <input v-model="formData.email" type="email" placeholder="E-Mail*" class="form-input" required>
            </div>
            <input v-model="formData.phone" type="tel" placeholder="Telefon (optional)" class="form-input">
            <input v-model="formData.quantity" type="number" placeholder="Geschätzte Stückzahl*" class="form-input" required>
            <textarea v-model="formData.message" placeholder="Ihre Nachricht an uns..." rows="5" class="form-input"></textarea>
            <div>
              <label class="block mb-2 text-sm font-medium text-gray-700">Design hochladen (optional)</label>
              <input type="file" @change="handleFileUpload" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
            </div>
            <div class="text-center">
              <button type="submit" class="btn btn-primary btn-lg" :disabled="isSubmitting">
                {{ isSubmitting ? 'Wird gesendet...' : 'Anfrage senden' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// State
const isSubmitting = ref(false)
const formData = ref({
  company: '',
  email: '',
  phone: '',
  quantity: '',
  message: '',
  file: null
})

// Icons from Lucide (lucide.dev) - using raw SVG paths
const b2bBenefits = ref([
  { title: 'Attraktive Mengenrabatte', description: 'Sparen Sie bei größeren Bestellungen für Ihr Team.', icon: '<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>' },
  { title: 'Persönliche Beratung', description: 'Ein fester Ansprechpartner begleitet Ihr Projekt.', icon: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>' },
  { title: 'Kauf auf Rechnung', description: 'Bequeme und sichere Zahlung für Geschäftskunden.', icon: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>' }
])

// Methods
const handleFileUpload = (event) => {
  formData.value.file = event.target.files[0]
}

const submitForm = async () => {
  try {
    isSubmitting.value = true
    
    // Here you would typically send the form data to your backend
    console.log('Form data:', formData.value)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Show success message
    alert('Ihre Anfrage wurde erfolgreich gesendet! Wir melden uns innerhalb von 24 Stunden bei Ihnen.')
    
    // Reset form
    formData.value = {
      company: '',
      email: '',
      phone: '',
      quantity: '',
      message: '',
      file: null
    }
  } catch (error) {
    console.error('Error submitting form:', error)
    alert('Es gab einen Fehler beim Senden Ihrer Anfrage. Bitte versuchen Sie es erneut.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.btn {
  @apply inline-block px-6 py-3 rounded-lg font-semibold text-center transition duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2;
}
.btn-lg {
  @apply px-8 py-4 text-lg;
}
.btn-primary {
  @apply bg-[#D8127D] text-white hover:bg-[#b30f68] focus:ring-[#D8127D];
}
.btn-primary:disabled {
  @apply bg-gray-400 cursor-not-allowed;
}
.form-input {
  @apply w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D8127D] focus:border-[#D8127D] transition;
}

/* Base styles for SVGs injected via v-html to ensure they inherit color */
svg {
  stroke: currentColor;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
}
</style>
