<template>
  <v-app>
    <nav-bar></nav-bar>
    <v-main>
      <router-view />
    </v-main>
    <v-footer :color="themeStore.themeColor"><v-btn variant="text" href="mailto:markley.kyle@epa.gov">
        Feedback</v-btn></v-footer>
  </v-app>
</template>

<script setup>
import { watch } from 'vue';
import { useTheme } from 'vuetify';
import { useThemeStore } from './stores/themeStore';
import NavBar from './components/NavBar.vue'

const theme = useTheme()
const themeStore = useThemeStore()

watch(
  () => themeStore.themeName,
  (newTheme) => {
    theme.global.name.value = newTheme;
  }
);

</script>
