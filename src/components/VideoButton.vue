<template>
  <v-btn :color="props.color" :disabled="props.disabled" :size="props.size" @click="open(props.url)">
    <v-icon class="mr-1" :icon="props.icon" />
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
