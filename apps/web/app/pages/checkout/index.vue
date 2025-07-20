<script setup lang="ts">
const router = useRouter()
const route = useRoute()
const productId = route.query.productId as string

const quantity = ref(1)

const { data } = await useAsyncGql({
  operation: 'ProductById',
  variables: { id: productId },
})

const product = computed(() => data.value?.productById ?? null)

async function handleCheckout() {
  const result = await useAsyncGql({
    operation: 'Checkout',
    variables: {
      items: [{ productId, quantity: quantity.value }],
    },
  })

  if (result.error?.value) {
    console.error(result.error.value)
    return
  }

  const orderId = result.data.value?.checkout?.orderId
  router.push(`/checkout/success?orderId=${orderId}`)
}
</script>

<template>
  <div class="p-6">
    <Button variant="outline" class="underline" @click="$router.back()">
      ← Back
    </Button>

    <div v-if="product" class="mt-4 space-y-4">
      <h1 class="text-2xl font-bold">
        {{ product.title }}
      </h1>
      <p class="text-gray-500">
        ฿{{ product.price }}
      </p>

      <label class="block">
        Quantity:
        <input
          v-model.number="quantity"
          type="number"
          class="ml-2 w-20 rounded border px-2 py-1"
          min="1"
        >
      </label>

      <button
        class="
          rounded bg-black px-4 py-2 text-white
          hover:bg-gray-800
        "
        @click="handleCheckout"
      >
        Confirm Purchase
      </button>
    </div>
  </div>
</template>
