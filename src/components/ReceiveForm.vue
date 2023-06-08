<script setup lang="ts">
import { ref } from 'vue';
import { receive } from 'src/api/v1';
import ReceiveSuccessDialog from './ReceiveSuccessDialog.vue';
import { Notify } from 'quasar';
import { Receive } from 'src/types';

const isSubmitting = ref(false);

const defaultForm = {
  receiveCode: (() => {
    const url = new URL(window.location.href);
    const query = new URLSearchParams(url.search);
    return query.get('receive_code') ?? '';
  })(),
};
const form = ref({
  ...defaultForm,
});

const isReceiveSuccessDialogShow = ref(false);

const receiveData = ref<Receive | null>(null);

const onSubmit = async () => {
  isSubmitting.value = true;
  try {
    const { data, callback } = await receive(form.value.receiveCode);
    Notify.create({
      message: data.message,
      position: 'top',
      type: 'positive',
    });
    receiveData.value = data.result;
    isReceiveSuccessDialogShow.value = true;
    if (callback) {
      callback();
    }
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
  <receive-success-dialog
    v-model:is-show="isReceiveSuccessDialogShow"
    :receive-data="receiveData as Receive"
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
