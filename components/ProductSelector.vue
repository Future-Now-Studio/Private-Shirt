<template>
  <div>
        <!-- Hero Section -->
        <section class="bg-white">
          <div class="container mx-auto px-6 py-8 text-center">
            <h1 class="text-3xl font-extrabold tracking-tight mb-2">Wähle dein Produkt</h1>
            <p class="text-gray-600 mb-4">Wähle aus unseren Kategorien das perfekte Produkt für dein Design.</p>
        
      </div>
    </section>

        <!-- Categories and Products -->
        <section class="bg-gray-50">
          <div class="container mx-auto px-6 py-6">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#D8127D]"></div>
          <p class="mt-4 text-gray-600">Lade Produkte...</p>
        </div>

            <!-- Categories -->
            <div v-else class="space-y-8">
              <div v-for="category in categoriesWithProducts" :key="category.id" class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <!-- Horizontal Layout: Category Title Left, Products Slider Right -->
                <div class="flex flex-col lg:flex-row">
                  <!-- Category Info (Left side) -->
                  <div class="lg:w-64 bg-gray-100 p-6 flex-shrink-0">
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ category.name }}</h2>
                    <p class="text-gray-600 text-sm">{{ category.description || 'Entdecke unsere ' + category.name.toLowerCase() }}</p>
                  </div>

                  <!-- Products Slider (Right side) -->
                  <div class="flex-1 p-6">
                    <div class="relative">
                      <!-- Slider Container -->
                      <div class="overflow-hidden">
                        <div 
                          ref="sliderContainer"
                          class="flex transition-transform duration-300 ease-in-out"
                          :style="{ transform: `translateX(-${currentSlide * slideWidth}px)` }"
                        >
                          <div 
                            v-for="product in category.products" 
                            :key="product.id"
                            class="flex-shrink-0 mr-6 cursor-pointer group"
                            :style="{ width: slideWidth + 'px' }"
                            @click="selectProduct(product)"
                          >
                            <!-- Product Image - More Prominent -->
                            <div class="relative mb-3">
                              <img 
                                :src="product.image" 
                                :alt="product.name" 
                                class="w-full h-64 object-contain bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-200"
                                :class="{ 'ring-2 ring-[#D8127D] shadow-lg': selectedProduct?.id === product.id }"
                                @error="handleImageError"
                              >
                              <!-- Selection Badge -->
                              <div v-if="selectedProduct?.id === product.id" class="absolute top-3 right-3 bg-[#D8127D] text-white rounded-full p-2 shadow-lg">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                                </svg>
                              </div>
                            </div>

                            <!-- Product Info -->
                            <div class="text-center group-hover:bg-gray-50 rounded-lg p-2 transition-colors duration-200">
                              <h3 class="font-semibold text-gray-900 mb-2 text-sm line-clamp-2 group-hover:text-[#D8127D] transition-colors duration-200">{{ product.name }}</h3>
                              <div class="text-lg font-bold text-[#D8127D] group-hover:text-[#b30f68] transition-colors duration-200">
                                {{ formatPrice(product.price) }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Navigation Arrows -->
                      <button 
                        v-if="category.products.length > visibleSlides"
                        @click="previousSlide(category.id)"
                        class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full shadow-lg p-2 hover:bg-gray-50 transition"
                      >
                        <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                        </svg>
                      </button>
                      <button 
                        v-if="category.products.length > visibleSlides"
                        @click="nextSlide(category.id)"
                        class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full shadow-lg p-2 hover:bg-gray-50 transition"
                      >
                        <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- No Products Message -->
            <div v-if="!loading && categoriesWithProducts.length === 0" class="text-center py-16">
              <div class="bg-white rounded-xl shadow-lg p-12 max-w-md mx-auto">
                <div class="text-gray-400 mb-6">
                  <svg class="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                  </svg>
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-3">Keine Designer-Produkte gefunden</h3>
                <p class="text-gray-600 mb-6">Es sind derzeit keine Designer-Produkte verfügbar. Bitte versuchen Sie es später erneut.</p>
                <button 
                  @click="loadData"
                  class="btn bg-[#D8127D] hover:bg-[#b30f68] text-white px-8 py-3 rounded-lg font-semibold transition"
                >
                  Erneut laden
                </button>
              </div>
            </div>
          </div>
        </section>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useWooCommerce } from '~/composables/useWooCommerce.js'

// Emits
const emit = defineEmits(['productSelected', 'proceedToCustomization'])

