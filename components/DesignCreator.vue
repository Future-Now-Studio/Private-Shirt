<template>
  <div class="container mx-auto px-6 py-12">
    <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Design Canvas -->
      <div class="lg:col-span-8">
        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-[#0a3a47]">Shirt Designer</h2>
            <div class="flex gap-2 relative z-20">
              <button @click="zoomIn" class="btn-secondary" title="Zoom In">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/>
                </svg>
              </button>
              <button @click="zoomOut" class="btn-secondary" title="Zoom Out">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 10v3m0-3H7"/>
                </svg>
              </button>
              <button @click="resetView" class="btn-secondary" title="Zurücksetzen">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
              </button>
              <button @click="exportDesign" class="btn-secondary" title="Design exportieren">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </button>
            
              <!-- Admin Controls simplified: single polygon button + save/clear -->
              <div class="relative group" v-if="isAdminMode">
                <button @click="handlePolygonButton" class="btn-secondary" :class="{'bg-[#0a3a47] text-white': isDrawingPolygon || isEditingArea}" :title="polygonButtonTitle">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4l16 16M4 20L20 4"/>
                  </svg>
                </button>
                <span class="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none z-50">{{ polygonButtonHelp }}</span>
              </div>

              <div class="relative group" v-if="isAdminMode && customPolygon.length >= 3">
                <button @click="toggleEditPolygon" class="btn-secondary" :class="{'bg-[#D8127D] text-white': isEditingArea}" title="Polygon bearbeiten">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M9 11l6.232-6.232a2 2 0 112.828 2.828L11.828 13.828a2 2 0 01-.828.515L7 15l1.657-3.999a2 2 0 01.343-.6z"/>
                  </svg>
                </button>
                <span class="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none z-50">Punkte verschieben</span>
              </div>

              <div class="relative group">
                <button @click="toggleAdminMode" class="btn-secondary" :class="{'bg-[#0a3a47] text-white': isAdminMode}" title="Admin Mode">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  </svg>
                </button>
                <span class="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none z-50">Admin-Tools an/aus</span>
              </div>
              <div class="relative group" v-if="isAdminMode">
                <button @click="savePlacementArea" class="btn-secondary" title="Area speichern">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4h16v16H4zM8 12h8"/>
                  </svg>
                </button>
                <span class="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none z-50">Fläche speichern</span>
              </div>
              <div class="relative group" v-if="isAdminMode">
                <button @click="clearPlacementArea" class="btn-secondary" title="Area löschen">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
                <span class="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none z-50">Fläche löschen</span>
              </div>
            </div>
          </div>
          
          <!-- Canvas Container (Fabric mounts inside; background via CSS) -->
          <div class="relative rounded-lg overflow-hidden">
            <div 
              ref="canvasHost"
              class="relative w-full h-[600px] cursor-crosshair bg-white"
              :style="hostBgStyle"
              @keydown="onKeyDown"
              tabindex="0"
            ></div>
            <!-- Warning Message - only for placement area validation -->
            <div v-if="showWarning" class="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-10">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>
                <span class="text-sm font-medium">{{ warningMessage }}</span>
              </div>
            </div>
          </div>
          <div class="mt-2 text-xs text-gray-500">Tipp: Objekte anklicken und mit der Maus ziehen, um sie zu bewegen.</div>
      </div>
      </div>

      <!-- Sidebar -->
      <div class="lg:col-span-4">
        <div class="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-6">
          <!-- Product Info -->
          <div>
            <h1 class="text-2xl font-bold mb-1">{{ productName }} <span class="text-xs text-gray-400">#{{ productId }}</span></h1>
            <div class="text-sm text-[#D8127D] font-semibold mb-2 flex items-center gap-2">
            
            </div>
          </div>

          <!-- Upload Section -->
          <div>
            <div class="space-y-3">
              <button @click="openFileInput" class="btn w-full bg-[#D8127D] hover:bg-[#b0105f] text-white">
                <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                </svg>
                Bild hochladen
              </button>
              <input ref="fileInput" type="file" accept="image/*,.svg" @change="handleFileUpload" class="hidden" />
              <button @click="addText" class="btn w-full bg-[#ff7a00] hover:bg-[#ffa940] text-white">
                <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
                Text hinzufügen
              </button>
            
            </div>
          </div>

          <!-- Product Views removed - always using local bottle green image -->



          

          <!-- Color Swatches -->
          <div>
            <div class="font-semibold mb-2 text-[#0a3a47]">Shirt Farbe</div>
            <div class="grid grid-cols-8 gap-2 mb-2">
              <button 
                v-for="(color, i) in colors" 
                :key="color.name" 
                :title="color.name" 
                @click="changeShirtColor(i)" 
                :class="['w-7 h-7 rounded-full border-2', selectedColor === i ? 'border-[#D8127D] ring-2 ring-[#ffd44d]' : 'border-gray-200']" 
                :style="{backgroundColor: color.hex}"
              ></button>
            </div>
            <div class="text-xs text-gray-500">Gewählte Farbe: <span class="font-semibold text-[#0a3a47]">{{ colors[selectedColor].name }}</span></div>
          </div>

          <!-- Design Tools -->
          <div v-if="selectedObject">
            <h3 class="font-semibold mb-3 text-[#0a3a47]">Design bearbeiten</h3>
            <div class="space-y-3">
              <div class="flex gap-2">
                <button @click="bringToFront" class="btn-secondary flex-1" title="Nach vorne">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/></svg>
                </button>
                <button @click="sendToBack" class="btn-secondary flex-1" title="Nach hinten">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </button>
                <button @click="deleteObject" class="btn-secondary" title="Löschen">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>

              <!-- Text Controls -->
              <div v-if="selectedObject.type === 'text'" class="space-y-3 p-3 border border-gray-200 rounded-md bg-white shadow-sm">
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Text</label>
                  <input v-model="selectedObject.text" @input="updateText" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#D8127D]" />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Schriftgröße</label>
                  <input v-model="selectedObject.fontSize" @input="updateText" type="range" min="12" max="72" class="w-full"/>
                  <div class="text-xs text-gray-500 text-center">{{ selectedObject.fontSize }}px</div>
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Farbe</label>
                  <div class="grid grid-cols-6 gap-1">
                    <button 
                      v-for="color in textColors" 
                      :key="color.name"
                      @click="changeTextColor(color.hex)"
                      :class="['w-6 h-6 rounded border', selectedObject.fill === color.hex ? 'border-[#D8127D] ring-2' : 'border-gray-200']"
                      :style="{backgroundColor: color.hex}"
                      :title="color.name"
                    ></button>
                  </div>
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Schriftart</label>
                  <select v-model="selectedObject.fontFamily" @change="updateText" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#D8127D]">
                    <option v-for="f in availableFonts" :key="f" :value="f">{{ f }}</option>
                  </select>
                </div>
              </div>

              <!-- Image Controls -->
              <div v-if="selectedObject.type === 'image'" class="space-y-3">
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Transparenz</label>
                  <input v-model="selectedObject.opacity" @input="updateImage" type="range" min="0.1" max="1" step="0.1" class="w-full"/>
                  <div class="text-xs text-gray-500 text-center">{{ Math.round(selectedObject.opacity * 100) }}%</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Product Info -->
          <div>
            <details class="mb-2">
              <summary class="cursor-pointer font-semibold text-[#D8127D]">Produktinformationen</summary>
              <div class="text-xs text-gray-600 mt-2">{{ productDescription || 'Produktbeschreibung folgt.' }}</div>
            </details>
            <details>
              <summary class="cursor-pointer font-semibold text-[#D8127D]">Aktueller Lagerbestand</summary>
              <div class="text-xs text-gray-600 mt-2">Viele Größen und Farben sofort verfügbar.</div>
            </details>
          </div>

          <!-- Price & Delivery -->
          <div class="bg-gray-50 rounded-lg p-4 flex flex-col gap-2">
            <div class="flex justify-between items-center">
              <span class="font-semibold text-[#0a3a47]">Gesamtsumme</span>
              <span class="text-lg font-bold text-[#D8127D]">11,90 €</span>
            </div>
            <div class="text-xs text-gray-500">inkl. MwSt. EU / inkl. Druckkosten / zzgl. <a href="#" class="underline text-[#D8127D]">Versand</a></div>
            <div class="text-sm text-[#0a3a47] font-semibold mt-2">Lieferung in der Regel innerhalb von 4 Werktagen</div>
          </div>

          <button @click="openSizeModal" class="btn w-full bg-[#ff7a00] hover:bg-[#ffa940] text-white text-lg font-bold py-3 rounded-lg mt-2">
            Größe und Menge wählen
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Size & Quantity Modal -->
  <div v-if="showSizeModal" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black/40" @click="showSizeModal = false"></div>
    <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6">
      <h3 class="text-lg font-semibold text-[#0a3a47] mb-4">Größe und Menge wählen</h3>
      <div class="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
        <div v-for="size in availableSizes" :key="size" class="flex items-center justify-between gap-4">
          <div class="font-medium text-sm text-[#0a3a47]">{{ size }}</div>
          <input type="number" min="0" step="1" class="w-24 px-3 py-2 border border-gray-300 rounded-md text-sm"
                 v-model.number="sizeQuantities[size]" />
        </div>
      </div>
      <div class="flex justify-end gap-2 mt-6">
        <button @click="showSizeModal = false" class="btn btn-secondary">Abbrechen</button>
        <button @click="confirmSizesAndGoToCheckout" class="btn bg-[#ff7a00] hover:bg-[#ffa940] text-white">Weiter zur Kasse</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useWooCommerce } from '~/composables/useWooCommerce.js'
