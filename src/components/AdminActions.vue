<script setup lang="ts">
import { ref } from 'vue';
import {
  logout,
  deleteExpiredTextRecords,
  deleteExpiredFileRecords,
  deleteExpiredChunks,
} from 'src/api/v1';
import { router } from 'src/router';
import { Notify } from 'quasar';
import { Response } from 'src/types';

const actions = [
  {
    icon: 'delete_sweep',
    label: 'buttons.deleteExpiredChunks',
    handler: deleteExpiredChunks,
  },
  {
    icon: 'delete',
    label: 'buttons.deleteExpiredFileRecords',
    handler: deleteExpiredFileRecords,
  },
  {
    icon: 'delete_outline',
    label: 'buttons.deleteExpiredTextRecords',
    handler: deleteExpiredTextRecords,
  },
  {
    icon: 'logout',
    label: 'buttons.logout',
    handler: logout,
    callback: () => {
      router.push({ name: 'AdminLogin' });
    },
  },
];

const isSubmittingList = ref(new Array(actions.length).fill(false));

const onSubmit = async (
  index: number,
  handler: () => Promise<Response<null>>,
  callback?: () => void
) => {
  isSubmittingList.value[index] = true;
  try {
    const data = await handler();
    Notify.create({
      message: data.message,
      position: 'top',
      type: 'positive',
    });
    if (callback) {
      callback();
    }
  } finally {
    isSubmittingList.value[index] = false;
  }
};
</script>

<template>
  <q-page-sticky position="bottom-left" :offset="[18, 18]">
    <q-fab color="primary" direction="up">
      <template v-slot:icon="{ opened }">
        <q-icon
          :class="{ 'example-fab-animate--hover': opened !== true }"
          name="keyboard_arrow_up"
        />
      </template>
      <template v-slot:active-icon="{ opened }">
        <q-icon
          :class="{ 'example-fab-animate': opened === true }"
          name="close"
        />
      </template>
      <q-fab-action
        v-for="(item, index) in actions"
        :key="index"
        @click="onSubmit(index, item.handler, item.callback)"
        :loading="isSubmittingList[index]"
        color="primary"
        external-label
      >
        <template v-slot:icon>
          <q-icon :name="item.icon" />
        </template>
        <template v-slot:label>
          {{ $t(item.label) }}
        </template>
      </q-fab-action>
    </q-fab>
  </q-page-sticky>
</template>

<style lang="scss" scoped>
.example-fab-animate,
.example-fab-animate,
.q-fab:hover .example-fab-animate--hover {
  animation: example-fab-animate 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
}

@keyframes example-fab-animate {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>
