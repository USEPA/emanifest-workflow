<template>
    <div class="mt-12 d-flex align-center justify-center">
        <div class="text-h5 mr-2">Electronic Workflow Wizard </div>
        <tooltip tipLocation="wizardHeading" type="info"></tooltip>
    </div>
    <v-container>
        <v-row justify="center" align="center">
            <v-col cols="12" md="6">
                <v-card title="Scenario Information">
                    <v-card-subtitle class="text-wrap">Please answer all questions below to see the proposed workflow
                        steps.</v-card-subtitle>
                    <v-card-text>
                        <div :class=questionTitleClasses>Generator</div>
                        <div class="pl-4">
                            <v-label class="text-wrap">Does the Generator have an EPA ID Number?<tooltip
                                    tipLocation="vsqg" type="info" :link="hwipLink" linkText="RCRAInfo Hazardous Waste Information Platform"></tooltip>
                            </v-label>
                            <v-radio-group v-model="selectedVsqg">
                                <v-radio label="Yes" value="Yes"></v-radio>
                                <v-radio label="No" value="No"></v-radio>
                            </v-radio-group>
                        </div>
                        <div class="pl-4">
                            <v-label class="text-wrap">How do you want the generator to sign?
                            </v-label>
                            <v-radio-group v-model="selectedSigMethod">
                                <v-radio v-for="option in genSigMethods" :key="option.value" :label="option.text"
                                    :value="option.value"></v-radio>
                            </v-radio-group>
                        </div>
                        <v-alert v-if="electronicNoGenIdScenario" type="warning" class="mb-4">
                            Since the generator does not have an EPA ID Number and you indicated it will sign
                            electronically, it must
                            obtain an EPA ID Number first before shipping waste. If the generator location state does
                            not
                            require VSQGs to obtain ID numbers and the generator does not intend to
                            obtain an ID Number, please change the signing option to "{{ getItemText(genSigMethods,
                                'paper') }}" in order to initiate the shipment.
                        </v-alert>

                        <div :class=questionTitleClasses>Transporter</div>
                        <div class="pl-4">
                            <v-label class="text-wrap">Is there more than 1 transporter?</v-label>
                            <v-radio-group v-model="selectedTransporter">
                                <v-radio label="Yes" value="Yes"></v-radio>
                                <v-radio label="No" value="No"></v-radio>
                            </v-radio-group>
                        </div>

                        <div :class=questionTitleClasses>Creator</div>
                        <div class="pl-4">
                            <v-label class="text-wrap">Which party is creating the manifest electronically?
                            </v-label>
                            <v-radio-group v-model="selectedParty">
                                <v-radio v-for="option in parties" :key="option.value" :label="option.text"
                                    :value="option.value"></v-radio>
                            </v-radio-group>
                        </div>

                        <div class="pl-4">
                            <v-label class="text-wrap">How are they creating it?
                            </v-label>
                            <v-radio-group v-model="selectedCreateMethod">
                                <v-radio v-for="option in createMethods" :key="option.value" :label="option.text"
                                    :value="option.value"></v-radio>
                            </v-radio-group>
                        </div>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn v-if="showQuickFill" @click="quickFill">Quick Fill</v-btn>
                        <v-btn @click="reset">Reset</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
    <v-container v-if="allFieldsFilled" class="pt-0" id="stepSection">
        <v-row justify="center" align="center">
            <v-col cols="12" md="6">
                <v-card v-if="selectedParty && selectedCreateMethod && selectedSigMethod" class="mb-4">
                    <v-card-title>
                        <v-icon color="warning" icon="mdi-alert-circle mr-4"></v-icon>Prerequisites
                    </v-card-title>
                    <v-card-text class="ml-12">
                        The following parties must have a registered user to participate in the worklow:
                        <ul class="ml-5">
                            <li v-for="item in preStep">{{ item }}
                                <span v-if="item === 'Generator' && electronicNoGenIdScenario">{{ genIdText }}</span>
                            </li>
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
                <v-card v-for="(step, i) in activeSteps" class="my-4">
                    <v-card-title>
                        <v-chip class="font-weight-bold mr-2">
                            {{ i + 1 }}
                        </v-chip>
                        {{ step.title }}
                    </v-card-title>
                    <v-card-text class="ml-12">
                        {{ step.text }}
                        <div v-if="step.print">
                            <ul class="ml-5">
                                <li><span v-if="selectedSigMethod === 'paper'">1st Copy: </span>To comply with DOT
                                    requirement to carry a shipping paper</li>
                                <li v-if="selectedSigMethod === 'paper'">2nd Copy: For generator and initial
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
                        <div v-if="step.signature">
                            <v-btn color="primary" size="small" @click="dialog = true" class="mt-2"><v-icon
                                    icon="mdi-file-sign" class="mr-2"></v-icon>Signature Options</v-btn>
                        </div>
                        <div v-if="step.video" class="mt-4">
                            <video-button :url="step.url"></video-button>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>

    <!--DIALOGS-->

    <!--video dialog component-->
    <video-dialog />

    <v-dialog max-width="700" v-model="dialog">
        <v-card title="Electronic Signature Options">
            <v-card-text>
                <div class="text-subtitle-1 font-weight-bold">Quick Signature using RCRAInfo</div>
                <div>Field personnel responsible for shipment logs into RCRAInfo with their own account and
                    electronically signs.</div>
                <video-button :url="generatorQuickSignUrl" class="mt-2"></video-button>

                <v-divider class="my-2"></v-divider>
                <div class="text-subtitle-1 font-weight-bold">Remote Signature using RCRAInfo </div>
                <div>Field personnel responsible for shipment authorizes remote signer to sign manifest - remote signer
                    logs into RCRAInfo with their own account and completes remote signature (provide name of field
                    personnel and date).</div>
                <video-button :url="generatorRemoteSignUrl" class="mt-2"></video-button>
                <v-alert class="mt-2" border="start" border-color="blue accent-4">
                    To learn more about the remote signer policy, see <a
                        href="https://rcrapublic.epa.gov/files/14956.pdf" target="_blank">the Remote Signer Policy
                        memo</a>
                </v-alert>
                <v-divider class="my-2"></v-divider>
                <div class="text-subtitle-1 font-weight-bold">Remote Signature using External System</div>
                <div>Field personnel responsible for shipment executes signature event though company's own hazardous
                    waste software - signature info submitted to e-Manifest via application programming interface (API).
                    Requires the company to previously configure their software to integrate with e-Manifest API.
                    View our <a href="https://usepa.github.io/e-manifest/" target="_blank">documentation <v-icon
                            icon="mdi-open-in-new" size="18"></v-icon></a> to learn more about APIs.
                </div>
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

