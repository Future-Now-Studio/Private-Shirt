<template>
  <div class="container mx-auto px-6 py-12" data-aos="fade-up">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-8">Zur Kasse</h1>
      
      <!-- Checkout Steps -->
      <div class="flex justify-between mb-8">
        <div v-for="step in 3" :key="step" 
             :class="['flex-1 text-center', checkoutStep >= step ? 'text-[#D8127D]' : 'text-gray-400']">
          <div class="w-8 h-8 rounded-full border-2 mx-auto mb-2 flex items-center justify-center"
               :class="checkoutStep >= step ? 'border-[#D8127D]' : 'border-gray-400'">
            {{ step }}
          </div>
          <span class="text-sm">
            {{ step === 1 ? 'Versand' : step === 2 ? 'Zahlung' : 'Bestätigung' }}
          </span>
        </div>
      </div>

      <!-- Step 1: Shipping -->
      <div v-if="checkoutStep === 1" class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4">Versandadresse</h2>
        <form @submit.prevent="checkoutStep = 2" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <input v-model="shippingAddress.firstName" type="text" placeholder="Vorname" required class="form-input">
            <input v-model="shippingAddress.lastName" type="text" placeholder="Nachname" required class="form-input">
          </div>
          <input v-model="shippingAddress.email" type="email" placeholder="E-Mail" required class="form-input">
          <input v-model="shippingAddress.phone" type="tel" placeholder="Telefon" required class="form-input">
          <input v-model="shippingAddress.address" type="text" placeholder="Adresse" required class="form-input">
          <div class="grid grid-cols-2 gap-4">
            <input v-model="shippingAddress.city" type="text" placeholder="Stadt" required class="form-input">
            <input v-model="shippingAddress.postalCode" type="text" placeholder="PLZ" required class="form-input">
          </div>
          <select v-model="shippingAddress.country" class="form-input">
            <option value="Deutschland">Deutschland</option>
            <option value="Österreich">Österreich</option>
            <option value="Schweiz">Schweiz</option>
          </select>
          <button type="submit" class="btn bg-[#D8127D] text-white w-full">Weiter zur Zahlung</button>
        </form>
      </div>

      <!-- Step 2: Payment -->
      <div v-if="checkoutStep === 2" class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4">Zahlungsmethode</h2>
        <div class="space-y-4">
          <div class="flex items-center space-x-4 p-4 border rounded-lg cursor-pointer"
               :class="paymentMethod === 'credit_card' ? 'border-[#D8127D]' : 'border-gray-200'"
               @click="paymentMethod = 'credit_card'">
            <input type="radio" v-model="paymentMethod" value="credit_card" class="text-[#D8127D]">
            <div>
              <h3 class="font-semibold">Kreditkarte</h3>
              <p class="text-sm text-gray-500">Visa, Mastercard, American Express</p>
            </div>
          </div>
          <div class="flex items-center space-x-4 p-4 border rounded-lg cursor-pointer"
               :class="paymentMethod === 'paypal' ? 'border-[#D8127D]' : 'border-gray-200'"
               @click="paymentMethod = 'paypal'">
            <input type="radio" v-model="paymentMethod" value="paypal" class="text-[#D8127D]">
            <div>
              <h3 class="font-semibold">PayPal</h3>
              <p class="text-sm text-gray-500">Schnell und sicher bezahlen</p>
            </div>
          </div>
          <textarea v-model="orderNotes" placeholder="Bestellnotizen (optional)" class="form-input" rows="3"></textarea>
          <div class="flex justify-between">
            <button @click="checkoutStep = 1" class="btn border-2 border-gray-300">Zurück</button>
            <button @click="checkoutStep = 3" class="btn bg-[#D8127D] text-white">Weiter zur Bestätigung</button>
          </div>
        </div>
      </div>

      <!-- Step 3: Confirmation -->
      <div v-if="checkoutStep === 3" class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4">Bestellung bestätigen</h2>
        <div class="space-y-6">
          <div class="border-b pb-4">
            <h3 class="font-semibold mb-2">Versandadresse</h3>
            <p>{{ shippingAddress.firstName }} {{ shippingAddress.lastName }}</p>
            <p>{{ shippingAddress.address }}</p>
            <p>{{ shippingAddress.postalCode }} {{ shippingAddress.city }}</p>
            <p>{{ shippingAddress.country }}</p>
          </div>
          <div class="border-b pb-4">
            <h3 class="font-semibold mb-2">Zahlungsmethode</h3>
            <p>{{ paymentMethod === 'credit_card' ? 'Kreditkarte' : 'PayPal' }}</p>
          </div>
          <div class="border-b pb-4">
            <h3 class="font-semibold mb-2">Bestellübersicht</h3>
            <div v-for="item in cart" :key="item.id" class="flex justify-between py-2">
              <span>{{ item.name }} ({{ item.quantity }})</span>
              <span>{{ (parseFloat(item.price) * item.quantity).toFixed(2) }} €</span>
            </div>
          </div>
          <div class="text-right">
            <p class="text-lg font-semibold">Gesamtsumme: {{ cartTotal.toFixed(2) }} €</p>
          </div>
          <div class="flex justify-between">
            <button @click="checkoutStep = 2" class="btn border-2 border-gray-300">Zurück</button>
            <button @click="completeOrder" class="btn bg-[#D8127D] text-white">Bestellung abschließen</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Props
const props = defineProps({
  cart: {
    type: Array,
    default: () => []
  }
})

// Emits
const emit = defineEmits(['completeOrder'])

// State
const checkoutStep = ref(1)
const shippingAddress = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  country: 'Deutschland'
})
const paymentMethod = ref('credit_card')
const orderNotes = ref('')

// Computed
const cartTotal = computed(() => {
  return props.cart.reduce((total, item) => {
    return total + (parseFloat(item.price) * item.quantity)
  }, 0)
})

// Methods
const completeOrder = async () => {
  try {
    // Here you would typically create the order in WooCommerce
    const orderData = {
      payment_method: paymentMethod.value,
      payment_method_title: paymentMethod.value === 'credit_card' ? 'Kreditkarte' : 'PayPal',
      set_paid: false,
      billing: shippingAddress.value,
      shipping: shippingAddress.value,
      line_items: props.cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity
      })),
      customer_note: orderNotes.value
    }
    
    // Emit event to parent to handle order completion
    emit('completeOrder', orderData)
  } catch (error) {
    console.error('Error creating order:', error)
  }
}
</script>

<style scoped>
.btn {
  @apply inline-block px-6 py-3 rounded-lg font-semibold text-center transition duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2;
}
.form-input {
  @apply w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D8127D] focus:border-[#D8127D] transition;
}
</style>
