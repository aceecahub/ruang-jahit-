<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';

const props = defineProps<{
    message?: string;
}>();

// Variabel penampung teks yang angkanya akan diubah-ubah
const displayMessage = ref('');
let timer: number | null = null;

// Pantau setiap kali ada pesan error baru masuk
watch(() => props.message, (newMessage) => {
    // Bersihkan timer lama jika sebelumnya sudah ada
    if (timer) clearInterval(timer);

    // Jika tidak ada error, kosongkan pesan
    if (!newMessage) {
        displayMessage.value = '';
        return;
    }

    // Setel pesan awal
    displayMessage.value = newMessage;

    // Deteksi jika di dalam pesan terdapat pola "dalam X detik"
    const match = newMessage.match(/dalam (\d+) detik/);

    if (match) {
        let seconds = parseInt(match[1], 10);

        // Buat hitungan mundur setiap 1000 milidetik (1 detik)
        timer = window.setInterval(() => {
            if (seconds > 1) {
                seconds--;
                // Ganti tulisan angka lama dengan angka yang sudah dikurangi
                displayMessage.value = newMessage.replace(/dalam \d+ detik/, `dalam ${seconds} detik`);
            } else {
                // Jika sudah 0, ubah teksnya
                displayMessage.value = "Waktu tunggu selesai. Silakan coba masuk kembali.";
                clearInterval(timer!);
            }
        }, 1000);
    }
}, { immediate: true }); // immediate: true agar langsung berjalan saat komponen dirender

// Pastikan timer dimatikan saat pindah halaman agar tidak bocor di memori
onUnmounted(() => {
    if (timer) clearInterval(timer);
});
</script>

<template>
    <div v-show="message">
        <!-- Ubah {{ message }} menjadi {{ displayMessage }} -->
        <p class="text-sm text-red-600 dark:text-red-500">
            {{ displayMessage }}
        </p>
    </div>
</template>
