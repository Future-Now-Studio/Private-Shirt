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

              <!-- Admin Controls simplified -->
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

          <!-- Canvas Container -->
          <div class="relative rounded-lg overflow-hidden">
            <div
              ref="canvasHost"
              class="relative w-full h-[600px] cursor-crosshair bg-white"
              :style="hostBgStyle"
              @keydown="onKeyDown"
              tabindex="0"
            ></div>

            <!-- Warning Message -->
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
            <div class="text-sm text-[#D8127D] font-semibold mb-2 flex items-center gap-2"></div>
          </div>

          <!-- Upload Section -->
          <div>
            <div class="space-y-3">
              <button @click="openFileInput" class="btn w-full bg-[#D8127D] hover:bg-[#b0105f] text-white">
                <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0-3l-3 3m3-3v12"/>
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

          <!-- Admin Section -->
          <div v-if="isAdminMode" class="border-t pt-4">
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm font-semibold text-gray-700">Admin Tools</span>
                <button @click="toggleAdminMode" class="text-xs text-gray-500 hover:text-gray-700">Exit Admin</button>
              </div>
              
              <button @click="togglePrintingAreaMode" 
                      :class="['btn w-full text-sm', printingAreaMode ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-gray-600 hover:bg-gray-700 text-white']">
                <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                {{ printingAreaMode ? 'Exit Printing Area Mode' : 'Set Printing Areas' }}
              </button>
              
              <div v-if="printingAreaMode" class="text-xs text-gray-600 bg-yellow-50 p-2 rounded">
                <p><strong>Instructions:</strong></p>
                <p>• Click and drag on empty canvas to create printing area rectangles</p>
                <p>• Click on existing rectangles to select and move/resize them</p>
                <p>• Press Delete key to remove selected printing area</p>
                <p>• Click "Save Printing Areas" when done</p>
              </div>
              
              <button v-if="printingAreaMode && printingAreas.length > 0" 
                      @click="savePrintingAreas" 
                      class="btn w-full bg-green-600 hover:bg-green-700 text-white text-sm">
                <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
                </svg>
                Save Printing Areas ({{ printingAreas.length }})
              </button>
              
              <!-- Printing Area Dimensions -->
              <div v-if="printingAreas.length > 0" class="text-xs text-gray-600 bg-blue-50 p-2 rounded">
                <p class="font-semibold mb-1">Druckbereich Dimensionen:</p>
                <div v-for="(area, index) in printingAreas" :key="index" class="mb-1">
                  <span class="font-medium">Bereich {{ index + 1 }}:</span>
                  {{ Math.round(area.width * 0.264583) }} × {{ Math.round(area.height * 0.264583) }} mm
                  <span class="text-gray-500">({{ Math.round(area.width) }} × {{ Math.round(area.height) }} px)</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Admin Toggle Button (Hidden by default) -->
          <div v-if="!isAdminMode" class="border-t pt-4">
            <button @click="toggleAdminMode" class="text-xs text-gray-400 hover:text-gray-600 w-full text-left">
              Admin Tools
            </button>
          </div>

          <!-- Product Variations -->
          <div v-if="productVariations.length > 0">
            <div class="font-semibold mb-2 text-[#0a3a47]">Produkt Farben</div>
            <div class="grid grid-cols-4 gap-2 mb-2">
              <button
                v-for="variation in productVariations"
                :key="variation.id"
                :title="variation.colorCode || variation.name"
                @click="selectVariation(variation)"
                :class="['w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xs font-semibold group relative overflow-hidden',
                         selectedVariation?.id === variation.id ? 'border-[#D8127D] ring-2 ring-[#ffd44d]' : 'border-gray-200']"
                :style="{ backgroundColor: variation._hex || getColorFromCode(variation.colorCode) || '#ccc' }"
              >
                <!-- Color code only visible on hover -->
                <span class="text-white drop-shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {{ variation.colorCode || 'N/A' }}
                </span>
              </button>
            </div>
            <div class="text-xs text-gray-500">
              Gewählte Farbe: <span class="font-semibold text-[#0a3a47]">{{ selectedVariation?.colorCode || 'Standard' }}</span>
            </div>
          </div>

          <!-- Fallback Color Swatches (if no variations) -->
          <div v-else>
            <div class="font-semibold mb-2 text-[#0a3a47]">Shirt Farbe</div>
            <div class="grid grid-cols-8 gap-2 mb-2">
              <button
                v-for="(color, i) in colors"
                :key="color.name"
                :title="color.name"
                @click="changeShirtColor(i)"
                :class="['w-7 h-7 rounded-full border-2 group relative flex items-center justify-center text-xs font-semibold',
                         selectedColor === i ? 'border-[#D8127D] ring-2 ring-[#ffd44d]' : 'border-gray-200']"
                :style="{backgroundColor: color.hex}"
              >
                <!-- Color name only visible on hover -->
                <span class="text-white drop-shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {{ color.name.charAt(0) }}
                </span>
              </button>
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
              <span class="text-lg font-bold text-[#D8127D]">{{ productPrice }} €</span>
            </div>
            <div class="text-xs text-gray-500">inkl. MwSt. EU / inkl. Druckkosten / zzgl. <a href="#" class="underline text-[#D8127D]">Versand</a></div>
            <div class="text-sm text-[#0a3a47] font-semibold mt-2">Lieferung in der Regel innerhalb von 4 Werktagen</div>
          </div>

          <div class="flex gap-2 mt-2">
            <button @click="openEmailModal" class="btn flex-1 bg-[#D8127D] hover:bg-[#b0105f] text-white text-sm font-bold py-3 rounded-lg">
              Per E-Mail senden
            </button>
            <button @click="openSizeModal" class="btn flex-1 bg-[#ff7a00] hover:bg-[#ffa940] text-white text-sm font-bold py-3 rounded-lg">
              Größe und Menge wählen
            </button>
          </div>
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

  <!-- Email Modal -->
  <div v-if="showEmailModal" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black/40" @click="showEmailModal = false"></div>
    <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6">
      <h3 class="text-lg font-semibold text-[#0a3a47] mb-4">Design per E-Mail senden</h3>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">E-Mail Adresse</label>
          <input 
            type="email" 
            v-model="emailAddress" 
            placeholder="deine@email.de"
            class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#D8127D] focus:border-transparent"
            :class="{ 'border-red-500': emailError }"
          />
          <p v-if="emailError" class="text-red-500 text-xs mt-1">{{ emailError }}</p>
        </div>
        
        <div class="bg-gray-50 p-3 rounded-lg">
          <p class="text-sm text-gray-600">
            <strong>Was wird gesendet:</strong><br>
            • Dein komplettes Design als Bild<br>
            • Alle Design-Elemente einzeln<br>
            • Produktinformationen<br>
            • Link zum Bestellen
          </p>
        </div>
      </div>
      
      <div class="flex justify-end gap-2 mt-6">
        <button @click="showEmailModal = false" class="btn btn-secondary">Abbrechen</button>
        <button @click="sendDesignByEmail" :disabled="isSendingEmail" class="btn bg-[#D8127D] hover:bg-[#b0105f] text-white disabled:opacity-50">
          <span v-if="isSendingEmail">Wird gesendet...</span>
          <span v-else>E-Mail senden</span>
        </button>
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

