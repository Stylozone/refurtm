<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const { data, error } = await useAsyncGql({
  operation: 'ProductBySlug',
  variables: { slug: route.params.slug as string },
})

if (error.value) {
  console.error(error.value)
}

const product = computed(() => data.value?.productBySlug ?? null)
</script>

<template>
  <div class="p-6">
    <Button variant="outline" class="underline" @click="$router.back()">
      ← Back
    </Button>
    <div v-if="product" class="mt-4 rounded-xl border p-6 shadow">
      <img
        :src="product.imageUrl" class="mb-4 h-64 w-full rounded-lg object-cover"
      >
      <h1 class="mb-2 text-3xl font-bold">
        {{ product.title }}
      </h1>
      <p class="mb-4 text-lg text-gray-600">
        {{ product.description }}
      </p>
      <p class="text-xl font-semibold text-green-600">
        ฿{{ product.price }}
      </p>
      <p class="mt-2 text-sm text-gray-500">
        Condition: {{ product.condition }}
      </p>
      <NuxtLink
        class="
          mt-4 inline-block rounded bg-black px-4 py-2 text-white
          hover:bg-gray-800
        "
        :to="`/checkout?productId=${product.id}`"
      >
        Checkout
      </NuxtLink>
    </div>
  </div>
</template>
