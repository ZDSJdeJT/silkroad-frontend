<script setup lang="ts">
defineProps({
  statusCode: {
    type: Number,
    required: true,
  },
  statusText: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="flex tw-flex-col tw-h-full tw-items-center tw-py-8">
    <div class="tw-text-8xl">{{ $t(statusText) }}</div>
    <div class="tw-text-4xl tw-opacity-40">{{ statusCode }}</div>
    <q-btn
      class="q-mt-xl"
      color="primary"
      unelevated
      to="/"
      :label="$t('buttons.goHome')"
      no-caps
    />
  </div>
</template>
