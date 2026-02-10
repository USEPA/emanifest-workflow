<template>
  <v-app-bar
    :border="overlay ? false : 'b'"
    class="appbar"
    :class="overlay ? 'appbar--overlay' : 'appbar--solid'"
    :color="overlay ? 'transparent' : 'primary-darken-1'"
    :elevation="overlay ? 0 : 4"
  >
    <div class="header-shell d-flex align-center justify-space-between w-100">
      <!-- Left (logo/title) -->
      <v-app-bar-title
        class="d-inline-flex align-center flex-nowrap"
        style="cursor: pointer"
        @click="$router.push('/')"
      >
        e-Manifest Workflow
      </v-app-bar-title>

      <!-- Right (menu, non-mobile) -->
      <div v-if="nonMobile" class="d-flex align-center ga-2">
        <template v-for="item in navPages" :key="item.title">
          <!-- Simple items -->
          <v-btn
            v-if="!checkSubItems(item)"
            class="text-none text-subtitle-1"
            :class="{ 'nav-active': route.path === `/${item.route}` }"
            :to="`/${item.route}`"
            variant="text"
          >
            {{ item.shortName }}
          </v-btn>

          <!-- Dropdown items -->
          <v-menu
            v-else
            :close-delay="100"
            :close-on-content-click="true"
            eager
            location="bottom"
            offset="8"
            :open-delay="75"
            open-on-hover
          >
            <template #activator="{ props }">
              <v-btn v-bind="props" class="text-none text-subtitle-1" variant="text">
                <span
                  :class="{
                    'nav-active': item.subItems?.some(sub => route.path === `/${sub.route}`)
                  }"
                > {{ item.shortName }} </span>
                <v-icon class="ml-1" icon="mdi-chevron-down" />
              </v-btn>
            </template>

            <v-list class="pt-2">
              <template v-for="(subItem, i) in item.subItems" :key="i"><v-list-item
                v-if="subItem.enabled"
                link
                :to="`/${subItem.route}`"
              >
                <v-list-item-title>{{ subItem.shortName }}</v-list-item-title>
              </v-list-item> </template>

            </v-list>
          </v-menu>
        </template>

        <v-divider class="mx-1" vertical />

        <v-icon-btn
          aria-label="Change Theme"
          class="pb-1"
          :icon="themeStore.themeIcon"
          title="Change Theme"
          variant="text"
          @click="themeStore.toggleTheme"
        />

        <!-- Resources menu -->
        <v-menu location="bottom" offset="8">
          <template #activator="{ props }">
            <v-icon-btn
              v-bind="props"
              class="pb-1"
              icon="mdi-dots-vertical"
              title="Resources"
              variant="text"
            />
          </template>
          <v-list>
            <v-list-item
              v-for="(item, i) in listLinks"
              :key="i"
              :href="item.url"
              link
              target="_blank"
            >
              <v-list-item-title>
                {{ item.text }}
                <v-icon class="ml-1" icon="mdi-open-in-new" size="18" />
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

      <!-- Mobile -->
      <v-app-bar-nav-icon v-if="!nonMobile" @click.stop="drawer = !drawer" />
    </div>
  </v-app-bar>

  <!-- Navigation Drawer (mobile) -->
  <v-navigation-drawer v-model="drawer" temporary>
    <v-list density="comfortable" nav>
      <template v-for="item in navPages" :key="item.title">
        <v-list-group v-if="hasSubItems(item)" :value="isGroupActive(item)">
          <template #activator="{ props }">
            <v-list-item v-bind="props" :title="item.shortName" />
          </template>
          <v-list-item
            v-for="(sub, i) in item.subItems"
            :key="i"
            :active="route.path === `/${sub.route}`"
            link
            :to="`/${sub.route}`"
          >
            <v-list-item-title>{{ sub.shortName }}</v-list-item-title>
          </v-list-item>
        </v-list-group>

        <v-list-item v-else :active="route.path === `/${item.route}`" link :to="`/${item.route}`">
          <v-list-item-title>{{ item.shortName }}</v-list-item-title>
        </v-list-item>
      </template>

      <v-divider class="my-2" />

      <v-list-item>
        <v-btn class="pa-0 text-none" flat @click="themeStore.toggleTheme">
          Change Theme
          <v-icon-btn
            aria-label="Change Theme"
            class="pb-2"
            :icon="themeStore.themeIcon"
            title="Change Theme"
            variant="text"
          />
        </v-btn>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
  import { computed, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { useDisplay } from 'vuetify'
  import { useScrollPosition } from '@/composables/useScrollPosition'
  import { useAppStore } from '@/stores/app'
  import { useThemeStore } from '@/stores/themeStore'

  const route = useRoute()
  const { smAndUp } = useDisplay()
  const nonMobile = smAndUp

  const themeStore = useThemeStore()
  const store = useAppStore()
  const listLinks = store.linksMenu

  const drawer = ref(false)
  const { scrollY } = useScrollPosition()

  // Overlay mode on home route until you scroll a bit (tweak threshold as needed)
  const overlay = computed(() => route.path === '/' && scrollY.value < 80)

  const navPages = [
    { title: 'Manifest Basics', shortName: 'Basics', route: 'basics' },
    {
      title: 'Wizard', shortName: 'Wizards', route: '',
      subItems: [
        { title: 'Manifest Wizard', shortName: 'Manifest Wizard', route: 'wizard', enabled: true },
        { title: 'Generator Wizard', shortName: 'Generator Wizard', route: 'generator-wizard', enabled: import.meta.env.DEV },
      ],
    },
    { title: 'Form Workflow', shortName: 'Workflow', route: 'manifest' },
  ]

  const checkSubItems = item => 'subItems' in item
  const hasSubItems = item => Array.isArray(item.subItems) && item.subItems.length > 0
  function isGroupActive (group) {
    return hasSubItems(group) && group.subItems.some(sub => route.path === `/${sub.route}`)
  }
</script>

<style scoped>
/* Match your page shell width (aligns navbar with content below) */
.header-shell {
    padding-inline: 16px;
    /* base */
}

@media (min-width: 960px) {
    .header-shell {
        padding-inline: 48px;
        /* md and up, similar to px-md-12 */
    }
}

/* Overlay: inherit on-primary color for all nav text/icons */
.appbar--overlay {
    color: rgb(var(--v-theme-on-primary));
    backdrop-filter: saturate(1.1) blur(6px);
    background-color: transparent !important;
}

.appbar--overlay :deep(.v-btn),
.appbar--overlay :deep(.v-icon),
.appbar--overlay :deep(.v-app-bar-title),
.appbar--overlay :deep(.v-list-item-title) {
    color: inherit;
}

/* Hover feedback on navbar buttons */
:deep(.v-btn.text-none) {
    transition: background-color 150ms ease;
}

:deep(.v-btn.text-none:hover) {
    background-color: rgba(255, 255, 255, 0.10);
    /* works in both overlay and solid */
}

/* Active state for nav buttons */
.nav-active {
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 4px;
}

/* Dropdown list styling in overlay mode for contrast */
.appbar--overlay :deep(.v-overlay__content .v-list) {
    background-color: rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(6px);
}
</style>
