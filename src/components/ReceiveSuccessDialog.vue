<script setup lang="ts">
import { computed, ref } from 'vue';
import { Receive } from 'src/types';
import { defaultLanguage } from 'src/i18n';
import RichTextEditor from './RichTextEditor.vue';
import { deleteRecord } from 'src/api/v1';
import { Notify } from 'quasar';

const props = defineProps<{
  isShow: boolean;
  receiveData?: Receive;
  receiveText: string;
}>();

const emit = defineEmits(['update:is-show']);

const expireAt = computed(() => {
  return new Date(props.receiveData?.expireAt as string).toLocaleString(
    localStorage.language ?? defaultLanguage
  );
});

const isSubmitting = ref(false);

const onSubmit = async (id: string) => {
  isSubmitting.value = true;
  try {
    const data = await deleteRecord(id);
    Notify.create({
      message: data.message,
      position: 'top',
      type: 'positive',
    });
    emit('update:is-show', false);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <q-dialog :model-value="isShow" persistent>
    <q-card flat bordered>
      <q-card-section>
        <div v-if="!receiveText" class="text-h4">
          {{ $t('dialogs.fileDownloadStartingMessage') }}...
        </div>
        <rich-text-editor v-else :text="receiveText" :readonly="true" />
      </q-card-section>
      <q-card-section>
        <q-list bordered separator>
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label overline>过期时间</q-item-label>
              <q-item-label>{{ expireAt }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label overline>剩余下载次数</q-item-label>
              <q-item-label
                >{{ receiveData!.downloadTimes === 0 ? '∞' : (receiveData!.downloadTimes - 1) }}</q-item-label
              >
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-separator />
      <q-card-actions>
        <q-btn @click="emit('update:is-show', false)" flat color="primary">
          {{ $t('buttons.ok') }}
        </q-btn>
        <q-btn
          v-if="receiveData!.downloadTimes !== 1"
          @click="onSubmit(receiveData!.id)"
          :loading="isSubmitting"
          flat
          color="negative"
        >
          {{ $t('buttons.destroy') }}
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
