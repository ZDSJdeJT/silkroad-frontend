<script setup lang="ts">
import { useLanguages } from 'src/composable';
import { Languages } from 'src/enums';

const {
  i18n: { locale },
  setLanguage,
} = useLanguages();

const locales = [
  {
    value: Languages['zh-CN'],
    label: '简体中文',
    onselect: () => {
      setLanguage(Languages['zh-CN']);
    },
  },
  {
    value: Languages['en-US'],
    label: 'English',
    onselect: () => {
      setLanguage(Languages['en-US']);
    },
  },
];
</script>

<template>
  <q-btn-dropdown flat round dense icon="translate">
    <q-list>
      <q-item
        clickable
        v-close-popup
        v-for="item in locales"
        :key="item.value"
        @click="item.onselect()"
      >
        <q-item-section>
          <q-item-label>{{ item.label }}</q-item-label>
        </q-item-section>
        <q-item-section avatar v-if="item.value === locale">
          <q-icon name="done" />
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>
