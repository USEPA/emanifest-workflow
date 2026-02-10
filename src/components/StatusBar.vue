<template>
  <v-stepper
    v-if="!hideHeader"
    v-model="store.currentStep"
    alt-labels
    class="mx-12 my-3"
    rounded="xl"
  >
    <v-stepper-header>
      <template v-for="(step, index) in store.steps" :key="index">
        <v-stepper-item
          :color="getStatusColor(index)"
          :complete="store.currentStep >= index + 1"
          :step="index + 1"
          :title="step.status"
        />
        <v-divider v-if="index < store.steps.length - 1" :color="getStatusBarColor(index)" thickness="4" />
      </template>
    </v-stepper-header>
    <v-stepper-window>
      <v-stepper-window-item v-for="(step, index) in store.steps" :key="index">
        <v-row fill-height>
          <v-card flat :title="step.status">
            <v-card-text>
              <p>{{ step.description }}</p>
            </v-card-text>
          </v-card>
        </v-row>
      </v-stepper-window-item>
    </v-stepper-window>
    <v-stepper-actions @click:next="nextStep()" @click:prev="prevStep()" />
  </v-stepper>
  <v-banner v-if="showBanner || hideHeader" class="banner-position my-3" min-height="120">
    <v-container>
      <v-row>
        <v-col class="text-left" cols="2">
          <v-btn :disabled="firstStep" @click="prevStep"><v-icon icon="mdi-arrow-left-thick" /></v-btn>
        </v-col>
        <v-col class="text-center" cols="8">
          <v-chip color="primary" variant="flat">
            {{ currentStatus.status }}
          </v-chip>
        </v-col>
        <v-col class="text-right" cols="2"> <v-btn :disabled="lastStep" @click="nextStep"><v-icon
          icon="mdi-arrow-right-thick"
        /></v-btn></v-col>
      </v-row>
      <v-row>
        <v-col class="text-center">
          <p>{{ currentStatus.description }}</p>
        </v-col>
      </v-row>
    </v-container>

  </v-banner>
</template>
<script setup>
  import { useDisplay } from 'vuetify'
  import { useScrollPosition } from '@/composables/useScrollPosition'
  import { useAppStore } from '@/stores/app'
  const { smAndDown } = useDisplay()
  const hideHeader = smAndDown
  const store = useAppStore()

  function nextStep () {
    if (store.currentStep <= store.steps.length) {
      store.currentStep++
    }
  }

  function prevStep () {
    if (store.currentStep > 0) {
      store.currentStep--
    }
  }

  function getStatusColor (index) {
    if (index == store.currentStep) {
      return 'blue'
    } else
      return index < store.currentStep ? 'success' : 'grey'
  }

  function getStatusBarColor (index) {
    return index < store.currentStep ? 'success' : 'grey'
  }

  const currentStatus = computed(() => {
    return store.currentStatus
  })

  const firstStep = computed(() => {
    return store.currentStep === 0
  })

  const lastStep = computed(() => {
    return store.currentStep === store.steps.length - 1
  })

  const { scrollY } = useScrollPosition()

  const showBanner = computed(() => {
    return scrollY.value > 300 // Show the banner after scrolling
  })

</script>
<style scoped>
.banner-position {
    position: sticky;
    top: 64px;
    /**use 64px if top menu bar doesn't hide on scroll. otherwise use 0 */
    z-index: 100;
    padding: 0px;
}
</style>