import { useCart } from '~/composables/useCart.js'

const props = defineProps({
  productId: { type: [String, Number], default: 'E150' }
})

const canvasRef = ref(null)
const canvasHost = ref(null)
const fileInput = ref(null)
let canvas = null
let fabric = null

// Design-Layer + Clip
let designLayer = null
let clipPolygon = null
const lastValidTransform = new WeakMap()
let bgImageObj = null
const DEFAULT_BG_URL = '/PW154_Bottle-Green-ca.-Pantone-560C.jpg'
const router = useRouter()
const { addToCart } = useCart()
const showSizeModal = ref(false)
const sizeQuantities = ref({})



// Admin/Polygon
const isAdminMode = ref(false)
const isEditingArea = ref(false)
const isDrawingPolygon = ref(false)
const customPolygon = ref([]) // [{x,y}]
let polygonOverlay = null
let polylineOverlay = null
const pointMarkers = []
let polygonControlPoints = []

// Shirt Colors
const selectedColor = ref(2)
const colors = [
  { name: 'Weiß', hex: '#f5f5f5' },
  { name: 'Schwarz', hex: '#222' },
  { name: 'Atoll', hex: '#1cc6ea' },
  { name: 'Gelb', hex: '#ffe600' },
  { name: 'Pink', hex: '#D8127D' },
  { name: 'Grün', hex: '#6bbf59' },
  { name: 'Rot', hex: '#e53935' },
  { name: 'Blau', hex: '#1976d2' },
]

