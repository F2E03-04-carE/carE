<script setup lang="ts"></script>
<template>
  <footer class="bg-stone-400 text-white py-20">
    <div class="max-w-[1440px] mx-auto px-[5%] sm:px-[8%] lg:px-[5%]">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 max-w-5xl mx-auto text-center">
        <div class="text-center">
          <div class="flex items-center gap-2 mb-4 justify-center">
            <a href="/"><img
            src="@/assets/icons/carE_logo_white.png"
            alt="carE logo"
            class="h-16 sm:h-20 w-auto object-contain cursor-pointer"
            /></a>
          </div>
        </div>
        <div class="text-center">
          <h3 class="font-bold mb-5 text-[18px]">網站地圖</h3>
          <ul class="space-y-2 text-sm">
            <li><a href="/" class="hover:text-[#e9c667]">尋找維修廠</a></li>
            <li><a href="/join-garage" class="hover:text-[#e9c667]">刊登維修廠</a></li>
          </ul>
        </div>
        <div class="text-center">
          <h3 class="font-bold mb-5 text-[18px]">法律條款</h3>
          <ul class="space-y-2 text-sm">
            <li><a href="/terms" class="hover:text-[#e9c667]">服務條款</a></li>
            <li><a href="/privacy" class="hover:text-[#e9c667]">隱私權政策</a></li>
          </ul>
        </div>
        <div class="text-center">
          <h3 class="font-bold mb-5 text-[18px]">聯絡我們</h3>
          <ul class="space-y-2 text-sm">
            <li>Email: <a href="mailto:info@care.com" class="hover:text-[#e9c667]">info@care.com</a></li>
          </ul>
        </div>
      </div>
      <div class="border-t border-white-700 pt-6 text-center">
        <p class="text-sm sm:text-base">&copy; 2026 carE. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>