// WooCommerce
const { wooService, formatProduct } = useWooCommerce()

// State
const loading = ref(false)
const products = ref([])
const categories = ref([])
const selectedProduct = ref(null)

// Slider state
const currentSlide = ref(0)
const slideWidth = ref(240) // Width of each product card
const visibleSlides = ref(4) // Number of slides visible at once
const sliderContainer = ref(null)

// Computed
const categoriesWithProducts = computed(() => {
  console.log('Categories:', categories.value)
  console.log('Products:', products.value)
  
  const result = categories.value.map(category => {
    const categoryProducts = products.value.filter(product => {
      const hasCategory = product.categories?.some(cat => cat.id === category.id)
      const hasDesignerTag = product.tags?.includes('designer')
      console.log(`Product ${product.name}: hasCategory=${hasCategory}, hasDesignerTag=${hasDesignerTag}, categories=`, product.categories, 'tags=', product.tags)
      return hasCategory && hasDesignerTag
    })
    
    return {
      ...category,
      products: categoryProducts
    }
  }).filter(category => category.products.length > 0)
  
  console.log('Categories with products:', result)
  return result
})

// Methods
const loadData = async () => {
  loading.value = true
  try {
    // Load categories and products in parallel
    const [categoriesData, productsData] = await Promise.all([
      wooService.fetchCategories(),
      wooService.fetchAllProducts()
    ])
    
    console.log('Raw categories data:', categoriesData)
    console.log('Raw products data:', productsData)
    
    // Debug first product to see price structure
    if (productsData.length > 0) {
      console.log('First product raw data:', productsData[0])
      console.log('First product price field:', productsData[0].price)
      console.log('First product price_html field:', productsData[0].price_html)
      console.log('First product regular_price field:', productsData[0].regular_price)
      console.log('First product sale_price field:', productsData[0].sale_price)
    }
    
    categories.value = categoriesData
    products.value = productsData.map(formatProduct)
    
    console.log('Formatted categories:', categories.value)
    console.log('Formatted products:', products.value)
  } catch (error) {
    console.error('Error loading data:', error)
    // Show error message to user
    alert('Fehler beim Laden der Produkte. Bitte versuchen Sie es später erneut.')
  } finally {
    loading.value = false
  }
}

const selectProduct = (product) => {
  selectedProduct.value = product
  emit('productSelected', product)
  // Automatically proceed to customization step
  emit('proceedToCustomization', product)
}

// Slider navigation methods
const nextSlide = (categoryId) => {
  const category = categoriesWithProducts.value.find(cat => cat.id === categoryId)
  if (!category) return
  
  const maxSlide = Math.max(0, category.products.length - visibleSlides.value)
  if (currentSlide.value < maxSlide) {
    currentSlide.value++
  }
}

const previousSlide = (categoryId) => {
  if (currentSlide.value > 0) {
    currentSlide.value--
  }
}

// Update visible slides based on screen size
const updateVisibleSlides = () => {
  if (typeof window === 'undefined') return
  
  const width = window.innerWidth
  if (width < 640) {
    visibleSlides.value = 1
    slideWidth.value = 240
  } else if (width < 768) {
    visibleSlides.value = 2
    slideWidth.value = 240
  } else if (width < 1024) {
    visibleSlides.value = 3
    slideWidth.value = 240
  } else {
    visibleSlides.value = 4
    slideWidth.value = 240
  }
}



const handleImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/300x300/f3f4f6/9ca3af?text=Kein+Bild'
}

const formatPrice = (price) => {
  console.log('Raw price from API:', price, 'Type:', typeof price)
  
  if (!price || price === '') {
    console.log('Price is empty or null')
    return '0.00 €'
  }
  
  // Convert to number if it's a string
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price
  
  console.log('Parsed numeric price:', numericPrice)
  
  if (isNaN(numericPrice)) {
    console.log('Price is NaN')
    return '0.00 €'
  }
  
  // Format with 2 decimal places and Euro symbol
  const formattedPrice = `${numericPrice.toFixed(2)} €`
  console.log('Formatted price:', formattedPrice)
  return formattedPrice
}

// Initialize on mount
onMounted(async () => {
  await loadData()
  updateVisibleSlides()
  
  // Add resize listener
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', updateVisibleSlides)
  }
})

// Cleanup on unmount
onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateVisibleSlides)
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.btn {
  @apply inline-flex items-center justify-center transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D8127D];
}
</style>