// UI
const selectedObject = ref(null)
const hasDesign = ref(false)
// Removed placement guide UI
const showWarning = ref(false)
const warningMessage = ref('')
const hostBgStyle = computed(() => ({
  backgroundImage: `url(${DEFAULT_BG_URL})`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'contain'
}))
const availableSizes = computed(() => {
  const sizes = ['S','M','L','XL','XXL']
  if (Object.keys(sizeQuantities.value).length === 0) {
    sizes.forEach(s => { sizeQuantities.value[s] = 0 })
  }
  return sizes
})
function openSizeModal() {
  if (!selectedProduct.value) return
  // ensure all common sizes are initialized
  ;['S','M','L','XL','XXL'].forEach(s => {
    if (typeof sizeQuantities.value[s] !== 'number') sizeQuantities.value[s] = 0
  })
  showSizeModal.value = true
}
function confirmSizesAndGoToCheckout() {
  const entries = Object.entries(sizeQuantities.value).filter(([, q]) => Number(q) > 0)
  if (!entries.length) { showSizeModal.value = false; return }
  entries.forEach(([size, qty]) => {
    addToCart({
      id: selectedProduct.value?.id || props.productId,
      name: selectedProduct.value?.name || 'Custom Produkt',
      price: selectedProduct.value?.price || '0',
      quantity: Number(qty),
      selectedSize: size,
      image: selectedProduct.value?.image
    })
  })
  showSizeModal.value = false
  router.push('/checkout')
}

// Helpers
const ensureFabric = async () => {
  if (!fabric) {
    const fm = await import('fabric')
    fabric = fm.default || fm
  }
  return fabric
}

// Init
const initCanvas = async () => {
  if (!canvasHost.value) return
  await ensureFabric()

  // Mount Fabric Canvas inside the host div to avoid DOM insertBefore issues
  const el = document.createElement('canvas')
  el.setAttribute('role', 'img')
  el.setAttribute('aria-label', 'Gestaltungsfläche')
  el.tabIndex = 0
  canvasHost.value.innerHTML = ''
  canvasHost.value.appendChild(el)

  canvas = new fabric.Canvas(el, {
    width: canvasHost.value.offsetWidth || 900,
    height: 600,
    backgroundColor: 'transparent',
    selection: true,
    preserveObjectStacking: true
  })
  canvas.perPixelTargetFind = false
  canvas.targetFindTolerance = 10

  // We now use a static <img> element underneath as the background.

  // Hinweis: Wir fügen Design-Objekte direkt zum Canvas hinzu
  designLayer = null

  addShirtOutline()

  // Mouse handlers: polygon point placement or panning (Alt)
  canvas.on('mouse:down', (opt) => {
    const e = opt.e
    if (isDrawingPolygon.value) {
      const pointer = canvas.getPointer(e)
      customPolygon.value.push({ x: pointer.x, y: pointer.y })
      drawPointMarkers()
      drawPolylineOverlay()
      drawPolygonOverlay()
      return
    }
    if (e.altKey) {
      isDragging = true
      lastPosX = e.clientX
      lastPosY = e.clientY
      canvas.defaultCursor = 'grabbing'
    }
  })
  canvas.on('mouse:move', (opt) => {
    if (!isDragging) return
    const e = opt.e
    const dx = e.clientX - lastPosX
    const dy = e.clientY - lastPosY
    const vpt = canvas.viewportTransform
    vpt[4] += dx; vpt[5] += dy
    canvas.setViewportTransform(vpt)
    lastPosX = e.clientX; lastPosY = e.clientY
  })
  canvas.on('mouse:up', () => { isDragging = false; canvas.defaultCursor = 'default' })
  canvas.on('mouse:wheel', (opt) => {
    const e = opt.e
    if (!e.ctrlKey) return
    e.preventDefault()
    const z = canvas.getZoom()
    const nz = z * (1 - e.deltaY / 1000)
    canvas.setZoom(Math.min(Math.max(nz, 0.5), 3))
    canvas.requestRenderAll()
  })

  // Auswahl / Manipulation
  canvas.on('selection:created', onSelection)
  canvas.on('selection:updated', onSelection)
  canvas.on('selection:cleared', onSelectionCleared)
  canvas.on('object:moving', (e) => validateAndMaybeRevert(e.target))
  canvas.on('object:scaling', (e) => validateAndMaybeRevert(e.target))
  canvas.on('object:rotating', (e) => validateAndMaybeRevert(e.target))

  setupDragAndDrop()
  // Load product data (background handled by static <img>)
  await updateProductAndBackground(props.productId)
}

