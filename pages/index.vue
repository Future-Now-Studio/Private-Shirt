<template>
  <div>
    <!-- Hero Section -->
    <section class="relative h-[60vh] md:h-[50vh] flex flex-col lg:flex-row">
      <!-- Left side - White background with brand colors for text -->
      <div class="w-full lg:w-1/2 bg-white flex items-center justify-center p-4 sm:p-6 lg:p-8 order-2 lg:order-1">
        <div class="max-w-xl text-center lg:text-left">
          <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-3">
            <span class="text-[#D8127D]">Sei du selbst. sei einzigartig.</span>
          </h1>
          <p class="text-sm sm:text-base md:text-lg lg:text-xl font-light mb-6 text-[#0a3a47]">gestalte ganz frei deinen look. t-shirts, sweatshirts, hoodies und vieles mehr. probier's einfach!</p>
          <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
            <button @click="$emit('navigate', 'CustomizationCreator')" class="btn bg-[#ffd44d] hover:bg-[#ffe28a] text-[#0a3a47] border-2 border-[#ffd44d] text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3">Jetzt gestalten</button>
            <button @click="$emit('navigate', 'Grossbestellung')" class="btn border-2 border-[#D8127D] text-[#D8127D] hover:bg-[#D8127D] hover:text-white text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3">Großbestellung anfragen</button>
          </div>
        </div>
      </div>
      
      <!-- Right side - Video -->
      <div class="w-full lg:w-1/2 relative overflow-hidden h-48 sm:h-64 md:h-80 lg:h-full order-1 lg:order-2">
        <div class="absolute inset-0 bg-black/20 z-10"></div>
        <video 
          class="absolute inset-0 w-full h-full object-cover"
          autoplay 
          loop 
          muted 
          playsinline
          @error="handleVideoError"
        >
          <source src="/assets/Video_PSM.mp4" type="video/mp4">
        </video>
      </div>
    </section>

    <!-- Bestsellers Section -->
    <section class="py-12 bg-white">
      <div class="container mx-auto px-6">
        <div class="flex items-baseline justify-between mb-8">
          <h2 class="text-3xl font-bold">Hot on Socials</h2>
          <button @click="$emit('navigate', 'ReadyToBuy')" class="text-sm text-gray-600 hover:text-[#D8127D]">Alle anzeigen</button>
        </div>
        <div class="relative">
          <div class="overflow-visible">
            <transition-group name="slide" tag="div" class="flex gap-6">
              <div v-for="product in paginatedBestsellers" 
                   :key="product.id" 
                   class="bg-white rounded-xl shadow-md hover:shadow-lg overflow-hidden group flex-shrink-0"
                   :style="{ width: `${100 / productsPerSlide}%` }">
                <div class="relative h-72">
                  <img :src="product.image" :alt="product.name" class="w-full h-full object-cover"
                       @error="handleImageError($event, product.category)">
                  <div class="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button @click.stop="$emit('navigate', 'ProductDetail'); $emit('selectProduct', product)" 
                            class="btn bg-white text-gray-900 shadow">Details anzeigen</button>
                  </div>
                </div>
                <div class="p-4">
                  <h4 class="font-semibold truncate">{{ product.name }}</h4>
                  <p v-if="product.category || product.categoryLabel" class="text-gray-500 text-sm truncate">{{ product.categoryLabel || product.category }}</p>
                  <p class="text-[#D8127D] font-bold">{{ product.price }} €</p>
                </div>
              </div>
            </transition-group>
          </div>
          <!-- Carousel Navigation -->
          <button @click="prevBestsellerPage" 
                  v-if="currentBestsellerPage > 0" 
                  class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none z-10">
            <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <button @click="nextBestsellerPage" 
                  v-if="(currentBestsellerPage + 1) * productsPerSlide < bestsellerProducts.length" 
                  class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none z-10">
            <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </section>

    <!-- Bestseller für Dich Section -->
    <section class="py-12">
      <div class="container mx-auto px-6">
        <div class="flex items-baseline justify-between mb-8">
          <h2 class="text-3xl font-bold">Bestseller für Dich</h2>
          <button @click="$emit('navigate', 'ReadyToBuy')" class="text-sm text-gray-600 hover:text-[#D8127D]">Alle anzeigen</button>
        </div>
        <div class="relative">
          <div class="overflow-visible">
            <transition-group name="slide" tag="div" class="flex gap-6">
              <div v-for="product in paginatedSummerProducts" 
                   :key="product.id" 
                   class="bg-white rounded-xl shadow-md hover:shadow-lg overflow-hidden group flex-shrink-0"
                   :style="{ width: `${100 / productsPerSlide}%` }">
                <div class="relative h-72">
                  <img :src="product.image" :alt="product.name" class="w-full h-full object-cover"
                       @error="handleImageError($event, product.category)">
                  <div class="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button @click.stop="$emit('navigate', 'ProductDetail'); $emit('selectProduct', product)" 
                            class="btn bg-white text-gray-900 shadow">Details anzeigen</button>
                  </div>
                </div>
                <div class="p-4">
                  <h4 class="font-semibold truncate">{{ product.name }}</h4>
                  <p v-if="product.category || product.categoryLabel" class="text-gray-500 text-sm truncate">{{ product.categoryLabel || product.category }}</p>
                  <p class="text-[#D8127D] font-bold">{{ product.price }} €</p>
                </div>
              </div>
            </transition-group>
          </div>
          <!-- Carousel Navigation -->
          <button @click="prevSummerPage" 
                  v-if="currentSummerPage > 0" 
                  class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none z-10">
            <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <button @click="nextSummerPage" 
                  v-if="(currentSummerPage + 1) * productsPerSlide < summerProducts.length" 
                  class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none z-10">
            <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </section>

    

    <!-- For Corporate Clothing Section -->
    <section class="py-16 sm:py-24 bg-gray-100">
      <div class="container mx-auto px-6">
        <div class="flex flex-col md:flex-row items-center gap-12">
          <div class="md:w-1/2 order-2 md:order-1 text-center md:text-left">
            <h2 class="text-3xl font-bold mb-4">Dein professioneller Auftritt: Firmenkleidung</h2>
            <p class="text-lg text-gray-600 mb-6">
              Statte dein Team mit hochwertiger, individuell bedruckter Firmenkleidung aus. Ob T-Shirts, Polos oder Jacken – wir sorgen für einen einheitlichen und professionellen Look.
            </p>
            <button @click="$emit('navigate', 'Grossbestellung')" class="btn btn-primary btn-lg">Jetzt anfragen</button>
          </div>
          <div class="md:w-1/2 order-1 md:order-2">
            <img src="https://images.unsplash.com/photo-1637225999234-eb7da046cb4b?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                 alt="Team in custom corporate t-shirts" 
                 class="rounded-lg shadow-lg w-full h-auto object-cover">
          </div>
        </div>
      </div>
    </section>



    <!-- Why Us? Section -->
    <section class="py-16 sm:py-24">
      <div class="container mx-auto px-6">
        <h2 class="text-3xl font-bold text-center mb-12">Warum private-shirt.de?</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="feature in features" :key="feature.title" class="text-center p-6">
            <div class="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 mx-auto mb-4">
              <svg v-html="feature.icon" class="h-8 w-8 feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"></svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">{{ feature.title }}</h3>
            <p class="text-gray-600">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>
    <!-- Custom Creator CTA Section -->
    <section class="py-16 sm:py-24 bg-white">
      <div class="container mx-auto px-6">
        <div class="flex flex-col md:flex-row items-center gap-12">
          <div class="md:w-1/2">
            <img src="https://images.unsplash.com/photo-1597374399280-541892788610?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                 alt="Person creating a custom design" 
                 class="rounded-lg shadow-lg w-full h-auto object-cover">
          </div>
          <div class="md:w-1/2 text-center md:text-left">
            <h2 class="text-3xl font-bold mb-4">Gestalte deine eigene Kleidung</h2>
            <p class="text-lg text-gray-600 mb-6">
              Lass deiner Kreativität freien Lauf! Mit unserem einfachen Online-Creator kannst du T-Shirts, Hoodies, Tassen und mehr mit deinen eigenen Designs, Texten und Bildern gestalten.
            </p>
            <button @click="$emit('navigate', 'CustomizationCreator')" class="btn btn-primary btn-lg">Jetzt gestalten</button>
          </div>
        </div>
      </div>
    </section>
    <!-- Trust & Reviews Section -->
    <section class="py-16 sm:py-24 bg-gradient-to-br from-gray-50 to-white">
      <div class="container mx-auto px-6">
        <!-- Header -->
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Unsere Kunden vertrauen uns</h2>
          <div class="flex justify-center items-center gap-4 mb-6">
            <div class="flex text-yellow-400 text-3xl">
              <span>★★★★☆</span>
            </div>
            <div class="text-left">
              <div class="text-2xl font-bold text-gray-900">4.7/5</div>
              <div class="text-sm text-gray-600">Google Bewertungen</div>
            </div>
          </div>
         
        </div>

      

        <!-- Featured Reviews Slideshow -->
        <div class="mb-16">
          <h3 class="text-2xl font-bold text-center mb-8">Was unsere Kunden sagen</h3>
          <div class="relative">
            <div class="overflow-hidden">
              <transition-group name="slide" tag="div" class="flex">
                <div v-for="review in visibleReviews" 
                     :key="review.id" 
                     class="flex-shrink-0"
                     :style="{ width: `${100 / 3}%`, padding: '0 0.75rem' }">
                  <div class="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                    <div class="flex items-center mb-4">
                      <div class="w-12 h-12 bg-gradient-to-br from-[#D8127D] to-[#b30f68] rounded-full flex items-center justify-center text-white font-bold mr-4">
                        {{ review.authorInitials }}
                      </div>
                      <div>
                        <h4 class="font-semibold text-gray-900">{{ review.author }}</h4>
                        <div class="flex items-center">
                          <span class="text-yellow-400 text-sm mr-2">★★★★★</span>
                          <span class="text-sm text-gray-600">{{ review.date }}</span>
                        </div>
                      </div>
                    </div>
                    <p class="text-gray-700 leading-relaxed">"{{ review.text }}"</p>
                  </div>
                </div>
              </transition-group>
            </div>
            <!-- Navigation Buttons -->
            <button @click="prevReviewsPage" 
                    v-if="currentReviewsPage > 0" 
                    class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none z-10">
              <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <button @click="nextReviewsPage" 
                    v-if="(currentReviewsPage + 1) * 3 < featuredReviews.length" 
                    class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none z-10">
              <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="flex justify-center gap-4">
            <a href="https://www.google.com/search?q=private-shirt.de+reviews" target="_blank" rel="noopener" class="btn bg-[#D8127D] text-white hover:bg-[#b30f68]">
              Alle Reviews ansehen
            </a>
            <a href="https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4" target="_blank" rel="noopener" class="btn border-2 border-[#D8127D] text-[#D8127D] hover:bg-[#D8127D] hover:text-white">
              Review schreiben
            </a>
          </div>
      </div>
    </section>

    
    <!-- Store Locations Section -->
    <section id="locations-section" class="py-16 sm:py-24 bg-gray-50">
      <div class="container mx-auto px-6 text-center">
        <!-- New Pin Needle SVG -->
        <div class="mb-8">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="mx-auto text-[#FFC72C]">
            <path d="M40 0C21.2 0 6 15.2 6 34C6 58 40 80 40 80C40 80 74 58 74 34C74 15.2 58.8 0 40 0ZM40 46C33.488 46 28 40.512 28 34C28 27.488 33.488 22 40 22C46.512 22 52 27.488 52 34C52 40.512 46.512 46 40 46Z" fill="currentColor"/>
          </svg>
        </div>

        <h2 class="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8 relative inline-block leading-tight">
          Zuhause, wo du es bist
          <span class="block absolute -bottom-3 left-0 w-full h-2 bg-[#D8127D] transform skew-x-12 opacity-75"></span>
        </h2>
        
        <!-- Service Description -->
        <div class="max-w-4xl mx-auto mb-12">
          <p class="text-lg text-gray-700 leading-relaxed mb-4">
            Ob online oder in unseren Shops, wir sind überall für Sie da.
          </p>
          <p class="text-lg text-gray-700 leading-relaxed mb-4">
            Wir garantieren Ihnen qualitativ hochwertige Produkte und top Kundenservice für Ihre individuellen Ideen. Rufen Sie uns an oder schreiben Sie uns eine E-Mail. Wir freuen uns.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <!-- Europa Passage Store -->
          <div class="bg-white rounded-lg shadow-md border border-gray-200 text-left overflow-hidden">
            <!-- Image -->
            <div>
              <img src="/assets/20210421_001_Private_Shirt_Hamburg.webp" 
                   alt="Europa Passage Storefront" 
                   class="w-full h-48 object-cover">
            </div>
            
            <!-- Content -->
            <div class="p-8">
              <!-- Text Content -->
              <div class="mb-6">
                <h3 class="text-2xl font-bold text-[#D8127D] mb-4">Europa Passage</h3>
                <p class="text-gray-600 mb-4">
                  <a href="https://maps.google.com/?q=Ballindamm 40, 20095 Hamburg" target="_blank" class="text-[#D8127D] hover:underline">
                    Ballindamm 40, 20095 Hamburg
                  </a>
                </p>
                
                <p class="text-gray-700 mb-2"><span class="font-semibold">Tel:</span> <a href="tel:+494032873804" class="text-[#D8127D] hover:underline">040 328 738 04</a></p>
                <p class="text-gray-700 mb-2"><span class="font-semibold">Fax:</span> 040 328 738 15</p>
                <p class="text-gray-700"><span class="font-semibold">E-Mail:</span> <a href="mailto:europa-passage@private-shirt.de" class="text-[#D8127D] hover:underline">europa-passage@private-shirt.de</a></p>
              </div>
              
              <!-- Map -->
              <div>
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2368.5!2d9.78016789726562!3d53.5523408!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b18f1dc6346d17%3A0xb2e7e85ab405c7a7!2sPrivate%20Shirt!5e1!3m2!1sen!2sde!4v1760116099275!5m2!1sen!2sde" 
                  width="100%" 
                  height="200" 
                  style="border:0; border-radius: 0.5rem;" 
                  allowfullscreen="" 
                  loading="lazy" 
                  referrerpolicy="no-referrer-when-downgrade">
                </iframe>
              </div>
            </div>
          </div>

          <!-- Altona Store -->
          <div class="bg-white rounded-lg shadow-md border border-gray-200 text-left overflow-hidden">
            <!-- Image -->
            <div>
              <img src="/assets/20201123_193242.webp" 
                   alt="Altona Storefront" 
                   class="w-full h-48 object-cover">
            </div>
            
            <!-- Content -->
            <div class="p-8">
              <!-- Text Content -->
              <div class="mb-6">
                <h3 class="text-2xl font-bold text-[#D8127D] mb-4">Mercado Altona</h3>
                <p class="text-gray-600 mb-4">
                  <a href="https://maps.google.com/?q=Ottenser Hauptstraße 10, 22765 Hamburg" target="_blank" class="text-[#D8127D] hover:underline">
                    Ottenser Hauptstraße 10, 22765 Hamburg
                  </a>
                </p>
                
                <p class="text-gray-700 mb-2"><span class="font-semibold">Tel:</span> <a href="tel:+494039907778" class="text-[#D8127D] hover:underline">040 399 077 78</a></p>
                <p class="text-gray-700 mb-2"><span class="font-semibold">Fax:</span> 040 399 081 16</p>
                <p class="text-gray-700"><span class="font-semibold">E-Mail:</span> <a href="mailto:altona@private-shirt.de" class="text-[#D8127D] hover:underline">altona@private-shirt.de</a></p>
              </div>
              
              <!-- Map -->
              <div>
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2368.5!2d9.951268743417247!3d53.54566741283561!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b18585ff23b8bb%3A0x3a3a59770b6ae2fa!2sPrivate%20Shirt%20Hamburg%20Altona!5e1!3m2!1sen!2sde!4v1760116056355!5m2!1sen!2sde" 
                  width="100%" 
                  height="200" 
                  style="border:0; border-radius: 0.5rem;" 
                  allowfullscreen="" 
                  loading="lazy" 
                  referrerpolicy="no-referrer-when-downgrade">
                </iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>

