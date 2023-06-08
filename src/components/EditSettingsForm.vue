<script setup lang="ts">
import { ref } from 'vue';
import { getSettings } from 'src/api/v1';
import { Setting } from 'src/types';
import { Languages } from 'src/enums';
import { useQuasar } from 'quasar';
import { updateSetting } from 'src/api/v1';
import { Notify } from 'quasar';

const $q = useQuasar();

const isSubmittingList = ref<Array<boolean>>([]);

const settings = ref<Array<Setting>>([]);

const fetchData = async () => {
  const data = await getSettings();
  settings.value = data.result;
  isSubmittingList.value = new Array(settings.value.length).fill(false);
};
fetchData();

const onSubmit = async (index: number, newValue: string | number) => {
  isSubmittingList.value[index] = true;
  try {
    const data = await updateSetting(settings.value[index].key, newValue);
    Notify.create({
      message: data.message,
      position: 'top',
      type: 'positive',
    });
  } finally {
    isSubmittingList.value[index] = false;
  }
};
</script>

<template>
  <div v-for="(item, index) in settings" :key="index">
    <q-form
      v-if="item.isText"
      @submit="onSubmit(index, item.textValue)"
      class="q-gutter-md flex items-center justify-between"
    >
      <q-input
        filled
        :type="item.key === 'ADMIN_PASSWORD' ? 'password' : 'text'"
        v-model="item.textValue"
        :label="`${item.label[$q.lang.isoName as Languages]} *`"
        class="tw-flex-1"
        lazy-rules
        :rules="[
        (val) => (val.length >= item.min && val.length <= item.max) ||           $t('forms.rules.rangeLength', {
            label: `${item.label[$q.lang.isoName as Languages]}`,
            min: item.min,
            max: item.max,
          }),
      ]"
      >
      </q-input>
      <q-btn
        type="submit"
        round
        flat
        icon="save"
        :loading="isSubmittingList[index]"
      />
    </q-form>
    <q-form
      v-else
      @submit="onSubmit(index, item.numberValue)"
      class="q-gutter-md flex items-center justify-between"
    >
      <q-input
        filled
        type="number"
        v-model.number="item.numberValue"
        :label="`${item.label[$q.lang.isoName as Languages]} *`"
        class="tw-flex-1"
        lazy-rules
        :rules="[(val) => (val >= item.min && val <= item.max) ||           $t('forms.rules.range', {
            label: `${item.label[$q.lang.isoName as Languages]}`,
            min: item.min,
            max: item.max,
          }),]"
      >
      </q-input>
      <q-btn
        type="submit"
        round
        flat
        icon="save"
        :loading="isSubmittingList[index]"
      />
    </q-form>
  </div>
</template>
