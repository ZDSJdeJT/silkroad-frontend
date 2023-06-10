<script setup lang="ts">
import { ref } from 'vue';
import RichTextEditor from './RichTextEditor.vue';
import { getPublicSettings, uploadText, mergeFile } from 'src/api/v1';
import { PublicSettings } from 'src/types';
import { useQuasar, Notify } from 'quasar';
import UploadSuccessDialog from './UploadSuccessDialog.vue';
import { getFileChunks, uploadChunk } from 'src/utils';
import { v4 as uuidv4 } from 'uuid';
import { useI18n } from 'vue-i18n';

const publicSettings = ref<PublicSettings | null>(null);

const fetchData = async () => {
  const data = await getPublicSettings();
  publicSettings.value = data.result;
};
fetchData();

const isSubmitting = ref(false);

const defaultForm = {
  keepDays: 1,
  isDownloadTimesLimited: true,
  downloadTimes: 1,
  type: 'text',
  text: '',
  file: null as File | null,
};
const form = ref({
  ...defaultForm,
});

const isUploadSuccessDialogShow = ref(false);

const receiveCode = ref('');

const $q = useQuasar();

const i18n = useI18n({ useScope: 'global' });

const onSubmit = async () => {
  if (form.value.type === 'text') {
    isSubmitting.value = true;
    try {
      const data = await uploadText({
        downloadTimes: form.value.isDownloadTimesLimited
          ? form.value.downloadTimes
          : 0,
        keepDays: form.value.keepDays,
        text: form.value.text,
      });
      Notify.create({
        message: data.message,
        position: 'top',
        type: 'positive',
      });
      receiveCode.value = data.result;
      isUploadSuccessDialogShow.value = true;
    } finally {
      isSubmitting.value = false;
    }
    return;
  }
  isSubmitting.value = true;
  const dialog = $q.dialog({
    message: `${i18n.t('dialogs.uploading')}... 0%`,
    progress: true,
    persistent: true,
    ok: false,
  });
  const chunks = getFileChunks(
    form.value.file as File,
    (publicSettings.value as PublicSettings).uploadChunkBytes
  );
  const uuid = uuidv4();
  const promises: Array<Promise<void>> = [];
  for (let i = 0; i < chunks.length; i++) {
    promises.push(uploadChunk(uuid, i, chunks.length, chunks[i]));
  }
  let completedPromises = 0;
  const promiseRace = new Promise<void>((resolve, reject) => {
    for (const promise of promises) {
      promise
        .then(() => {
          completedPromises++;
          const progress = Math.floor(
            (completedPromises / promises.length) * 100
          );
          dialog.update({
            message: `${i18n.t('dialogs.uploading')}... ${progress}%`,
          });
          if (completedPromises === promises.length) {
            dialog.hide();
            resolve();
          }
        })
        .catch(reject);
    }
  });
  try {
    await Promise.all([promiseRace]);
    const data = await mergeFile(uuid, {
      downloadTimes: form.value.isDownloadTimesLimited
        ? form.value.downloadTimes
        : 0,
      keepDays: form.value.keepDays,
      filename: (form.value.file as File).name,
    });
    Notify.create({
      message: data.message,
      position: 'top',
      type: 'positive',
    });
    receiveCode.value = data.result;
    isUploadSuccessDialogShow.value = true;
  } finally {
    isSubmitting.value = false;
  }
};

const onReset = () => {
  form.value = {
    ...defaultForm,
  };
};
</script>

<template>
  <upload-success-dialog
    v-model:is-show="isUploadSuccessDialogShow"
    :receive-code="receiveCode"
  />
  <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
    <q-input
      filled
      type="number"
      v-model.number="form.keepDays"
      :label="`${$t('forms.labels.keepDays')} *`"
      lazy-rules
      :rules="[
        (val) =>
          (val >= 1 && val <= publicSettings!.keepDays) ||
          $t('forms.rules.range', {
            label: $t('forms.labels.keepDays'),
            min: 1,
            max: publicSettings!.keepDays,
          }),
      ]"
    />
    <q-toggle
      v-model="form.isDownloadTimesLimited"
      :label="`${$t('forms.labels.isDownloadTimesLimited')} *`"
      left-label
    />
    <br />
    <q-input
      v-if="form.isDownloadTimesLimited"
      filled
      type="number"
      v-model.number="form.downloadTimes"
      :label="`${$t('forms.labels.downloadTimes')} *`"
      lazy-rules
      :rules="[
        (val) =>
          (val >= 1 && val <= publicSettings!.downloadTimes) ||
          $t('forms.rules.range', {
            label: $t('forms.labels.downloadTimes'),
            min: 1,
            max: publicSettings!.downloadTimes,
          }),
      ]"
    />
    <q-radio v-model="form.type" val="text" :label="$t('forms.labels.text')" />
    <q-radio v-model="form.type" val="file" :label="$t('forms.labels.file')" />
    <q-field
      v-if="form.type === 'text'"
      :model-value="form.text"
      filled
      lazy-rules
      counter
      :rules="[
        (val) =>
          (val.length >= 1 && val.length <= publicSettings!.uploadTextLength) ||
          $t('forms.rules.rangeLength', {
            label: $t('forms.labels.text'),
            min: 1,
            max: publicSettings!.uploadTextLength,
          }),
      ]"
    >
      <template v-slot:control>
        <rich-text-editor v-model:text="form.text" />
      </template>
      <template v-slot:hint>{{ $t('forms.hints.richText') }}</template>
    </q-field>
    <q-file
      v-else
      filled
      clearable
      bottom-slots
      v-model="form.file"
      :label="`${$t('forms.labels.file')} *`"
      lazy-rules
      :rules="[
        (val) =>
          val ||
          $t('forms.rules.notEmpty', {
            label: $t('forms.labels.file'),
          }),
        (val) =>
          val.size <= publicSettings!.uploadFileBytes ||
          `${$t('forms.rules.maxSize', {
            label: $t('forms.labels.file'),
            max: publicSettings!.uploadFileBytes / 1048576,
          })} MB`,
      ]"
      counter
    >
      <template v-slot:prepend>
        <q-icon name="cloud_upload" @click.stop />
      </template>
    </q-file>
    <q-btn
      :loading="isSubmitting"
      :label="$t('buttons.submit')"
      type="submit"
      color="primary"
    />
    <q-btn :label="$t('buttons.reset')" type="reset" />
  </q-form>
  <q-inner-loading :showing="!publicSettings">
    <q-spinner-gears size="xl" color="primary" />
  </q-inner-loading>
</template>
