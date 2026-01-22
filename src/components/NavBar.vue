<template>
    <v-app-bar v-if="showTopNav" border="b" color="primary-darken-1">
        <v-app-bar-title>
            <div v-if="nonMobile" class="w-33" style="cursor: pointer" @click="$router.push('/')">
                <v-icon icon="mdi-cog" size="small"></v-icon>
                <v-icon icon="mdi-arrow-right-bold" size="small"></v-icon>
                <span class="ml-2">e-Manifest Workflow</span>
            </div>
            <v-icon-btn v-else icon="mdi-home" variant="text" aria-label="Home" title="Home"
                @click="$router.push('/')"></v-icon-btn>
        </v-app-bar-title>
        <div class="d-flex justify-space-evenly ga-2 mr-4">
            <v-btn to="/basics" title="Manifest Basics" class="text-none text-subtitle-1" size="small">Basics</v-btn>
            <v-btn to="/wizard" title="Workflow Wizard" class="text-none text-subtitle-1" size="small">Wizard</v-btn>
            <v-btn to="/manifest" title="Form Workflow" class="text-none text-subtitle-1" size="small">Workflow</v-btn>
            <v-divider vertical></v-divider>
            <v-icon-btn :icon="themeStore.themeIcon" @click="themeStore.toggleTheme" variant="text"
                aria-label="Change Theme" title="Change Theme" class="pb-2"></v-icon-btn>
            <v-menu>
                <template v-slot:activator="{ props }">
                    <v-icon-btn icon="mdi-dots-vertical" variant="text" v-bind="props" title="Resources"
                        class="pb-2"></v-icon-btn>
                </template>
                <v-list>
                    <v-list-item v-for="(item, i) in listLinks" :key="i" :value="i" :href="item.url" target="_blank">
                        <v-list-item-title>{{ item.text }} <v-icon icon="mdi-open-in-new"
                                size="18"></v-icon></v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>
    </v-app-bar>
</template>
<script setup>
import { computed } from 'vue'
import { useScrollPosition } from '@/composables/useScrollPosition';
import { useAppStore } from '@/stores/app'
import { useThemeStore } from '@/stores/themeStore'
import { useRoute } from 'vue-router';
import { useDisplay } from 'vuetify'

const route = useRoute();
const store = useAppStore();
const themeStore = useThemeStore()
const { smAndUp } = useDisplay()
const nonMobile = smAndUp
const { scrollY } = useScrollPosition();

//hide top nav on scroll on all pages except home
const showTopNav = computed(() => {
    if (route.path === '/') {
        return true
    }
    return scrollY.value < 10;
});

//list of links from store
const listLinks = store.linksMenu

</script>