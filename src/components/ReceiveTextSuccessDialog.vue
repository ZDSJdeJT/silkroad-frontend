<script setup lang="ts">
import RichTextEditor from './RichTextEditor.vue';

defineProps<{
  isShow: boolean;
  text: string;
}>();

const emit = defineEmits(['update:is-show']);
</script>

<template>
  <q-dialog :model-value="isShow" persistent>
    <q-card flat bordered>
      <q-card-section>
        <rich-text-editor :text="text" readonly />
      </q-card-section>
      <q-separator />
      <q-card-actions>
        <q-btn @click="emit('update:is-show', false)" flat>
          {{ $t('buttons.close') }}
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
