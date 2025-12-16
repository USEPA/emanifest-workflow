<template>
    <div class="d-flex align-center justify-center">
        <div class="text-h5 mr-2">Electronic Workflow Wizard </div>
        <tooltip tipLocation="wizardHeading" type="info"></tooltip>
    </div>
    <v-card :width="baseWidth" title="Basic Information" class="mx-auto px-4 my-4">
        <v-card-subtitle>Answer all questions below to view the workflow steps.</v-card-subtitle>
        <v-card-text>
            <v-select label="Who is creating the manifest electronically?" :items="parties" item-title="text"
                item-value="value" v-model="selectedParty" return-object></v-select>
            <v-select label="How are they creating it?" :items="createMethods" item-title="text" item-value="value"
                v-model="selectedCreateMethod" return-object></v-select>
            <v-select label="How is the generator signing?" :items="genSigMethods" item-title="text" item-value="value"
                v-model="selectedSigMethod" return-object></v-select>
            <v-select label="Is there more than 1 transporter?" :items="['Yes', 'No']" v-model="selectedTransporter"
                return-object></v-select>
        </v-card-text>
    </v-card>
    <div v-if="allFieldsFilled">
        <v-card :width="baseWidth" title="Here's how the process works for this scenario" class="mx-auto px-4 my-4"
            v-if="selectedParty && selectedCreateMethod && selectedSigMethod">
            <v-card-text>
                <h3>Prerequisites</h3>
                The following parties must have a registered user to participate in the worklow:
                {{ preStep }}
                <div v-if="selectedSigMethod.value === 'paper'" class="mt-2">The generator does not need an account for
                    signing,
                    but Large and Small Quantity
                    Generators must
                    maintain an account to access final signed manifests from receiving
                    facilities, submit post-receipt data corrections requested by regulators, and submit exception
                    reports electronically via e-Manifest. </div>
                <v-alert class="mt-2" border="start" border-color="blue accent-4">To create an account, go to <a
                        href="https://rcrainfo.epa.gov/" target="_blank">RCRAInfo</a>, then request permission to the
                    relevant EPA ID(s).</v-alert>
                <div v-if="selectedCreateMethod.value === 'external'" class="mt-3">
                    To integrate with e-Manifest from an external system you need Site
                    Management permission to your EPA ID Number and will need to generate an API ID and Key from the
                    RCRAInfo.</div>
            </v-card-text>
        </v-card>

        <v-card :width="baseWidth" title="Step 1" class=" mx-auto px-4 my-4">
            <v-card-text>{{ step1 }} </v-card-text>
        </v-card>
        <v-card :width="baseWidth" title="Step 2" class=" mx-auto px-4 my-4">
            <v-card-text>Schedule the shipment. This must be done by the Receiving Facility unless it opts to allow
                other parties to schedule manifests (via a setting in e-Manifest).</v-card-text>
        </v-card>
        <v-card :width="baseWidth" title="Step 3" class=" mx-auto px-4 my-4">
            <v-card-text>{{ step3 }}
                <ul class="ml-4">
                    <li>1st Copy: To comply with DOT requirement to carry a shipping paper</li>
                    <li v-if="selectedSigMethod.value == 'paper'">2nd Copy: For generator and initial transporter to
                        sign - generator retains for recordkeeping</li>
                </ul>
                <v-alert class="mt-2" border="start" border-color="blue accent-4">
                    This step can occur later, but must happen before the waste leaves the generator site.
                    Copies can be printed by any party. There are <a href="#" @click.prevent="printDialog = true">two
                        options</a> for printing the manifest. Copies may be marked up to match shipment actuals,
                    but these changes must be updated in e-Manifest before
                    the first party's signature.
                </v-alert>
            </v-card-text>
        </v-card>
        <v-card :width="baseWidth" title="Step 4" class=" mx-auto px-4 my-4">
            <v-card-text>{{ step4 }} <br>
                <v-btn @click="dialog = true" color="surface-variant" text="Signature Options" size="small"
                    class="mt-2"></v-btn>
            </v-card-text>
        </v-card>
        <v-card :width="baseWidth" title="Step 5" class=" mx-auto px-4 my-4">
            <v-card-text>{{ step5 }} <br>
                <v-btn @click="dialog = true" color="surface-variant" text="Signature Options" size="small"
                    class="mt-2"></v-btn>
            </v-card-text>
        </v-card>
        <v-card :width="baseWidth" title="Step 6" class=" mx-auto px-4 my-4">
            <v-card-text>{{ step6 }} <br>
                <v-btn @click="dialog = true" color="surface-variant" text="Signature Options" size="small"
                    class="mt-2"></v-btn>
            </v-card-text>
        </v-card>
        <v-card :width="baseWidth" title="Step 7" class=" mx-auto px-4 my-4">
            <v-card-text>{{ step7 }} <br>
                <v-btn @click="dialog = true" color="surface-variant" text="Signature Options" size="small"
                    class="mt-2"></v-btn>
            </v-card-text>
        </v-card>
        <v-card :width="baseWidth" title="Step 8" class=" mx-auto px-4 my-4">
            <v-card-text>{{ step8 }}
            </v-card-text>
        </v-card>
    </div>
    <v-dialog max-width="700" v-model="dialog">
        <v-card title="Electronic Signature Options">
            <v-card-text>
                <div class="text-subtitle-1 font-weight-bold">Quick Signature using RCRAInfo</div>
                <div>Field personnel responsible for shipment logs into RCRAInfo with their own account and
                    electronically signs.</div>
                <v-divider class="my-2"></v-divider>
                <div class="text-subtitle-1 font-weight-bold">Remote Signature using RCRAInfo </div>
                <div>Field personnel responsible for shipment authorizes remote signer to sign manifest - remote signer
                    logs into RCRAInfo with their own account and completes remote signature (provide name of field
                    personnel and date).</div>
                <v-divider class="my-2"></v-divider>
                <div class="text-subtitle-1 font-weight-bold">Remote Signature using External System</div>
                <div>Field personnel responsible for shipment executes signature event though company's own hazardous
                    waste software - signature info submitted to e-Manifest via API.

                    Requires the company to previously configure their software to integrate with e-Manifest API.
                </div>
                <v-alert class="mt-2" border="start" border-color="blue accent-4">
                    To learn more about the remote signer policy, see <a
                        href="https://rcrapublic.epa.gov/files/14956.pdf" target="_blank">the Remote Signer Policy
                        memo</a>
                </v-alert>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text="Close" @click="dialog = false"></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog max-width="700" v-model="printDialog">
        <v-card title="Printing Options">
            <v-card-text>
                Copies can be printed from e-Manifest or directly from another system using EPA's template.
                If you have your own system and would like to populate the manifest copy directly, download EPA's
                manifest and continuation sheet <a
                    href="https://github.com/USEPA/e-manifest/tree/master/Services-Information/Shipping-Paper-PDF"
                    target="_blank">templates <v-icon icon="mdi-open-in-new" size="18"></v-icon></a>. Then configure
                your system to
                populate these documents.
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text="Close" @click="printDialog = false"></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

