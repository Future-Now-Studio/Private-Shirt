<template>
  <section class="py-16 bg-gray-50" v-gsap>
    <div class="container mx-auto px-6">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-3xl font-bold mb-4">Haben Sie Fragen?</h2>
        <p class="text-lg text-gray-600 mb-8">
          Unser Team steht Ihnen gerne zur Verfügung. Kontaktieren Sie uns für persönliche Beratung.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink to="/kontakt" class="btn btn-primary">
            Kontakt aufnehmen
          </NuxtLink>
          <a href="tel:+494032873804" class="btn btn-secondary">
            <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
            040 328 738 04
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// Contact CTA component
</script>

<style scoped>
/* Component-specific styles can be added here if needed */
</style>
