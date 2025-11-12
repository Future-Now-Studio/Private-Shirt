<template>
  <div class="bg-gray-50 min-h-screen font-sans text-gray-800">
    <!-- Notification Bar -->
    <NotificationBar />

    <!-- Header & Navigation -->
    <Header 
      :cartItemCount="cartItemCount"
      @navigate="handleNavigation"
      @toggleCart="isCartOpen = !isCartOpen"
    />

    <main>
      <!-- Page Content - Dynamically rendered based on `currentPage` -->
      <transition name="fade" mode="out-in">
        <div :key="currentPage">
          
          <!-- HOME PAGE -->
          <HomePage 
            v-if="currentPage === 'Home'"
            :readyToBuyProducts="readyToBuyProducts"
            @navigate="handleNavigation"
            @selectProduct="handleSelectProduct"
          />

          <!-- READY TO BUY PAGE -->
          <ReadyToBuyPage 
            v-if="currentPage === 'ReadyToBuy'"
            :categories="categories"
            :readyToBuyProducts="readyToBuyProducts"
            :isLoading="isLoading"
            :totalPages="totalPages"
            @navigate="handleNavigation"
            @selectProduct="handleSelectProduct"
            @addToCart="addToCart"
            @updateFilters="handleUpdateFilters"
          />

          <!-- CUSTOMIZABLE PRODUCTS PAGE -->
          <CustomizationCreatorPage 
            v-if="currentPage === 'CustomizationCreator'"
            :categories="categories"
            :customizableProducts="customizableProducts"
            @navigate="handleNavigation"
            @selectProduct="handleSelectProduct"
          />

          <!-- PRODUCT DETAIL PAGE -->
          <div v-if="currentPage === 'ProductDetail'">
            <div v-if="selectedProduct">
              <ProductDetailPage 
                :selectedProduct="selectedProduct"
                @navigate="handleNavigation"
                @addToCart="addToCart"
              />
            </div>
            <div v-else class="container mx-auto px-6 py-24 text-center">
              <h1 class="text-4xl font-bold mb-4">Produkt nicht gefunden</h1>
              <p class="text-lg text-gray-600 mb-8">Das ausgewählte Produkt konnte nicht geladen werden.</p>
              <button @click="handleNavigation('Home')" class="btn btn-primary">Zurück zur Startseite</button>
            </div>
          </div>

          <!-- GROSSBESTELLUNG PAGE -->
          <GrossbestellungPage 
            v-if="currentPage === 'Grossbestellung'"
          />

          <!-- UNTERNEHMEN PAGE -->
          <UnternehmenPage 
            v-if="currentPage === 'Unternehmen'"
            @navigate="handleNavigation"
          />

          <!-- LEISTUNGEN PAGE -->
          <LeistungenPage 
            v-if="currentPage === 'Leistungen'"
            @navigate="handleNavigation"
          />


          <!-- CHECKOUT PAGE -->
          <CheckoutPage 
            v-if="currentPage === 'Checkout'"
            :cart="cart"
            @completeOrder="handleCompleteOrder"
          />

          <!-- ORDER CONFIRMATION PAGE -->
          <OrderConfirmationPage 
            v-if="currentPage === 'OrderConfirmation'"
            @navigate="handleNavigation"
          />

          <!-- CREATOR PROGRAM PAGE -->
          <Creator 
            v-if="currentPage === 'Creator'"
          />

          <!-- OTHER PAGES (Placeholders) -->
          <div v-if="!['Home', 'ReadyToBuy', 'CustomizationCreator', 'Creator', 'ProductDetail', 'Grossbestellung', 'Unternehmen', 'Leistungen', 'Checkout', 'OrderConfirmation'].includes(currentPage)">
            <div class="container mx-auto px-6 py-24 text-center">
              <h1 class="text-4xl font-bold mb-4">{{ currentPage }}</h1>
              <p class="text-lg text-gray-600">Diese Seite befindet sich im Aufbau.</p>
              <button @click="handleNavigation('Home')" class="btn btn-primary mt-8">Zurück zur Startseite</button>
            </div>
          </div>

        </div>
      </transition>
    </main>

    <!-- Footer -->
    <Footer />

    <!-- Cart Sidebar -->
    <Cart 
      :isOpen="isCartOpen"
      :cart="cart"
      :savedForLater="savedForLater"
      :recentlyViewed="recentlyViewed"
      @close="isCartOpen = false"
      @navigate="handleNavigation"
      @updateCart="updateCartItemQuantity"
      @removeFromCart="removeFromCart"
      @moveToSavedForLater="moveToSavedForLater"
      @moveToCart="moveToCart"
      @addToCart="addToCart"
      @proceedToCheckout="proceedToCheckout"
    />

    <!-- Live Chat Icon (UI Only) -->
    <div class="fixed bottom-5 right-5 z-50">
      <button class="bg-[#D8127D] text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-[#b30f68] transition">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
      </button>
    </div>

    <!-- Add loading state -->
    <div v-if="isLoading" class="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-[#D8127D] border-t-transparent mx-auto"></div>
        <p class="mt-4 text-gray-600">Lade Produkte...</p>
      </div>
    </div>

    <!-- Add error state -->
    <div v-if="error" class="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="text-center p-8 bg-white rounded-lg shadow-lg">
        <svg class="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <h3 class="text-lg font-semibold mb-2">Fehler beim Laden</h3>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <button @click="initializeData" class="btn bg-[#D8127D] text-white">
          Erneut versuchen
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useCart } from '~/composables/useCart.js'
import NotificationBar from '~/components/NotificationBar.vue'
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'
import Cart from '~/components/Cart.vue'
import Creator from '~/components/Creator.vue'
import HomePage from '~/pages/index.vue'
import ReadyToBuyPage from '~/pages/ready-to-buy.vue'
import CustomizationCreatorPage from '~/pages/customization-creator.vue'
import ProductDetailPage from '~/pages/product-detail.vue'
import GrossbestellungPage from '~/pages/grossbestellung.vue'
import CheckoutPage from '~/pages/checkout.vue'
import OrderConfirmationPage from '~/pages/order-confirmation.vue'
import UnternehmenPage from '~/pages/unternehmen.vue'
import LeistungenPage from '~/pages/leistungen.vue'

