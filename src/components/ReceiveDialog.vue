<script setup lang="ts">
import { computed, ref } from 'vue';
import { Receive } from 'src/types';
import { defaultLanguage } from 'src/i18n';
import { deleteRecord, receiveText, receiveFile } from 'src/api/v1';
import { Notify } from 'quasar';
import ReceiveTextSuccessDialog from './ReceiveTextSuccessDialog.vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { AxiosProgressEvent } from 'axios';

const $q = useQuasar();

const i18n = useI18n({ useScope: 'global' });

const props = defineProps<{
  isShow: boolean;
  receiveData?: Receive;
}>();

const emit = defineEmits(['update:is-show']);

const expireAt = computed(() => {
  return new Date(props.receiveData?.expireAt as string).toLocaleString(
    localStorage.language ?? defaultLanguage
  );
});

const isReceiveTextSuccessDialogShow = ref(false);
const text = ref('');

const isSubmittingReceive = ref(false);

const onSubmitReceive = async (receiveData: Receive) => {
  if (receiveData.filename) {
    emit('update:is-show', false);
    const dialog = $q.dialog({
      message: `${i18n.t('dialogs.downloading')}... 0%`,
      progress: true,
      persistent: true,
      ok: false,
    });
    try {
      await receiveFile(
        receiveData.code,
        receiveData.filename,
        (progressEvent: AxiosProgressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) /
              (progressEvent.total ?? progressEvent.loaded)
          );
          dialog.update({
            message: `${i18n.t('dialogs.downloading')}... ${progress}%`,
          });
        }
      );
    } finally {
      dialog.hide();
    }
    return;
  }
  try {
    isSubmittingReceive.value = true;
    const data = await receiveText(receiveData.code);
    text.value = data.result;
    isReceiveTextSuccessDialogShow.value = true;
  } finally {
    isSubmittingReceive.value = false;
    emit('update:is-show', false);
  }
};

const isSubmittingDeleteRecord = ref(false);

const onSubmitDeleteRecord = async (id: string) => {
  isSubmittingDeleteRecord.value = true;
  try {
    const data = await deleteRecord(id);
    Notify.create({
      message: data.message,
      position: 'top',
      type: 'positive',
    });
    emit('update:is-show', false);
  } finally {
    isSubmittingDeleteRecord.value = false;
  }
};
</script>

<template>
  <receive-text-success-dialog
    v-model:is-show="isReceiveTextSuccessDialogShow"
    :text="text"
  />
  <q-dialog :model-value="isShow" persistent>
    <q-card flat bordered>
      <q-card-section>
        <q-list bordered separator>
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label overline>{{ $t('dialogs.type') }}</q-item-label>
              <q-item-label>{{
                receiveData!.filename ? $t('dialogs.file') : $t('dialogs.text')
              }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label overline>{{ $t('dialogs.expireAt') }}</q-item-label>
              <q-item-label>{{ expireAt }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label overline>{{
                $t('dialogs.remainingDownloadTimes')
              }}</q-item-label>
              <q-item-label
                >{{ receiveData!.downloadTimes === 0 ? '∞' : receiveData!.downloadTimes }}</q-item-label
              >
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-separator />
      <q-card-actions>
        <q-btn
          @click="onSubmitReceive(receiveData!)"
          :loading="isSubmittingReceive"
          flat
          color="primary"
        >
          {{ $t('buttons.receive') }}
        </q-btn>
        <q-btn @click="emit('update:is-show', false)" flat>
          {{ $t('buttons.cancel') }}
        </q-btn>
        <q-btn
          @click="onSubmitDeleteRecord(receiveData!.id)"
          :loading="isSubmittingDeleteRecord"
          flat
          color="negative"
        >
          {{ $t('buttons.destroy') }}
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
