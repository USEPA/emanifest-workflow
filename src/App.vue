<template>
  <v-app>
    <nav-bar />
    <v-main class="pa-0">
      <router-view />
    </v-main>
    <v-footer :color="themeStore.themeColor"><v-btn :href="encodedFeedbackString" variant="text">
      Feedback</v-btn></v-footer>
  </v-app>
</template>

<script setup>
  import { watch } from 'vue'
  import { useTheme } from 'vuetify'
  import NavBar from './components/NavBar.vue'
  import { useThemeStore } from './stores/themeStore'

  const theme = useTheme()
  const themeStore = useThemeStore()

  watch(
    () => themeStore.themeName,
    newTheme => {
      theme.global.name.value = newTheme
    },
  )

  const emailAddress = 'markley.kyle@epa.gov'
  const subjectLine = 'e-Manifest Workflow Feedback'
  const encodedFeedbackString = encodeURI(`mailto:${emailAddress}?subject=${subjectLine}`)

</script>