// WooCommerce API Configuration
const WOO_CONFIG = {
  baseUrl: 'https://timob10.sg-host.com/wp-json/wc/v3',
  consumerKey: 'ck_17e70b1dcd1b0d0aab92da0c8ac7bda10a280827',
  consumerSecret: 'cs_e7d6fe86192848c4d06c5b0eb4692d32d2b42a50'
}

// Use cart composable
const {
  cart,
  savedForLater,
  recentlyViewed,
  cartTotal,
  cartItemCount,
  shippingCost,
  remainingForFreeShipping,
  freeShippingProgress,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
  moveToSavedForLater,
  moveToCart,
  addToRecentlyViewed,
  loadCartData
} = useCart()

// State
const currentPage = ref('Home')
const selectedProduct = ref(null)
const isCartOpen = ref(false)

// Data
const categories = ref([])
const readyToBuyProducts = ref([])
const customizableProducts = ref([])
const isLoading = ref(true)
const error = ref(null)

// Pagination
const currentPageNumber = ref(1)
const itemsPerPage = ref(12)
const totalProducts = ref(0)

// WooCommerce API Service
const wooService = {
  async fetchCategories() {
    try {
      const response = await fetch(
        `${WOO_CONFIG.baseUrl}/products/categories?per_page=100`,
        {
          headers: {
            'Authorization': 'Basic ' + btoa(`${WOO_CONFIG.consumerKey}:${WOO_CONFIG.consumerSecret}`)
          }
        }
      )
      if (!response.ok) throw new Error('Failed to fetch categories')
      return await response.json()
    } catch (err) {
      console.error('Error fetching categories:', err)
      throw err
    }
  },

  async fetchAllProducts(params = {}) {
    let allProducts = []
    let page = 1
    let totalPages = 1
    do {
      const queryParams = new URLSearchParams({
        per_page: 100, // max allowed by WooCommerce
        page,
        ...params
      }).toString()
      const response = await fetch(
        `${WOO_CONFIG.baseUrl}/products?${queryParams}`,
        {
          headers: {
            'Authorization': 'Basic ' + btoa(`${WOO_CONFIG.consumerKey}:${WOO_CONFIG.consumerSecret}`)
          }
        }
      )
      if (!response.ok) throw new Error('Failed to fetch products')
      const products = await response.json()
      allProducts = allProducts.concat(products)
      totalPages = parseInt(response.headers.get('X-WP-TotalPages')) || 1
      page++
    } while (page <= totalPages)
    return allProducts
  },

  async fetchProduct(id) {
    try {
      const response = await fetch(
        `${WOO_CONFIG.baseUrl}/products/${id}`,
        {
          headers: {
            'Authorization': 'Basic ' + btoa(`${WOO_CONFIG.consumerKey}:${WOO_CONFIG.consumerSecret}`)
          }
        }
      )
      if (!response.ok) throw new Error('Failed to fetch product')
      return await response.json()
    } catch (err) {
      console.error('Error fetching product:', err)
      throw err
    }
  }
}

// Computed properties
const totalPages = computed(() => {
  return Math.ceil(totalProducts.value / itemsPerPage.value)
})

