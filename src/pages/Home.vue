<template>
  <!-- Hero -->
  <v-sheet class="hero d-flex flex-column align-center justify-center text-center px-4 px-md-12" height="360">
    <div class="hero-title text-lg-h2 text-md-h2 text-h3 font-weight-bold">
      e-Manifest Workflow
    </div>
    <div class="hero-subtitle mt-4 text-subtitle-1 text-md-h5">
      Documentation and interactive tools to assist with implementing the electronic workflow
      for the EPA Uniform Hazardous Waste Manifest.
    </div>
    <div class="mt-6 d-flex ga-3 flex-wrap justify-center">
      <v-btn color="secondary" size="large" :to="'/wizard'">
        Start Workflow Wizard
        <v-icon class="ml-2" icon="mdi-arrow-right-bold" />
      </v-btn>
      <v-btn color="primary" size="large" :to="'/basics'" variant="outlined">
        Learn the Basics
      </v-btn>
    </div>
  </v-sheet>
  <v-container fluid>
    <!-- animate the card grid on load -->
    <v-slide-y-transition group>
      <v-row align="stretch" class="mt-6">
        <v-col v-for="card in enabledCards" :key="card.route" cols="12" :md="12 / enabledCards.length">
          <v-card class="hover-raise fill-height" elevation="2" rounded="xl" variant="tonal">
            <v-card-title class="d-flex align-center">
              <v-icon v-if="card.icon" class="mr-2" :icon="card.icon" />
              {{ card.title }}
            </v-card-title>
            <v-card-text>{{ card.description }}</v-card-text>
            <v-card-actions class="pb-4">
              <v-btn color="primary" :to="card.route" variant="tonal">
                Go
                <v-icon class="ml-2" icon="mdi-arrow-right-bold" />
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-slide-y-transition>
  </v-container>
  <v-divider class="my-6" />
  <v-container class="d-flex flex-column justify-center" fluid>
    <v-card variant="text">
      <v-card-title>Useful Links</v-card-title>
      <v-card-text>
        <div v-for="(item, i) in listLinks" :key="i" class="mb-3" :value="i">
          <a class="text-decoration-none" :href="item.url" target="_blank">{{ item.text }} <v-icon
            icon="mdi-open-in-new"
            size="18"
          /></a>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script setup>
  import { computed } from 'vue'
  import { useAppStore } from '@/stores/app'

  const cards = [
    {
      title: 'The Basics',
      description: 'Foundational information about electronic manifests. Learn about requirements, types and signature options.',
      route: '/basics',
      enabled: true,
    },
    {
      title: 'Workflow Wizard',
      description: 'Answer some basic questions to find out what each party needs to do in the workflow.',
      route: '/wizard',
      enabled: true,
    },
    {
      title: 'Generator Wizard',
      description: 'Determine generator manifesting requirements based on waste activity.',
      route: '/generator-wizard',
      enabled: import.meta.env.DEV,
    },
    {
      title: 'Form Workflow',
      description: 'Shows what information is required and can be edited on the form at various points in the workflow.',
      route: '/manifest',
      enabled: true,
    },
  ]

  const enabledCards = computed(() => {
    return cards.filter(item => item.enabled)
  })

  const store = useAppStore()
  const listLinks = store.linksMenu
</script>
<style scoped>
a:link,
a:visited {
    color: inherit !important
}

/* Hero styling that uses Vuetify theme tokens */
.hero {
    color: rgb(var(--v-theme-on-primary));
    background:
        radial-gradient(1000px 400px at 15% 0%, rgba(var(--v-theme-secondary), 0.20) 0%, transparent 60%),
        linear-gradient(120deg,
            rgb(var(--v-theme-primary)) 0%,
            rgb(var(--v-theme-primary-darken-1)) 50%,
            rgb(var(--v-theme-secondary)) 100%);
}

.hero::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    /* subtle overlay to improve contrast in light mode */
    background: rgba(255, 255, 255, 0.08);
}

/* Dark mode overrides */
:deep(.v-theme--dark) .hero {
    color: rgb(var(--v-theme-on-primary));
    background:
        radial-gradient(1000px 400px at 15% 0%, rgba(var(--v-theme-secondary), 0.12) 0%, transparent 60%),
        linear-gradient(120deg,
            rgb(var(--v-theme-primary-darken-2)) 0%,
            rgb(var(--v-theme-primary)) 50%,
            rgb(var(--v-theme-secondary-darken-1)) 100%);
}

:deep(.v-theme--dark) .hero::after {
    background: rgba(0, 0, 0, 0.28);
    /* darker overlay in dark mode for contrast */
}

/* Optional subtle text shadow on hero title */
.hero-title {
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.18);
}

/* Card hover effect */
.hover-raise {
    transition: transform 160ms ease, box-shadow 160ms ease;
}

.hover-raise:hover {
    transform: translateY(-3px);
    box-shadow: var(--v-elevation-8);
}
</style>