// Email functionality
const showEmailModal = ref(false)
const emailAddress = ref('')
const emailError = ref('')
const isSendingEmail = ref(false)

// Admin/Polygon
const isAdminMode = ref(false)
const isEditingArea = ref(false)
const isDrawingPolygon = ref(false)
const customPolygon = ref([]) // [{x,y}]
let polygonOverlay = null
let polylineOverlay = null
const pointMarkers = []
let polygonControlPoints = []

// Printing Area Management
const printingAreaMode = ref(false)
const printingAreas = ref([]) // Array of printing area rectangles
const isDrawingPrintingArea = ref(false)
const currentPrintingArea = ref(null)
let printingAreaStartPoint = null

// Shirt Colors
const selectedColor = ref(2)
const colors = [
  { name: 'Weiß', hex: '#FFFFFF' },
  { name: 'Schwarz', hex: '#000000' },
  { name: 'Atoll', hex: '#00BFFF' },
  { name: 'Gelb', hex: '#FFFF00' },
  { name: 'Pink', hex: '#FF1493' },
  { name: 'Grün', hex: '#00FF00' },
  { name: 'Rot', hex: '#FF0000' },
  { name: 'Blau', hex: '#0000FF' },
]

// UI
const selectedObject = ref(null)
const hasDesign = ref(false)
const showWarning = ref(false)
const warningMessage = ref('')