.video-container {
    position: relative;
    width: 100%;
    padding-top: 56.25%;
    /* 16:9 Aspect Ratio */
    /* Add a background color to the container which will be visible until the iframe loads */
    background-color: #f0f0f0;
}

.video-iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.video-spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
}
</style>

<script setup>
import { ref, unref, computed, watch, nextTick } from 'vue';
import { useGoTo } from 'vuetify'

import Tooltip from '../components/Tooltip.vue';
import VideoButton from '@/components/VideoButton.vue';
import VideoDialog from '@/components/VideoDialog.vue';

const goTo = useGoTo()

const questionTitleClasses = ['text-subtitle-1', 'font-weight-bold', 'mb-3']

const generatorLink = 'https://www.epa.gov/hwgenerators/categories-hazardous-waste-generators'
const hwipLink = 'https://rcrapublic.epa.gov/rcra-hwip'
const generatorQuickSignUrl = 'https://www.youtube.com/embed/6vckZ9bTBOM?si=lEc3OnF3NboCu2y9'
const generatorRemoteSignUrl = 'https://www.youtube.com/embed/3kaGjxf6e80?si=hbXRjYYtjO1lZBHb'
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
    { value: 'electronic', text: 'Electronically' },
    { value: 'paper', text: 'On paper (Hybrid)' }]

/**
 * REFS FOR DROPDOWNS/MODAL
 */
const selectedParty = ref(null)
const selectedCreateMethod = ref(null)
const selectedSigMethod = ref(null)
const selectedTransporter = ref(null)
const selectedVsqg = ref(null)

const dialog = ref(false)
const printDialog = ref(false)

const showQuickFill = import.meta.env.DEV

function reset() {
    selectedVsqg.value = null
    selectedParty.value = null
    selectedCreateMethod.value = null
    selectedSigMethod.value = null
    selectedTransporter.value = null
}

const allFieldsFilled = computed(() => {
    return selectedVsqg.value !== null && selectedParty.value !== null && selectedCreateMethod.value !== null && selectedSigMethod.value !== null && selectedTransporter.value !== null
})

watch(allFieldsFilled, async (newValue) => {
    if (newValue) {
        await nextTick();
        goTo('#stepSection', { duration: 500, offset: -85 })
    }
})
const electronicNoGenIdScenario = computed(() => {
    return selectedVsqg?.value === 'No' && selectedSigMethod?.value === 'electronic'
})

function getItemText(items, value) {
    return items.find(item => item.value === value).text
}