// Background handled by static <img> in template for simplicity

// Product info
const selectedProduct = ref(null)
const productImages = ref([])
const currentViewIndex = ref(0)
const productName = computed(() => selectedProduct.value?.name || 'Unisex Basic T-Shirt')
const productDescription = computed(() => {
  const raw = selectedProduct.value?.description || ''
  try { return raw.replace(/<[^>]*>/g, '').trim() } catch { return raw }
})

// pickImage function removed - always using local bottle green image

const { wooService, formatProduct } = useWooCommerce()


// Removed dynamic background helpers; static <img> is used instead
async function updateProductAndBackground(id) {
  if (!id || !canvas) return
  try {
    const raw = await wooService.fetchProduct(String(id))
    selectedProduct.value = formatProduct(raw)
    
    // Always use the local bottle green image - no external image loading
    console.debug('Using local bottle green image for product:', selectedProduct.value)
    
    // Clear product images array since we only use local image
    productImages.value = []
    currentViewIndex.value = 0
    
    // Always load the local bottle green background
    await setShirtBackground()
  } catch {}
}

watch(() => props.productId, (id) => id && updateProductAndBackground(id), { immediate: true })

// Removed product image view switching - always use local bottle green image

const addShirtOutline = () => {
  if (!fabric) return
  // Outlines removed per request; keep only design objects and background
  bringDesignObjectsToFront()
}

// Drag & Drop (bind to host div to avoid null refs)
const setupDragAndDrop = () => {
  const el = canvasHost.value
  if (!el) return
  el.addEventListener('dragover', (e) => { e.preventDefault(); el.style.borderColor = '#D8127D' })
  el.addEventListener('dragleave', (e) => { e.preventDefault(); el.style.borderColor = '#e5e7eb' })
  el.addEventListener('drop', async (e) => {
    e.preventDefault(); el.style.borderColor = '#e5e7eb'
    const files = e.dataTransfer.files
    if (files && files.length > 0) await handleFile(files[0])
  })
}

// File Handling
const openFileInput = () => fileInput.value.click()
const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (file) await handleFile(file)
}
const handleFile = async (file) => {
  const fabricInstance = await ensureFabric()

  if (file.type.startsWith('image/')) {
    // For local files, use FileReader (no CORS issues)
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const fImg = new fabricInstance.Image(img, {
          left: canvas.width / 2,
          top: canvas.height / 2,
          originX: 'center',
          originY: 'center'
        })
        addImageToCanvas(fImg)
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  } else if (file.name.endsWith('.svg')) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const svgText = e.target.result
      fabricInstance.loadSVGFromString(svgText, (objects, options) => {
        const svgGroup = fabricInstance.util.groupSVGElements(objects, options)
        addImageToCanvas(svgGroup)
      })
    }
    reader.readAsText(file)
  }
}


const addObjectToDesignLayer = (obj) => {
  obj.set({ selectable: true, evented: true })
  obj.set({ name: 'DESIGN_OBJECT' })
  canvas.add(obj)
  obj.setCoords()
  canvas.setActiveObject(obj)
  canvas.requestRenderAll()
  hasDesign.value = true
  rememberTransform(obj)
}

const addImageToCanvas = (fabricObject) => {
  const maxSize = 200
  const scaleX = maxSize / (fabricObject.width || maxSize)
  const scaleY = maxSize / (fabricObject.height || maxSize)
  const scale = Math.min(scaleX, scaleY, 1)

  fabricObject.set({
    left: canvas.width / 2,
    top: canvas.height / 2,
    originX: 'center',
    originY: 'center',
    scaleX: scale,
    scaleY: scale
  })
  addObjectToDesignLayer(fabricObject)
  updateObjectBorder(fabricObject)
}

// Text
const addText = async () => {
  const f = await ensureFabric()
  const text = new f.Text('Text eingeben', {
    left: canvas.width / 2,
    top: canvas.height / 2,
    fontSize: 24,
    fill: '#000',
    fontFamily: 'Arial',
    originX: 'center',
    originY: 'center'
  })
  addObjectToDesignLayer(text)
  updateObjectBorder(text)
}

