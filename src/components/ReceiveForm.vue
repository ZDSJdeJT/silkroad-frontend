<script setup lang="ts">
import { ref } from 'vue';
import { getRecordByCode } from 'src/api/v1';
import ReceiveDialog from './ReceiveDialog.vue';
import { Record } from 'src/types';

const isSubmitting = ref(false);

const defaultForm = {
  receiveCode: '',
};
const form = ref({
  ...defaultForm,
});

const isReceiveSuccessDialogShow = ref(false);

const record = ref<Record | null>(null);

const onSubmit = async () => {
  isSubmitting.value = true;
  try {
    const data = await getRecordByCode(form.value.receiveCode);
    record.value = data.result;
    isReceiveSuccessDialogShow.value = true;
  } finally {
    isSubmitting.value = false;
  }
};

const onReset = () => {
  form.value = {
    ...defaultForm,
  };
};

const url = new URL(window.location.href);
const query = new URLSearchParams(url.search);
const receiveCode = query.get('receive_code');
if (receiveCode) {
  form.value.receiveCode = receiveCode;
  onSubmit();
}
</script>

<template>
  <receive-dialog
    v-model:is-show="isReceiveSuccessDialogShow"
    :record="record as Record"
  />
  <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
    <q-input
      filled
      v-model="form.receiveCode"
      :label="`${$t('forms.labels.receiveCode')} *`"
      lazy-rules
      :rules="[
        (val) =>
          val.length > 0 ||
          $t('forms.rules.notEmpty', {
            label: $t('forms.labels.receiveCode'),
          }),
      ]"
    />
    <q-btn
      :loading="isSubmitting"
      :label="$t('buttons.submit')"
      type="submit"
      color="primary"
    />
    <q-btn :label="$t('buttons.reset')" type="reset" />
  </q-form>
</template>
