<script setup lang="ts">
import { ref } from 'vue';
import SystemInfo from 'src/components/SystemInfo.vue';
import EditSettingsForm from 'src/components/EditSettingsForm.vue';
import { logout } from 'src/api/v1';
import { router } from 'src/router';
import { Notify } from 'quasar';

const isSubmitting = ref(false);

const onSubmit = async () => {
  isSubmitting.value = true;
  try {
    const data = await logout();
    Notify.create({
      message: data.message,
      position: 'top',
      type: 'positive',
    });
    router.push({ name: 'AdminLogin' });
  } finally {
    isSubmitting.value = false;
  }
};

const tab = ref('systemInfo');
</script>

<template>
  <q-card>
    <q-splitter :model-value="20" disable>
      <template v-slot:before>
        <q-tabs v-model="tab" vertical class="text-primary">
          <q-tab name="systemInfo" icon="info" :label="$t('tabs.systemInfo')" />
          <q-tab name="settings" icon="settings" :label="$t('tabs.settings')" />
        </q-tabs>
      </template>
      <template v-slot:after>
        <q-tab-panels
          v-model="tab"
          animated
          vertical
          keep-alive
          transition-prev="jump-up"
          transition-next="jump-up"
        >
          <q-tab-panel name="systemInfo"><system-info /></q-tab-panel>
          <q-tab-panel name="settings"><edit-settings-form /></q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>
  </q-card>
  <q-page-sticky position="bottom-left" :offset="[18, 18]">
    <q-btn
      fab
      color="primary"
      icon="logout"
      @click="onSubmit"
      :loading="isSubmitting"
    />
  </q-page-sticky>
</template>
