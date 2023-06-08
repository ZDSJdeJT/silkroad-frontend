<script setup lang="ts">
import { ref } from 'vue';
import ReceiveForm from 'src/components/ReceiveForm.vue';
import UploadForm from 'src/components/UploadForm.vue';

const tab = ref('receive');
</script>

<template>
  <q-card>
    <q-splitter :model-value="20" disable>
      <template v-slot:before>
        <q-tabs v-model="tab" vertical class="text-primary">
          <q-tab
            name="receive"
            icon="file_download"
            :label="$t('tabs.receive')"
          />
          <q-tab name="upload" icon="file_upload" :label="$t('tabs.upload')" />
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
          <q-tab-panel name="receive"><receive-form /></q-tab-panel>
          <q-tab-panel name="upload"><upload-form /></q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>
  </q-card>
</template>
