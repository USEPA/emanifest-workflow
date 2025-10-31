<template>
    <div v-if="statusDisplay">
        <v-tooltip interactive>
            <template v-slot:activator="{ props: activatorProps }">
                <v-icon :icon="icon" v-bind="activatorProps" :color="iconColor"></v-icon>
            </template>
            <div>
                {{ text }}
            </div>
        </v-tooltip>
    </div>
</template>

<script setup>
import { useAppStore } from '@/stores/app'
const store = useAppStore();

const props = defineProps({
    tipLocation: String,
    type: String,
    status: String
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