// Initialize Data
const initializeData = async () => {
  try {
    isLoading.value = true
    // Fetch categories
    const wooCategories = await wooService.fetchCategories()
    categories.value = [
      { id: 'all', name: 'Alle Kategorien' },
      ...wooCategories.map(cat => ({
        id: cat.id.toString(),
        name: cat.name,
        image: cat.image?.src || '/assets/placeholder.jpg'
      }))
    ]

    // Fetch all products
    const products = await wooService.fetchAllProducts()
    totalProducts.value = products.length
    // Separate products into ready-to-buy and customizable
    readyToBuyProducts.value = products
      .filter(product => !product.meta_data?.some(meta => meta.key === '_customizable' && meta.value === 'yes'))
      .map(formatProduct)

    customizableProducts.value = products
      .filter(product => product.meta_data?.some(meta => meta.key === '_customizable' && meta.value === 'yes'))
      .map(formatProduct)

  } catch (err) {
    error.value = err.message
    console.error('Error initializing data:', err)
  } finally {
    isLoading.value = false
  }
}

// Format product data from WooCommerce
const formatProduct = (product) => {
  const customizable = product.meta_data?.some(meta => meta.key === '_customizable' && meta.value === 'yes')
  
  // Get category name for fallback image
  const categoryName = product.categories[0]?.name?.toLowerCase() || 'clothing'
  
  return {
    id: product.id,
    category: product.categories[0]?.id.toString() || 'all',
    name: product.name,
    price: product.price,
    image: product.images[0]?.src || getFallbackImage(categoryName),
    description: product.description,
    gallery: product.images.map(img => img.src),
    customizable,
    sizes: product.attributes?.find(attr => attr.name === 'Size')?.options || [],
    colors: product.attributes?.find(attr => attr.name === 'Color')?.options || [],
    stock_status: product.stock_status,
    stock_quantity: product.stock_quantity,
    sku: product.sku,
    weight: product.weight,
    dimensions: product.dimensions,
    tags: product.tags?.map(tag => tag.slug) || []
  }
}

// Utility function to get relevant Unsplash fallback images
const getFallbackImage = (category) => {
  const fallbackImages = {
    't-shirts': 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop',
    'hoodies': 'https://images.unsplash.com/photo-1556156026-e01c89f5f19c?q=80&w=800&auto=format&fit=crop',
    'tassen': 'https://images.unsplash.com/photo-1594225019830-798c8a1fe4a0?q=80&w=800&auto=format&fit=crop',
    'stofftaschen': 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop',
    'caps': 'https://images.unsplash.com/photo-1521369909049-ecaf380c8536?q=80&w=800&auto=format&fit=crop',
    'clothing': 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=800&auto=format&fit=crop',
    'accessories': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop'
  }

  return fallbackImages[category] || fallbackImages.clothing
}

// Navigation handler
const handleNavigation = (page) => {
  currentPage.value = page
  if (page !== 'ProductDetail') {
    selectedProduct.value = null
  }
}

// Product selection handler
const handleSelectProduct = (product) => {
  selectedProduct.value = product
  currentPage.value = 'ProductDetail'
  addToRecentlyViewed(product)
}

// Cart methods are now provided by useCart composable

// Checkout Methods
const proceedToCheckout = () => {
  if (cart.value.length === 0) return
  currentPage.value = 'Checkout'
}

const handleCompleteOrder = async (orderData) => {
  try {
    // Here you would typically create the order in WooCommerce
    console.log('Creating order:', orderData)
    
    // Clear cart after successful order
    clearCart()
    currentPage.value = 'OrderConfirmation'
  } catch (error) {
    console.error('Error creating order:', error)
  }
}

// Filter update handler
const handleUpdateFilters = (filters) => {
  // Handle filter updates here
  console.log('Filters updated:', filters)
  // You could refetch products with new filters
}

// Lifecycle
onMounted(() => {
  // Load cart data from localStorage using the composable
  loadCartData()
  
  // Initialize other data
  initializeData()
})
</script>

<style>
/* In a real Nuxt/Vue project with Tailwind, this would be in a global CSS file
  or handled by Tailwind's configuration.
*/
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

:root {
  --primary-color: #D8127D;
  --primary-hover: #b30f68;
}

body {
  font-family: 'Inter', sans-serif;
}

/* Custom Component Styles using @apply */
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
.btn-secondary-outline {
  @apply bg-transparent text-white border-2 border-white hover:bg-white hover:text-gray-900;
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

/* Add new styles for the creator */
#creator-canvas {
  width: 100% !important;
  height: 500px !important;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}

/* Add styles for filters */
.filter-section {
  @apply bg-white p-4 rounded-lg shadow-md;
}

.filter-title {
  @apply font-semibold mb-4;
}

.filter-group {
  @apply space-y-2;
}

.filter-label {
  @apply flex items-center space-x-2;
}

/* Add styles for checkout */
.checkout-step {
  @apply flex items-center space-x-2;
}

.checkout-step-number {
  @apply w-8 h-8 rounded-full border-2 flex items-center justify-center;
}

/* Add styles for cart tabs */
.cart-tab {
  @apply px-4 py-2 border-b-2;
}

.cart-tab-active {
  @apply border-[#D8127D] text-[#D8127D];
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
</style>

