<script setup lang="ts">
import { ref } from 'vue';
import { login } from 'src/api/v1';
import { Admin } from 'src/types';
import { router } from 'src/router';
import { Notify } from 'quasar';

const isSubmitting = ref(false);

const defaultForm: Admin = {
  adminName: '',
  password: '',
};
const form = ref({
  ...defaultForm,
});

const onSubmit = async () => {
  isSubmitting.value = true;
  try {
    const data = await login(form.value);
    Notify.create({
      message: data.message,
      position: 'top',
      type: 'positive',
    });
    router.push({ name: 'AdminConsole' });
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
  <q-card class="tw-p-4">
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <q-input
        filled
        v-model="form.adminName"
        :label="`${$t('forms.labels.username')} *`"
        lazy-rules
        :rules="[
          (val) =>
            val.length >= 1 ||
            $t('forms.rules.notEmpty', {
              label: $t('forms.labels.username'),
            }),
        ]"
      />
      <q-input
        filled
        type="password"
        v-model="form.password"
        :label="`${$t('forms.labels.password')} *`"
        lazy-rules
        :rules="[
          (val) =>
            val.length >= 1 ||
            $t('forms.rules.notEmpty', {
              label: $t('forms.labels.password'),
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
  </q-card>
</template>