// The background is rendered via CSS on the host div
const hostBgStyle = computed(() => {
  const imageUrl = selectedVariation.value?.image || selectedProduct.value?.image || DEFAULT_BG_URL
  return {
    backgroundImage: `url(${imageUrl})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'contain'
  }
})

const availableSizes = computed(() => {
  // Prefer WooCommerce Size attribute values; fallback to standard sizes
  const sizes = (selectedProduct.value?.sizes && selectedProduct.value.sizes.length > 0)
    ? selectedProduct.value.sizes
    : ['S','M','L','XL','XXL']
  // Initialize quantities for any missing keys
  sizes.forEach(s => {
    if (typeof sizeQuantities.value[s] !== 'number') sizeQuantities.value[s] = 0
  })
  return sizes
})
function openSizeModal() {
  if (!selectedProduct.value) return
  // Ensure quantities are initialized for current available sizes
  availableSizes.value.forEach(s => {
    if (typeof sizeQuantities.value[s] !== 'number') sizeQuantities.value[s] = 0
  })
  showSizeModal.value = true
}
function confirmSizesAndGoToCheckout() {
  // Check if any design objects are outside printing areas
  if (printingAreas.value.length > 0 && !validateDesignInPrintingAreas()) {
    alert('Bitte verschieben Sie alle Design-Elemente in die definierten Druckbereiche, bevor Sie fortfahren.')
    return
  }
  
  const entries = Object.entries(sizeQuantities.value).filter(([, q]) => Number(q) > 0)
  if (!entries.length) { showSizeModal.value = false; return }
  entries.forEach(([size, qty]) => {
    addToCart({
      id: selectedProduct.value?.id || props.productId,
      name: selectedProduct.value?.name || 'Custom Produkt',
      price: selectedVariation.value?.price || selectedProduct.value?.price || '0',
      quantity: Number(qty),
      selectedSize: size,
      selectedColor: selectedVariation.value?.colorCode || null,
      image: selectedVariation.value?.image || selectedProduct.value?.image
    })
  })
  showSizeModal.value = false
  router.push('/checkout')
}

// Email functionality
function openEmailModal() {
  emailAddress.value = ''
  emailError.value = ''
  showEmailModal.value = true
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

async function sendDesignByEmail() {
  // Validate email
  if (!emailAddress.value.trim()) {
    emailError.value = 'Bitte gib eine E-Mail Adresse ein.'
    return
  }
  
  if (!validateEmail(emailAddress.value)) {
    emailError.value = 'Bitte gib eine gültige E-Mail Adresse ein.'
    return
  }
  
  isSendingEmail.value = true
  emailError.value = ''
  
  try {
    // Generate composite image (full design)
    const compositeImage = await generateCompositeImage()
    
    // Generate individual design element images
    const individualImages = await generateIndividualImages()
    
    // Create email content
    const emailContent = createEmailContent(compositeImage, individualImages)
    
    // Send email (this would typically call a backend API)
    await sendEmail(emailAddress.value, emailContent)
    
    // Success
    showEmailModal.value = false
    alert('Dein Design wurde erfolgreich per E-Mail gesendet!')
    
  } catch (error) {
    console.error('Error sending email:', error)
    emailError.value = 'Fehler beim Senden der E-Mail. Bitte versuche es erneut.'
  } finally {
    isSendingEmail.value = false
  }
}

async function generateCompositeImage() {
  if (!canvas) throw new Error('Canvas not initialized')
  
  // Create a temporary canvas for the composite image
  const tempCanvas = document.createElement('canvas')
  const tempCtx = tempCanvas.getContext('2d')
  
  // Set canvas size to match the design
  tempCanvas.width = 800
  tempCanvas.height = 600
  
  // Fill with white background
  tempCtx.fillStyle = 'white'
  tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height)
  
  // Draw background image if available
  if (bgImageObj && bgImageObj._originalElement) {
    const img = bgImageObj._originalElement
    const scale = Math.min(tempCanvas.width / img.width, tempCanvas.height / img.height)
    const scaledWidth = img.width * scale
    const scaledHeight = img.height * scale
    const x = (tempCanvas.width - scaledWidth) / 2
    const y = (tempCanvas.height - scaledHeight) / 2
    
    tempCtx.drawImage(img, x, y, scaledWidth, scaledHeight)
  }
  
  // Draw all design objects
  const designObjects = canvas.getObjects().filter(obj => obj.name === 'DESIGN_OBJECT')
  designObjects.forEach(obj => {
    if (obj.type === 'textbox' || obj.type === 'text') {
      // Draw text
      tempCtx.font = `${obj.fontSize}px ${obj.fontFamily}`
      tempCtx.fillStyle = obj.fill
      tempCtx.textAlign = 'left'
      tempCtx.textBaseline = 'top'
      tempCtx.fillText(obj.text, obj.left, obj.top)
    } else if (obj.type === 'image') {
      // Draw image
      const img = obj._originalElement
      if (img) {
        tempCtx.drawImage(img, obj.left, obj.top, obj.width * obj.scaleX, obj.height * obj.scaleY)
      }
    }
  })
  
  return tempCanvas.toDataURL('image/png')
}

async function generateIndividualImages() {
  if (!canvas) throw new Error('Canvas not initialized')
  
  const individualImages = []
  const designObjects = canvas.getObjects().filter(obj => obj.name === 'DESIGN_OBJECT')
  
  for (const obj of designObjects) {
    const tempCanvas = document.createElement('canvas')
    const tempCtx = tempCanvas.getContext('2d')
    
    // Set canvas size based on object
    tempCanvas.width = obj.width * obj.scaleX + 20 // Add padding
    tempCanvas.height = obj.height * obj.scaleY + 20
    
    // Fill with transparent background
    tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height)
    
    if (obj.type === 'textbox' || obj.type === 'text') {
      // Draw text
      tempCtx.font = `${obj.fontSize}px ${obj.fontFamily}`
      tempCtx.fillStyle = obj.fill
      tempCtx.textAlign = 'left'
      tempCtx.textBaseline = 'top'
      tempCtx.fillText(obj.text, 10, 10) // Add padding
    } else if (obj.type === 'image') {
      // Draw image
      const img = obj._originalElement
      if (img) {
        tempCtx.drawImage(img, 10, 10, obj.width * obj.scaleX, obj.height * obj.scaleY)
      }
    }
    
    individualImages.push({
      type: obj.type,
      content: tempCanvas.toDataURL('image/png'),
      name: obj.type === 'textbox' || obj.type === 'text' ? `Text: ${obj.text.substring(0, 20)}...` : 'Bild'
    })
  }
  
  return individualImages
}

function createEmailContent(compositeImage, individualImages) {
  const productName = selectedProduct.value?.name || 'Custom Produkt'
  const productPrice = productPrice.value
  
  return {
    subject: `Dein Design für ${productName} - Private Shirt`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #D8127D;">Hallo!</h2>
        <p>Hier ist dein gestaltetes Design für <strong>${productName}</strong>:</p>
        
        <div style="text-align: center; margin: 20px 0;">
          <h3>Dein komplettes Design:</h3>
          <img src="${compositeImage}" alt="Komplettes Design" style="max-width: 100%; border: 1px solid #ddd; border-radius: 8px;">
        </div>
        
        ${individualImages.length > 0 ? `
        <div style="margin: 20px 0;">
          <h3>Deine Design-Elemente einzeln:</h3>
          ${individualImages.map(img => `
            <div style="margin: 10px 0; padding: 10px; border: 1px solid #eee; border-radius: 4px;">
              <h4 style="margin: 0 0 10px 0; color: #0a3a47;">${img.name}</h4>
              <img src="${img.content}" alt="${img.name}" style="max-width: 200px; border: 1px solid #ddd;">
            </div>
          `).join('')}
        </div>
        ` : ''}
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #0a3a47; margin-top: 0;">Produktinformationen:</h3>
          <p><strong>Produkt:</strong> ${productName}</p>
          <p><strong>Preis:</strong> ${productPrice} €</p>
          <p><strong>Farbe:</strong> ${selectedVariation.value?.colorCode || 'Standard'}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${window.location.origin}/customization-creator?product=${props.productId}" 
             style="background: #D8127D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Jetzt bestellen
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          Mit freundlichen Grüßen<br>
          Dein Private Shirt Team
        </p>
      </div>
    `
  }
}

async function sendEmail(email, content) {
  // This would typically call a backend API to send the email
  // For now, we'll simulate the email sending
  console.log('Sending email to:', email)
  console.log('Email content:', content)
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // In a real implementation, you would call your backend API here:
  // const response = await fetch('/api/send-email', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ email, content })
  // })
  // if (!response.ok) throw new Error('Failed to send email')
}

// Admin and Printing Area Methods
function toggleAdminMode() {
  isAdminMode.value = !isAdminMode.value
  if (!isAdminMode.value) {
    printingAreaMode.value = false
    isDrawingPrintingArea.value = false
  }
}

function togglePrintingAreaMode() {
  printingAreaMode.value = !printingAreaMode.value
  isDrawingPrintingArea.value = false
  if (printingAreaMode.value) {
    loadPrintingAreas()
  }
}

async function loadPrintingAreas() {
  try {
    const response = await fetch(`/api/products/${props.productId}/placement-area`)
    if (response.ok) {
      const data = await response.json()
      printingAreas.value = data.printingAreas || []
      renderPrintingAreas()
    }
  } catch (error) {
    console.error('Error loading printing areas:', error)
  }
}

async function savePrintingAreas() {
  try {
    const response = await fetch(`/api/products/${props.productId}/placement-area`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        printingAreas: printingAreas.value
      })
    })
    
    if (response.ok) {
      alert('Druckbereiche erfolgreich gespeichert!')
      printingAreaMode.value = false
    } else {
      alert('Fehler beim Speichern der Druckbereiche.')
    }
  } catch (error) {
    console.error('Error saving printing areas:', error)
    alert('Fehler beim Speichern der Druckbereiche.')
  }
}

