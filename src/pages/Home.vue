<template>
    <v-container fluid :class="`${themeStore.homeTopColor} d-flex flex-column justify-center px-12`" min-height="250px">
        <div class="text-h2 font-weight-semibold mx-12 ">e-Manifest Workflow</div>
        <div class="mt-5 mx-12 text-subtitle-1 ">
            Documentation and interactive tools to assist with implementing the electronic workflow
            for the EPA Uniform Hazardous Waste Manifest.
        </div>
    </v-container>
    <v-container fluid class="px-12">
        <v-row class="mt-5" align="stretch">
            <v-col cols="12" :md="12 / enabledCards.length" v-for="(card) in enabledCards">
                <v-card :color="themeStore.themeColor" elevation="8" rounded="lg" class="fill-height">
                    <v-card-title>{{ card.title }}</v-card-title>
                    <v-card-text>
                        {{ card.description }}
                    </v-card-text>
                    <v-card-actions class="pb-4"><v-btn variant="outlined" :to="card.route">Go <v-icon
                                icon="mdi-arrow-right-bold"></v-icon></v-btn></v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
    <v-divider class="my-6"></v-divider>
    <v-container fluid class="d-flex flex-column justify-center">
        <v-card :class="`pl-4`" variant="text">
            <v-card-title>Useful Links</v-card-title>
            <v-card-text>
                <div v-for="(item, i) in listLinks" :key="i" :value="i" class="mb-3">
                    <a class="text-decoration-none" :href="item.url" target="_blank">{{ item.text }} <v-icon
                            icon="mdi-open-in-new" size="18"></v-icon></a>
                </div>
            </v-card-text>
        </v-card>
    </v-container>
</template>
<style scoped>
a:link,
a:visited {
    color: inherit !important
}
</style>
<script setup>
import { computed } from 'vue'
import { useThemeStore } from '@/stores/themeStore'
import { useAppStore } from '@/stores/app'

const themeStore = useThemeStore()

const cards = [
    {
        title: 'The Basics',
        description: 'Foundational information about electronic manifests. Learn about requirements, types and signature options.',
        route: '/basics',
        enabled: true
    },
    {
        title: 'Workflow Wizard',
        description: 'Answer some basic questions to find out what each party needs to do in the workflow.',
        route: '/wizard',
        enabled: true
    },
    {
        title: 'Form Workflow',
        description: 'Shows what information is required and can be edited on the form at various points in the workflow.',
        route: '/manifest',
        enabled: true
    },
]

const enabledCards = computed(() => {
    return cards.filter(item => item.enabled);
})


const store = useAppStore();
const listLinks = store.linksMenu
</script>