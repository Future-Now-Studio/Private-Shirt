<template>
  <div>
    <!-- Step Indicator -->
    <div class="bg-white border-b">
      <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-center space-x-8">
          <!-- Step 1 -->
          <div class="flex items-center space-x-3">
            <div class="flex items-center justify-center w-8 h-8 rounded-full border-2 transition"
                 :class="currentStep === 1 ? 'border-[#D8127D] bg-[#D8127D] text-white' : 'border-gray-300 text-gray-500'">
              <span class="text-sm font-semibold">1</span>
            </div>
            <span class="text-sm font-medium" :class="currentStep === 1 ? 'text-[#D8127D]' : 'text-gray-500'">
              Produkt wählen
            </span>
          </div>

          <!-- Arrow -->
          <div class="w-8 h-px bg-gray-300"></div>

          <!-- Step 2 -->
          <div class="flex items-center space-x-3">
            <div class="flex items-center justify-center w-8 h-8 rounded-full border-2 transition"
                 :class="currentStep === 2 ? 'border-[#D8127D] bg-[#D8127D] text-white' : 'border-gray-300 text-gray-500'">
              <span class="text-sm font-semibold">2</span>
            </div>
            <span class="text-sm font-medium" :class="currentStep === 2 ? 'text-[#D8127D]' : 'text-gray-500'">
              Design gestalten
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Step 1: Product Selection -->
    <ProductSelector 
      v-if="currentStep === 1"
      @productSelected="handleProductSelected"
      @proceedToCustomization="handleProceedToCustomization"
    />

    <!-- Step 2: Design Customization -->
    <div v-if="currentStep === 2" class="bg-white">
      <!-- Back Button -->
      <div class="container mx-auto px-6 py-4 border-b">
        <button 
          @click="goBackToProductSelection"
          class="flex items-center space-x-2 text-gray-600 hover:text-[#D8127D] transition"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          <span>Zurück zur Produktauswahl</span>
        </button>
      </div>

      <!-- Design Creator -->
      <div class="container mx-auto px-6 py-12">
        <DesignCreator :productId="activeProductId" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DesignCreator from '~/components/DesignCreator.vue'
import ProductSelector from '~/components/ProductSelector.vue'

// State
const currentStep = ref(1)
const selectedProduct = ref(null)
const activeProductId = ref(null)

// Methods
const handleProductSelected = (product) => {
  selectedProduct.value = product
  activeProductId.value = String(product.id)
  
  // Store product info in localStorage for DesignCreator
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(`product:${product.id}:image`, product.image)
    }
  } catch {}
}

const handleProceedToCustomization = (product) => {
  currentStep.value = 2
}

const goBackToProductSelection = () => {
  currentStep.value = 1
}
</script>

<style scoped>
.btn {
  @apply inline-block px-6 py-3 rounded-lg font-semibold text-center transition duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2;
}
</style>
