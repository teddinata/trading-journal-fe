<!-- src/views/Home.vue -->
<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <!-- Navbar -->
    <Navbar />
    <!-- Hero Section -->
    <div class="relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="pt-20 pb-16 text-center lg:pt-32">
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-8">
            <span class="text-emerald-500">Catat</span> dan <span class="text-emerald-500">Analisis</span>
            <br />Trading Anda dengan Mudah
          </h1>
          <p class="max-w-2xl mx-auto text-xl text-gray-300 mb-10">
            Platform jurnal trading gratis yang membantu Anda melacak, menganalisis, dan meningkatkan performa trading Anda.
          </p>
          <div class="flex justify-center gap-4">
            <router-link 
              to="/register" 
              class="px-8 py-3 bg-emerald-500 text-black rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
            >
              Mulai Sekarang - Gratis!
            </router-link>
            <router-link 
              to="/login" 
              class="px-8 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Login
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="py-20 bg-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold mb-4">Fitur Unggulan</h2>
          <p class="text-gray-300 max-w-2xl mx-auto">
            Tools lengkap untuk membantu Anda mengembangkan strategi trading yang lebih baik
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-gray-900 p-6 rounded-xl border border-gray-700">
            <div class="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4">
              <ChartBarIcon class="w-6 h-6 text-emerald-500" />
            </div>
            <h3 class="text-xl font-semibold mb-2">Dashboard Analisis</h3>
            <p class="text-gray-300">
              Pantau performa trading Anda melalui dashboard interaktif dengan metrik penting seperti win rate, profit factor, dan risk analysis.
            </p>
          </div>

          <div class="bg-gray-900 p-6 rounded-xl border border-gray-700">
            <div class="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4">
              <ClipboardDocumentCheckIcon class="w-6 h-6 text-emerald-500" />
            </div>
            <h3 class="text-xl font-semibold mb-2">Jurnal Terstruktur</h3>
            <p class="text-gray-300">
              Catat setiap trade dengan detail seperti entry price, target profit, stop loss, dan strategi yang digunakan.
            </p>
          </div>

          <div class="bg-gray-900 p-6 rounded-xl border border-gray-700">
            <div class="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4">
              <ShieldCheckIcon class="w-6 h-6 text-emerald-500" />
            </div>
            <h3 class="text-xl font-semibold mb-2">Data Aman</h3>
            <p class="text-gray-300">
              Data trading Anda tersimpan dengan aman dan tidak akan disalahgunakan. Privasi Anda adalah prioritas kami.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Statistics Section -->
    <div class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="text-4xl font-bold text-emerald-500 mb-2">100%</div>
            <div class="text-gray-300">Gratis</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold text-emerald-500 mb-2">24/7</div>
            <div class="text-gray-300">Akses</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold text-emerald-500 mb-2">0</div>
            <div class="text-gray-300">Biaya Tersembunyi</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold text-emerald-500 mb-2">∞</div>
            <div class="text-gray-300">Trade History</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Benefits Section -->
    <div class="py-20 bg-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold mb-4">Mengapa Menggunakan Jurnal Trading Kami?</h2>
          <p class="text-gray-300 max-w-2xl mx-auto">
            Tingkatkan disiplin dan konsistensi trading Anda dengan tools yang tepat
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-12">
          <div class="space-y-8">
            <div class="flex gap-4">
              <div class="flex-shrink-0">
                <ChartBarSquareIcon class="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <h3 class="text-xl font-semibold mb-2">Analisis Mendalam</h3>
                <p class="text-gray-300">
                  Dapatkan insight mendalam tentang performa trading Anda melalui analisis strategi dan risk management.
                </p>
              </div>
            </div>
            <div class="flex gap-4">
              <div class="flex-shrink-0">
                <ChartBarIcon class="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <h3 class="text-xl font-semibold mb-2">Tracking Sistematis</h3>
                <p class="text-gray-300">
                  Monitor perkembangan trading Anda secara sistematis dan identifikasi area yang perlu ditingkatkan.
                </p>
              </div>
            </div>
          </div>

          <div class="bg-gray-900 rounded-xl border border-gray-700 p-8">
            <h3 class="text-2xl font-bold mb-6">Mulai Jurnal Trading Anda</h3>
            <ul class="space-y-4 mb-8">
              <li class="flex items-center gap-3">
                <ChevronRightIcon class="w-5 h-5 text-emerald-500" />
                <span>Registrasi gratis tanpa kartu kredit</span>
              </li>
              <li class="flex items-center gap-3">
                <ChevronRightIcon class="w-5 h-5 text-emerald-500" />
                <span>Akses penuh ke semua fitur</span>
              </li>
              <li class="flex items-center gap-3">
                <ChevronRightIcon class="w-5 h-5 text-emerald-500" />
                <span>Data trading aman dan terenkripsi</span>
              </li>
              <li class="flex items-center gap-3">
                <ChevronRightIcon class="w-5 h-5 text-emerald-500" />
                <span>Update fitur berkelanjutan</span>
              </li>
            </ul>
            <router-link
              to="/register"
              class="block w-full text-center px-8 py-3 bg-emerald-500 text-black rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
            >
              Daftar Sekarang
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="py-12 border-t border-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
        <p>Version v{{ version }} © {{ currentYear }} Trading Journal. Semua hak dilindungi.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Navbar from '@/components/Navbar.vue'
// use version from package.json
import { version } from '../../package.json'

import {
  ChartBarIcon,
  ClipboardDocumentCheckIcon,
  ShieldCheckIcon,
  ChartBarSquareIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/solid'

const currentYear = computed(() => new Date().getFullYear())
</script>