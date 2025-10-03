<template>
  <div>
    <!-- Hero -->
    <section class="bg-white">
      <div class="container mx-auto px-6 py-12 text-center">
        <h1 class="text-4xl font-extrabold tracking-tight mb-2">Gestalte dein Produkt</h1>
        <p class="text-gray-600 mb-6">Wähle ein Produkt und starte dein Design.</p>
      </div>
    </section>

    <!-- Designer-tagged products -->
    <section class="bg-gray-50">
      <div class="container mx-auto px-6 py-8">
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div v-for="p in designerProducts" :key="p.id" class="bg-white rounded-lg shadow hover:shadow-md transition cursor-pointer" @click="selectProduct(p)">
            <img :src="p.image" :alt="p.name" class="w-full h-56 object-contain">
            <div class="p-4">
              <div class="font-semibold">{{ p.name }}</div>
              <div class="text-sm text-gray-500" v-if="p.price">ab {{ p.price }} €</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Designer -->
    <div class="container mx-auto px-6 py-12">
      <DesignCreator :productId="activeProductId" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import DesignCreator from '~/components/DesignCreator.vue'
import { useWooCommerce } from '~/composables/useWooCommerce.js'

// WooCommerce
const { wooService, formatProduct } = useWooCommerce()

const loading = ref(false)
const products = ref([])
const designerProducts = computed(() => products.value.filter(p => p.tags?.includes('designer')))
const activeProductId = ref(null)

async function loadDesignerProducts() {
  loading.value = true
  try {
    const raw = await wooService.fetchAllProducts()
    products.value = raw.map(formatProduct)
    // default to first designer product
    const first = designerProducts.value[0]
    if (first) activeProductId.value = String(first.id)
  } finally {
    loading.value = false
  }
}

function selectProduct(p) {
  activeProductId.value = String(p.id)
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(`product:${p.id}:image`, p.image)
    }
  } catch {}
}

onMounted(loadDesignerProducts)
</script>

<style scoped>
.btn {
  @apply inline-block px-6 py-3 rounded-lg font-semibold text-center transition duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2;
}
</style>
