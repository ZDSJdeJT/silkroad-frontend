<script setup lang="ts">
import LanguagesDropdown from 'src/components/LanguagesDropdown.vue';
import ModesDropdown from 'src/components/ModesDropdown.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<template>
  <q-layout view="hhh lpR fff">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-avatar>
          <img
            class="cursor-pointer"
            @click="router.push({ name: 'Index' })"
            src="/favicon.ico"
          />
        </q-avatar>
        <q-toolbar-title>
          <a class="cursor-pointer" @click="router.push({ name: 'Index' })">{{
            $t('meta.title')
          }}</a>
        </q-toolbar-title>
        <languages-dropdown />
        <modes-dropdown />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page class="tw-p-5">
        <router-view />
      </q-page>
    </q-page-container>
    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title
          >Built with
          <a
            rel="noopener"
            href="https://github.com/ZDSJdeJT/silkroad-backend"
            target="_blank"
            class="text-white"
            >Silk Road</a
          ></q-toolbar-title
        >
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>
