<template>
  <v-app>
    <nav-bar></nav-bar>
    <v-main class="pa-0">
      <router-view />
    </v-main>
    <v-footer :color="themeStore.themeColor"><v-btn variant="text" :href="encodedFeedbackString">
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

const emailAddress = 'markley.kyle@epa.gov'
const subjectLine = 'e-Manifest Workflow Feedback'
const encodedFeedbackString = encodeURI(`mailto:${emailAddress}?subject=${subjectLine}`)

</script>
