<template>
  <div>
    <!-- Hero Section -->
    <section class="relative h-[60vh] md:h-[50vh] flex flex-col lg:flex-row">
      <!-- Left side - White background with brand colors for text -->
      <div class="w-full lg:w-1/2 bg-white flex items-center justify-center p-4 sm:p-6 lg:p-8 order-2 lg:order-1">
        <div class="max-w-xl text-center lg:text-left">
          <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-3">
            <span class="text-[#D8127D]">aufdruck für</span>
            <br>
            <span class="text-[#0a3a47]">_eindruck.</span>
          </h1>
          <p class="text-sm sm:text-base md:text-lg lg:text-xl font-light mb-6 text-[#0a3a47]">
            Ob online oder in unseren Shops, wir sind überall für Sie da. Wir garantieren Ihnen qualitativ hochwertige Produkte und top Kundenservice für Ihre individuellen Ideen.
          </p>
        </div>
      </div>
      
      <!-- Right side - Services Image -->
      <div class="w-full lg:w-1/2 relative overflow-hidden h-48 sm:h-64 md:h-80 lg:h-full order-1 lg:order-2">
        <div class="absolute inset-0 bg-black/20 z-10"></div>
        <img 
                  src="/assets/sincerely-media-qeDcKFADdp8-unsplash.jpg"
          alt="Printing Services"
          class="absolute inset-0 w-full h-full object-cover"
        >
      </div>
    </section>

    <!-- Printing Techniques Section -->
    <section class="py-16 sm:py-24 bg-gradient-to-br from-gray-50 to-white">
      <div class="container mx-auto px-6">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-4xl md:text-5xl font-extrabold text-[#0a3a47] mb-4">
              drucktechniken:
            </h2>
            <div class="w-24 h-1 bg-gradient-to-r from-[#D8127D] to-[#ffd44d] mx-auto rounded-full"></div>
          </div>
          
          <div class="space-y-20">
            <!-- Flex -->
            <div class="group relative overflow-hidden bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div class="absolute inset-0 bg-gradient-to-br from-[#D8127D]/5 to-[#ffd44d]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div class="relative p-8 lg:p-12">
                <div class="flex flex-col lg:flex-row gap-12 items-center">
                  <div class="lg:w-1/2 order-2 lg:order-1">
                    <div class="relative">
                      <img 
                        src="https://images.unsplash.com/photo-1629891060732-199a33f240bb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=987"
                        alt="Flex Printing"
                        class="w-full h-80 object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-500"
                      >
                      <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
                      <div class="absolute bottom-4 left-4 text-white">
                        <span class="bg-[#D8127D] px-3 py-1 rounded-full text-sm font-semibold">Flex Druck</span>
                      </div>
                    </div>
                  </div>
                  <div class="lg:w-1/2 order-1 lg:order-2">
                    <div class="mb-6">
                      <h3 class="text-3xl font-bold text-[#D8127D] mb-4 flex items-center">
                        <span class="w-12 h-12 bg-[#D8127D] rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">1</span>
                        flex
                      </h3>
                      <p class="text-gray-700 text-lg leading-relaxed">
                        Unser liebstes Material zeichnet sich durch eine sehr hohe Robustheit aus. Wir haben eine Farbauswahl von mehr als 24 Farben, darunter auch Neontöne und Glitzereffekte. Produktion ab ein Stück, Robust und waschbar bis 40 Grad.
                      </p>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div class="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:border-[#D8127D]/30 transition-colors">
                        <h4 class="font-bold text-[#0a3a47] mb-2 text-sm">STÜCKZAHL</h4>
                        <p class="text-sm text-gray-600">ab einem stück</p>
                      </div>
                      <div class="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:border-[#D8127D]/30 transition-colors">
                        <h4 class="font-bold text-[#0a3a47] mb-2 text-sm">FARBEN</h4>
                        <p class="text-sm text-gray-600">Ein- bis mehrfarbige Drucke, Farbauswahl nach Farbkarte.</p>
                      </div>
                      <div class="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:border-[#D8127D]/30 transition-colors">
                        <h4 class="font-bold text-[#0a3a47] mb-2 text-sm">TEXTILART</h4>
                        <p class="text-sm text-gray-600">Geeignet für fast alle Textilien</p>
                      </div>
                      <div class="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:border-[#D8127D]/30 transition-colors">
                        <h4 class="font-bold text-[#0a3a47] mb-2 text-sm">DATEIFORMATE</h4>
                        <p class="text-sm text-gray-600">Vektorisierte Grafiken (.EPS, .AI, .PDF)</p>
                      </div>
                    </div>
                    <div class="mt-4 bg-gradient-to-r from-[#D8127D]/10 to-[#ffd44d]/10 p-4 rounded-xl border-l-4 border-[#D8127D]">
                      <h4 class="font-bold text-[#0a3a47] mb-2 text-sm">BESONDERHEITEN</h4>
                      <p class="text-sm text-gray-600">Druckmotive müssen mindestens eine Strichstärke von 1 mm haben Farbverläufe leider nicht möglich.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Digital Flex -->
            <div class="group relative overflow-hidden bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div class="absolute inset-0 bg-gradient-to-br from-[#ffd44d]/5 to-[#D8127D]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div class="relative p-8 lg:p-12">
                <div class="flex flex-col lg:flex-row gap-12 items-center">
                  <div class="lg:w-1/2 order-1 lg:order-1">
                    <div class="relative">
                      <img 
                        src="https://images.unsplash.com/photo-1627225924765-552d49cf47ad?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=987"
                        alt="Digital Flex Printing"
                        class="w-full h-80 object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-500"
                      >
                      <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
                      <div class="absolute bottom-4 left-4 text-white">
                        <span class="bg-[#ffd44d] text-[#0a3a47] px-3 py-1 rounded-full text-sm font-semibold">Digital Transfer</span>
                      </div>
                    </div>
                  </div>
                  <div class="lg:w-1/2 order-2 lg:order-2">
                    <div class="mb-6">
                      <h3 class="text-3xl font-bold text-[#D8127D] mb-4 flex items-center">
                        <span class="w-12 h-12 bg-[#ffd44d] text-[#0a3a47] rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">2</span>
                        Digital Flex
                      </h3>
                      <p class="text-gray-700 text-lg leading-relaxed">
                        Digital-Transfer ist ein weißes Trägermaterial für deine mehrfarbigen Motive. Zuerst wird das Trägermaterial gedruckt und dann nach individueller Cut-Kontur geschnitten. Produktion ab einem Stück möglich, waschbar bis 30 Grad.
                      </p>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div class="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:border-[#ffd44d]/30 transition-colors">
                        <h4 class="font-bold text-[#0a3a47] mb-2 text-sm">STÜCKZAHL</h4>
                        <p class="text-sm text-gray-600">Ab einem Stück Möglich, Mindermengenaufschlag!</p>
                      </div>
                      <div class="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:border-[#ffd44d]/30 transition-colors">
                        <h4 class="font-bold text-[#0a3a47] mb-2 text-sm">FARBEN</h4>
                        <p class="text-sm text-gray-600">Ein- bis mehrfarbige Drucke. Nahezu jeder Farbton druckbar.</p>
                      </div>
                      <div class="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:border-[#ffd44d]/30 transition-colors">
                        <h4 class="font-bold text-[#0a3a47] mb-2 text-sm">TEXTILART</h4>
                        <p class="text-sm text-gray-600">Geeignet für fast alle Textilien</p>
                      </div>
                      <div class="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:border-[#ffd44d]/30 transition-colors">
                        <h4 class="font-bold text-[#0a3a47] mb-2 text-sm">DATEIFORMATE</h4>
                        <p class="text-sm text-gray-600">Vektorisierte Grafiken (.EPS, .AI, .PDF)</p>
                      </div>
                    </div>
                    <div class="mt-4 bg-gradient-to-r from-[#ffd44d]/10 to-[#D8127D]/10 p-4 rounded-xl border-l-4 border-[#ffd44d]">
                      <h4 class="font-bold text-[#0a3a47] mb-2 text-sm">BESONDERHEITEN</h4>
                      <p class="text-sm text-gray-600">Fotorealistische Drucke möglich. Kleinste Details und Farbverläufe umsetzbar. Falls Trägermaterial zugeschnitten werden muss ist eine Strichstärke von mind. 2 mm nötig.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Flock -->
            <div class="group relative overflow-hidden bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div class="absolute inset-0 bg-gradient-to-br from-[#0a3a47]/5 to-[#D8127D]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div class="relative p-8 lg:p-12">
                <div class="flex flex-col lg:flex-row gap-12 items-center">
                  <div class="lg:w-1/2 order-2 lg:order-1">
                    <div class="relative">
                      <img 
                        src="https://images.unsplash.com/photo-1628071711153-d0204a351a6e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2420"
                        alt="Flock Printing"
                        class="w-full h-80 object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-500"
                      >
                      <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
                      <div class="absolute bottom-4 left-4 text-white">
                        <span class="bg-[#0a3a47] px-3 py-1 rounded-full text-sm font-semibold">Flock Druck</span>
                      </div>
                    </div>
                  </div>
                  <div class="lg:w-1/2 order-1 lg:order-2">
                    <div class="mb-6">
                      <h3 class="text-3xl font-bold text-[#D8127D] mb-4 flex items-center">
                        <span class="w-12 h-12 bg-[#0a3a47] rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">3</span>
                        Flock
                      </h3>
                      <p class="text-gray-700 text-lg leading-relaxed">
                        Flock ist nicht mehr so gefragt aber wir haben trotzdem die Standardfarben auf Lager. Sollest du also ein Liebhaber von Flock sein bieten wir auch dieses Druckverfahren gerne an. Produktion ab einem Stück, samtige Oberfläche leicht erhaben, waschbar bis 40 Grad.
                      </p>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div class="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:border-[#0a3a47]/30 transition-colors">
                        <h4 class="font-bold text-[#0a3a47] mb-2 text-sm">STÜCKZAHL</h4>
                        <p class="text-sm text-gray-600">Ab einem Stück</p>
                      </div>
                      <div class="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:border-[#0a3a47]/30 transition-colors">
                        <h4 class="font-bold text-[#0a3a47] mb-2 text-sm">FARBEN</h4>
                        <p class="text-sm text-gray-600">Ein- bis mehrfarbige Drucke, Farbauswahl nach Farbkarte</p>
                      </div>
                      <div class="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:border-[#0a3a47]/30 transition-colors">
                        <h4 class="font-bold text-[#0a3a47] mb-2 text-sm">TEXTILART</h4>
                        <p class="text-sm text-gray-600">Geeignet für fast alle Textilien</p>
                      </div>
                      <div class="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:border-[#0a3a47]/30 transition-colors">
                        <h4 class="font-bold text-[#0a3a47] mb-2 text-sm">DATEIFORMATE</h4>
                        <p class="text-sm text-gray-600">Vektorisierte Grafiken (.EPS, .AI, .PDF)</p>
                      </div>
                    </div>
                    <div class="mt-4 bg-gradient-to-r from-[#0a3a47]/10 to-[#D8127D]/10 p-4 rounded-xl border-l-4 border-[#0a3a47]">
                      <h4 class="font-bold text-[#0a3a47] mb-2 text-sm">BESONDERHEITEN</h4>
                      <p class="text-sm text-gray-600">Druckmotive müssen mindestens eine Strichstärke von 2 mm haben Farbverläufe leider nicht möglich.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Direktdruck (DTG) -->
            <div class="group relative overflow-hidden bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div class="absolute inset-0 bg-gradient-to-br from-[#D8127D]/5 to-[#ffd44d]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div class="relative p-8 lg:p-12">
                <div class="flex flex-col lg:flex-row gap-12 items-center">
                  <div class="lg:w-1/2 order-1 lg:order-1">
                    <div class="relative">
                      <img 
                        src="https://images.unsplash.com/photo-1582142839970-2b9e04b60f65?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1335"
                        alt="Direct to Garment Printing"
                        class="w-full h-80 object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-500"
                      >
                      <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
                      <div class="absolute bottom-4 left-4 text-white">
                        <span class="bg-[#D8127D] px-3 py-1 rounded-full text-sm font-semibold">DTG Druck</span>
                      </div>
                    </div>
                  </div>
                  <div class="lg:w-1/2 order-2 lg:order-2">
                    <div class="mb-6">
                      <h3 class="text-3xl font-bold text-[#D8127D] mb-4 flex items-center">
                        <span class="w-12 h-12 bg-[#D8127D] rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">4</span>
                        Direktdruck (DTG)
                      </h3>
                      <p class="text-gray-700 text-lg leading-relaxed">
                        Alles ist möglich. Im Digitaldirektdruck oder DTG Verfahren genannt sind komplexe Druckmotive und auch Fotorealistische Drucke möglich. Produktion ab ein Stück, Druck auf weiß nicht spürbar, waschbar bis 30 Grad.
                      </p>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div class="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:border-[#D8127D]/30 transition-colors">
                        <h4 class="font-bold text-[#0a3a47] mb-2 text-sm">STÜCKZAHL</h4>
                        <p class="text-sm text-gray-600">Ab einem Stück</p>
                      </div>
                      <div class="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:border-[#D8127D]/30 transition-colors">
                        <h4 class="font-bold text-[#0a3a47] mb-2 text-sm">FARBEN</h4>
                        <p class="text-sm text-gray-600">Ein- bis mehrfarbige Drucke. Nahezu jeder Farbton druckbar.</p>
                      </div>
                      <div class="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:border-[#D8127D]/30 transition-colors">
                        <h4 class="font-bold text-[#0a3a47] mb-2 text-sm">TEXTILART</h4>
                        <p class="text-sm text-gray-600">Nicht für alle Textilien geeignet. Textil sollte mind. 80 % Baumwollanteil haben.</p>
                      </div>
                      <div class="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:border-[#D8127D]/30 transition-colors">
                        <h4 class="font-bold text-[#0a3a47] mb-2 text-sm">DATEIFORMATE</h4>
                        <p class="text-sm text-gray-600">Vektorisierte Grafiken (.EPS, .AI, .PDF)</p>
                      </div>
                    </div>
                    <div class="mt-4 bg-gradient-to-r from-[#D8127D]/10 to-[#ffd44d]/10 p-4 rounded-xl border-l-4 border-[#D8127D]">
                      <h4 class="font-bold text-[#0a3a47] mb-2 text-sm">BESONDERHEITEN</h4>
                      <p class="text-sm text-gray-600">Fotorealistische Drucke möglich. Kleinste Details und Farbverläufe umsetzbar.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Siebdruck -->
            <div class="group relative overflow-hidden bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div class="absolute inset-0 bg-gradient-to-br from-[#0a3a47]/5 to-[#ffd44d]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div class="relative p-8 lg:p-12">
                <div class="flex flex-col lg:flex-row gap-12 items-center">
                  <div class="lg:w-1/2 order-2 lg:order-1">
                    <div class="relative">
                      <img 
                        src="https://images.unsplash.com/photo-1614494731690-53925976ea29?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1335"
                        alt="Screen Printing"
                        class="w-full h-80 object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-500"
                      >
                      <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
                      <div class="absolute bottom-4 left-4 text-white">
                        <span class="bg-[#0a3a47] px-3 py-1 rounded-full text-sm font-semibold">Siebdruck</span>
                      </div>
                    </div>
                  </div>
                  <div class="lg:w-1/2 order-1 lg:order-2">
                    <div class="mb-6">
                      <h3 class="text-3xl font-bold text-[#D8127D] mb-4 flex items-center">
                        <span class="w-12 h-12 bg-[#0a3a47] rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">5</span>
                        Siebdruck
                      </h3>
                      <p class="text-gray-700 text-lg leading-relaxed">
                        Siebdruck, die traditionellste aller Druckarten… leider nicht die spontanste. Für den Siebdruck benötigen wir ein Auftragsvolumen ab 20 Teilen und eine Produktionszeit von mindestens 7 Werktagen. Vorteile: Bei hohen Stückzahlen kostengünstige Produktion, Farben auf Wasserbasis ohne Lösungsmittel, detaillierte Motive möglich und waschbar bis 60 Grad.
                      </p>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div class="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:border-[#0a3a47]/30 transition-colors">
                        <h4 class="font-bold text-[#0a3a47] mb-2 text-sm">STÜCKZAHL</h4>
                        <p class="text-sm text-gray-600">Mittlere bis große Auflagen (nach Rücksprache auch Kleinauflagen ab 20 Stück)</p>
                      </div>
                      <div class="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:border-[#0a3a47]/30 transition-colors">
                        <h4 class="font-bold text-[#0a3a47] mb-2 text-sm">FARBEN</h4>
                        <p class="text-sm text-gray-600">Ein- bis mehrfarbige Drucke nach der Pantone-Farbskala</p>
                      </div>
                      <div class="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:border-[#0a3a47]/30 transition-colors">
                        <h4 class="font-bold text-[#0a3a47] mb-2 text-sm">TEXTILART</h4>
                        <p class="text-sm text-gray-600">Geeignet für fast alle Textilien (außer Fleece, Frottee usw.)</p>
                      </div>
                      <div class="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:border-[#0a3a47]/30 transition-colors">
                        <h4 class="font-bold text-[#0a3a47] mb-2 text-sm">DATEIFORMATE</h4>
                        <p class="text-sm text-gray-600">Vektorisierte Grafiken (.EPS, .AI, .PDF)</p>
                      </div>
                    </div>
                    <div class="mt-4 bg-gradient-to-r from-[#0a3a47]/10 to-[#ffd44d]/10 p-4 rounded-xl border-l-4 border-[#0a3a47]">
                      <h4 class="font-bold text-[#0a3a47] mb-2 text-sm">BESONDERHEITEN</h4>
                      <p class="text-sm text-gray-600">Es fallen Film- und Siebkosten zur Anfertigung des Druckmotives an. Größere Auflagen sind darum empfehlenswert.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sublimation -->
            <div class="group relative overflow-hidden bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div class="absolute inset-0 bg-gradient-to-br from-[#D8127D]/5 to-[#0a3a47]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div class="relative p-8 lg:p-12">
                <div class="flex flex-col lg:flex-row gap-12 items-center">
                  <div class="lg:w-1/2 order-1 lg:order-1">
                    <div class="relative">
                      <img 
                        src="https://images.unsplash.com/photo-1713387918624-677346b5a441?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1335"
                        alt="Sublimation Printing"
                        class="w-full h-80 object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-500"
                      >
                      <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
                      <div class="absolute bottom-4 left-4 text-white">
                        <span class="bg-[#D8127D] px-3 py-1 rounded-full text-sm font-semibold">Sublimation</span>
                      </div>
                    </div>
                  </div>
                  <div class="lg:w-1/2 order-2 lg:order-2">
                    <div class="mb-6">
                      <h3 class="text-3xl font-bold text-[#D8127D] mb-4 flex items-center">
                        <span class="w-12 h-12 bg-[#D8127D] rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">6</span>
                        Sublimation
                      </h3>
                      <p class="text-gray-700 text-lg leading-relaxed">
                        Sublimation – komplizierteres, aber machbares Druckverfahren… Ab einer Auflage von 10 weißen Polyestershirts können wir All Over drucken. Unsere 100x150cm große Transferpresse macht es möglich. Attribute: bis 40 Grad waschbar, nicht fühlbarer und bis zu 4-farbiger Druck.
                      </p>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div class="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:border-[#D8127D]/30 transition-colors">
                        <h4 class="font-bold text-[#0a3a47] mb-2 text-sm">STÜCKZAHL</h4>
                        <p class="text-sm text-gray-600">Mittlere bis große Auflagen (nach Rücksprache auch Kleinauflagen ab 20 Stück)</p>
                      </div>
                      <div class="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:border-[#D8127D]/30 transition-colors">
                        <h4 class="font-bold text-[#0a3a47] mb-2 text-sm">FARBEN</h4>
                        <p class="text-sm text-gray-600">Ein- bis mehrfarbige Drucke nach der Pantone-Farbskala</p>
                      </div>
                      <div class="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:border-[#D8127D]/30 transition-colors">
                        <h4 class="font-bold text-[#0a3a47] mb-2 text-sm">TEXTILART</h4>
                        <p class="text-sm text-gray-600">Geeignet für fast alle Textilien (außer Fleece, Frottee usw.)</p>
                      </div>
                      <div class="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:border-[#D8127D]/30 transition-colors">
                        <h4 class="font-bold text-[#0a3a47] mb-2 text-sm">DATEIFORMATE</h4>
                        <p class="text-sm text-gray-600">Vektorisierte Grafiken (.EPS, .AI, .PDF)</p>
                      </div>
                    </div>
                    <div class="mt-4 bg-gradient-to-r from-[#D8127D]/10 to-[#0a3a47]/10 p-4 rounded-xl border-l-4 border-[#D8127D]">
                      <h4 class="font-bold text-[#0a3a47] mb-2 text-sm">BESONDERHEITEN</h4>
                      <p class="text-sm text-gray-600">Es fallen Film- und Siebkosten zur Anfertigung des Druckmotives an. Größere Auflagen sind darum empfehlenswert.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Embroidery Section -->
    <section class="py-16 sm:py-24 bg-gradient-to-br from-white to-gray-50">
      <div class="container mx-auto px-6">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-4xl md:text-5xl font-extrabold text-[#0a3a47] mb-4">
              lass' sticken:
            </h2>
            <div class="w-24 h-1 bg-gradient-to-r from-[#D8127D] to-[#ffd44d] mx-auto rounded-full"></div>
          </div>
          
          <div class="space-y-20">
            <!-- Direktstick -->
            <div class="group relative overflow-hidden bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div class="absolute inset-0 bg-gradient-to-br from-[#D8127D]/5 to-[#ffd44d]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div class="relative p-8 lg:p-12">
                <div class="flex flex-col lg:flex-row gap-12 items-center">
                  <div class="lg:w-1/2 order-2 lg:order-1">
                    <div class="relative">
                      <img 
                        src="https://images.unsplash.com/photo-1653704841996-c2ed854aedd8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2340"
                        alt="Direct Embroidery"
                        class="w-full h-80 object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-500"
                      >
                      <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
                      <div class="absolute bottom-4 left-4 text-white">
                        <span class="bg-[#D8127D] px-3 py-1 rounded-full text-sm font-semibold">Direktstick</span>
                      </div>
                    </div>
                  </div>
                  <div class="lg:w-1/2 order-1 lg:order-2">
                    <div class="mb-6">
                      <h3 class="text-3xl font-bold text-[#D8127D] mb-4 flex items-center">
                        <span class="w-12 h-12 bg-[#D8127D] rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">1</span>
                        Direktstick
                      </h3>
                      <p class="text-gray-700 text-lg leading-relaxed">
                        Eines der schicksten Veredlungsmethoden, ob einfarbig oder mehrfarbig, das macht meist keinen großen Preisunterschied. Wichtig ist die Stickkarte, und die wird einmalig berechnet. Sind diese Einrichtungskosten einmal bezahlt, ist der Stick direkt auf das Textil oder die Snapback keine allzu kostspielige Angelegenheit. Jetzt neu auch 3D Stick (ab 20 Teilen).
                      </p>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div class="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:border-[#D8127D]/30 transition-colors">
                        <h4 class="font-bold text-[#0a3a47] mb-2 text-sm">STÜCKZAHL</h4>
                        <p class="text-sm text-gray-600">Ab einem Stück</p>
                      </div>
                      <div class="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:border-[#D8127D]/30 transition-colors">
                        <h4 class="font-bold text-[#0a3a47] mb-2 text-sm">GARNFARBEN</h4>
                        <p class="text-sm text-gray-600">Nahezu unbegrenzte Farbauswahl</p>
                      </div>
                      <div class="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:border-[#D8127D]/30 transition-colors">
                        <h4 class="font-bold text-[#0a3a47] mb-2 text-sm">TEXTILART</h4>
                        <p class="text-sm text-gray-600">Geeignet für fast alle Textilien</p>
                      </div>
                      <div class="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:border-[#D8127D]/30 transition-colors">
                        <h4 class="font-bold text-[#0a3a47] mb-2 text-sm">DATEIFORMATE</h4>
                        <p class="text-sm text-gray-600">Vektorisierte Grafiken (.EPS, .AI, .PDF) sind für die Erstellung der Stickkarte nötig. Stickkarte hat bei uns die Formate (DST, TAB)</p>
                      </div>
                    </div>
                    <div class="mt-4 bg-gradient-to-r from-[#D8127D]/10 to-[#ffd44d]/10 p-4 rounded-xl border-l-4 border-[#D8127D]">
                      <h4 class="font-bold text-[#0a3a47] mb-2 text-sm">BESONDERHEITEN</h4>
                      <p class="text-sm text-gray-600">Falls Kosten zur Anfertigung des Stickmotives anfallen, sind größere Auflagen empfehlenswert.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 3D Stick -->
            <div class="group relative overflow-hidden bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div class="absolute inset-0 bg-gradient-to-br from-[#ffd44d]/5 to-[#D8127D]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div class="relative p-8 lg:p-12">
                <div class="flex flex-col lg:flex-row gap-12 items-center">
                  <div class="lg:w-1/2 order-1 lg:order-1">
                    <div class="relative">
                      <img 
                        src="https://images.unsplash.com/photo-1639143831276-6615e124dc8e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=987"
                        alt="3D Embroidery"
                        class="w-full h-80 object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-500"
                      >
                      <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
                      <div class="absolute bottom-4 left-4 text-white">
                        <span class="bg-[#ffd44d] text-[#0a3a47] px-3 py-1 rounded-full text-sm font-semibold">3D Stick</span>
                      </div>
                    </div>
                  </div>
                  <div class="lg:w-1/2 order-2 lg:order-2">
                    <div class="mb-6">
                      <h3 class="text-3xl font-bold text-[#D8127D] mb-4 flex items-center">
                        <span class="w-12 h-12 bg-[#ffd44d] text-[#0a3a47] rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">2</span>
                        3D Stick
                      </h3>
                      <p class="text-gray-700 text-lg leading-relaxed">
                        Bei der 3D-Stickerei wird zusätzlich ein Füllmaterial (Schaumstoff) auf die Textilie gelegt und fixiert. Dieses so genannte Puffy wird bei der Direkteinstickung „mitgestickt". So wirkt die Bestickung erhaben und hebt sich stark von der Textilie ab. Dies lässt sich bei großen Buchstaben oder auch bei flächigen Stücken hervorragend realisieren.
                      </p>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div class="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:border-[#ffd44d]/30 transition-colors">
                        <h4 class="font-bold text-[#0a3a47] mb-2 text-sm">STÜCKZAHL</h4>
                        <p class="text-sm text-gray-600">Ab 20 Stück</p>
                      </div>
                      <div class="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:border-[#ffd44d]/30 transition-colors">
                        <h4 class="font-bold text-[#0a3a47] mb-2 text-sm">GARNFARBEN</h4>
                        <p class="text-sm text-gray-600">Nahezu unbegrenzte Farbauswahl</p>
                      </div>
                      <div class="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:border-[#ffd44d]/30 transition-colors">
                        <h4 class="font-bold text-[#0a3a47] mb-2 text-sm">TEXTILART</h4>
                        <p class="text-sm text-gray-600">Hauptsächlich auf Caps</p>
                      </div>
                      <div class="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:border-[#ffd44d]/30 transition-colors">
                        <h4 class="font-bold text-[#0a3a47] mb-2 text-sm">DATEIFORMATE</h4>
                        <p class="text-sm text-gray-600">Vektorisierte Grafiken (.EPS, .AI, .PDF) sind für die Erstellung der Stickkarte nötig. Stickkarte hat bei uns die Formate (DST, TAB)</p>
                      </div>
                    </div>
                    <div class="mt-4 bg-gradient-to-r from-[#ffd44d]/10 to-[#D8127D]/10 p-4 rounded-xl border-l-4 border-[#ffd44d]">
                      <h4 class="font-bold text-[#0a3a47] mb-2 text-sm">BESONDERHEITEN</h4>
                      <p class="text-sm text-gray-600">Nicht jedes Motiv lässt sich als 3D Motiv sticken</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Patches/Aufnäher -->
            <div class="group relative overflow-hidden bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div class="absolute inset-0 bg-gradient-to-br from-[#0a3a47]/5 to-[#D8127D]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div class="relative p-8 lg:p-12">
                <div class="flex flex-col lg:flex-row gap-12 items-center">
                  <div class="lg:w-1/2 order-2 lg:order-1">
                    <div class="relative">
                      <img 
                        src="https://images.unsplash.com/photo-1685059352125-077b37ca6743?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=987"
                        alt="Custom Patches"
                        class="w-full h-80 object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-500"
                      >
                      <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
                      <div class="absolute bottom-4 left-4 text-white">
                        <span class="bg-[#0a3a47] px-3 py-1 rounded-full text-sm font-semibold">Patches</span>
                      </div>
                    </div>
                  </div>
                  <div class="lg:w-1/2 order-1 lg:order-2">
                    <div class="mb-6">
                      <h3 class="text-3xl font-bold text-[#D8127D] mb-4 flex items-center">
                        <span class="w-12 h-12 bg-[#0a3a47] rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">3</span>
                        patches/Aufnäher
                      </h3>
                      <p class="text-gray-700 text-lg leading-relaxed">
                        Gestickte Aufnäher nach eurem Motiv und in beliebigen Formen ob mit Klettverschluss oder mit Schmelzkleber liefern wir Ihnen bereits ab einer Mindestmenge von 30 Stück.
                      </p>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div class="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:border-[#0a3a47]/30 transition-colors">
                        <h4 class="font-bold text-[#0a3a47] mb-2 text-sm">STÜCKZAHL</h4>
                        <p class="text-sm text-gray-600">Ab 30 Stück</p>
                      </div>
                      <div class="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:border-[#0a3a47]/30 transition-colors">
                        <h4 class="font-bold text-[#0a3a47] mb-2 text-sm">GARNFARBEN</h4>
                        <p class="text-sm text-gray-600">Nahezu unbegrenzte Farbauswahl</p>
                      </div>
                      <div class="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:border-[#0a3a47]/30 transition-colors">
                        <h4 class="font-bold text-[#0a3a47] mb-2 text-sm">TEXTILART</h4>
                        <p class="text-sm text-gray-600">Geeignet für fast alle Textilien</p>
                      </div>
                      <div class="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:border-[#0a3a47]/30 transition-colors">
                        <h4 class="font-bold text-[#0a3a47] mb-2 text-sm">DATEIFORMATE</h4>
                        <p class="text-sm text-gray-600">Vektorisierte Grafiken (.EPS, .AI, .PDF) sind für die Erstellung der Stickkarte nötig. Stickkarte hat bei uns die Formate (DST, TAB)</p>
                      </div>
                    </div>
                    <div class="mt-4 bg-gradient-to-r from-[#0a3a47]/10 to-[#D8127D]/10 p-4 rounded-xl border-l-4 border-[#0a3a47]">
                      <h4 class="font-bold text-[#0a3a47] mb-2 text-sm">BESONDERHEITEN</h4>
                      <p class="text-sm text-gray-600">Der Aufnäher kann auch auf fast auf jeden Untergrund selbst aufgebracht werden.</p>
                    </div>
                  </div>
                </div>
              </div>
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
            Rufen Sie uns an oder schreiben Sie uns eine E-Mail
          </h2>
          <p class="text-lg text-gray-600 mb-8">
            Wir freuen uns.
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
  </div>
</template>

<script setup>
// Emits
defineEmits(['navigate'])
</script>

<style scoped>
.btn {
  @apply inline-block px-6 py-3 rounded-lg font-semibold text-center transition duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2;
}
</style>
