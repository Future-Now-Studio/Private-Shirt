<template>
  <header class="bg-white/80 backdrop-blur-lg sticky top-0 z-40 shadow-sm">
    <nav class="container mx-auto px-6 py-4 flex justify-between items-center">
      <div class="text-2xl font-bold text-gray-900 cursor-pointer" @click="$emit('navigate', 'Home')">
        <img src="/assets/group-25.svg" 
             alt="private-shirt.de Logo" 
             class="h-8"
             @error="handleLogoError">
      </div>
      <div class="hidden lg:flex items-center space-x-8">
        <a @mouseenter="fertigeProdukteHover = true" @mouseleave="fertigeProdukteHover = false" @click="$emit('navigate', 'ReadyToBuy')" class="nav-link relative">
          Fertige Produkte
        </a>
        <a @click="$emit('navigate', 'CustomizationCreator')" class="nav-link">Gestalten / Creator</a>
        <a @click="$emit('navigate', 'Leistungen')" class="nav-link">Leistungen</a>
        <a @click="$emit('navigate', 'Unternehmen')" class="nav-link">Unternehmen</a>
        <a @click="scrollToLocations" class="nav-link">Filialen</a>
        <a @click="$emit('navigate', 'Grossbestellung')" class="nav-link">Großbestellung</a>
      </div>
      <div class="flex items-center">
        <!-- Instagram Icon -->
        <a href="https://www.instagram.com/privateshirt/" target="_blank" rel="noopener noreferrer" class="p-2 rounded-full hover:bg-gray-100 transition">
          <svg class="w-6 h-6 text-gray-600 hover:text-[#D8127D] transition-colors" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </a>

        <!-- Cart Icon -->
        <button @click="$emit('toggleCart')" class="relative ml-2 p-2 rounded-full hover:bg-gray-100 transition">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          <span v-if="cartItemCount > 0" 
                class="absolute -top-1 -right-1 bg-[#D8127D] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {{ cartItemCount }}
          </span>
        </button>

        <button class="lg:hidden ml-2">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
        </button>
      </div>
    </nav>
    <!-- Submenu Bar -->
    <transition name="fade">
      <div v-if="fertigeProdukteHover" @mouseenter="fertigeProdukteHover = true" @mouseleave="fertigeProdukteHover = false" class="fixed left-0 right-0 top-[72px] z-50 bg-gray-100 border-b border-gray-200 shadow-sm">
        <div class="container mx-auto px-6 flex space-x-8 py-2 justify-center">
          <button v-for="cat in submenuCategories" :key="cat.id" class="text-gray-700 hover:text-[#D8127D] font-medium px-3 py-1 rounded transition">
            {{ cat.name }}
          </button>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref } from 'vue'

// Props
defineProps({
  cartItemCount: {
    type: Number,
    default: 0
  }
})

// Emits
const emit = defineEmits(['navigate', 'toggleCart'])

// State
const fertigeProdukteHover = ref(false)
const submenuCategories = [
  { name: 'Männer', id: 'maenner' },
  { name: 'Frauen', id: 'frauen' },
  { name: 'Kinder', id: 'kinder' },
  { name: 'Accessoires', id: 'accessoires' },
  { name: 'Arbeitskleidung', id: 'arbeitskleidung' }
]

// Methods
const handleLogoError = (event) => {
  // Replace logo with text
  const logoContainer = event.target.parentElement;
  const textLogo = document.createElement('span');
  textLogo.textContent = 'private-shirt.de';
  textLogo.className = 'text-2xl font-bold text-[#D8127D]';
  logoContainer.replaceChild(textLogo, event.target);
}

const scrollToLocations = () => {
  // First navigate to home page
  emit('navigate', 'Home');
  
  // Then scroll to locations section after a short delay
  setTimeout(() => {
    const locationsSection = document.querySelector('#locations-section');
    if (locationsSection) {
      locationsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, 100);
}
</script>

<style scoped>
.nav-link {
  @apply text-gray-600 hover:text-[#D8127D] font-medium cursor-pointer transition;
}

/* Page Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
  