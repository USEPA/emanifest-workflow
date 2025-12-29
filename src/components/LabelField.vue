<template>
    <div class="d-flex align-center">
        <label v-if="field.label" :for="field.id">{{ field.label }}</label>
        <tooltip v-if="props.tooltipInfo" :tipLocation="props.tooltipInfo.tipLocation" :type="props.tooltipInfo.type"
            :status="props.tooltipInfo.status"></tooltip>
        <v-icon icon="mdi-asterisk" size="x-small" color="red" v-if="required" class="pl-2 pb-2"></v-icon>
    </div>
    <v-text-field v-if="props.type == 'text'" :id="field.id" v-model="internalValue" readonly variant="solo-filled">
        <template #append-inner>
            <v-tooltip v-if="locked" :text="readOnlyText" location="bottom">
                <template v-slot:activator="{ props }">
                    <v-icon v-bind="props" icon="mdi-lock"></v-icon>
                </template>
            </v-tooltip>
            <v-tooltip v-if="signatureRequiredNow" text="Signature Required for this Status" location="bottom">
                <template v-slot:activator="{ props }">
                    <v-icon v-bind="props" icon="mdi-draw-pen" color="green-darken-1"></v-icon>
                </template>
            </v-tooltip>
            <span v-if="locked" class="sr-only">{{ readOnlyText }}</span>
        </template>
    </v-text-field>
    <v-textarea v-if="props.type === 'textarea'" :id="field.id" v-model="internalValue" rows="2" readonly no-resize
        variant="solo-filled">
        <template #append-inner>
            <v-tooltip v-if="locked" :text="readOnlyText" location="bottom">
                <template v-slot:activator="{ props }">
                    <v-icon v-bind="props" icon="mdi-lock"></v-icon>
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

const store = useAppStore();
const props = defineProps({
    name: String,
    type: String,
    overRideValue: { type: [String, Number], default: null },
    tooltipInfo: Object
})

const readOnlyText = 'This field is read-only at this point in the workflow'

const field = store.lookupField(props.name)

const internalValue = computed(() => {
    if (!props.overRideValue) {
        if (populate.value) {
            return field.value
        }
        else if (required.value) {
            return field.value
        } else {
            return ''
        }
    } else {
        return props.overRideValue
    }
});

const required = computed(() => {
    if (field.hasOwnProperty('required')) {
        return store.lookupStatusId(field.required) <= store.currentStep + 1
    }
    return false
})

const requiredNow = computed(() => {
    if (field.hasOwnProperty('required')) {
        if (store.lookupStatusId(field.required) == store.currentStep + 1) {
            return true
        }
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