<template>
    <div v-if="statusDisplay">
        <v-tooltip interactive location="top" :aria-label="text">
            <template v-slot:activator="{ props: activatorProps }">
                <v-icon :icon="icon" v-bind="activatorProps" :color="iconColor"></v-icon>
            </template>
            <div>
                {{ text }} <span v-if="props.link"> <a :class="`${themeStore.linkColor} font-weight-medium`"
                        :href="link" target="_blank">{{linkText}} <v-icon icon="mdi-open-in-new"
                            size="18"></v-icon></a></span>
            </div>
        </v-tooltip>
    </div>
</template>

<script setup>
import { useAppStore } from '@/stores/app'
import { useThemeStore } from '@/stores/themeStore'

const themeStore = useThemeStore()
const store = useAppStore();

const props = defineProps({
    tipLocation: String,
    type: String,
    status: String,
    link: String,
    linkText: {
        type: String,
        default:'Learn More'
    }
})

const text = store.getTooltip(props.tipLocation)

const iconTypes = {
    warning: { icon: 'mdi-alert', color: 'orange' },
    info: { icon: 'mdi-information', color: 'primary' }
}

const icon = computed(() => {
    return iconTypes[props.type].icon
})

const iconColor = computed(() => {
    return iconTypes[props.type].color
})

const statusDisplay = computed(() => {
    if (props.status) {
        return store.lookupStatusId(props.status) <= store.currentStep
    }
    return true
})

</script>