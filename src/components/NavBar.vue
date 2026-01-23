<template>
    <v-app-bar border="b" color="primary-darken-1">
        <v-app-bar-nav-icon v-if="!nonMobile" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-app-bar-title>
            <div class="w-33" style="cursor: pointer" @click="$router.push('/')">
                <div class="d-flex align-center">
                    <v-img v-if="nonMobile" src="/EM logo.png" lazy-src="/EM logo.png" alt="My Image"   aspect-ratio="1" max-width="60" min-width="50" cover></v-img>
                    <span class="ml-2 ">e-Manifest Workflow </span>
                </div>
            </div>
        </v-app-bar-title>
        <div class="d-flex justify-space-evenly ga-2 mr-4" v-if="nonMobile">
            <v-btn v-for="item in navPages" :to="`/${item.route}`" :title="item.title" class="text-none text-subtitle-1"
                size="small">{{ item.shortName }}</v-btn>
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
    <v-navigation-drawer v-model="drawer" temporary>
        <v-list>
            <v-list-item v-for="item in navPages" :key="item.title" :to="item.route" link>
                <v-list-item-title>{{ item.shortName }}</v-list-item-title>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item><v-btn flat class="pa-0 text-none" @click="themeStore.toggleTheme">Change Theme <v-icon-btn
                        :icon="themeStore.themeIcon" variant="text" aria-label="Change Theme" title="Change Theme"
                        class="pb-2"></v-icon-btn></v-btn> </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>
<script setup>
import { computed, ref } from 'vue'
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

const drawer = ref(false)

const navPages = [
    { title: 'Manifest Basics', shortName: 'Basics', route: 'basics' },
    { title: 'Manifest Wizard', shortName: 'Wizard', route: 'wizard' },
    { title: 'Form Workflow', shortName: 'Workflow', route: 'manifest' },

]

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