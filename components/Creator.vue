<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-[#D8127D] to-[#b30f68] text-white py-20">
      <div class="container mx-auto px-6 text-center">
        <h1 class="text-5xl font-extrabold mb-6">Gestalte. Teile. Verdiene.</h1>
        <p class="text-xl mb-8 max-w-3xl mx-auto">Werde Teil unserer Creator-Community! Lade deine Designs hoch, verkaufe sie auf unseren Produkten und verdiene mit jeder Bestellung Geld – ganz ohne Risiko.</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button @click="scrollToSignup" class="btn bg-white text-[#D8127D] hover:bg-gray-100 btn-lg">Jetzt kostenlos starten</button>
          <button @click="scrollToHowItWorks" class="btn border-2 border-white text-white hover:bg-white hover:text-[#D8127D] btn-lg">So funktioniert's</button>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section ref="howItWorksRef" class="py-16 bg-white">
      <div class="container mx-auto px-6">
        <h2 class="text-3xl font-bold text-center mb-12">So funktioniert unser Creator-Programm</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-[#D8127D] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-3">1. Design hochladen</h3>
            <p class="text-gray-600">Lade deine Designs, Grafiken oder Texte hoch. Wir prüfen sie und stellen sie in unserem Shop zur Verfügung.</p>
          </div>
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-[#D8127D] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-3">2. Kunden kaufen</h3>
            <p class="text-gray-600">Kunden entdecken deine Designs und bestellen sie auf T-Shirts, Hoodies, Tassen und mehr.</p>
          </div>
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-[#D8127D] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-3">3. Geld verdienen</h3>
            <p class="text-gray-600">Du erhältst eine Provision für jede Bestellung mit deinem Design. Monatliche Auszahlungen, keine Mindestbeträge.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-6">
        <h2 class="text-3xl font-bold text-center mb-12">Warum Creator bei uns werden?</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <div class="text-3xl font-bold text-[#D8127D] mb-2">15%</div>
            <h3 class="font-semibold mb-2">Provision</h3>
            <p class="text-sm text-gray-600">Du erhältst 15% vom Verkaufspreis für jedes verkaufte Produkt mit deinem Design.</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <div class="text-3xl font-bold text-[#D8127D] mb-2">0€</div>
            <h3 class="font-semibold mb-2">Keine Kosten</h3>
            <p class="text-sm text-gray-600">Komplett kostenlos. Keine Anmeldegebühren, keine monatlichen Kosten.</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <div class="text-3xl font-bold text-[#D8127D] mb-2">24h</div>
            <h3 class="font-semibold mb-2">Schnelle Prüfung</h3>
            <p class="text-sm text-gray-600">Deine Designs werden innerhalb von 24 Stunden geprüft und freigeschaltet.</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <div class="text-3xl font-bold text-[#D8127D] mb-2">∞</div>
            <h3 class="font-semibold mb-2">Unbegrenzt</h3>
            <p class="text-sm text-gray-600">Lade so viele Designs hoch wie du möchtest. Keine Limits.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Success Stories -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-6">
        <h2 class="text-3xl font-bold text-center mb-12">Erfolgsgeschichten</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="bg-gray-50 p-6 rounded-lg">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-[#D8127D] rounded-full flex items-center justify-center text-white font-bold mr-4">
                AS
              </div>
              <div>
                <h4 class="font-semibold">Anna Schmidt</h4>
                <p class="text-sm text-gray-600">Illustratorin</p>
              </div>
            </div>
            <p class="text-gray-700 italic">"Seit ich bei private-shirt.de Creator bin, verdiene ich monatlich 200-300€ zusätzlich. Meine Tierillustrationen sind besonders beliebt!"</p>
          </div>
          <div class="bg-gray-50 p-6 rounded-lg">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-[#D8127D] rounded-full flex items-center justify-center text-white font-bold mr-4">
                MJ
              </div>
              <div>
                <h4 class="font-semibold">Max Johnson</h4>
                <p class="text-sm text-gray-600">Grafikdesigner</p>
              </div>
            </div>
            <p class="text-gray-700 italic">"Perfekt für passives Einkommen! Meine minimalistischen Designs verkaufen sich super. Die Auszahlungen kommen pünktlich."</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Signup Form -->
    <section ref="signupRef" class="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div class="container mx-auto px-6">
        <div class="max-w-2xl mx-auto">
          <h2 class="text-3xl font-bold text-center mb-8">Jetzt Creator werden</h2>
          <form @submit.prevent="submitSignup" class="bg-white p-8 rounded-lg shadow-lg">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Vorname *</label>
                <input v-model="form.firstName" type="text" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D8127D] focus:border-transparent">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nachname *</label>
                <input v-model="form.lastName" type="text" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D8127D] focus:border-transparent">
              </div>
            </div>
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">E-Mail *</label>
              <input v-model="form.email" type="email" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D8127D] focus:border-transparent">
            </div>
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
              <input v-model="form.phone" type="tel" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D8127D] focus:border-transparent">
            </div>
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Kurze Beschreibung deiner Designs</label>
              <textarea v-model="form.description" rows="3" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D8127D] focus:border-transparent" placeholder="z.B. Minimalistische Illustrationen, Vintage-Logos, Tierzeichnungen..."></textarea>
            </div>
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Portfolio/Links (optional)</label>
              <input v-model="form.portfolio" type="url" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D8127D] focus:border-transparent" placeholder="https://behance.net/username oder Instagram-Link">
            </div>
            <div class="mb-6">
              <label class="flex items-start">
                <input v-model="form.terms" type="checkbox" required class="mt-1 mr-3">
                <span class="text-sm text-gray-600">Ich akzeptiere die <a href="#" class="text-[#D8127D] hover:underline">AGB</a> und <a href="#" class="text-[#D8127D] hover:underline">Datenschutzerklärung</a> *</span>
              </label>
            </div>
            <button type="submit" :disabled="isSubmitting" class="w-full btn bg-[#D8127D] hover:bg-[#b30f68] text-white btn-lg">
              {{ isSubmitting ? 'Wird gesendet...' : 'Jetzt kostenlos anmelden' }}
            </button>
          </form>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-6">
        <h2 class="text-3xl font-bold text-center mb-12">Häufige Fragen</h2>
        <div class="max-w-3xl mx-auto space-y-6">
          <div class="border border-gray-200 rounded-lg">
            <button @click="toggleFAQ(0)" class="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50">
              <span class="font-semibold">Wie hoch ist die Provision?</span>
              <svg class="w-5 h-5 transform transition-transform" :class="{ 'rotate-180': openFAQ === 0 }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
            <div v-if="openFAQ === 0" class="px-6 pb-4 text-gray-600">
              Du erhältst 15% vom Verkaufspreis für jedes verkaufte Produkt mit deinem Design. Bei einem 20€ T-Shirt wären das 3€ Provision.
            </div>
          </div>
          <div class="border border-gray-200 rounded-lg">
            <button @click="toggleFAQ(1)" class="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50">
              <span class="font-semibold">Wann werde ich ausgezahlt?</span>
              <svg class="w-5 h-5 transform transition-transform" :class="{ 'rotate-180': openFAQ === 1 }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
            <div v-if="openFAQ === 1" class="px-6 pb-4 text-gray-600">
              Auszahlungen erfolgen monatlich per Überweisung. Es gibt keine Mindestbeträge - auch kleine Beträge werden ausgezahlt.
            </div>
          </div>
          <div class="border border-gray-200 rounded-lg">
            <button @click="toggleFAQ(2)" class="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50">
              <span class="font-semibold">Welche Dateiformate werden akzeptiert?</span>
              <svg class="w-5 h-5 transform transition-transform" :class="{ 'rotate-180': openFAQ === 2 }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
            <div v-if="openFAQ === 2" class="px-6 pb-4 text-gray-600">
              Wir akzeptieren PNG, JPG, SVG und PDF. Für beste Druckqualität empfehlen wir Vektordateien (SVG, PDF) oder hochauflösende Rasterbilder (mindestens 300 DPI).
            </div>
          </div>
          <div class="border border-gray-200 rounded-lg">
            <button @click="toggleFAQ(3)" class="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50">
              <span class="font-semibold">Kann ich meine Designs später ändern?</span>
              <svg class="w-5 h-5 transform transition-transform" :class="{ 'rotate-180': openFAQ === 3 }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
            <div v-if="openFAQ === 3" class="px-6 pb-4 text-gray-600">
              Ja, du kannst deine Designs jederzeit aktualisieren oder entfernen. Änderungen werden innerhalb von 24 Stunden im Shop sichtbar.
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

