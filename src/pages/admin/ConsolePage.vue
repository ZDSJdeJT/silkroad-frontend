<script setup lang="ts">
import { ref } from 'vue';
import SystemInfo from 'src/components/SystemInfo.vue';
import EditSettingsForm from 'src/components/EditSettingsForm.vue';
import AdminActions from 'src/components/AdminActions.vue';

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
  <admin-actions />
</template>
