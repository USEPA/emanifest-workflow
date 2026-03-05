<template>
  <v-app>
    <nav-bar />
    <v-main class="pa-0">
      <router-view />
    </v-main>
    <v-footer :color="themeStore.themeColor"><v-btn :href="appStore.feedbackLink" target="_blank" variant="text">
      Feedback</v-btn></v-footer>
  </v-app>
</template>

<script setup>
  import { watch } from 'vue'
  import { useTheme } from 'vuetify'
  import NavBar from './components/NavBar.vue'
  import { useThemeStore } from './stores/themeStore'
  import { useAppStore } from './stores/app'
  
  const theme = useTheme()
  const themeStore = useThemeStore()
  const appStore = useAppStore()

  watch(
    () => themeStore.themeName,
    newTheme => {
      theme.global.name.value = newTheme
    },
  )

</script>