import { ref, computed } from 'vue'



// Props
const props = defineProps({
  readyToBuyProducts: {
    type: Array,
    default: () => []
  }
})

// Emits
const emit = defineEmits(['navigate', 'selectProduct'])

// State
const productsPerSlide = ref(3)
const currentBestsellerPage = ref(0)
const currentSummerPage = ref(0)
const currentTopCustomersPage = ref(0)
const currentReviewsPage = ref(0)


// Computed
const bestsellerProducts = computed(() => props.readyToBuyProducts.filter(p => p.tags.includes('bestseller')))
const summerProducts = computed(() => props.readyToBuyProducts.filter(p => p.tags.includes('summer')))
const paginatedBestsellers = computed(() => {
  const start = currentBestsellerPage.value * productsPerSlide.value
  const end = start + productsPerSlide.value
  return bestsellerProducts.value.slice(start, end)
})
const paginatedSummerProducts = computed(() => {
  const start = currentSummerPage.value * productsPerSlide.value
  const end = start + productsPerSlide.value
  return summerProducts.value.slice(start, end)
})

// Top Customers Slideshow
const visibleTopCustomers = computed(() => {
  const start = currentTopCustomersPage.value * 4
  const end = start + 4
  return topCustomers.value.slice(start, end)
})

// Reviews Slideshow
const visibleReviews = computed(() => {
  const start = currentReviewsPage.value * 3
  const end = start + 3
  return featuredReviews.value.slice(start, end)
})