function renderPrintingAreas() {
  if (!canvas || !printingAreas.value.length) return
  
  // Clear existing printing area objects
  const existingAreas = canvas.getObjects().filter(obj => obj.name === 'PRINTING_AREA')
  existingAreas.forEach(obj => canvas.remove(obj))
  
  // Add printing area rectangles
  printingAreas.value.forEach((area, index) => {
    const rect = new fabric.Rect({
      left: area.x,
      top: area.y,
      width: area.width,
      height: area.height,
      fill: 'rgba(255, 0, 0, 0.1)',
      stroke: '#ff0000',
      strokeWidth: 2,
      strokeDashArray: [5, 5],
      selectable: true,
      evented: true,
      name: 'PRINTING_AREA',
      data: { index },
      cornerColor: '#ff0000',
      cornerSize: 8,
      transparentCorners: false,
      borderColor: '#ff0000',
      borderScaleFactor: 2
    })
    
    // Add event listeners for moving and resizing
    rect.on('modified', () => {
      updatePrintingAreaFromObject(rect)
    })
    
    rect.on('moving', () => {
      updatePrintingAreaFromObject(rect)
    })
    
    rect.on('scaling', () => {
      updatePrintingAreaFromObject(rect)
    })
    
    canvas.add(rect)
  })
  
  canvas.requestRenderAll()
}