// Colors
const changeShirtColor = (index) => {
  selectedColor.value = index
  canvas.backgroundColor = colors[index].hex
  canvas.renderAll()
}
const textColors = [
  { name: 'Schwarz', hex: '#000000' },
  { name: 'Weiß', hex: '#ffffff' },
  { name: 'Rot', hex: '#e53935' },
  { name: 'Blau', hex: '#1976d2' },
  { name: 'Grün', hex: '#6bbf59' },
  { name: 'Gelb', hex: '#ffe600' },
  { name: 'Orange', hex: '#ff7a00' },
  { name: 'Pink', hex: '#D8127D' },
  { name: 'Lila', hex: '#8e24aa' },
  { name: 'Grau', hex: '#666666' },
  { name: 'Navy', hex: '#0a3a47' },
  { name: 'Türkis', hex: '#30d5c8' },
]

// Common web-safe fonts for quick selection
const availableFonts = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Georgia',
  'Courier New',
  'Verdana',
  'Tahoma',
  'Trebuchet MS',
  'Impact',
  'Lucida Sans Unicode',
  'Garamond',
  'Palatino Linotype',
  'Century Gothic',
  'Calibri',
  'Comic Sans MS'
]

// ---------- Utility ----------
function bringToTop(obj) {
  if (!canvas || !obj) return
  canvas.remove(obj)
  canvas.add(obj)
  canvas.requestRenderAll()
}

function bringDesignObjectsToFront() {
  if (!canvas) return
  const designObjects = canvas.getObjects().filter(o => o.name === 'DESIGN_OBJECT')
  designObjects.forEach(o => canvas.bringToFront(o))
  canvas.requestRenderAll()
}

function bringPolygonUIToFront() {
  if (!canvas) return
  // Bring polygon overlay, polyline, markers, and control points above everything
  if (polygonOverlay) canvas.bringToFront(polygonOverlay)
  if (polylineOverlay) canvas.bringToFront(polylineOverlay)
  pointMarkers.forEach(p => canvas.bringToFront(p))
  if (Array.isArray(polygonControlPoints)) polygonControlPoints.forEach(cp => canvas.bringToFront(cp))
  canvas.requestRenderAll()
}

// Selection
const onSelection = () => {
  const active = canvas.getActiveObject()
  if (active) {
    selectedObject.value = {
      type: active.type,
      text: active.text || '',
      fontSize: active.fontSize || 24,
      fill: active.fill || '#000000',
      fontFamily: active.fontFamily || 'Arial',
      opacity: active.opacity || 1
    }
    rememberTransform(active)
  }
}
const onSelectionCleared = () => { selectedObject.value = null }

// Update text/image
const updateText = () => {
  const active = canvas.getActiveObject()
  if (active && active.type === 'text' && selectedObject.value) {
    active.set({
      text: selectedObject.value.text,
      fontSize: parseInt(selectedObject.value.fontSize),
      fill: selectedObject.value.fill,
      fontFamily: selectedObject.value.fontFamily
    })
    canvas.requestRenderAll()
  }
}
const changeTextColor = (hex) => {
  if (!selectedObject.value) return
  selectedObject.value.fill = hex
  updateText()
}
const updateImage = () => {
  const active = canvas.getActiveObject()
  if (active && active.type === 'image' && selectedObject.value) {
    active.set('opacity', parseFloat(selectedObject.value.opacity))
    canvas.requestRenderAll()
  }
}

// Layers
const bringToFront = () => {
  const active = canvas.getActiveObject()
  if (active) { canvas.bringToFront(active); canvas.setActiveObject(active); canvas.requestRenderAll() }
}
const sendToBack = () => {
  const active = canvas.getActiveObject()
  if (active) {
    canvas.sendToBack(active)
    canvas.setActiveObject(active)
    canvas.requestRenderAll()
  }
}
const deleteObject = () => {
  const active = canvas.getActiveObject()
  if (active) {
    canvas.remove(active)
    selectedObject.value = null
    hasDesign.value = canvas.getObjects().some(o => o.name === 'DESIGN_OBJECT')
    canvas.requestRenderAll()
  }
}

// Zoom & View
const zoomIn = () => { const z = canvas.getZoom(); canvas.setZoom(Math.min(z * 1.1, 3)); canvas.requestRenderAll() }
const zoomOut = () => { const z = canvas.getZoom(); canvas.setZoom(Math.max(z / 1.1, 0.5)); canvas.requestRenderAll() }
const resetView = () => { canvas.setZoom(1); canvas.setViewportTransform([1,0,0,1,0,0]); canvas.requestRenderAll() }

