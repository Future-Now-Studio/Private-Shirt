<template>
    <div class="bg-white" v-gsap>
        <div class="container mx-auto px-6 py-16">
            <div class="max-w-4xl mx-auto">
                <h1 class="text-4xl font-bold text-center mb-4">Großbestellungen für Ihr Business</h1>
                <p class="text-xl text-gray-600 text-center mb-12">Perfekt für Firmen, Vereine, Events und Merchandise.</p>
  
                <div class="grid md:grid-cols-3 gap-8 text-center mb-16">
                   <div v-for="benefit in b2bBenefits" :key="benefit.title" class="p-4">
                       <div class="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 mx-auto mb-4">
                          <component :is="benefit.icon" class="h-8 w-8" />
                       </div>
                       <h3 class="text-lg font-semibold">{{ benefit.title }}</h3>
                       <p class="text-sm text-gray-500">{{ benefit.description }}</p>
                   </div>
                </div>
  
                <div class="bg-gray-50 p-8 rounded-xl border border-gray-200">
                     <h2 class="text-2xl font-bold mb-6 text-center">Unverbindliche Anfrage stellen</h2>
                     <form @submit.prevent="submitForm" class="space-y-6">
                       <div class="grid md:grid-cols-2 gap-6">
                         <input type="text" placeholder="Firma / Name*" class="form-input" required>
                         <input type="email" placeholder="E-Mail*" class="form-input" required>
                       </div>
                       <input type="tel" placeholder="Telefon (optional)" class="form-input">
                       <input type="number" placeholder="Geschätzte Stückzahl*" class="form-input" required>
                       <textarea placeholder="Ihre Nachricht an uns..." rows="5" class="form-input"></textarea>
                       <div>
                         <label class="block mb-2 text-sm font-medium text-gray-700">Design hochladen (optional)</label>
                         <input type="file" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                       </div>
                       <div class="text-center">
                         <button type="submit" class="btn btn-primary btn-lg">Anfrage senden</button>
                       </div>
                     </form>
                </div>
            </div>
        </div>
    </div>
  </template>
  
  <script setup>
  import { DollarSign, Users, FileText } from 'lucide-vue-next';
  
  const b2bBenefits = ref([
    { title: 'Attraktive Mengenrabatte', description: 'Sparen Sie bei größeren Bestellungen für Ihr Team.', icon: DollarSign },
    { title: 'Persönliche Beratung', description: 'Ein fester Ansprechpartner begleitet Ihr Projekt.', icon: Users },
    { title: 'Kauf auf Rechnung', description: 'Bequeme und sichere Zahlung für Geschäftskunden.', icon: FileText }
  ]);
  
  const submitForm = () => {
    // In a real app, you would handle form submission here.
    alert('Vielen Dank für Ihre Anfrage! Wir werden uns in Kürze bei Ihnen melden.');
  }
  
  useHead({
    title: 'Großbestellung & B2B | Textildruck für Firmen – private-shirt.de',
    meta: [
      { name: 'description', content: 'Fragen Sie jetzt Ihr individuelles Angebot für Großbestellungen an. Perfekt für Firmenkleidung, Events und Vereine. Attraktive Mengenrabatte.' }
    ]
  })
  </script>
  