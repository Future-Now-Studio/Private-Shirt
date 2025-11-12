<template>
  <div class="container mx-auto px-6 py-12">
    <h1 class="text-4xl font-bold mb-2">Fertige Produkte</h1>
    <p class="text-lg text-gray-600 mb-10">Entdecke unsere Kollektion an fertigen Produkten.</p>
    
    <!-- Category Navigation -->
    <div class="flex space-x-4 mb-8 overflow-x-auto pb-4">
      <button v-for="category in categories" 
              :key="category.id"
              @click="selectedCategory = category.id"
              :class="['px-4 py-2 rounded-lg whitespace-nowrap', 
                      selectedCategory === category.id ? 'bg-[#D8127D] text-white' : 'bg-gray-100']">
        {{ category.name }}
      </button>
    </div>

    <!-- Search and Sort Bar -->
    <div class="bg-white border-b mb-8">
      <div class="container mx-auto px-6 py-4">
        <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
          <!-- Search -->
          <div class="w-full md:w-96">
            <div class="relative">
              <input 
                type="text" 
                v-model="searchQuery"
                @input="debouncedSearch($event.target.value)"
                placeholder="Produkte suchen..." 
                class="w-full pl-10 pr-4 py-2 border rounded-lg focus:border-[#D8127D] focus:ring-1 focus:ring-[#D8127D]"
              >
              <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>

          <!-- Sort -->
          <div class="w-full md:w-64">
            <select 
              v-model="sortBy"
              class="w-full px-4 py-2 border rounded-lg focus:border-[#D8127D] focus:ring-1 focus:ring-[#D8127D]"
            >
              <option v-for="option in sortOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Products Grid -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <template v-if="!isLoading">
        <div v-for="product in filteredReadyToBuyProducts" 
             :key="product.id" 
             class="bg-white rounded-lg shadow-md overflow-hidden group">
          <div class="relative">
            <img :src="product.image" :alt="product.name" class="w-full h-64 object-cover"
                 @error="handleImageError($event, product.category)">
            <div class="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div class="flex flex-col gap-2">
                <button @click.stop="$emit('navigate', 'ProductDetail'); $emit('selectProduct', product)" 
                        class="btn bg-white text-gray-900">
                  Details anzeigen
                </button>
                <button @click.stop="handleAddToCart(product)" 
                        class="btn bg-[#D8127D] text-white">
                  In den Warenkorb
                </button>
              </div>
            </div>
          </div>
          <div class="p-4">
            <h4 class="font-semibold">{{ product.name }}</h4>
            <p class="text-[#D8127D] font-bold">{{ product.price }} €</p>
          </div>
        </div>
      </template>
      <template v-else>
        <!-- Loading Skeleton -->
        <div v-for="n in 8" :key="n" class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="animate-pulse">
            <div class="bg-gray-200 h-64"></div>
            <div class="p-4">
              <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div class="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Pagination -->
    <div class="flex justify-center space-x-2 mt-8">
      <button 
        v-for="page in totalPages" 
        :key="page"
        @click="currentPageNumber = page"
        :class="[
          'px-4 py-2 rounded-lg',
          currentPageNumber === page 
            ? 'bg-[#D8127D] text-white' 
            : 'bg-gray-100 hover:bg-gray-200'
        ]"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// Props
const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  },
  readyToBuyProducts: {
    type: Array,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  totalPages: {
    type: Number,
    default: 1
  }
})

// Emits
const emit = defineEmits(['navigate', 'selectProduct', 'addToCart'])

// State
const selectedCategory = ref('all')
const searchQuery = ref('')
const debouncedSearchQuery = ref('')
const sortBy = ref('menu_order')
const currentPageNumber = ref(1)

const sortOptions = [
  { value: 'menu_order', label: 'Standard' },
  { value: 'popularity', label: 'Beliebtheit' },
  { value: 'date', label: 'Neueste' },
  { value: 'price', label: 'Preis: Niedrig zu Hoch' },
  { value: 'price-desc', label: 'Preis: Hoch zu Niedrig' }
]

// Debounce function
const debounce = (fn, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

// Create debounced search function
const debouncedSearch = debounce((value) => {
  debouncedSearchQuery.value = value
}, 300)

// Computed
const filteredReadyToBuyProducts = computed(() => {
  if (selectedCategory.value === 'all') return props.readyToBuyProducts
  return props.readyToBuyProducts.filter(product => product.category === selectedCategory.value)
})

// Methods
const handleAddToCart = (product) => {
  emit('addToCart', product)
  alert('Produkt wurde zum Warenkorb hinzugefügt!')
}

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

// Watch for changes in search, sort, or pagination
watch([debouncedSearchQuery, sortBy, currentPageNumber], () => {
  // Emit event to parent to handle data fetching
  emit('updateFilters', {
    search: debouncedSearchQuery.value,
    sort: sortBy.value,
    page: currentPageNumber.value,
    category: selectedCategory.value
  })
})
</script>

<style scoped>
.btn {
  @apply inline-block px-6 py-3 rounded-lg font-semibold text-center transition duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2;
}
</style>
