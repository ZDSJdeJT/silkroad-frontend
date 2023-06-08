<script setup lang="ts">
import QrcodeVue from 'qrcode.vue';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

const props = defineProps({
  isShow: {
    type: Boolean,
    required: true,
  },
  receiveCode: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['update:is-show']);

const receiveURL = computed(() => {
  return `${location.origin}/?receive_code=${props.receiveCode}`;
});

const i18n = useI18n({ useScope: 'global' });

const copy = (text: string) => {
  if (!navigator.clipboard) {
    Notify.create({
      message: i18n.t('notify.copyNotSupported'),
      position: 'top',
      type: 'negative',
    });
    return;
  }
  navigator.clipboard
    .writeText(text)
    .then(() => {
      Notify.create({
        message: i18n.t('notify.copySuccess'),
        position: 'top',
        type: 'positive',
      });
    })
    .catch(() => {
      Notify.create({
        message: i18n.t('notify.copyFail'),
        position: 'top',
        type: 'negative',
      });
    });
};
</script>

<template>
  <q-dialog :model-value="isShow" persistent>
    <q-card flat bordered>
      <q-card-section horizontal>
        <q-card-section class="q-pt-xs">
          <div class="text-overline">{{ $t('dialogs.receiveInfo') }}</div>
          <div class="text-h5 q-mt-sm q-mb-xs">
            {{ receiveCode }}
            <q-btn
              round
              size="md"
              flat
              icon="content_copy"
              @click="copy(receiveCode)"
            />
          </div>
          <div class="text-caption text-grey">
            {{ receiveURL }}
            <q-btn
              round
              size="xs"
              flat
              icon="content_copy"
              @click="copy(receiveURL)"
            />
          </div>
        </q-card-section>
        <q-card-section class="col-5 flex flex-center">
          <qrcode-vue :value="receiveURL"></qrcode-vue>
        </q-card-section>
      </q-card-section>
      <q-separator />
      <q-card-actions>
        <q-btn @click="emit('update:is-show', false)" flat color="primary">
          {{ $t('buttons.ok') }}
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