// Export
const exportDesign = () => {
  // Ensure everything is visible for export
  const oldClip = canvas.clipPath
  canvas.clipPath = null
  canvas.discardActiveObject()
  // Hide polygon UI
  const toHide = []
  if (polygonOverlay) { toHide.push({ o: polygonOverlay, v: polygonOverlay.visible }); polygonOverlay.visible = false }
  if (polylineOverlay) { toHide.push({ o: polylineOverlay, v: polylineOverlay.visible }); polylineOverlay.visible = false }
  pointMarkers.forEach(p => { toHide.push({ o: p, v: p.visible }); p.visible = false })
  if (Array.isArray(polygonControlPoints)) polygonControlPoints.forEach(cp => { toHide.push({ o: cp, v: cp.visible }); cp.visible = false })

  canvas.requestRenderAll()
  // Export full canvas (shirt + design objects), without polygon UI
  const dataUrl = canvas.toDataURL({ format: 'png', quality: 1 })
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = 'design_export.png'
  document.body.appendChild(link)
  link.click()
  link.remove()
  // Restore clip if needed
  canvas.clipPath = oldClip
  // Restore polygon UI visibility
  toHide.forEach(({ o, v }) => { o.visible = v })
  canvas.requestRenderAll()
}

// Panning & Zoom via Fabric events
let isDragging = false, lastPosX = 0, lastPosY = 0
canvas?.on?.('mouse:down', (opt) => {
  const e = opt.e
  if (e.altKey) {
    isDragging = true
    lastPosX = e.clientX
    lastPosY = e.clientY
    canvas.defaultCursor = 'grabbing'
  }
})
canvas?.on?.('mouse:move', (opt) => {
  if (!isDragging) return
  const e = opt.e
  const dx = e.clientX - lastPosX
  const dy = e.clientY - lastPosY
  const vpt = canvas.viewportTransform
  vpt[4] += dx; vpt[5] += dy
  canvas.setViewportTransform(vpt)
  lastPosX = e.clientX; lastPosY = e.clientY
})
canvas?.on?.('mouse:up', () => { isDragging = false; canvas.defaultCursor = 'default' })
canvas?.on?.('mouse:wheel', (opt) => {
  const e = opt.e
  if (!e.ctrlKey) return
  e.preventDefault()
  const z = canvas.getZoom()
  const nz = z * (1 - e.deltaY / 1000)
  canvas.setZoom(Math.min(Math.max(nz, 0.5), 3))
  canvas.requestRenderAll()
})

// Keyboard
const onKeyDown = (e) => {
  if (!canvas) return

  // Admin: Polygon steuern
  if (isAdminMode.value) {
    if (e.key === 'Enter' && isDrawingPolygon.value) {
      e.preventDefault()
      // finish polygon: switch to edit mode
      isDrawingPolygon.value = false
      isEditingArea.value = true
      canvas.selection = true
      canvas.skipTargetFind = false
      canvas.defaultCursor = 'default'
      removePolylineOverlay()
      drawPolygonOverlay()
      renderPolygonControlPoints()
      return
    }
    if (e.key === 'Escape' && (isDrawingPolygon.value || isEditingArea.value)) {
      e.preventDefault()
      isDrawingPolygon.value = false
      isEditingArea.value = false
      clearPolygonControlPoints()
      removePolylineOverlay()
      removePointMarkers()
      return
    }
  }

  if ((e.key === 'Delete' || e.key === 'Backspace')) {
    const active = canvas.getActiveObject()
    if (active) { e.preventDefault(); deleteObject() }
  }
}



// Simplified polygon controls
const polygonButtonTitle = computed(() => {
  if (isDrawingPolygon.value) return 'Punkt setzen (Enter fertig)'
  if (isEditingArea.value) return 'Polygon bearbeiten (Punkte ziehen)'
  return 'Polygon-Modus starten'
})
const polygonButtonHelp = computed(() => {
  if (isDrawingPolygon.value) return 'Klicken zum Punkt setzen – Enter: fertig'
  if (isEditingArea.value) return 'Ziehe Punkte, Esc: beenden'
  return 'Erstelle eine Fläche durch Klicken'
})
function handlePolygonButton() {
  if (!isAdminMode.value) {
    isAdminMode.value = true
  }
  if (!isDrawingPolygon.value && !isEditingArea.value) {
    // start draw mode
    isDrawingPolygon.value = true
    canvas.discardActiveObject()
    canvas.selection = false
    canvas.skipTargetFind = true
    canvas.defaultCursor = 'crosshair'
    customPolygon.value = []
    removePolylineOverlay()
    removePointMarkers()
    removePolygonOverlay()
    drawPolylineOverlay()
    return
  }
  if (isDrawingPolygon.value) {
    // finish drawing -> edit mode
    isDrawingPolygon.value = false
    isEditingArea.value = true
    canvas.selection = true
    canvas.skipTargetFind = false
    canvas.defaultCursor = 'default'
    removePolylineOverlay()
    drawPolygonOverlay()
    renderPolygonControlPoints()
    return
  }
  if (isEditingArea.value) {
    // leave edit mode
    isEditingArea.value = false
    clearPolygonControlPoints()
    removePolylineOverlay()
    removePointMarkers()
  }
}

function toggleEditPolygon() {
  if (!customPolygon.value.length) return
  isEditingArea.value = !isEditingArea.value
  if (isEditingArea.value) {
    renderPolygonControlPoints()
  } else {
    clearPolygonControlPoints()
  }
}

