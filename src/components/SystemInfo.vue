<script setup lang="ts">
import { ref } from 'vue';
import { getSystemInfo } from 'src/api/v1';
import { SystemInfo } from 'src/types';

const systemInfo = ref<SystemInfo | null>(null);

const fetchData = async () => {
  const data = await getSystemInfo();
  systemInfo.value = data.result;
};
fetchData();
</script>

<template>
  <div class="text-h4">
    {{ systemInfo?.appName }}
    <q-badge outline align="middle" color="primary"
      >v{{ systemInfo?.appVersion }}</q-badge
    >
  </div>
  <q-inner-loading :showing="!systemInfo">
    <q-spinner-gears size="xl" color="primary" />
  </q-inner-loading>
</template>
