<template>
    <div class="d-flex align-center justify-center">
        <div class="text-h5 mr-2">Electronic Workflow Wizard </div>
        <tooltip tipLocation="wizardHeading" type="info"></tooltip>
    </div>
    <v-container>
        <v-row justify="center" align="center">
            <v-col cols="12" md="6">
                <v-card title="Basic Information">
                    <v-card-subtitle class="text-wrap">Answer all questions below to view the workflow
                        steps.</v-card-subtitle>
                    <v-card-text>
                        <v-select class="text-wrap" label="Who is creating the manifest electronically?"
                            :items="parties" item-title="text" item-value="value" v-model="selectedParty"
                            return-object></v-select>
                        <v-select label="How are they creating it?" :items="createMethods" item-title="text"
                            item-value="value" v-model="selectedCreateMethod" return-object></v-select>
                        <v-select label="How is the generator signing?" :items="genSigMethods" item-title="text"
                            item-value="value" v-model="selectedSigMethod" return-object></v-select>
                        <v-select label="Is there more than 1 transporter?" :items="['Yes', 'No']"
                            v-model="selectedTransporter" return-object></v-select>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn v-if="showQuickFill" @click="quickFill">Quick Fill</v-btn>
                        <v-btn @click="reset">Reset</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
    <v-container v-if="allFieldsFilled" class="pt-0">
        <v-row justify="center" align="center">
            <v-col cols="12" md="6">
                <v-card v-if="selectedParty && selectedCreateMethod && selectedSigMethod" class="mb-4">
                    <v-card-title>

                        <v-icon icon="mdi-alert-circle mr-4"></v-icon>Prerequisites</v-card-title>
                    <v-card-text class="ml-12">
                        The following parties must have a registered user to participate in the worklow:
                        <ul class="ml-5">
                            <li v-for="item in preStep">{{ item }}</li>
                        </ul>
                        <div v-if="selectedSigMethod.value === 'paper'" class="mt-2">
                            Since you indicated that the generator is signing on paper, the generator does not need an
                            account for signing, but Large and Small Quantity Generators must
                            maintain an account to access final signed manifests from receiving
                            facilities, submit post-receipt data corrections requested by regulators, and submit
                            exception
                            reports electronically via e-Manifest. </div>
                        <v-alert class="mt-2" border="start" border-color="blue accent-4">Create an account in <a
                                href="https://rcrainfo.epa.gov/" target="_blank">RCRAInfo<v-icon icon="mdi-open-in-new"
                                    size="18"></v-icon></a>, then request permission to your party's EPA ID(s).
                        </v-alert>
                        <div v-if="selectedCreateMethod.value === 'external'" class="mt-3">
                            To integrate with e-Manifest from an external system you need Site
                            Management permission to your EPA ID Number and will need to generate an API ID and Key from
                            the
                            RCRAInfo.</div>
                    </v-card-text>
                </v-card>
                <v-card class="my-4" v-for="(step, i) in allSteps">
                    <v-card-title>
                        <v-chip class="font-weight-bold mr-2">
                            {{ i + 1 }}
                        </v-chip>
                        {{ step.value.title }}
                    </v-card-title>
                    <v-card-text class="ml-12">
                        {{ step.value.text }}
                        <div v-if="step.value.print">
                            <ul class="ml-5">
                                <li>1st Copy: To comply with DOT requirement to carry a shipping paper</li>
                                <li v-if="selectedSigMethod.value == 'paper'">2nd Copy: For generator and initial
                                    transporter to
                                    sign - generator retains for recordkeeping</li>
                            </ul>
                            <v-alert class="my-2" border="start" border-color="blue accent-4">
                                This step can occur later, but must happen before the waste leaves the generator
                                site. Copies can be printed by any party. There are <a href="#"
                                    @click.prevent="printDialog = true">two options</a> for printing the manifest.
                                Copies may be marked up to match shipment
                                actuals, but these changes must be updated in e-Manifest before
                                the first party's signature.
                            </v-alert>
                        </div>
                        <div v-if="step.value.signature">
                            <v-btn color="primary" size="small" @click="dialog = true" class="mt-2"><v-icon
                                    icon="mdi-file-sign" class="mr-2"></v-icon>Signature Options</v-btn>
                        </div>
                        <div v-if="step.value.video" class="mt-2">
                            <v-btn color="primary" size="small" @click="openVideoDialog(step.value.url)"><v-icon
                                    icon="mdi-video" class="mr-2"></v-icon>Demo</v-btn>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
    <v-dialog max-width="700" v-model="videoDialog">
        <v-card title="Demonstration Video">
            <v-card-text>
                <iframe width="560" height="315" :src="videoUrl" title="YouTube video player" frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text="Close" @click="videoDialog = false"></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog max-width="700" v-model="dialog">
        <v-card title="Electronic Signature Options">
            <v-card-text>
                <div class="text-subtitle-1 font-weight-bold">Quick Signature using RCRAInfo</div>
                <div>Field personnel responsible for shipment logs into RCRAInfo with their own account and
                    electronically signs.</div>
                <v-btn color="primary" @click="openVideoDialog(generatorQuickSignUrl)"><v-icon
                        icon="mdi-video-box"></v-icon>Demo</v-btn>
                <v-divider class="my-2"></v-divider>
                <div class="text-subtitle-1 font-weight-bold">Remote Signature using RCRAInfo </div>
                <div>Field personnel responsible for shipment authorizes remote signer to sign manifest - remote signer
                    logs into RCRAInfo with their own account and completes remote signature (provide name of field
                    personnel and date).</div>
                <v-btn color="primary" @click="openVideoDialog(generatorRemoteSignUrl)"><v-icon
                        icon="mdi-video-box"></v-icon>Demo</v-btn>
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
<style scoped>
a:link,
a:visited {
    color: inherit !important
}
</style>

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
const videoDialog = ref(false)
const videoUrl = ref('')