function updatePrintingAreaFromObject(rect) {
  const index = rect.data.index
  if (index !== undefined && printingAreas.value[index]) {
    printingAreas.value[index] = {
      x: rect.left,
      y: rect.top,
      width: rect.width * rect.scaleX,
      height: rect.height * rect.scaleY
    }
  }
}

function validateDesignInPrintingAreas() {
  if (!canvas || printingAreas.value.length === 0) return true
  
  const designObjects = canvas.getObjects().filter(obj => obj.name === 'DESIGN_OBJECT')
  
  for (const obj of designObjects) {
    const objBounds = obj.getBoundingRect()
    let isInPrintingArea = false
    
    for (const area of printingAreas.value) {
      if (isObjectInArea(objBounds, area)) {
        isInPrintingArea = true
        break
      }
    }
    
    if (!isInPrintingArea) {
      return false
    }
  }
  
  return true
}

function isObjectInArea(objBounds, area) {
  return objBounds.left >= area.x &&
         objBounds.top >= area.y &&
         objBounds.left + objBounds.width <= area.x + area.width &&
         objBounds.top + objBounds.height <= area.y + area.height
}

function updatePrintingAreaPreview() {
  if (!canvas || !currentPrintingArea.value) return
  
  // Remove existing preview
  const existingPreview = canvas.getObjects().filter(obj => obj.name === 'PRINTING_AREA_PREVIEW')
  existingPreview.forEach(obj => canvas.remove(obj))
  
  // Add preview rectangle
  const preview = new fabric.Rect({
    left: currentPrintingArea.value.x,
    top: currentPrintingArea.value.y,
    width: currentPrintingArea.value.width,
    height: currentPrintingArea.value.height,
    fill: 'rgba(0, 255, 0, 0.2)',
    stroke: '#00ff00',
    strokeWidth: 2,
    strokeDashArray: [3, 3],
    selectable: false,
    evented: false,
    name: 'PRINTING_AREA_PREVIEW'
  })
  canvas.add(preview)
  canvas.requestRenderAll()
}

