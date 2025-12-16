<template>
  <v-app>
    <nav-bar></nav-bar>
    <v-main>
      <router-view/>
    </v-main>
   <v-footer><v-btn  variant="text" href="mailto:markley.kyle@epa.gov"> Feedback</v-btn></v-footer>
  </v-app>
</template>

<script setup>
import NavBar from './components/NavBar.vue'
</script>