const generatorQuickSignUrl = 'https://www.youtube.com/embed/6vckZ9bTBOM?si=lEc3OnF3NboCu2y9'
const generatorRemoteSignUrl = 'https://www.youtube.com/embed/3kaGjxf6e80?si=hbXRjYYtjO1lZBHb'

const showQuickFill = import.meta.env.DEV

function openVideoDialog(url) {
    videoDialog.value = true
    videoUrl.value = url
}

function reset() {
    selectedParty.value = null
    selectedCreateMethod.value = null
    selectedSigMethod.value = null
    selectedTransporter.value = null
}

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

    return allParties
})


const step1 = computed(() => {
    const editText = 'The data may be modified up until the generator signs the manifest. '
    let action

    if (selectedCreateMethod.value.value === 'eman') {
        action = 'accesses the e-Manifest module in RCRAInfo and creates the manifest.'
    } else if (selectedCreateMethod.value.value === 'external') {
        action = 'prepares the manifest shipment data in their external system, then uploads the data to e-Manifest via Application Programing Interface (API).'
    }

    return {
        title: 'Create the Manifest',
        text: `${selectedParty.value.text} ${action} ${editText}`,
        video: true,
        url: 'https://www.youtube.com/embed/Q-HLuOljA54?si=XKnCWzekKbYXINFd'
    }
})

const step2 = computed(() => {
    return {
        title: 'Schedule the Manifest',
        text: 'The Receiving Facility must schedule the manifest by default. Alternatively, the Receiving Facility can opt to allow other parties to schedule manifests via a setting in e-Manifest.',
        video: true,
        url: 'https://www.youtube.com/embed/Cv13HhYeiOA?si=u0adr9QHXpm5Pu0q'
    }
})

const step3 = computed(() => {
    const copies = selectedSigMethod.value.value === 'paper' ? '2 copies' : '1 copy'
    return {
        title: 'Print the Manifest',
        text: `Print ${copies} of the manifest`,
        print: true,
        video: true,
        url: 'https://www.youtube.com/embed/V1341MjT9uY?si=__idvpTya6qSuIic'
    }
})

const dataEditText = 'Data edits must be submitted to match shipment actuals prior to signing.'

const step4 = computed(() => {
    const title = 'Generator Signs'
    if (selectedSigMethod.value.value === 'paper') {
        return {
            title: title,
            text: 'Generator signs paper manifest copy. Generator keeps this copy for their recordkeeping requirements after the initial transporter signs.'
        }
    } else {
        return {
            title: title,
            text: 'Generator signs electronically. ' + dataEditText,
            signature: true
        }
    }
})

const step5 = computed(() => {
    const title = 'Initial Transporter Signs'
    if (selectedSigMethod.value.value === 'paper') {
        return {
            title: title,
            text: 'Initial transporter signs paper manifest copy, then signs manifest electronically. ' + dataEditText,
            signature: true
        }
    } else {
        return { title: title, text: 'Initial transporter signs manifest electronically. ', signature: true }
    }
})

const step6 = computed(() => {
    if (selectedTransporter.value === 'Yes') {
        return {
            title: 'Next Transporter Signs',
            text: 'Next transporter signs manifest electronically upon custody exchange. This is repeated for each transporter.',
            signature: true
        }
    } else {
        return {
            title: 'Receiving Facility Signs',
            text: 'Receiving facility signs manifest electronically upon receipt.',
            signature: true
        }
    }
})

const submitFinalText = 'Within 30 days, the receiving facility must submit final manifest data and sign electronically in e-Manifest'

const step7 = computed(() => {
    if (selectedTransporter.value === 'Yes') {
        return {
            title: 'Receiving Facility Signs',
            text: 'Receiving facility signs manifest electronically upon receipt.',
            signature: true
        }
    } else {
        return {
            title: 'Final Submission',
            text: submitFinalText
        }
    }
})

const step8 = computed(() => {
    return { title: 'Final Submission', text: submitFinalText }
})

const allSteps = reactive([step1, step2, step3, step4, step5, step6, step7, step8])

function quickFill() {
    selectedParty.value = parties[0]
    selectedCreateMethod.value = createMethods[0]
    selectedSigMethod.value = genSigMethods[0]
    selectedTransporter.value = 'Yes'
}

</script>