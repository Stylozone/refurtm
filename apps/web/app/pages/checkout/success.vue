<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const orderId = route.query.orderId
</script>

<template>
  <div class="p-6 text-center">
    <h1 class="text-2xl font-bold text-green-600">
      Checkout Successful 🎉
    </h1>
    <p class="mt-2">
      Your order has been placed successfully.
    </p>
    <p class="mt-1 text-gray-500">
      Order ID: {{ orderId }}
    </p>

    <NuxtLink
      to="/products"
      class="
        mt-6 inline-block rounded bg-black px-4 py-2 text-white
        hover:bg-gray-800
      "
    >
      Continue Shopping
    </NuxtLink>
  </div>
</template>
