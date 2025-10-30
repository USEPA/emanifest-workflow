<template>
    <label v-if="field.label" :for="field.id">{{ field.label }}</label>
    <v-icon icon="mdi-asterisk" size="x-small" color="red" v-if="required" class="pl-2 pb-2"></v-icon>
    <v-text-field v-if="props.type == 'text'" :id="field.id" v-model="fieldValue" readonly variant="solo-filled">
        <template #append-inner>
            <v-tooltip v-if="locked" :text="readOnlyText" location="bottom">
                <template v-slot:activator="{ props }">
                    <v-icon v-bind="props" icon="mdi-lock"></v-icon>
                </template>
            </v-tooltip>
            <span v-if="locked" class="sr-only">{{ readOnlyText }}</span>
        </template>
    </v-text-field>
    <v-textarea v-if="props.type === 'textarea'" :id="field.id" v-model="fieldValue" rows="2" readonly no-resize variant="solo-filled">
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
import { computed, ref, watch } from 'vue'
import { useAppStore } from '@/stores/app'

const store = useAppStore();
const props = defineProps({
    name: String,
    type: String
})

const readOnlyText = 'This field is read-only at this point in the workflow'

const field = store.lookupField(props.name)

const fieldValue = ref('')

const required = computed(() => {
    if (field.hasOwnProperty('required')) {
        return store.lookupStatusId(field.required) <= store.currentStep + 1
    }
    return false
})

const locked = computed(() => {
    if (field.hasOwnProperty('locked')) {
        return store.lookupStatusId(field.locked) < store.currentStep + 1
    }
    return false
})

watch(required, () => {
    if (required.value) {
        fieldValue.value = field.value
    } else {
        fieldValue.value = ''
    }
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