function validateAndMaybeRevert(obj) {
  if (!obj || obj.name !== 'DESIGN_OBJECT') return
  
  // Check printing area validation first (if printing areas are defined)
  if (printingAreas.value.length > 0) {
    const objBounds = obj.getBoundingRect()
    let isInPrintingArea = false
    
    for (const area of printingAreas.value) {
      if (isObjectInArea(objBounds, area)) {
        isInPrintingArea = true
        break
      }
    }
    
    if (!isInPrintingArea) {
      // Show warning but allow movement
      showWarning.value = true
      warningMessage.value = 'Design-Elemente müssen innerhalb der definierten Druckbereiche platziert werden.'
      setTimeout(() => {
        showWarning.value = false
      }, 3000)
      
      // Add red border to indicate object is outside printing area
      obj.set({ stroke: '#e53e3e', strokeWidth: 2 })
      canvas.requestRenderAll()
      
      // Store current position as potentially invalid
      // Don't revert, just mark as outside printing area
      return
    } else {
      // Object is in printing area, remove warning border and store as valid position
      obj.set({ stroke: null, strokeWidth: 0 })
      lastValidTransform.set(obj, {
        left: obj.left,
        top: obj.top,
        scaleX: obj.scaleX,
        scaleY: obj.scaleY,
        angle: obj.angle
      })
      canvas.requestRenderAll()
    }
  }
  
  // Check polygon validation (if polygon is defined)
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
    obj.set({ stroke: '#e53e3e', strokeWidth: 3 })
    showWarning.value = true
    warningMessage.value = 'Bitte innerhalb der Fläche platzieren.'
    canvas.requestRenderAll()
  }
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

  // Mount Fabric Canvas inside the host div
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

  addShirtOutline()

  // Mouse handlers
  canvas.on('mouse:down', (opt) => {
    const e = opt.e
    if (printingAreaMode.value) {
      const pointer = canvas.getPointer(e)
      const target = canvas.findTarget(e)
      
      // If clicking on an existing printing area, don't start drawing
      if (target && target.name === 'PRINTING_AREA') {
        // Allow normal selection/movement of printing areas
        return
      }
      
      // Start drawing new printing area only if not clicking on existing area
      isDrawingPrintingArea.value = true
      printingAreaStartPoint = pointer
      currentPrintingArea.value = {
        x: pointer.x,
        y: pointer.y,
        width: 0,
        height: 0
      }
      return
    }
    
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
    const e = opt.e
    
    // Handle printing area drawing
    if (isDrawingPrintingArea.value && printingAreaStartPoint) {
      const pointer = canvas.getPointer(e)
      const width = pointer.x - printingAreaStartPoint.x
      const height = pointer.y - printingAreaStartPoint.y
      
      currentPrintingArea.value = {
        x: Math.min(printingAreaStartPoint.x, pointer.x),
        y: Math.min(printingAreaStartPoint.y, pointer.y),
        width: Math.abs(width),
        height: Math.abs(height)
      }
      
      // Update the preview rectangle
      updatePrintingAreaPreview()
      return
    }
    
    if (!isDragging) return
    const dx = e.clientX - lastPosX
    const dy = e.clientY - lastPosY
    const vpt = canvas.viewportTransform
    vpt[4] += dx; vpt[5] += dy
    canvas.setViewportTransform(vpt)
    lastPosX = e.clientX; lastPosY = e.clientY
  })
  canvas.on('mouse:up', () => { 
    isDragging = false
    canvas.defaultCursor = 'default'
    
    // Complete printing area drawing
    if (isDrawingPrintingArea.value && currentPrintingArea.value && 
        currentPrintingArea.value.width > 10 && currentPrintingArea.value.height > 10) {
      printingAreas.value.push({ ...currentPrintingArea.value })
      renderPrintingAreas()
    }
    
    isDrawingPrintingArea.value = false
    currentPrintingArea.value = null
    printingAreaStartPoint = null
  })
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
  await updateProductAndBackground(props.productId)
}

const selectedProduct = ref(null)
const productImages = ref([])
const currentViewIndex = ref(0)
const productVariations = ref([])
const selectedVariation = ref(null)
const productName = computed(() => selectedProduct.value?.name || 'Unisex Basic T-Shirt')
const productDescription = computed(() => {
  const raw = selectedProduct.value?.description || ''
  try { return raw.replace(/<[^>]*>/g, '').trim() } catch { return raw }
})

const productPrice = computed(() => {
  // Use variation price if available, otherwise use product price
  const price = selectedVariation.value?.price || selectedProduct.value?.price || '0'
  // Format price with 2 decimal places
  const numericPrice = parseFloat(price) || 0
  return numericPrice.toFixed(2)
})

const { wooService, formatProduct, formatVariation } = useWooCommerce()