// ---------- Polygon / Clip ----------
const toggleAdminMode = () => {
  isAdminMode.value = !isAdminMode.value
  if (!isAdminMode.value) {
    isEditingArea.value = false
    isDrawingPolygon.value = false
    clearPolygonControlPoints()
  }
}

const toggleAreaEditing = () => {}

const togglePolygonMode = () => {}

const finishPolygon = () => {}

// Overlays & Marker
function drawPointMarkers() {
  removePointMarkers()
  for (let i = 0; i < customPolygon.value.length; i++) {
    const pt = customPolygon.value[i]
    const dot = new fabric.Circle({
      left: pt.x, top: pt.y, originX: 'center', originY: 'center',
      radius: 3.5, fill: '#0a3a47', stroke: '#ffffff', strokeWidth: 1,
      selectable: false, evented: false, name: 'POLY_DOT'
    })
    pointMarkers.push(dot)
    canvas.add(dot)
  }
  pointMarkers.forEach(bringToTop)
  canvas.requestRenderAll()
}
function removePointMarkers() {
  if (!pointMarkers.length) return
  pointMarkers.forEach(d => canvas.remove(d))
  pointMarkers.length = 0
}

function drawPolylineOverlay() {
  const pts = customPolygon.value
  if (pts.length < 2) { removePolylineOverlay(); return }
  const polyPts = pts.map(p => ({ x: p.x, y: p.y }))
  if (polylineOverlay) {
    polylineOverlay.set({ points: polyPts })
  } else {
    polylineOverlay = new fabric.Polyline(polyPts, {
      fill: 'transparent',
      stroke: '#0a3a47',
      strokeWidth: 2,
      selectable: false,
      evented: false,
      name: 'PLACEMENT_POLYLINE',
      absolutePositioned: true,
    })
    canvas.add(polylineOverlay)
  }
  bringToTop(polylineOverlay)
  bringPolygonUIToFront()
  canvas.requestRenderAll()
}
function removePolylineOverlay() {
  if (polylineOverlay) {
    canvas.remove(polylineOverlay)
    polylineOverlay = null
    canvas.requestRenderAll()
  }
}

function drawPolygonOverlay() {
  const pts = customPolygon.value
  if (pts.length < 3) { removePolygonOverlay(); return }
  const points = pts.map(pt => ({ x: pt.x, y: pt.y }))
  if (polygonOverlay) {
    polygonOverlay.set({ points })
  } else {
    polygonOverlay = new fabric.Polygon(points, {
      fill: 'rgba(0, 150, 255, 0.1)',
      stroke: '#0a3a47',
      strokeWidth: 2,
      strokeLineJoin: 'round',
      strokeMiterLimit: 2,
      selectable: false,
      evented: false,
      name: 'PLACEMENT_OVERLAY',
      absolutePositioned: true,
    })
    canvas.add(polygonOverlay)
  }
  bringToTop(polygonOverlay)
  bringPolygonUIToFront()
  canvas.requestRenderAll()
}
function removePolygonOverlay() {
  if (polygonOverlay) { canvas.remove(polygonOverlay); polygonOverlay = null; canvas.requestRenderAll() }
  clearPolygonControlPoints()
}

function renderPolygonControlPoints() {
  clearPolygonControlPoints()
  if (customPolygon.value.length < 3) return
  polygonControlPoints = customPolygon.value.map((pt, index) => {
    const cp = new fabric.Circle({
      left: pt.x, top: pt.y, originX: 'center', originY: 'center',
      radius: 6, fill: '#0a3a47', stroke: '#ffffff', strokeWidth: 2,
      hasControls: false, hasBorders: false, name: 'POLY_CP',
      selectable: true, hoverCursor: 'pointer',
      perPixelTargetFind: false
    })
    cp._polyIndex = index
    cp.on('moving', () => {
      customPolygon.value[cp._polyIndex] = { x: cp.left, y: cp.top }
      drawPointMarkers()
      drawPolylineOverlay()
      drawPolygonOverlay()
      applyClipPathFromCustomPolygon()
    })
    canvas.add(cp)
    return cp
  })
  polygonControlPoints.forEach(bringToTop)
  bringPolygonUIToFront()
  canvas.requestRenderAll()
}
function clearPolygonControlPoints() {
  if (!polygonControlPoints.length) return
  polygonControlPoints.forEach(cp => canvas.remove(cp))
  polygonControlPoints = []
  canvas.requestRenderAll()
}

// ClipPath anwenden
function applyClipPathFromCustomPolygon() {
  // Temporarily disable visual clipping to avoid cutting off images
  canvas.clipPath = null
  clipPolygon = null
  canvas.requestRenderAll()
}

