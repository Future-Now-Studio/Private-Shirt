<template>
  <div>
    <!-- Hero Section -->
    <section class="relative h-[60vh] md:h-[50vh] flex flex-col lg:flex-row">
      <!-- Left side - White background with brand colors for text -->
      <div class="w-full lg:w-1/2 bg-white flex items-center justify-center p-4 sm:p-6 lg:p-8 order-2 lg:order-1">
        <div class="max-w-xl text-center lg:text-left">
          <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-3">
            <span class="text-[#D8127D]">wir sind private shirt:</span>
            <br>
            <span class="text-[#0a3a47]">_geboren in hamburg.</span>
          </h1>
          <p class="text-sm sm:text-base md:text-lg lg:text-xl font-light mb-6 text-[#0a3a47]">
            Guter Stoff für Ihre Ideen. Private Shirt – professionelle Textilveredelung.
          </p>
        </div>
      </div>
      
      <!-- Right side - Company Image -->
      <div class="w-full lg:w-1/2 relative overflow-hidden h-48 sm:h-64 md:h-80 lg:h-full order-1 lg:order-2">
        <div class="absolute inset-0 bg-black/20 z-10"></div>
        <img 
          src="/assets/20210421_001_Private_Shirt_Hamburg.webp"
          alt="Private Shirt Hamburg Store"
          class="absolute inset-0 w-full h-full object-cover"
          @error="handleImageError"
        >
      </div>
    </section>

    <!-- Main Content Section -->
    <section class="py-16 sm:py-24 bg-white">
      <div class="container mx-auto px-6">
        <div class="max-w-4xl mx-auto">
          <div class="prose prose-lg mx-auto">
            <p class="text-lg text-gray-700 leading-relaxed mb-8">
              Sie überzeugen Ihre Kunden täglich mit kreativen Ideen und individuellen Dienstleistungen? Dann legen Sie bei der Außendarstellung sicher auch hohen Wert auf Qualität.
            </p>
            
            <p class="text-lg text-gray-700 leading-relaxed mb-8">
              Für einen professionellen Auftritt im Segment Corporate Fashion-Lösungen gibt es Private Shirt. Wir sind die Spezialisten für individuelle Textilveredelung, die durch Qualität begeistert!
            </p>
            
            <p class="text-lg text-gray-700 leading-relaxed mb-12">
              Vom trendigen Marken-Shirt über den fröhlich-bunten Kaffeebecher bis zum kuscheligen Bademantel mit Ihrem gestickten oder gedrucktem Firmenlogo: Wer einen gelungenen Aufhänger für seine Ideen sucht, findet im Produktsortiment von Private Shirt Corporate Fashion-Lösungen und Geschenkideen, die besonders anziehend sind – und länger im Gedächtnis bleiben.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Company Values Section -->
    <section class="py-16 sm:py-24 bg-gray-50">
      <div class="container mx-auto px-6">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-3xl font-bold text-center mb-12 text-[#0a3a47]">
            Unser Name steht für Textilveredelung, die seit zehn Jahren mit Qualität und Service überzeugt:
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="bg-white p-8 rounded-lg shadow-md">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-[#D8127D] rounded-full flex items-center justify-center mr-4">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                  </svg>
                </div>
                <h3 class="text-xl font-semibold text-[#0a3a47]">Umfangreiche Produktpalette</h3>
              </div>
              <p class="text-gray-600">Eine umfangreiche Produktpalette mit Markentextilien</p>
            </div>

            <div class="bg-white p-8 rounded-lg shadow-md">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-[#D8127D] rounded-full flex items-center justify-center mr-4">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <h3 class="text-xl font-semibold text-[#0a3a47]">Erstklassige Produktionsverfahren</h3>
              </div>
              <p class="text-gray-600">Erstklassige Produktionsverfahren, die Sie nicht überall finden</p>
            </div>

            <div class="bg-white p-8 rounded-lg shadow-md">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-[#D8127D] rounded-full flex items-center justify-center mr-4">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                  </svg>
                </div>
                <h3 class="text-xl font-semibold text-[#0a3a47]">Kostengünstige Lösungen</h3>
              </div>
              <p class="text-gray-600">Kostengünstige Lösungen bei kleinen und großen Auflagen</p>
            </div>

            <div class="bg-white p-8 rounded-lg shadow-md">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-[#D8127D] rounded-full flex items-center justify-center mr-4">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"/>
                  </svg>
                </div>
                <h3 class="text-xl font-semibold text-[#0a3a47]">Freundliche Fachberatung</h3>
              </div>
              <p class="text-gray-600">Eine freundliche Fachberatung, auf die Sie sich jederzeit verlassen können</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action Section -->
    <section class="py-16 sm:py-24 bg-white">
      <div class="container mx-auto px-6 text-center">
        <div class="max-w-3xl mx-auto">
          <h2 class="text-3xl font-bold mb-6 text-[#0a3a47]">
            Entdecken auch Sie unsere individuelle Beratung
          </h2>
          <p class="text-lg text-gray-600 mb-8">
            Die professionelle Ausführung und den erstklassigen Service.
          </p>
          <p class="text-xl font-semibold text-[#D8127D] mb-8">
            Wir freuen uns auf Sie!
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button @click="$emit('navigate', 'CustomizationCreator')" class="btn bg-[#D8127D] hover:bg-[#b30f68] text-white text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4">
              Jetzt gestalten
            </button>
            <button @click="$emit('navigate', 'Grossbestellung')" class="btn border-2 border-[#D8127D] text-[#D8127D] hover:bg-[#D8127D] hover:text-white text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4">
              Großbestellung anfragen
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Equipment Section -->
    <section class="py-16 sm:py-24 bg-gray-50">
      <div class="container mx-auto px-6">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-3xl font-bold text-center mb-12 text-[#0a3a47]">
            Unsere Ausstattung
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div class="text-center">
              <div class="w-24 h-24 bg-[#D8127D] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 12h6m-6 4h6"/>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-[#D8127D] mb-4">Hochwertige Druckmaschinen</h3>
              <p class="text-gray-600">Moderne Drucktechnologie für beste Ergebnisse</p>
            </div>

            <div class="text-center">
              <div class="w-24 h-24 bg-[#D8127D] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-[#D8127D] mb-4">Modernste Stickmaschinen</h3>
              <p class="text-gray-600">Präzise Sticktechnik für hochwertige Verarbeitung</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Emits
defineEmits(['navigate'])

// Methods
const handleImageError = (event) => {
  // Replace with a fallback image
  event.target.src = 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=800&auto=format&fit=crop'
}
</script>

<style scoped>
.btn {
  @apply inline-block px-6 py-3 rounded-lg font-semibold text-center transition duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.prose {
  @apply text-gray-700;
}

.prose p {
  @apply mb-6;
}
</style>
