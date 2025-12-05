<template>
  <div v-if="selectedProduct" class="container mx-auto px-6 py-12" data-aos="fade-up">
    <!-- Breadcrumb Navigation -->
    <div class="flex items-center space-x-2 text-sm text-gray-500 mb-8">
      <a @click="$emit('navigate', 'Home')" class="hover:text-[#D8127D] cursor-pointer">Home</a>
      <span>/</span>
      <a @click="$emit('navigate', selectedProduct.customizable ? 'CustomizationCreator' : 'ReadyToBuy')" 
         class="hover:text-[#D8127D] cursor-pointer">
        {{ selectedProduct.customizable ? 'Individuell gestalten' : 'Fertige Produkte' }}
      </a>
      <span>/</span>
      <span class="text-gray-900">{{ selectedProduct.name }}</span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <!-- Product Images -->
      <div class="space-y-4">
        <div class="relative aspect-square rounded-lg overflow-hidden">
          <img :src="selectedImage || selectedProduct.image" 
               :alt="selectedProduct.name" 
               class="w-full h-full object-cover"
               @error="handleImageError($event, selectedProduct.category)">
          <div v-if="selectedProduct.customizable" 
               class="absolute top-4 left-4 bg-[#D8127D] text-white px-3 py-1 rounded-full text-sm">
            Individuell gestaltbar
          </div>
        </div>
        <div class="grid grid-cols-4 gap-4">
          <button v-for="(image, index) in selectedProduct.gallery" 
                  :key="index"
                  @click="selectedImage = image"
                  class="aspect-square rounded-lg overflow-hidden border-2"
                  :class="selectedImage === image ? 'border-[#D8127D]' : 'border-transparent'">
            <img :src="image" 
                 :alt="`${selectedProduct.name} - Bild ${index + 1}`"
                 class="w-full h-full object-cover"
                 @error="handleImageError($event, selectedProduct.category)">
          </button>
        </div>
      </div>

      <!-- Product Info -->
      <div>
        <h1 class="text-3xl font-bold mb-2">{{ selectedProduct.name }}</h1>
        <div class="flex items-center space-x-4 mb-4">
          <p class="text-2xl text-[#D8127D] font-bold">{{ selectedProduct.price }} €</p>
          <span v-if="selectedProduct.customizable" class="text-gray-500">Ab</span>
          <div class="flex items-center">
            <span class="text-yellow-400">★★★★★</span>
            <span class="ml-2 text-gray-600">(4.9)</span>
          </div>
        </div>
        
        <div class="prose max-w-none mb-8">
          <p>{{ selectedProduct.description }}</p>
        </div>

        <!-- Product Options -->
        <div class="space-y-6">
          <!-- Size/Quantity Selection -->
          <div v-if="selectedProduct.sizes">
            <div class="flex justify-between items-center mb-2">
              <h3 class="font-semibold">Größe / Menge wählen</h3>
              <button class="text-sm text-[#D8127D] hover:underline">Größentabelle</button>
            </div>
            <div class="divide-y divide-gray-200 border rounded-lg overflow-hidden">
              <div v-for="size in selectedProduct.sizes" :key="size" class="flex items-center px-4 py-2">
                <span class="w-12 font-bold text-gray-800">{{ size }}</span>
                <div class="flex items-center ml-auto">
                  <button @click="sizeQuantities[size] = Math.max(0, sizeQuantities[size] - 1)" class="w-8 h-8 border rounded-l flex items-center justify-center text-gray-700 hover:bg-gray-100">-</button>
                  <input type="number" v-model.number="sizeQuantities[size]" min="0" class="w-12 text-center border-t border-b focus:outline-none" />
                  <button @click="sizeQuantities[size] = sizeQuantities[size] + 1" class="w-8 h-8 border rounded-r flex items-center justify-center text-gray-700 hover:bg-gray-100">+</button>
                </div>
              </div>
            </div>
          </div>
          <!-- Color Selection -->
          <div v-if="selectedProduct.colors">
            <h3 class="font-semibold mb-2">Farbe</h3>
            <div class="flex flex-wrap gap-2">
              <button v-for="color in selectedProduct.colors" 
                      :key="color"
                      @click="selectedColor = color"
                      class="w-8 h-8 rounded-full border-2 transition"
                      :class="selectedColor === color ? 'border-[#D8127D]' : 'border-transparent'"
                      :style="{ backgroundColor: color }">
              </button>
            </div>
          </div>
          <!-- Quantity (hidden if sizes) -->
          <div v-if="!selectedProduct.sizes">
            <h3 class="font-semibold mb-2">Menge</h3>
            <div class="flex items-center gap-4">
              <button @click="quantity = Math.max(1, quantity - 1)" 
                      class="w-10 h-10 border rounded-lg hover:border-[#D8127D] hover:text-[#D8127D] transition">
                -
              </button>
              <input type="number" 
                     v-model="quantity" 
                     min="1" 
                     class="w-20 text-center border rounded-lg focus:border-[#D8127D] focus:ring-1 focus:ring-[#D8127D]">
              <button @click="quantity++" 
                      class="w-10 h-10 border rounded-lg hover:border-[#D8127D] hover:text-[#D8127D] transition">
                +
              </button>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-4">
            <button v-if="selectedProduct.customizable" 
                    class="btn bg-[#D8127D] text-white flex-1 hover:bg-[#b30f68]">
              Jetzt gestalten
            </button>
            <button v-else 
                    @click="addToCart"
                    class="btn bg-[#D8127D] text-white flex-1 hover:bg-[#b30f68]">
              In den Warenkorb
            </button>
            <button class="btn border-2 border-gray-300 hover:border-[#D8127D] hover:text-[#D8127D]">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </button>
          </div>

          <!-- Product Features -->
          <div class="grid grid-cols-2 gap-4 pt-6 border-t">
            <div class="flex items-center space-x-2">
              <svg class="w-6 h-6 text-[#D8127D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              <span class="text-sm">Kostenloser Versand</span>
            </div>
            <div class="flex items-center space-x-2">
              <svg class="w-6 h-6 text-[#D8127D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
              <span class="text-sm">2 Jahre Garantie</span>
            </div>
            <div class="flex items-center space-x-2">
              <svg class="w-6 h-6 text-[#D8127D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
              </svg>
              <span class="text-sm">Sicherer Zahlung</span>
            </div>
            <div class="flex items-center space-x-2">
              <svg class="w-6 h-6 text-[#D8127D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              <span class="text-sm">Persönlicher Service</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Additional Information Tabs -->
    <div class="mt-16">
      <div class="border-b border-gray-200">
        <nav class="flex space-x-8">
          <button v-for="tab in ['Beschreibung', 'Material & Pflege', 'Versand & Rücksendung', 'Bewertungen']"
                  :key="tab"
                  @click="selectedTab = tab"
                  class="py-4 px-1 border-b-2 font-medium text-sm"
                  :class="selectedTab === tab ? 'border-[#D8127D] text-[#D8127D]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'">
            {{ tab }}
          </button>
        </nav>
      </div>

      <div class="py-8">
        <!-- Description Tab -->
        <div v-if="selectedTab === 'Beschreibung'" class="prose max-w-none">
          <p>{{ selectedProduct.description }}</p>
          <ul>
            <li>Hochwertige Materialien</li>
            <li>Nachhaltige Produktion</li>
            <li>Made in Germany</li>
          </ul>
        </div>

        <!-- Material & Care Tab -->
        <div v-if="selectedTab === 'Material & Pflege'" class="prose max-w-none">
          <h3 class="text-lg font-semibold mb-4">Material</h3>
          <p>100% Bio-Baumwolle, GOTS zertifiziert</p>
          
          <h3 class="text-lg font-semibold mb-4 mt-8">Pflegehinweise</h3>
          <ul>
            <li>Maschinenwäsche bei 30°C</li>
            <li>Nicht bleichen</li>
            <li>Bügeln bei mittlerer Temperatur</li>
            <li>Nicht chemisch reinigen</li>
          </ul>
        </div>

        <!-- Shipping & Returns Tab -->
        <div v-if="selectedTab === 'Versand & Rücksendung'" class="prose max-w-none">
          <h3 class="text-lg font-semibold mb-4">Versand</h3>
          <ul>
            <li>Kostenloser Versand ab 50€</li>
            <li>Standardversand: 2-4 Werktage</li>
            <li>Expressversand: 1-2 Werktage</li>
          </ul>

          <h3 class="text-lg font-semibold mb-4 mt-8">Rücksendung</h3>
          <ul>
            <li>14 Tage Rückgaberecht</li>
            <li>Kostenlose Rücksendung</li>
            <li>Einfacher Rückgabeprozess</li>
          </ul>
        </div>

        <!-- Reviews Tab -->
        <div v-if="selectedTab === 'Bewertungen'" class="space-y-8">
          <div class="flex items-center space-x-4">
            <div class="text-4xl font-bold text-[#D8127D]">4.9</div>
            <div>
              <div class="flex text-yellow-400">
                <span>★★★★★</span>
              </div>
              <div class="text-sm text-gray-500">Basierend auf 128 Bewertungen</div>
            </div>
          </div>

          <div class="space-y-6">
            <div v-for="i in 3" :key="i" class="border-b pb-6">
              <div class="flex items-center space-x-4 mb-2">
                <div class="w-10 h-10 rounded-full bg-gray-200"></div>
                <div>
                  <div class="font-semibold">Max Mustermann</div>
                  <div class="text-sm text-gray-500">Vor 2 Wochen</div>
                </div>
              </div>
              <div class="flex text-yellow-400 mb-2">★★★★★</div>
              <p class="text-gray-600">Sehr zufrieden mit der Qualität und dem Service. Die Lieferung war schnell und das Produkt entspricht genau der Beschreibung.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Details Section -->
    <div class="mt-12">
      <section class="bg-[#f8f8f6] border-t border-gray-200 py-10">
        <div class="container mx-auto px-6 grid md:grid-cols-2 gap-12">
          <!-- Left: Description and Details -->
          <div>
            <h2 class="text-2xl font-bold mb-2">{{ selectedProduct.name }}</h2>
            <h3 class="font-semibold mb-2">Dieses Basic T-Shirt sorgt für einen modernen Look</h3>
            <p class="mb-4 text-gray-700">Das Basic T-Shirt für Frauen und Männer aus der B&C Collection steht für eine zeitgemäße Passform und eine moderne Optik. Die zu 100% ringgesponnene, einlaufvorbehandelte Baumwolle (Ash: 99% Baumwolle, 1% Viskose; Sport Grey: 85% Baumwolle, 15% Viskose) mit einer Stoffdichte von 145 g/m² ist besonders strapazierfähig und weist eine ebenmäßige und weiche Oberfläche auf. Der schlauchförmige Schnitt hebt die hervorragende Passform weiter hervor.</p>
            <h4 class="font-semibold mb-2">Ein schickes T-Shirt für alle Tage</h4>
            <p class="mb-4 text-gray-700">Wenn man sich leicht und locker einkleiden möchte, dann hat das Unisex Basic T-Shirt seinen ganz großen Auftritt. Es steht für Lässigkeit und punktet mit seinem innovativen Design. Das T-Shirt lässt sich in vielen verschiedenen Farben bestellen. Der schmale Kragen sieht ansprechend aus, wurde er doch aus flexiblem Rippstrick mit Elasthan gefertigt. Im Nacken ist für mehr Formstabilität ein Kragenband verarbeitet. Das Label B&C setzt sich zudem für faire Arbeitsbedingungen in den Produktionsstätten ein. Dafür sorgt die Mitgliedschaft in der Fair Wear Foundation.</p>
            <div class="bg-blue-100 border border-blue-300 rounded p-3 mb-4">
              <span class="font-semibold text-blue-800 block mb-1">Hinweis zur Farbe Natural:</span>
              <span class="text-blue-800 text-sm">Die natürliche Struktur des Natural Garns ist sichtbar.</span>
            </div>
            <table class="w-full text-sm mb-4">
              <tbody>
                <tr><td class="font-semibold pr-2">Artikel-Nr.:</td><td>BCTU01T</td></tr>
                <tr><td class="font-semibold pr-2">Hersteller:</td><td>B&C</td></tr>
                <tr><td class="font-semibold pr-2">Herstellungsland:</td><td>Bangladesch</td></tr>
                <tr><td class="font-semibold pr-2">Druckarten:</td><td>Flexdruck, Flockdruck, Spezial Flexdruck, Digitaltransferdruck</td></tr>
                <tr><td class="font-semibold pr-2">Materialzusammensetzung:</td><td>100% einlaufvorbehandelte, ringgesponnene Baumwolle (Ash: 99% Baumwolle, 1% Viskose; Sport Grey: 85% Baumwolle, 15% Viskose)</td></tr>
                <tr><td class="font-semibold pr-2">Produktsicherheit (GPSR):</td><td>The Cotton Group SA/NV, Drève Richelle 161, 1410 Waterloo, Belgium, info@bc-collection.eu</td></tr>
              </tbody>
            </table>
          </div>
          <!-- Right: Size chart and print info -->
          <div>
            <h3 class="font-semibold mb-2">Größentabelle</h3>
            <div class="flex items-center mb-2">
              <img src="/assets/shirt.svg" alt="Größentabelle Illustration" class="w-24 h-24 mr-4" />
              <table class="text-xs border-collapse">
                <thead>
                  <tr class="text-left">
                    <th class="pr-2">Größe</th>
                    <th class="pr-2">Maß A (cm)</th>
                    <th class="pr-2">Maß B (cm)</th>
                    <th>Maß C (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in sizeChart" :key="row.g">
                    <td class="pr-2">{{ row.g }}</td>
                    <td class="pr-2">{{ row.a }}</td>
                    <td class="pr-2">{{ row.b }}</td>
                    <td>{{ row.c }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="text-xs text-gray-500 mb-4">A = Länge in cm, B = Breite in cm, C = Länge in cm<br>Es kann eine handelsübliche Toleranz von +/- 5% bestehen!</div>
            <h4 class="font-semibold mb-2">Design- und Produktgröße</h4>
            <p class="text-sm mb-2">Unsere Produktbilder zeigen Durchschnittsgrößen. Bestellst Du ein besonders großes Produkt, wird das Design nicht automatisch an den größeren Druckbereich angepasst.</p>
            <p class="text-xs text-gray-600 mb-2">Unser Tipp: Zieh Dein Design größer, damit es zur Größe Deines Produkts passt. <a href="#" class="text-[#D8127D] underline">Mehr erfahren</a></p>
            <div class="flex items-end gap-2 mt-4">
              <img src="/assets/printarea-kinder.svg" alt="Printarea Kinder" class="h-60" />
            </div>
          </div>
        </div>
        <!-- Payment, shipping, returns info -->
        <div class="container mx-auto px-6 mt-10 grid md:grid-cols-3 gap-8 text-center text-xs text-gray-700">
          <div>
            <div class="font-semibold mb-2">Sichere Zahlungsmethoden</div>
            <div class="flex justify-center gap-2 mb-2">
              <span>PayPal</span><span>Klarna</span><span>VISA</span><span>Mastercard</span>
            </div>
            <a href="#" class="underline">Mehr erfahren</a>
          </div>
          <div>
            <div class="font-semibold mb-2">Internationale Lieferung</div>
            <div class="flex justify-center gap-2 mb-2">
              <span>DHL</span><span>UPS</span><span>Express</span>
            </div>
            <a href="#" class="underline">Mehr zum Versand erfahren</a>
          </div>
          <div>
            <div class="font-semibold mb-2">Unsere fairen Rückgaberegeln</div>
            <div class="flex justify-center gap-2 mb-2">
              <span>14 Tage Rückgaberecht</span>
            </div>
            <a href="#" class="underline">Mehr erfahren</a>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// Props
const props = defineProps({
  selectedProduct: {
    type: Object,
    default: null
  }
})

// Emits
const emit = defineEmits(['navigate', 'addToCart'])

// State
const selectedImage = ref(null)
const selectedColor = ref(null)
const quantity = ref(1)
const selectedTab = ref('Beschreibung')
const sizeQuantities = ref({})

// Size chart data
const sizeChart = [
  {g: 'XS', a: '68,0', b: '45,0', c: '17,0'},
  {g: 'S', a: '70,0', b: '48,0', c: '17,0'},
  {g: 'M', a: '72,0', b: '51,0', c: '18,0'},
  {g: 'L', a: '74,0', b: '54,0', c: '19,0'},
  {g: 'XL', a: '76,0', b: '57,0', c: '20,0'},
  {g: 'XXL', a: '78,0', b: '60,0', c: '21,0'}
]

// Watch for product changes to initialize size quantities
watch(() => props.selectedProduct, (newProduct) => {
  if (newProduct && newProduct.sizes) {
    const initial = {}
    newProduct.sizes.forEach(size => { initial[size] = 0 })
    sizeQuantities.value = initial
  }
  // Set first image as selected
  if (newProduct && newProduct.gallery && newProduct.gallery.length > 0) {
    selectedImage.value = newProduct.gallery[0]
  }
}, { immediate: true })

// Computed
const totalSelectedQuantity = computed(() => {
  if (!props.selectedProduct?.sizes) return quantity.value
  return Object.values(sizeQuantities.value).reduce((sum, n) => sum + n, 0)
})

const totalSelectedPrice = computed(() => {
  return totalSelectedQuantity.value * (parseFloat(props.selectedProduct?.price) || 0)
})

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

const addToCart = () => {
  if (props.selectedProduct.sizes?.length > 0) {
    let added = false
    for (const size of props.selectedProduct.sizes) {
      const qty = sizeQuantities.value[size]
      if (qty > 0) {
        emit('addToCart', {
          ...props.selectedProduct,
          quantity: qty,
          selectedSize: size,
          selectedColor: selectedColor.value
        })
        added = true
      }
    }
    if (!added) {
      alert('Bitte wählen Sie mindestens eine Größe und Menge aus.')
      return
    }
    // Reset
    for (const size of props.selectedProduct.sizes) sizeQuantities.value[size] = 0
    selectedColor.value = null
    alert('Produkte wurden zum Warenkorb hinzugefügt')
  } else {
    // Single size logic
    if (props.selectedProduct.colors?.length > 0 && !selectedColor.value) {
      alert('Bitte wählen Sie eine Farbe aus.')
      return
    }
    emit('addToCart', {
      ...props.selectedProduct,
      quantity: quantity.value,
      selectedSize: null,
      selectedColor: selectedColor.value
    })
    quantity.value = 1
    selectedColor.value = null
    alert('Produkt wurde zum Warenkorb hinzugefügt')
  }
}
</script>

<style scoped>
.btn {
  @apply inline-block px-6 py-3 rounded-lg font-semibold text-center transition duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2;
}
</style>
