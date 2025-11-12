<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 z-50" @click.self="$emit('close')">
    <div class="absolute right-0 top-0 h-full w-full md:w-96 bg-white shadow-xl">
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold">Warenkorb ({{ cartItemCount }})</h2>
          <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Cart Tabs -->
        <div class="flex border-b mb-4">
          <button 
            class="px-4 py-2 border-b-2"
            :class="activeCartTab === 'Warenkorb' ? 'border-[#D8127D] text-[#D8127D]' : 'border-transparent'"
            @click="activeCartTab = 'Warenkorb'"
          >
            Warenkorb
          </button>
        </div>

        <!-- Cart Items -->
        <div v-if="activeCartTab === 'Warenkorb' && cart.length > 0" class="space-y-4">
          <div v-for="(item, index) in cart" :key="index" class="flex gap-4 pb-4 border-b">
            <img :src="item.image" 
                 :alt="item.name" 
                 class="w-20 h-20 object-cover rounded"
                 @error="handleImageError($event, item.category)">
            <div class="flex-1">
              <h3 class="font-semibold">{{ item.name }}</h3>
              <p v-if="item.selectedColor || item.selectedSize" class="text-sm text-gray-500">
                <span v-if="item.selectedColor">Farbe: <span class="capitalize">{{ item.selectedColor }}</span></span>
                <span v-if="item.selectedColor && item.selectedSize"> / </span>
                <span v-if="item.selectedSize">Größe: {{ item.selectedSize }}</span>
              </p>
              <div class="flex justify-between items-center mt-2">
                <div class="flex items-center border rounded-lg px-2 py-1">
                  <button @click="updateCartItemQuantity(index, item.quantity - 1)" class="p-1 text-gray-600 hover:text-gray-900">-</button>
                  <input type="number" v-model.number="item.quantity" @change="updateCartItemQuantity(index, item.quantity)" min="1" class="w-10 text-center text-sm border-x mx-2 focus:outline-none focus:ring-0">
                  <button @click="updateCartItemQuantity(index, item.quantity + 1)" class="p-1 text-gray-600 hover:text-gray-900">+</button>
                </div>
                <div class="font-bold">
                  {{ (parseFloat(item.price) * item.quantity).toFixed(2) }} €
                </div>
              </div>
              <div class="flex justify-end text-sm mt-2">
                <button @click="moveToSavedForLater(index)" class="text-gray-500 hover:text-gray-700 mr-4">Bearbeiten</button>
                <button @click="moveToSavedForLater(index)" class="text-gray-500 hover:text-gray-700 mr-4">Kopieren</button>
                <button @click="removeFromCart(index)" class="text-gray-500 hover:text-gray-700">Löschen</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Saved For Later -->
        <div v-if="activeCartTab === 'Gespeichert' && savedForLater.length > 0" class="space-y-4">
          <div v-for="(item, index) in savedForLater" :key="index" class="flex gap-4 pb-4 border-b">
            <img :src="item.image" 
                 :alt="item.name" 
                 class="w-20 h-20 object-cover rounded"
                 @error="handleImageError($event, item.category)">
            <div class="flex-1">
              <h3 class="font-semibold">{{ item.name }}</h3>
              <p class="text-sm text-gray-500">
                {{ item.selectedSize }} / {{ item.selectedColor }}
              </p>
              <div class="flex justify-between items-center mt-2">
                <div class="text-[#D8127D] font-bold">
                  {{ item.price }} €
                </div>
                <button 
                  @click="moveToCart(index)"
                  class="text-[#D8127D] hover:text-[#b30f68]"
                >
                  In den Warenkorb
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Recently Viewed -->
        <div v-if="activeCartTab === 'Kürzlich angesehen'" class="space-y-4">
          <div v-for="item in recentlyViewed" :key="item.id" class="flex gap-4 pb-4 border-b">
            <img :src="item.image" 
                 :alt="item.name" 
                 class="w-20 h-20 object-cover rounded"
                 @error="handleImageError($event, item.category)">
            <div class="flex-1">
              <h3 class="font-semibold">{{ item.name }}</h3>
              <p class="text-[#D8127D] font-bold">{{ item.price }} €</p>
              <button 
                @click="addToCart(item)"
                class="text-[#D8127D] hover:text-[#b30f68]"
              >
                In den Warenkorb
              </button>
            </div>
          </div>
        </div>

        <!-- Empty States -->
        <div v-if="activeCartTab === 'Warenkorb' && cart.length === 0" class="text-center py-8">
          <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
          </svg>
          <p class="text-gray-500">Ihr Warenkorb ist leer</p>
        </div>

        <!-- Cart Summary -->
        <div v-if="activeCartTab === 'Warenkorb' && cart.length > 0" class="mt-6 pt-4 border-t">
          <div class="flex justify-between text-gray-700 mb-2">
            <span>Zwischensumme</span>
            <span>{{ cartTotal.toFixed(2) }} €</span>
          </div>
          <div class="flex justify-between text-gray-700 mb-2">
            <span>Versandkosten</span>
            <span>{{ shippingCost.toFixed(2) }} €</span>
          </div>
          <!-- Free Shipping Progress Bar -->
          <div class="mb-4 p-3 bg-indigo-50 rounded-lg text-sm text-indigo-800">
            <template v-if="remainingForFreeShipping > 0">
              <p class="mb-2">Noch <strong>{{ remainingForFreeShipping.toFixed(2) }} €</strong> bis zum <span class="font-semibold">kostenlosen Versand!</span></p>
              <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div class="bg-[#D8127D] h-2.5 rounded-full" :style="{ width: freeShippingProgress + '%' }"></div>
              </div>
            </template>
            <template v-else>
              <p class="font-semibold">Kostenloser Versand! 🎉</p>
            </template>
          </div>

          <div class="flex justify-between font-bold text-lg mb-4">
            <span>Gesamtsumme</span>
            <span>{{ (cartTotal + shippingCost).toFixed(2) }} €</span>
          </div>
          <button @click="proceedToCheckout" class="btn bg-[#D8127D] text-white w-full mb-3">Zur Kasse</button>
          <button @click="$emit('close'); $emit('navigate', 'ReadyToBuy')" class="btn bg-gray-200 text-gray-800 w-full">Weiter einkaufen</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  cart: {
    type: Array,
    default: () => []
  },
  savedForLater: {
    type: Array,
    default: () => []
  },
  recentlyViewed: {
    type: Array,
    default: () => []
  }
})

