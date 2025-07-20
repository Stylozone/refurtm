<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const page = ref(Number(route.query.page) || 1)
const limit = 6

const { data, error, pending, refresh } = await useAsyncGql({
  operation: 'Products',
  variables: { category: 'Phone', limit, page },
})

if (error.value) {
  console.error(error.value)
}

const totalPage = computed(() => Math.ceil(data.value?.products.total / limit) ?? 0)
const products = computed(() => data.value?.products?.products ?? [])

function nextPage() {
  if (page.value < totalPage.value) {
    page.value++
  }
}

function prevPage() {
  if (page.value > 1) {
    page.value--
  }
}

function goToPage(p: number) {
  if (p !== page.value) {
    page.value = p
  }
}

// sync to URL when page changes
watch(page, (val) => {
  router.replace({ query: { ...route.query, page: val.toString() } })
  refresh()
})

// sync back if URL changes (e.g. browser back/forward)
watch(
  () => route.query.page,
  (val) => {
    const parsed = Number.parseInt(val as string || '1')
    if (!Number.isNaN(parsed) && parsed !== page.value) {
      page.value = parsed
    }
  },
)
</script>

<template>
  <div class="p-6">
    <h1 class="mb-4 text-2xl font-bold">
      Products
    </h1>

    <div v-if="pending" class="text-gray-500">
      Loading products...
    </div>

    <div v-else-if="products.length === 0" class="text-gray-500">
      No products found.
    </div>

    <div v-else class="flex flex-col gap-2">
      <div class="grid grid-cols-3 gap-6">
        <NuxtLink
          v-for="product in products"
          :key="product.slug"
          :to="`/products/${product.slug}`"
        >
          <div
            class="
              rounded-xl border p-4 shadow
              hover:bg-gray-50
            "
          >
            <img
              :src="product.imageUrl" class="
                mb-2 h-48 w-full rounded-lg object-cover
              "
            >
            <h2 class="font-semibold">
              {{ product.title }}
            </h2>
            <p class="text-gray-500">
              {{ product.condition }} • ฿{{ product.price }}
            </p>
          </div>
        </NuxtLink>
      </div>
      <!-- Pagination -->
      <div class="flex justify-center gap-4">
        <Button
          class="rounded px-4 py-2"
          :disabled="page === 1"
          @click="prevPage"
        >
          Previous
        </Button>
        <!-- Page numbers -->
        <Button
          v-for="p in totalPage"
          :key="p"
          class="rounded px-3 py-2" :variant="page === p ? 'default' : 'outline'"
          @click="goToPage(p)"
        >
          {{ p }}
        </Button>
        <Button
          class="rounded px-4 py-2"
          @click="nextPage"
        >
          Next
        </Button>
      </div>
    </div>
  </div>
</template>
