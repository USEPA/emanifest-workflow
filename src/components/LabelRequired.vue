<template>
  <label v-if="props.label" :for="props.forId">{{ props.label }}</label>
  <v-icon
    v-if="required"
    class="pl-2"
    color="red"
    icon="mdi-asterisk"
    size="x-small"
  />
</template>
<script setup>
/**
 * This component is used to display a label and required asterisk
 * the props to provide are label and status
 */
  import { computed } from 'vue'
  import { useAppStore } from '@/stores/app'

  const store = useAppStore()
  const props = defineProps({
    label: String,
    status: String,
  })

  const required = computed(() => {
    if (store.lookupStatusId(props.status) <= store.currentStep + 1) {
      return true
    }
    return false
  })
</script>