/**
 * STEP TEXT
 */
const preStep = computed(() => {
    const allParties = ['Transporter(s)', 'Receiving Facility']
    if (selectedSigMethod.value === 'electronic' || selectedParty.value === 'generator') allParties.unshift('Generator')
    if (selectedParty.value === 'broker') allParties.push('Broker')

    return allParties
})

const genIdText = '- Additionally the generator must obtain an EPA ID Number first if it does not have one'

const step1 = computed(() => {
    const step = {
        title: 'Create the Manifest',
        text: '',
        video: true,
        url: 'https://www.youtube.com/embed/Q-HLuOljA54?si=XKnCWzekKbYXINFd',
        show: true
    }
    const editText = 'The data may be modified up until the generator signs the manifest. '
    let action = ''

    if (selectedCreateMethod.value === 'eman') {
        action = 'accesses the e-Manifest module in RCRAInfo and creates the manifest.'
    } else if (selectedCreateMethod.value === 'external') {
        action = 'prepares the manifest shipment data in their external system, then uploads the data to e-Manifest via Application Programing Interface (API).'
    }

    step.text = `${getItemText(parties, selectedParty.value)} ${action} ${editText}`

    return step
})

const step2 = computed(() => {
    return {
        title: 'Schedule the Manifest',
        text: 'The Receiving Facility must schedule the manifest by default. Alternatively, the Receiving Facility can opt to allow other parties to schedule manifests via a setting in e-Manifest.',
        video: true,
        url: 'https://www.youtube.com/embed/Cv13HhYeiOA?si=u0adr9QHXpm5Pu0q',
        show: true
    }
})

const step3 = computed(() => {
    const copies = selectedSigMethod.value === 'paper' ? '2 copies' : '1 copy'
    return {
        title: 'Print the Manifest',
        text: `Print ${copies} of the manifest`,
        print: true,
        video: true,
        url: 'https://www.youtube.com/embed/V1341MjT9uY?si=__idvpTya6qSuIic',
        show: true
    }
})

const dataEditText = 'Data edits must be submitted to match shipment actuals prior to signing.'

const step4 = computed(() => {
    const step = {
        title: 'Generator Signs',
        text: '',
        show: true,
        signature: false
    }

    if (selectedSigMethod.value === 'paper') {
        step.text = 'Generator signs paper manifest copy. Generator keeps this copy for their recordkeeping requirements after the initial transporter signs.'

    } else {

        step.text = 'Generator signs electronically. ' + dataEditText
        step.signature = true
    }

    return step
})

const step5 = computed(() => {
    const step = {
        title: 'Initial Transporter Signs',
        text: '',
        show: true,
        signature: true
    }

    if (selectedSigMethod.value === 'paper') {
        step.text = 'Initial transporter signs paper manifest copy, then signs manifest electronically. ' + dataEditText
    } else {
        step.text = 'Initial transporter signs manifest electronically. '
    }

    return step
})

const step6 = computed(() => {
    const step = {
        title: '',
        text: '',
        show: true,
        signature: true
    }
    if (selectedTransporter.value === 'Yes') {
        step.title = 'Next Transporter Signs'
        step.text = 'Next transporter signs manifest electronically upon custody exchange. This is repeated for each transporter.'

    } else {
        step.title = 'Receiving Facility Signs'
        step.text = 'Receiving facility signs manifest electronically upon receipt.'
    }

    return step
})

const submitFinalText = 'Within 30 days, the receiving facility must submit final manifest data and sign electronically in e-Manifest'

const step7 = computed(() => {
    const step = {
        title: '',
        text: '',
        show: true,
        signature: false
    }
    if (selectedTransporter.value === 'Yes') {
        step.title = 'Receiving Facility Signs'
        step.text = 'Receiving facility signs manifest electronically upon receipt.'
        step.signature = true

    } else {
        step.title = 'Final Submission'
        step.text = submitFinalText
    }
    return step
})

const step8 = computed(() => {
    if (selectedTransporter.value === 'Yes') {
        return { title: 'Final Submission', text: submitFinalText, show: true }
    }
    return { show: false }
})

const allSteps = [step1, step2, step3, step4, step5, step6, step7, step8]

const activeSteps = computed(() => {
    return allSteps
        .map(unref)          // unwrap each computed
        .filter(item => item?.show)
})

function quickFill() {
    selectedParty.value = 'generator'
    selectedCreateMethod.value = 'eman'
    selectedSigMethod.value = 'electronic'
    selectedTransporter.value = 'Yes'
    selectedVsqg.value = 'No'
}

</script>