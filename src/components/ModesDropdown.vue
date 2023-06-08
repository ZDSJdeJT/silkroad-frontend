<script setup lang="ts">
import { useQuasar } from 'quasar';
import { Modes } from 'src/enums';

const $q = useQuasar();

const modes = [
  {
    value: false,
    label: 'modes.light',
    onselect: () => {
      $q.dark.set(false);
      localStorage.mode = Modes.light;
    },
  },
  {
    value: true,
    label: 'modes.dark',
    onselect: () => {
      $q.dark.set(true);
      localStorage.mode = Modes.dark;
    },
  },
  {
    value: 'auto',
    label: 'modes.auto',
    onselect: () => {
      $q.dark.set('auto');
      localStorage.removeItem('mode');
    },
  },
];
</script>

<template>
  <q-btn-dropdown flat round dense icon="visibility">
    <q-list>
      <q-item
        v-for="(item, index) in modes"
        :key="index"
        clickable
        v-close-popup
        @click="item.onselect()"
      >
        <q-item-section>
          <q-item-label>{{ $t(item.label) }}</q-item-label>
        </q-item-section>
        <q-item-section avatar v-if="item.value === $q.dark.mode">
          <q-icon name="done" />
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>
