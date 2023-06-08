<script setup lang="ts">
import { useLanguages } from 'src/composable';
import { Languages, Modes } from 'src/enums';

const { $q, i18n, setLanguage } = useLanguages();

if (localStorage.language in Languages) {
  if (localStorage.language !== i18n.locale.value) {
    setLanguage(localStorage.language);
  }
} else {
  const locale = $q.lang.getLocale();
  if (locale && locale in Languages && locale !== i18n.locale.value) {
    setLanguage(locale as Languages);
  }
}

if (localStorage.mode in Modes) {
  if (localStorage.mode === Modes.light) {
    $q.dark.set(false);
  } else if (localStorage.mode === Modes.dark) {
    $q.dark.set(true);
  }
}
</script>

<template>
  <router-view />
</template>
