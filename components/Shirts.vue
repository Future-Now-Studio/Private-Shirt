<template>
    <div class="container mx-auto px-6 py-12">
      <h1 class="text-4xl font-bold mb-2">T-Shirts bedrucken lassen</h1>
      <p class="text-lg text-gray-600 mb-10">100 % dein Style – Wähle dein Lieblingsshirt und gestalte es selbst.</p>
      
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Filters -->
        <aside class="w-full lg:w-1/4">
          <h3 class="text-xl font-bold mb-4">Filtern</h3>
          <div class="space-y-6">
            <div>
              <h4 class="font-semibold mb-2">Farbe</h4>
              <div class="flex flex-wrap gap-2">
                <span v-for="color in ['black', 'white', 'red', 'blue', 'green']" :key="color" :class="`w-8 h-8 rounded-full bg-${color}-500 border cursor-pointer`"></span>
              </div>
            </div>
            <div>
              <h4 class="font-semibold mb-2">Größe</h4>
              <div class="flex flex-wrap gap-2">
                <span v-for="size in ['S', 'M', 'L', 'XL', 'XXL']" class="px-3 py-1 border rounded-full cursor-pointer hover:bg-indigo-100">{{ size }}</span>
              </div>
            </div>
             <div>
              <h4 class="font-semibold mb-2">Material</h4>
              <div class="space-y-1">
                <label class="flex items-center"><input type="checkbox" class="mr-2 rounded text-indigo-600 focus:ring-indigo-500"> Baumwolle</label>
                <label class="flex items-center"><input type="checkbox" class="mr-2 rounded text-indigo-600 focus:ring-indigo-500"> Bio-Baumwolle</label>
                <label class="flex items-center"><input type="checkbox" class="mr-2 rounded text-indigo-600 focus:ring-indigo-500"> Polyester</label>
              </div>
            </div>
          </div>
        </aside>
        
        <!-- Product Grid -->
        <main class="w-full lg:w-3/4">
          <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div v-for="i in 9" :key="i" class="bg-white rounded-lg shadow-md overflow-hidden group">
              <div class="relative">
                <img src="/PW154_Bottle-Green-ca.-Pantone-560C.jpg" alt="Bottle Green T-Shirt" class="w-full h-auto">
                <div class="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button class="btn btn-primary">Jetzt gestalten</button>
                </div>
              </div>
              <div class="p-4">
                <h4 class="font-semibold">Basic Unisex Shirt</h4>
                <p class="text-gray-600">Ab 14,99 €</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </template>
  
  <script setup>
  useHead({
    title: 'T-Shirts bedrucken | Hochwertig & schnell – private-shirt.de',
    meta: [
      { name: 'description', content: 'Gestalte dein eigenes T-Shirt. Wähle aus vielen Farben, Größen und nachhaltigen Materialien. Schneller Versand aus Deutschland.' }
    ]
  })
  </script>
  