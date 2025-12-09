<template>
    <v-sheet :width="500" class=" mx-auto px-4">
        <h1>Getting Started</h1>
        <v-container>
            <v-select label="Who is creating the manifest?" :items="parties" item-title="text" item-value="value"
                v-model="selectedParty" return-object></v-select>
            <v-select label="How are they creating it?" :items="createMethods" item-title="text" item-value="value"
                v-model="selectedCreateMethod" return-object></v-select>
            <v-select label="How is the generator signing?" :items="genSigMethods" item-title="text" item-value="value"
                v-model="selectedSigMethod" return-object></v-select></v-container>
    </v-sheet>

    <v-card :width="500" title="Step 1" class=" mx-auto px-4 my-4"
        v-if="selectedParty && selectedCreateMethod && selectedSigMethod">
        <v-card-text>{{ step1 }} </v-card-text>

    </v-card>
    <v-card :width="500" title="Step 2" class=" mx-auto px-4 my-4"
        v-if="selectedParty && selectedCreateMethod && selectedSigMethod">
        <v-card-text>Schedule the shipment</v-card-text>
    </v-card>
</template>

<script setup>
import { ref } from 'vue';
const parties = [
    { value: 'generator', text: 'Generator' },
    { value: 'transporter', text: 'Transporter' },
    { value: 'tsdf', text: 'Receiving Facility' },
    { value: 'broker', text: 'Broker' }
]
const createMethods = [
    { value: 'eman', text: 'In e-Manifest' },
    { value: 'own', text: 'In own system and uploading data' }
]

const genSigMethods = [
    { value: 'elc', text: 'Electronically' },
    { value: 'paper', text: 'On paper (Hybrid)' }]

const selectedParty = ref(null)
const selectedCreateMethod = ref(null)
const selectedSigMethod = ref(null)

const step1 = computed(() => {
    let action = ''
    console.log(selectedCreateMethod)
    if (selectedCreateMethod.value.value === 'eman') {
        action = 'go to RCRAInfo and create the manifest'
    } else if (selectedCreateMethod.value.value === 'own') {
        action = 'create the manifest in own system, then upload to e-Manifest via API'
    }
    return `${selectedParty.value.text} ${action} `
}

)

</script>