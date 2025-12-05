<template>
    <v-stepper v-model="store.currentStep" alt-labels rounded="xl" class="mx-12 my-3" v-if="!hideHeader">
        <v-stepper-header>
            <template v-for="(step, index) in store.steps" :key="index">
                <v-stepper-item :step="index + 1" :complete="store.currentStep >= index + 1" :title="step.status"
                    :color="getStatusColor(index)">
                </v-stepper-item>
                <v-divider thickness="4" :color="getStatusBarColor(index)" v-if="index < store.steps.length - 1" />
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
        <v-stepper-actions @click:next="nextStep()" @click:prev="prevStep()"></v-stepper-actions>
    </v-stepper>
    <v-container fluid class="banner-position" v-if="showBanner || hideHeader">
        <v-banner min-height="120">
            <v-row justify="space-between">
                <v-col cols="auto" class="d-flex align-center">
                    <v-btn size="small" @click="prevStep" :disabled="firstStep">Previous</v-btn>
                </v-col>
                <v-col class="text-center">
                    <v-chip color="primary" variant="flat" class="mb-2">
                        {{ currentStatus.status }}
                    </v-chip>
                    <p>{{ currentStatus.description }}</p>
                </v-col>
                <v-col cols="auto" class="d-flex align-center"> <v-btn size="small" @click="nextStep"
                        :disabled="lastStep">Next</v-btn></v-col>
            </v-row>
        </v-banner>
    </v-container>
</template>
<style scoped>
.banner-position {
    position: sticky;
    top: 0;
    /**use 64px if top menu bar doesn't hide on scroll. otherwise use 0 */
    z-index: 100;
    padding: 0px;
}
</style>
<script setup>
import { useScrollPosition } from '@/composables/useScrollPosition';
import { useAppStore } from '@/stores/app'
import { useDisplay } from 'vuetify'
const { smAndDown } = useDisplay()
const hideHeader = smAndDown
const store = useAppStore();

function nextStep() {
    if (store.currentStep <= store.steps.length) {
        store.currentStep++;
    }
}

function prevStep() {
    if (store.currentStep > 0) {
        store.currentStep--;
    }
}

function getStatusColor(index) {
    if (index == store.currentStep) {
        return 'blue'
    } else
        return index < store.currentStep ? 'success' : 'grey'
}

function getStatusBarColor(index) {
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

const { scrollY } = useScrollPosition();

const showBanner = computed(() => {
    return scrollY.value > 300; // Show the banner after scrolling
});

</script>