// Emits
const emit = defineEmits(['close', 'navigate', 'updateCart', 'removeFromCart', 'moveToSavedForLater', 'moveToCart', 'addToCart', 'proceedToCheckout'])

// State
const activeCartTab = ref('Warenkorb')

// Computed
const cartItemCount = computed(() => {
  return props.cart.reduce((count, item) => count + item.quantity, 0)
})

const cartTotal = computed(() => {
  return props.cart.reduce((total, item) => {
    return total + (parseFloat(item.price) * item.quantity)
  }, 0)
})

const shippingCost = computed(() => {
  return cartTotal.value >= 50 ? 0 : 4.99
})

const remainingForFreeShipping = computed(() => {
  return Math.max(0, 50 - cartTotal.value)
})

const freeShippingProgress = computed(() => {
  return Math.min(100, (cartTotal.value / 50) * 100)
})

// Methods
const handleImageError = (event, category) => {
  // Always use the local bottle green image as fallback
  event.target.src = '/PW154_Bottle-Green-ca.-Pantone-560C.jpg'
}

const updateCartItemQuantity = (index, quantity) => {
  if (quantity < 1) return
  emit('updateCart', { index, quantity })
}

const removeFromCart = (index) => {
  emit('removeFromCart', index)
}

const moveToSavedForLater = (index) => {
  emit('moveToSavedForLater', index)
}

const moveToCart = (index) => {
  emit('moveToCart', index)
}

const addToCart = (item) => {
  emit('addToCart', item)
}

const proceedToCheckout = () => {
  emit('proceedToCheckout')
}
</script>

<style scoped>
.btn {
  @apply inline-block px-6 py-3 rounded-lg font-semibold text-center transition duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2;
}
</style>
