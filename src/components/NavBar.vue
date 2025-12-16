<template>
    <v-app-bar color="primary-darken-1" v-if="showTopNav">
        <v-app-bar-title>
            <div class="w-33" style="cursor: pointer" @click="$router.push('/')">e-Manifest Workflow</div>
        </v-app-bar-title>
        <div class="d-flex justify-space-evenly ga-2">
            <v-btn to="/manifest" title="Form Workflow"><v-icon icon="mdi-list-box-outline" aria-label="Form Workflow"
                    size="large"></v-icon></v-btn>
            <v-btn to="/wizard" title="Workflow Wizard"><v-icon icon="mdi-assistant" aria-label="Workflow Wizard"
                    size="large"></v-icon></v-btn>
            <v-icon-btn :icon="themeMode" @click="theme.toggle()" variant="text" aria-label="Change Theme"
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

const route = useRoute();

const theme = useTheme()
const store = useAppStore();

const { scrollY } = useScrollPosition();

const showTopNav = computed(() => {
    if (route.path === '/') {
        return true
    }
    return scrollY.value < 10;
});

const themeMode = computed(() => {
    if (theme.global.current.value.dark) {
        return 'mdi-white-balance-sunny'
    } else {
        return 'mdi-weather-night'
    }
})

const listLinks = store.linksMenu

</script>