// Persistenz
function normalizePoints(points) {
  const w = canvas.width, h = canvas.height
  return points.map(p => ({ x: p.x / w, y: p.y / h }))
}
function denormalizePoints(points) {
  const w = canvas.width, h = canvas.height
  return points.map(p => ({ x: p.x * w, y: p.y * h }))
}
async function savePolygonToStore(productId, normalizedPoints) {
  const payload = { points: normalizedPoints, updatedAt: new Date().toISOString() }
  try {
    const res = await fetch(`/api/products/${encodeURIComponent(productId)}/placement-area`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
  } catch {
    localStorage.setItem(`placementArea:${productId}`, JSON.stringify(payload))
  }
}
async function loadPolygonFromStore(productId) {
  try {
    const res = await fetch(`/api/products/${encodeURIComponent(productId)}/placement-area`)
    if (res.ok) return await res.json()
  } catch {}
  const raw = localStorage.getItem(`placementArea:${productId}`)
  return raw ? JSON.parse(raw) : null
}

async function savePlacementArea() {
  if (customPolygon.value.length < 3) { alert('Bitte mindestens 3 Punkte setzen.'); return }
  const normalized = normalizePoints(customPolygon.value)
  await savePolygonToStore(String(props.productId), normalized)
  showWarning.value = false; warningMessage.value = ''
  applyClipPathFromCustomPolygon()
}
async function loadPlacementArea() {
  const data = await loadPolygonFromStore(String(props.productId))
  if (data && Array.isArray(data.points) && data.points.length >= 3) {
    customPolygon.value = denormalizePoints(data.points)
    drawPointMarkers()
    drawPolylineOverlay()
    drawPolygonOverlay()
    applyClipPathFromCustomPolygon()
  }
}
function clearPlacementArea() {
  customPolygon.value = []
  removePolylineOverlay()
  removePointMarkers()
  removePolygonOverlay()
  applyClipPathFromCustomPolygon()
}

// ---------- Placement-Validation ----------
function pointInPolygon(x, y, polygon) {
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y
    const xj = polygon[j].x, yj = polygon[j].y
    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / ((yj - yi) || 1e-6) + xi)
    if (intersect) inside = !inside
  }
  return inside
}
function objectFullyInsidePolygon(object, polygonPoints) {
  object.setCoords()
  const br = object.getBoundingRect(true, true)
  const pts = [
    { x: br.left, y: br.top },
    { x: br.left + br.width, y: br.top },
    { x: br.left, y: br.top + br.height },
    { x: br.left + br.width, y: br.top + br.height }
  ]
  return pts.every(p => pointInPolygon(p.x, p.y, polygonPoints))
}
function rememberTransform(obj) {
  lastValidTransform.set(obj, {
    left: obj.left, top: obj.top, scaleX: obj.scaleX, scaleY: obj.scaleY, angle: obj.angle || 0
  })
}
function validateAndMaybeRevert(obj) {
  if (!obj) return
  if (obj.name !== 'DESIGN_OBJECT') return

  const hasPoly = customPolygon.value.length >= 3
  if (!hasPoly) {
    updateObjectBorder(obj)
    rememberTransform(obj)
    return
  }

  const inside = objectFullyInsidePolygon(obj, customPolygon.value)
  if (inside) {
    updateObjectBorder(obj)
    rememberTransform(obj)
  } else {
    // Allow movement outside polygon but show warning/border
    obj.set({ stroke: '#e53e3e', strokeWidth: 3 })
    showWarning.value = true
    warningMessage.value = 'Bitte innerhalb der Fläche platzieren.'
    canvas.requestRenderAll()
  }
}
function updateObjectBorder(object) {
  if (!object) return
  let ok = true
  if (customPolygon.value.length >= 3) ok = objectFullyInsidePolygon(object, customPolygon.value)
  if (ok) {
    object.set('stroke', null); object.set('strokeWidth', 0)
    showWarning.value = false
  } else {
    object.set('stroke', '#e53e3e'); object.set('strokeWidth', 3)
    showWarning.value = true; warningMessage.value = 'Bitte platziere deine Inhalte innerhalb des Rahmens'
  }
  canvas.requestRenderAll()
}

// Canvas an Fenstergröße anpassen
function handleResize() {
  if (!canvas || !canvasHost.value) return
  const w = canvasHost.value.offsetWidth
  const h = 600
  canvas.setWidth(w)
  canvas.setHeight(h)
  canvas.requestRenderAll()
}

// Lifecycle
onMounted(async () => {
  await nextTick()
  await initCanvas()
  await loadPlacementArea()
  window.addEventListener('resize', handleResize)
})
onUnmounted(() => {
  if (canvas) canvas.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.btn {
  @apply transition font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 px-4 py-2 rounded-lg;
}
.btn-secondary {
  @apply transition font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700;
}
input[type="range"] { @apply w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer; }
input[type="range"]::-webkit-slider-thumb { @apply appearance-none h-4 w-4 rounded-full bg-[#D8127D] cursor-pointer; }
input[type="range"]::-moz-range-thumb { @apply h-4 w-4 rounded-full bg-[#D8127D] cursor-pointer border-0; }
</style>
