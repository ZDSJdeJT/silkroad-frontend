<script setup lang="ts">
import { computed, ref } from 'vue';
import { Record } from 'src/types';
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
  record?: Record;
}>();

const emit = defineEmits(['update:is-show']);

const expireAt = computed(() => {
  return new Date(props.record?.expireAt as string).toLocaleString(
    localStorage.language ?? defaultLanguage
  );
});

const isReceiveTextSuccessDialogShow = ref(false);
const text = ref('');

const isSubmittingReceive = ref(false);

const onSubmitReceive = async (record: Record) => {
  if (record.filename) {
    emit('update:is-show', false);
    const dialog = $q.dialog({
      message: `${i18n.t('dialogs.downloading')}... 0%`,
      progress: true,
      persistent: true,
      ok: false,
    });
    try {
      await receiveFile(
        record.code,
        record.filename,
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
      Notify.create({
        message: i18n.t('notify.receiveSuccess'),
        position: 'top',
        type: 'positive',
      });
    } finally {
      dialog.hide();
    }
    return;
  }
  try {
    isSubmittingReceive.value = true;
    const data = await receiveText(record.code);
    Notify.create({
      message: data.message,
      position: 'top',
      type: 'positive',
    });
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
  } finally {
    isSubmittingDeleteRecord.value = false;
    emit('update:is-show', false);
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
      <q-card-section class="tw-text-2xl">
        <q-list bordered separator>
          <template v-if="!!record!.filename">
            <q-item clickable v-ripple>
              <q-item-section>
                <q-item-label overline>{{ $t('dialogs.type') }}</q-item-label>
                <q-item-label>{{ $t('dialogs.file') }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple>
              <q-item-section>
                <q-item-label overline>{{
                  $t('dialogs.filename')
                }}</q-item-label>
                <q-item-label>
                  {{ record!.filename }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </template>
          <q-item v-else clickable v-ripple>
            <q-item-section>
              <q-item-label overline>{{ $t('dialogs.type') }}</q-item-label>
              <q-item-label>{{ $t('dialogs.text') }}</q-item-label>
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
                >{{ record!.downloadTimes === 0 ? '∞' : record!.downloadTimes }}</q-item-label
              >
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-separator />
      <q-card-actions>
        <q-btn
          @click="onSubmitReceive(record!)"
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
          @click="onSubmitDeleteRecord(record!.id)"
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