async function updateProductAndBackground(id) {
  if (!id || !canvas) return
  try {
    const raw = await wooService.fetchProduct(String(id))
    selectedProduct.value = formatProduct(raw)

    // Fetch product variations
    try {
      const variationsRaw = await wooService.fetchProductVariations(String(id))
      const vs = variationsRaw.map(formatVariation)

      // compute an average color from image for each variation
      await Promise.all(vs.map(async v => {
        const img = v.image || selectedProduct.value?.image
        v._hex = await getDominantHex(img) // <- accurate swatch
      }))

      productVariations.value = vs
      if (productVariations.value.length > 0) {
        selectedVariation.value = productVariations.value[0]
      }
    } catch (variationError) {
      console.warn('Could not load product variations:', variationError)
      productVariations.value = []
    }

    productImages.value = []
    currentViewIndex.value = 0
  } catch (e) {
    console.warn('Product load failed', e)
  }
}

watch(() => props.productId, (id) => id && updateProductAndBackground(id), { immediate: true })

const addShirtOutline = () => {
  if (!fabric) return
  bringDesignObjectsToFront()
}

// Drag & Drop
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

// Colors (fallback for "no variations")
const changeShirtColor = (index) => {
  selectedColor.value = index
  canvas.backgroundColor = colors[index].hex
  canvas.renderAll()
}

// Variations
const selectVariation = (variation) => {
  selectedVariation.value = variation
}

// ---------- Pantone + Dominant Color ----------

// Intensive color mapping for better visibility
const PANTONE_MAP = {
  // Single letter codes
  'C': '#000000',     // Black
  'W': '#FFFFFF',     // White
  'R': '#FF0000',     // Red
  'B': '#0000FF',     // Blue
  'G': '#00FF00',     // Green
  'Y': '#FFFF00',     // Yellow
  'P': '#00FF00',     // Green

  // 4-digit codes - more intensive colors
  '7503C': '#FF1493', // Deep Pink
  '2166C': '#0066CC', // Bright Blue
  '1655C': '#FF4500', // Orange Red
  '2766C': '#0000FF', // Blue
  '1205C': '#FFD700', // Gold
  '2410C': '#8B4513', // Saddle Brown
  '2708C': '#00FF00', // Lime
  '5115C': '#800080', // Purple

  // 3-digit + letter codes - more intensive
  '186C': '#DC143C',  // Crimson
  '286C': '#0000FF',  // Blue
  '355C': '#FF0000',  // Red
  '348C': '#00FF00',  // Green
  '116C': '#FFD700',  // Gold
  '127C': '#FFD700',  // Gold

  // Additional intensive colors
  '312C': '#00BFFF',  // Deep Sky Blue
  '2587C': '#8B4513', // Saddle Brown
  '200C': '#DC143C',  // Crimson
  '428C': '#708090',  // Slate Gray
  '378C': '#00FF00',  // Lime
  '264C': '#00FFFF',  // Cyan
  '214C': '#8B4513',  // Saddle Brown
  '431C': '#8A2BE2',  // Blue Violet
  '216C': '#00FF00',  // Lime
  '560C': '#228B22',  // Forest Green
  
  // 3-digit codes (for consistency)
  '186': '#DC143C',   // Crimson
  '286': '#0000FF',   // Blue
  '355': '#FF0000',   // Red
  '348': '#00FF00',   // Green
  '116': '#FFD700',   // Gold
  '127': '#FFD700',   // Gold
}

// Normalize common inputs like "Pantone 286 C", "286 c", "286"
function normalizePantone(input) {
  if (!input) return null
  let s = String(input).toUpperCase().trim()
  s = s.replace(/^PANTONE\s*/,'').replace(/^PMS\s*/,'').replace(/\s+/g,'')
  if (/^\d{3,4}$/.test(s)) s = s + 'C'
  return s
}

// If you still want to try Pantone first (optional):
function getColorFromCode(code) {
  const norm = normalizePantone(code)
  if (!norm) return null
  return PANTONE_MAP[norm] || null
}

// Average color from image via canvas (no dependency)
const _avgCache = new Map()
async function getDominantHex(url) {
  if (!url) return '#cccccc'
  if (_avgCache.has(url)) return _avgCache.get(url)
  try {
    const hex = await averageImageColor(url)
    _avgCache.set(url, hex)
    return hex
  } catch {
    return '#cccccc'
  }
}

