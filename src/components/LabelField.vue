<template>
  <div class="d-flex align-center">
    <label v-if="field.label" :for="field.id">{{ field.label }}</label>
    <tooltip
      v-if="props.tooltipInfo"
      :status="props.tooltipInfo.status"
      :tip-location="props.tooltipInfo.tipLocation"
      :type="props.tooltipInfo.type"
    />
    <v-icon
      v-if="required"
      class="pl-2 pb-2"
      color="red"
      icon="mdi-asterisk"
      size="x-small"
    />
  </div>
  <v-text-field
    v-if="props.type == 'text'"
    :id="field.id"
    v-model="internalValue"
    readonly
    variant="solo-filled"
  >
    <template #append-inner>
      <v-tooltip v-if="locked" location="bottom" :text="readOnlyText">
        <template #activator="{ props: lockedActivator }">
          <v-icon v-bind="lockedActivator" icon="mdi-lock" />
        </template>
      </v-tooltip>
      <v-tooltip v-if="signatureRequiredNow" location="bottom" text="Signature Required for this Status">
        <template #activator="{ props: signActivator }">
          <v-icon v-bind="signActivator" color="green-darken-1" icon="mdi-draw-pen" />
        </template>
      </v-tooltip>
      <span v-if="locked" class="sr-only">{{ readOnlyText }}</span>
    </template>
  </v-text-field>
  <v-textarea
    v-if="props.type === 'textarea'"
    :id="field.id"
    v-model="internalValue"
    no-resize
    readonly
    rows="2"
    variant="solo-filled"
  >
    <template #append-inner>
      <v-tooltip v-if="locked" location="bottom" :text="readOnlyText">
        <template #activator="{ props:readOnlyActivator }">
          <v-icon v-bind="readOnlyActivator" icon="mdi-lock" />
        </template>
      </v-tooltip>
      <span v-if="locked" class="sr-only">{{ readOnlyText }}</span>
    </template>
  </v-textarea>
</template>
<script setup>
/**
 * This component is used to display a label, required asterisk and accompanying textfield or textarea
 * The name prop points to the specific field in the store file which will pull the full properties for the field including id, label, required, value, locked, populate
 * Optionally there is an overRideValue prop that will populate the value that is passed into it
 * Optionally there is tooltipInfo prop - if provided this will display the tooltip component and need the standard props supplied to it coming from the parent
 */
  import { computed } from 'vue'
  import { useAppStore } from '@/stores/app'

  const store = useAppStore()
  const props = defineProps({
    name: String,
    type: String,
    overRideValue: { type: [String, Number], default: null },
    tooltipInfo: Object,
  })

  const readOnlyText = 'This field is read-only at this point in the workflow'

  const field = store.lookupField(props.name)

  const internalValue = computed(() => {
    if (props.overRideValue) {
      return props.overRideValue
    } else {
      if (populate.value) {
        return field.value
      } else if (required.value) {
        return field.value
      } else {
        return ''
      }
    }
  })

  const required = computed(() => {
    if (field.hasOwnProperty('required')) {
      return store.lookupStatusId(field.required) <= store.currentStep + 1
    }
    return false
  })

  const requiredNow = computed(() => {
    if (field.hasOwnProperty('required') && store.lookupStatusId(field.required) == store.currentStep + 1) {
      return true
    }
    return false
  })

  const populate = computed(() => {
    if (field.hasOwnProperty('populate')) {
      return store.lookupStatusId(field.populate) <= store.currentStep + 1
    }
    return false
  })

  const locked = computed(() => {
    if (field.hasOwnProperty('locked')) {
      return store.lookupStatusId(field.locked) < store.currentStep + 1
    }
    return false
  })

  const signatureRequiredNow = computed(() => {
    return props.name.includes('signature') && requiredNow.value
  })

</script>
<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