useHead({
  title: 'Creator-Programm – private-shirt.de',
  meta: [
    { name: 'description', content: 'Verdiene Geld mit deinen Designs. Unser Creator-Programm für Künstler, Designer und Influencer.' }
  ]
})

// Refs for smooth scrolling
const howItWorksRef = ref(null)
const signupRef = ref(null)

// Form data
const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  description: '',
  portfolio: '',
  terms: false
})

const isSubmitting = ref(false)
const openFAQ = ref(null)

// Methods
const scrollToSignup = () => {
  signupRef.value?.scrollIntoView({ behavior: 'smooth' })
}

const scrollToHowItWorks = () => {
  howItWorksRef.value?.scrollIntoView({ behavior: 'smooth' })
}

const toggleFAQ = (index) => {
  openFAQ.value = openFAQ.value === index ? null : index
}

const submitSignup = async () => {
  isSubmitting.value = true
  try {
    // Here you would typically send the data to your backend
    console.log('Creator signup:', form.value)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Show success message
    alert('Vielen Dank für deine Anmeldung! Wir melden uns innerhalb von 24 Stunden bei dir.')
    
    // Reset form
    form.value = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      description: '',
      portfolio: '',
      terms: false
    }
  } catch (error) {
    console.error('Signup error:', error)
    alert('Es ist ein Fehler aufgetreten. Bitte versuche es erneut.')
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
</style>
  