// Downsampled average to keep it fast
function averageImageColor(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const w = 40, h = 40
      const c = document.createElement('canvas')
      c.width = w; c.height = h
      const ctx = c.getContext('2d', { willReadFrequently: true })
      // cover strategy similar to CSS background-size: contain (already)
      ctx.drawImage(img, 0, 0, w, h)
      const data = ctx.getImageData(0, 0, w, h).data
      let r = 0, g = 0, b = 0, count = 0
      for (let i = 0; i < data.length; i += 4) {
        const alpha = data[i + 3]
        if (alpha < 10) continue // ignore fully transparent pixels
        r += data[i]
        g += data[i + 1]
        b += data[i + 2]
        count++
      }
      if (!count) return resolve('#cccccc')
      r = Math.round(r / count)
      g = Math.round(g / count)
      b = Math.round(b / count)
      resolve(rgbToHex(r, g, b))
    }
    img.onerror = reject
    img.src = src
  })
}
function rgbToHex(r, g, b) {
  const toHex = (n) => n.toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

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
const exportDesign = async () => {
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

  try {
    const compositeCanvas = document.createElement('canvas')
    const ctx = compositeCanvas.getContext('2d')

    compositeCanvas.width = canvas.width
    compositeCanvas.height = canvas.height

    const backgroundImageUrl = selectedVariation.value?.image || selectedProduct.value?.image || DEFAULT_BG_URL

    const backgroundImg = new Image()
    backgroundImg.crossOrigin = 'anonymous'

    await new Promise((resolve, reject) => {
      backgroundImg.onload = () => {
        const imgAspect = backgroundImg.width / backgroundImg.height
        const canvasAspect = compositeCanvas.width / compositeCanvas.height

        let drawWidth, drawHeight, drawX, drawY
        if (imgAspect > canvasAspect) {
          drawWidth = compositeCanvas.width
          drawHeight = drawWidth / imgAspect
          drawX = 0
          drawY = (compositeCanvas.height - drawHeight) / 2
        } else {
          drawHeight = compositeCanvas.height
          drawWidth = drawHeight * imgAspect
          drawX = (compositeCanvas.width - drawWidth) / 2
          drawY = 0
        }

        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, compositeCanvas.width, compositeCanvas.height)
        ctx.drawImage(backgroundImg, drawX, drawY, drawWidth, drawHeight)
        resolve()
      }
      backgroundImg.onerror = () => {
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, compositeCanvas.width, compositeCanvas.height)
        resolve()
      }
      backgroundImg.src = backgroundImageUrl
    })

    const designDataUrl = canvas.toDataURL({ format: 'png', quality: 1 })
    const designImg = new Image()

    await new Promise((resolve, reject) => {
      designImg.onload = () => {
        ctx.drawImage(designImg, 0, 0)
        resolve()
      }
      designImg.onerror = reject
      designImg.src = designDataUrl
    })

    const finalDataUrl = compositeCanvas.toDataURL({ format: 'png', quality: 1 })
    const link = document.createElement('a')
    link.href = finalDataUrl
    const variationSuffix = selectedVariation.value?.colorCode ? `_${selectedVariation.value.colorCode}` : ''
    link.download = `design_${selectedProduct.value?.name || 'product'}${variationSuffix}_${new Date().getTime()}.png`
    document.body.appendChild(link)
    link.click()
    link.remove()

  } catch (error) {
    console.error('Error creating composite image:', error)
    const dataUrl = canvas.toDataURL({ format: 'png', quality: 1 })
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = 'design_export.png'
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  canvas.clipPath = oldClip
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

// ClipPath (disabled visually to show full images in your flow)
function applyClipPathFromCustomPolygon() {
  canvas.clipPath = null
  clipPolygon = null
  canvas.requestRenderAll()
}

// Persistenz (optional store)
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
  // Load polygon data
  const data = await loadPolygonFromStore(String(props.productId))
  if (data && Array.isArray(data.points) && data.points.length >= 3) {
    customPolygon.value = denormalizePoints(data.points)
    drawPointMarkers()
    drawPolylineOverlay()
    drawPolygonOverlay()
    applyClipPathFromCustomPolygon()
  }
  
  // Load printing areas
  await loadPrintingAreas()
}
function clearPlacementArea() {
  customPolygon.value = []
  removePolylineOverlay()
  removePointMarkers()
  removePolygonOverlay()
  applyClipPathFromCustomPolygon()
}

// Validation
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

// Resize
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
  window.addEventListener('keydown', handleKeyDown)
})
onUnmounted(() => {
  if (canvas) canvas.dispose()
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('keydown', handleKeyDown)
})

function handleKeyDown(e) {
  // Delete selected printing area with Delete key
  if (e.key === 'Delete' && printingAreaMode.value && canvas) {
    const activeObject = canvas.getActiveObject()
    if (activeObject && activeObject.name === 'PRINTING_AREA') {
      const index = activeObject.data.index
      printingAreas.value.splice(index, 1)
      renderPrintingAreas()
    }
  }
}
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

