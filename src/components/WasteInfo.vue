<template>
    <v-data-table v-if="mobile" :headers="headers" :items="wastes" item-key="line" hide-default-footer>
        <template v-for="header in headers" #[`header.${header.key}`]="{ column }">
            <span :key="header.key">{{ column.title }}</span>
            <v-icon icon="mdi-asterisk" size="x-small" color="red" v-if="required(header.key)"
                class="pl-2 pb-2"></v-icon>
        </template>
        <template #item.description="{ item, index }">
            <v-textarea v-model="item.description" rows="2" readonly no-resize="true" variant="solo-filled"
                :aria-label="labelValue('description', index)" :aria-describedby="undefined">
            </v-textarea>
        </template>
        <template #item.containerNumber="{ item, index }">
            <v-text-field v-model="item.containerNumber" readonly variant="solo-filled"
                :aria-label="labelValue('containerNumber', index)" :aria-describedby="undefined">
            </v-text-field>
        </template>
        <template #item.containerType="{ item, index }">
            <v-text-field v-model="item.containerType" readonly variant="solo-filled" 
            :aria-label="labelValue('containerType', index)" :aria-describedby="undefined">
            </v-text-field>
        </template>
        <template #item.quantity="{ item, index }">
            <v-text-field v-model="item.quantity" readonly variant="solo-filled" 
            :aria-label="labelValue('quantity', index)" :aria-describedby="undefined">
            </v-text-field>
        </template>
        <template #item.uom="{ item, index }">
            <v-text-field v-model="item.uom" readonly variant="solo-filled" 
            :aria-label="labelValue('uom', index)" :aria-describedby="undefined">
            </v-text-field>
        </template>
        <template #item.wasteCodes="{ item, index }">
            <v-textarea v-model="item.wasteCodes" rows="2" readonly no-resize="true" variant="solo-filled" 
            :aria-label="labelValue('wasteCodes', index)" :aria-describedby="undefined">
            </v-textarea>
        </template>
    </v-data-table>
    <v-row v-else>
        <v-col cols="12" v-for="(item, index) in wastes" :key="index">
            <v-card>
                <v-card-text>
                    <div v-for="header in headers" :key="header.key">
                        <div v-if="header.key == 'line'">Line {{ item[header.key] }}</div>
                        <div v-else>
                            <label-field :name="`waste.${header.key}`" type="text"
                                :overRideValue="item[header.key]"></label-field>
                        </div>
                    </div>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>
<script setup>
import { watch, computed } from 'vue'
import { useDisplay } from 'vuetify'
const { mdAndUp } = useDisplay()
const mobile = mdAndUp

import { useAppStore } from '@/stores/app'
const store = useAppStore();

const headers = [
    { title: 'Line', key: 'line' },
    { title: '9a HM', key: 'haz' },
    { title: '9b. U.S. DOT Description', key: 'description' },
    { title: 'Container Number', key: 'containerNumber' },
    { title: 'Container Type', key: 'containerType' },
    { title: 'Total Quantity', key: 'quantity' },
    { title: 'Unit Of Measure', key: 'uom' },
    { title: 'Waste Codes', key: 'wasteCodes' }
]

const labelValue = (key, index) => {
    const header = headers.find(item => item.key === key);
    return header ? `${header.title} - ${index + 1}` : null;
}

const addedWastes = [{ line: 1, haz: 'X', description: 'UN1993 Waste', containerNumber: '0', containerType: 'DM', quantity: '0', uom: 'G', wasteCodes: ['D001', 'D002'] },
{ line: 2, haz: 'X', description: 'UN1993 Waste', containerNumber: '0', containerType: 'DM', quantity: '0', uom: 'G', wasteCodes: ['D001', 'D002'] }
]
const wastes = reactive(addedWastes)

const required = (name) => {
    const field = store.lookupField(`waste.${name}`)
    if (field.optional) {
        return false
    }
    return store.lookupStatusId(field.required) <= store.currentStep
}

//popualates the waste container and quantity values at scheduled
const currentStep = computed(() => store.currentStep)
watch(currentStep, () => {
    if (currentStep.value >= store.lookupStatusId('Scheduled')) {
        wastes[0].containerNumber = '4'
        wastes[0].quantity = '200'
        wastes[1].containerNumber = '3'
        wastes[1].quantity = '150'
    } else {
        wastes[0].containerNumber = '0'
        wastes[0].quantity = '0'
        wastes[1].containerNumber = '0'
        wastes[1].quantity = '0'
    }
})


</script>