</template>

<script setup>
import { ref } from 'vue';

import Tooltip from '../components/Tooltip.vue';

/**
 * DROPDOWNS OPTIONS
 */
const parties = [
    { value: 'generator', text: 'Generator' },
    { value: 'transporter', text: 'Transporter' },
    { value: 'tsdf', text: 'Receiving Facility' },
    { value: 'broker', text: 'Broker' }
]
const createMethods = [
    { value: 'eman', text: 'In e-Manifest' },
    { value: 'external', text: 'In external system and uploading to e-Manifest' }
]

const genSigMethods = [
    { value: 'elc', text: 'Electronically' },
    { value: 'paper', text: 'On paper (Hybrid)' }]

/**
 * REFS FOR DROPDOWNS/MODAL
 */
const selectedParty = ref(null)
const selectedCreateMethod = ref(null)
const selectedSigMethod = ref(null)
const selectedTransporter = ref(null)

const dialog = ref(false)
const printDialog = ref(false)

const baseWidth = 600

const allFieldsFilled = computed(() => {
    return selectedParty.value !== null && selectedCreateMethod.value !== null && selectedSigMethod.value !== null && selectedTransporter.value !== null
})

/**
 * STEP TEXT
 */
const preStep = computed(() => {
    const allParties = ['Transporter(s)', 'Receiving Facility']
    if (selectedSigMethod.value.value === 'elc' || selectedParty.value.value === 'generator') allParties.unshift('Generator')
    if (selectedParty.value.value === 'broker') allParties.push('Broker')

    return allParties.join(', ')
})

const step1 = computed(() => {
    let action

    if (selectedCreateMethod.value.value === 'eman') {
        action = 'access e-Manifest module in RCRAInfo and create the manifest.'
    } else if (selectedCreateMethod.value.value === 'external') {
        action = 'create the manifest in external system, then upload to e-Manifest via API.'
    }

    return `${selectedParty.value.text} ${action}`
})

const step3 = computed(() => {
    const copies = selectedSigMethod.value.value === 'paper' ? '2 copies' : '1 copy'
    return `Print ${copies} of the manifest`
})

const dataEditText = 'Data edits must be submitted to match shipment actuals prior to signing.'

const step4 = computed(() => {
    if (selectedSigMethod.value.value === 'paper') {
        return 'Generator and initial transporter sign paper manifest copy. Generator keeps this copy for their recordkeeping requirements.' 
    } else {
        return 'Generator signs electronically. ' + dataEditText
    }
})

const step5 = computed(() => {
    if (selectedSigMethod.value.value === 'paper') {
        return 'Initial transporter signs manifest electronically. ' + dataEditText
    } else {
        return 'Initial transporter signs manifest electronically. '
    }
})

const step6 = computed(() => {
    if (selectedTransporter.value === 'Yes') {
        return 'Next transporter signs manifest electronically upon custody exchange. This is repeated for each transporter.'
    } else {
        return 'Receiving facility signs manifest electronically upon receipt.'
    }
})

const submitFinalText = 'Within 30 days, receiving facility must submit final manifest and sign electronically in e-Manifest'

const step7 = computed(() => {
    if (selectedTransporter.value === 'Yes') {
        return 'Receiving facility signs manifest electronically upon receipt.'
    } else {
        return submitFinalText
    }
})

const step8 = computed(() => {
    return submitFinalText
})

</script>