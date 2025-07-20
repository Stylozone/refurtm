<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const page = useState<number>('productPage')

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
    <NuxtLink
      :to="{
        path: '/products',
        query: { page },
      }" class="text-blue-500 underline"
    >
      Back
    </NuxtLink>
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
    </div>
  </div>
</template>