// Icons from Lucide (lucide.dev) - using raw SVG paths
const features = ref([
  { title: 'Premiumdruck ab 1 Stück', description: 'Keine Mindestbestellmenge. Perfekt für Einzelstücke und Geschenke.', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>' },
  { title: 'Nachhaltige Textilien', description: 'Wir setzen auf Bio-Baumwolle und umweltfreundliche Materialien.', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343m11.314 11.314a8 8 0 00-11.314-11.314"/>' },
  { title: 'Versand in 2–4 Tagen', description: 'Schnelle Produktion und Lieferung mit unseren zuverlässigen Partnern.', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>' },
  { title: 'Made in Hamburg, Germany', description: 'Druck und Veredelung finden direkt bei uns in Deutschland statt.', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M4 17v4M2 19h4M17 3v4M15 5h4M16 17v4M14 19h4"/>' }
])

// Top Customers Data
const topCustomers = ref([
  { id: 1, name: 'Hamburg Startups', logo: 'https://www.peopleplan.eu/wp-content/uploads/sites/6/2023/01/Hochbahn-2.png' },
  { id: 2, name: 'Event Masters', logo: 'https://app.tradersclub24.de/wp-content/uploads/2023/09/Hapag_lloyd_logo.png' },
  { id: 3, name: 'TechCorp GmbH', logo: 'https://espressohouse.zendesk.com/hc/theming_assets/01HZPM9NQSV96Y55Z1PZM2S2Y6' },
  { id: 4, name: 'Creative Agency', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiVzAKXb_clXNwslAGqeZfH_dHmFyYZeUg7A&s' },
  { id: 5, name: 'Sports Club', logo: 'https://espressohouse.zendesk.com/hc/theming_assets/01HZPM9NQSV96Y55Z1PZM2S2Y6' },
  { id: 6, name: 'University Hamburg', logo: 'https://espressohouse.zendesk.com/hc/theming_assets/01HZPM9NQSV96Y55Z1PZM2S2Y6' },
])

// Featured Reviews Data
const featuredReviews = ref([
  {
    id: 1,
    author: 'Jörg Baumann',
    authorInitials: 'JB',
    date: 'Juli 2025',
    text: 'Absolut begeistert von der Qualität und dem schnellen Versand! Mein Team-Hoodie sieht fantastisch aus. Jederzeit wieder!'
  },
  {
    id: 2,
    author: 'Christian Ippendorf',
    authorInitials: 'CI',
    date: 'Juni 2023',
    text: 'Super freundliches Personal, man nimmt sich Zeit für den Kunden und wenn die passende Größe nicht da ist, ruft man in der anderen Filiale an und fragt nach ob sie dort vorrätig ist. Ich kann es nur empfehlen und es ging auch fix, man konnte das T Shirt direkt am nächsten holen. Nochmal vielen Dank.'
  },
  {
    id: 3,
    author: 'Helmut Burger',
    authorInitials: 'HB',
    date: 'Juni 2025',
    text: 'Beim Shoppen sind wir am Geschäft vorbeigekommen und haben uns spontan überlegt für einen besonderen Anlass kurzfristig Shirts mit eigenem Aufdruck bedrucken zu lassen.'
    },
])

// Methods
const handleImageError = (event, category) => {
  const fallbackImages = {
    't-shirts': 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop',
    'hoodies': 'https://images.unsplash.com/photo-1556156026-e01c89f5f19c?q=80&w=800&auto=format&fit=crop',
    'tassen': 'https://images.unsplash.com/photo-1594225019830-798c8a1fe4a0?q=80&w=800&auto=format&fit=crop',
    'stofftaschen': 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop',
    'caps': 'https://images.unsplash.com/photo-1521369909049-ecaf380c8536?q=80&w=800&auto=format&fit=crop',
    'clothing': 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=800&auto=format&fit=crop',
    'accessories': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop'
  }
  event.target.src = fallbackImages[category] || fallbackImages.clothing
}

const handleLogoError = (event) => {
  // Replace with a placeholder logo or initials
  const customerName = event.target.alt.replace(' Logo', '')
  const initials = customerName.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase()
  
  // Create a fallback div with initials
  const fallbackDiv = document.createElement('div')
  fallbackDiv.className = 'w-28 h-28 mx-auto mb-4 bg-gradient-to-br from-[#D8127D] to-[#b30f68] rounded-full flex items-center justify-center text-white font-bold text-lg'
  fallbackDiv.textContent = initials
  
  // Replace the img with the fallback div
  event.target.parentElement.replaceChild(fallbackDiv, event.target)
}

const handleVideoError = (event) => {
  // Replace video with a fallback image
  const videoContainer = event.target.parentElement
  const fallbackImage = document.createElement('img')
  fallbackImage.src = 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=800&auto=format&fit=crop'
  fallbackImage.className = 'absolute inset-0 w-full h-full object-cover'
  videoContainer.replaceChild(fallbackImage, event.target)
}

// Carousel Navigation Methods
const nextBestsellerPage = () => {
  const maxPage = Math.ceil(bestsellerProducts.value.length / productsPerSlide.value) - 1
  if (currentBestsellerPage.value < maxPage) {
    currentBestsellerPage.value++
  }
}

const prevBestsellerPage = () => {
  if (currentBestsellerPage.value > 0) {
    currentBestsellerPage.value--
  }
}

const nextSummerPage = () => {
  const maxPage = Math.ceil(summerProducts.value.length / productsPerSlide.value) - 1
  if (currentSummerPage.value < maxPage) {
    currentSummerPage.value++
  }
}

const prevSummerPage = () => {
  if (currentSummerPage.value > 0) {
    currentSummerPage.value--
  }
}

// Top Customers Slideshow Navigation
const nextTopCustomersPage = () => {
  const maxPage = Math.ceil(topCustomers.value.length / 4) - 1
  if (currentTopCustomersPage.value < maxPage) {
    currentTopCustomersPage.value++
  }
}

const prevTopCustomersPage = () => {
  if (currentTopCustomersPage.value > 0) {
    currentTopCustomersPage.value--
  }
}

// Reviews Slideshow Navigation
const nextReviewsPage = () => {
  const maxPage = Math.ceil(featuredReviews.value.length / 3) - 1
  if (currentReviewsPage.value < maxPage) {
    currentReviewsPage.value++
  }
}

const prevReviewsPage = () => {
  if (currentReviewsPage.value > 0) {
    currentReviewsPage.value--
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
.btn-secondary {
  @apply bg-[#D8127D] text-white hover:bg-[#b30f68] focus:ring-[#b30f68];
}
.btn-primary-inverted {
   @apply bg-white text-[#D8127D] hover:bg-pink-50 focus:ring-[#D8127D];
}

/* Carousel Transitions */
.slide-enter-active, .slide-leave-active {
  transition: all 0.5s ease;
}
.slide-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.slide-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}
.slide-enter-to, .slide-leave-from {
  opacity: 1;
  transform: translateX(0);
}

/* Base styles for SVGs injected via v-html to ensure they inherit color */
svg {
  stroke: currentColor;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
}

/* Update feature icons to use primary color */
.feature-icon {
  @apply text-[#D8127D];
}

/* Update B2B section background */
.bg-indigo-600 {
  @apply bg-[#D8127D];
}

/* Update hover states */
.hover\:bg-indigo-700:hover {
  @apply hover:bg-[#b30f68];
}

/* Update focus rings */
.focus\:ring-indigo-500:focus {
  @apply focus:ring-[#D8127D];
}
</style>
