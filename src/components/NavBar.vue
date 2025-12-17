<template>
    <v-app-bar color="primary-darken-1" v-if="showTopNav">
        <v-app-bar-title>
            <div v-if="nonMobile" class="w-33" style="cursor: pointer" @click="$router.push('/')">e-Manifest Workflow
            </div>
            <v-icon-btn v-else icon="mdi-home" variant="text" aria-label="Home" title="Home"
                @click="$router.push('/')"></v-icon-btn>
        </v-app-bar-title>
        <div class="d-flex justify-space-evenly ga-2">
            <v-btn to="/manifest" title="Form Workflow"><v-icon icon="mdi-list-box-outline" aria-label="Form Workflow"
                    size="large"></v-icon></v-btn>
            <v-btn to="/wizard" title="Workflow Wizard"><v-icon icon="mdi-assistant" aria-label="Workflow Wizard"
                    size="large"></v-icon></v-btn>
            <v-icon-btn :icon="themeMode" @click="toggleTheme" variant="text" aria-label="Change Theme"
                title="Change Theme"></v-icon-btn>
            <v-menu>
                <template v-slot:activator="{ props }">
                    <v-icon-btn icon="mdi-dots-vertical" variant="text" v-bind="props" title="Resources"></v-icon-btn>
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
import { useTheme } from 'vuetify'
import { useScrollPosition } from '@/composables/useScrollPosition';
import { useAppStore } from '@/stores/app'
import { useRoute } from 'vue-router';
import { useDisplay } from 'vuetify'

const route = useRoute();
const theme = useTheme()
const store = useAppStore();
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

//theme toggle
const isDark = computed(() => theme.global.name.value === 'dark')

const toggleTheme = () => {
    const newTheme = isDark.value ? 'light' : 'dark';
    theme.global.name.value = newTheme
    localStorage.setItem('theme', newTheme);
}

const themeMode = computed(() => {
    if (isDark.value) {
        return 'mdi-white-balance-sunny'
    } else {
        return 'mdi-weather-night'
    }
})

//list of links from store
const listLinks = store.linksMenu

</script>