<template>
    <v-app-bar color="#3e6d9b" v-if="showTopNav">
        <v-app-bar-title>e-Manifest Workflow</v-app-bar-title>
        <div class="d-flex justify-space-evenly ga-2">
            <v-btn to="/"  title="Form Workflow"><v-icon icon="mdi-list-box-outline" aria-label="Form Workflow" size="large"
                   ></v-icon></v-btn>
            <v-btn to="/wizard" title="Workflow Wizard"><v-icon icon="mdi-assistant" aria-label="Workflow Wizard" size="large"
                   ></v-icon></v-btn>
            <v-icon-btn icon="mdi-help-circle" color="#3e6d9b" @click="dialog = true" aria-label="Help"
                title="Help"></v-icon-btn>
            <v-icon-btn :icon="themeMode" @click="theme.toggle()" color="#3e6d9b" aria-label="Change Theme"
                title="Change Theme"></v-icon-btn>
            <v-menu>
                <template v-slot:activator="{ props }">
                    <v-icon-btn icon="mdi-dots-vertical" color="#3e6d9b" v-bind="props" title="Resources"></v-icon-btn>
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
    <v-dialog v-model="dialog" width="auto">
        <v-card max-width="600">
            <v-card-title><v-icon icon="mdi-help-circle"></v-icon> Help</v-card-title>
            <v-card-text>
                <p>This interactive tool provides information about the electronic manifest workflow.</p>
            </v-card-text>
            <v-card-actions>
                <v-btn class="ms-auto" text="Ok" @click="dialog = false" aria-label="Ok"></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useTheme } from 'vuetify'
import { useScrollPosition } from '@/composables/useScrollPosition';
import { useAppStore } from '@/stores/app'
import { RouterLink } from 'vue-router';

const theme = useTheme()
const store = useAppStore();

const { scrollY } = useScrollPosition();

const showTopNav = computed(() => {
    return scrollY.value < 10;
});

const dialog = ref(false)

const themeMode = computed(() => {
    if (theme.global.current.value.dark) {
        return 'mdi-white-balance-sunny'
    } else {
        return 'mdi-weather-night'
    }
})

const listLinks = store.linksMenu

</script>