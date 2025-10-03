<template>
  <footer class="bg-[#0a3a47] text-white">
    <div class="container mx-auto px-6 py-12">
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
        <div class="col-span-2 md:col-span-4 lg:col-span-1 mb-6 lg:mb-0">
          <img src="/assets/group-25.svg" 
               alt="private-shirt.de Logo" 
               class="h-8 mb-4"
               @error="handleLogoError">
          <p class="text-white text-sm opacity-80">Dein Druck. Deine Idee. Dein Shirt.</p>
        </div>
        <div>
          <h4 class="font-semibold mb-3">Shop</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="#" class="footer-link">T-Shirts</a></li>
            <li><a href="#" class="footer-link">Hoodies</a></li>
            <li><a href="#" class="footer-link">Tassen</a></li>
            <li><a href="#" class="footer-link">Accessoires</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold mb-3">Service</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="#" class="footer-link">Großbestellungen</a></li>
            <li><a href="#" class="footer-link">Hilfe & FAQ</a></li>
            <li><a href="#" class="footer-link">Kontakt</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold mb-3">Unternehmen</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="#" class="footer-link">Über uns</a></li>
            <li><a href="#" class="footer-link">Jobs</a></li>
            <li><a href="#" class="footer-link">Nachhaltigkeit</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold mb-3">Legal</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="#" class="footer-link">Impressum</a></li>
            <li><a href="#" class="footer-link">Datenschutz</a></li>
            <li><a href="#" class="footer-link">AGB</a></li>
          </ul>
        </div>
      </div>
      <div class="mt-12 border-t border-[#D8127D] pt-8 flex flex-col md:flex-row justify-between items-center">
        <p class="text-sm text-white opacity-80">&copy; {{ new Date().getFullYear() }} private-shirt.de. Alle Rechte vorbehalten.</p>
        <div class="flex space-x-4 mt-4 md:mt-0">
          <!-- Trust Logos Placeholder -->
          <span class="text-xs opacity-70">VISA</span>
          <span class="text-xs opacity-70">Mastercard</span>
          <span class="text-xs opacity-70">PayPal</span>
          <span class="text-xs opacity-70">DHL</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
// Methods
const handleLogoError = (event) => {
  // Replace logo with text
  const logoContainer = event.target.parentElement;
  const textLogo = document.createElement('span');
  textLogo.textContent = 'private-shirt.de';
  textLogo.className = 'text-2xl font-bold text-white';
  logoContainer.replaceChild(textLogo, event.target);
}
</script>

<style scoped>
.footer-link {
  @apply text-gray-400 hover:text-[#D8127D] transition-colors duration-200;
}
</style>
  