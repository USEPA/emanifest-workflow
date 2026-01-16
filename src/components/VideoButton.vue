<template>
    <v-btn :color="props.color" :size="props.size" :disabled="props.disabled" @click="open(props.url)">
        <v-icon :icon="props.icon" class="mr-1" />
        {{ props.label }}
    </v-btn>
</template>
<script setup>
import { useVideoDialog } from '@/composables/useVideoDialog'

const props = defineProps({
    url: { type: String, required: true },
    label: { type: String, default: 'Demo' },
    icon: { type: String, default: 'mdi-video' },
    color: { type: String, default: 'primary' },
    size: { type: String, default: 'small' },
    disabled: { type: Boolean, default: false },
})

const { open } = useVideoDialog()

</script>