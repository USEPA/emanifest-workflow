<template>
    <v-container class="py-12">
        <v-row justify="center">
            <v-col cols="12" lg="7" md="8">
                <div class="d-flex align-center justify-center flex-column">
                    <div class="d-flex align-center">
                        <div class="text-h5 mr-2">Electronic Workflow Wizard</div>
                        <tooltip tip-location="wizardHeading" type="info" />
                    </div>
                </div>

                <v-card title="Workflow Scenario Information">
                    <v-card-subtitle class="text-wrap">Please answer all questions below to see the
                        proposed workflow steps.</v-card-subtitle>
                    <v-card-text>
                        <div :class="questionTitleClasses">Generator</div>
                        <v-radio-group v-model="selectedVsqg">
                            <template #label>
                                <div class="d-inline-flex align-center flex-wrap">
                                    <span class="mr-1 text-wrap">Does the Generator have an EPA ID
                                        Number?</span>
                                    <tooltip :link="hwipLink" link-text="RCRAInfo Hazardous Waste Information Platform"
                                        tip-location="vsqg" type="info" />
                                </div>
                            </template>
                            <v-radio label="Yes" value="Yes" />
                            <v-radio label="No" value="No" />
                        </v-radio-group>
                        <v-radio-group v-model="selectedSigMethod">
                            <template #label><span class="text-wrap">How do you want the generator to
                                    sign?</span></template>
                            <v-radio v-for="option in genSigMethods" :key="option.value" :label="option.text"
                                :value="option.value" />
                        </v-radio-group>

                        <v-alert border="start" border-color="warning" variant="flat" class="mb-4" v-if="electronicNoGenIdScenario">
                            Since the generator does not have an EPA ID Number and you indicated it
                            will sign electronically, it must obtain an EPA ID Number first before shipping waste.
                            If the generator location state does not 
                            require VSQGs to obtain ID numbers and the generator does not intend to
                            obtain an ID Number, please change the signing option to "{{
                                getItemText(genSigMethods,
                                    'paper') }}" in order to initiate the shipment.
                        </v-alert>

                        <div :class="questionTitleClasses">Transporter</div>
                        <v-radio-group v-model="selectedTransporter">
                            <template #label><span class="text-wrap">Is there more than 1
                                    transporter?</span></template>
                            <v-radio label="Yes" value="Yes" />
                            <v-radio label="No" value="No" />
                        </v-radio-group>

                        <div :class="questionTitleClasses">Creator</div>
                        <v-radio-group v-model="selectedParty">
                            <template #label><span class="text-wrap">Which party is creating the manifest
                                    electronically?</span></template>
                            <v-radio v-for="option in parties" :key="option.value" :label="option.text"
                                :value="option.value" />
                        </v-radio-group>
                        <v-radio-group v-model="selectedCreateMethod">
                            <template #label><span class="text-wrap">How are they creating it?</span></template>
                            <v-radio v-for="option in createMethods" :key="option.value" :label="option.text"
                                :value="option.value" />
                        </v-radio-group>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn v-if="showQuickFill" @click="quickFill">Quick Fill</v-btn>
                        <v-btn @click="reset">Reset</v-btn>
                    </v-card-actions>
                </v-card>
                <div v-if="allFieldsFilled" id="stepSection" class="pt-0">
                    <v-card v-if="selectedParty && selectedCreateMethod && selectedSigMethod" class="my-4">
                        <v-card-title>
                            <v-icon color="warning" icon="mdi-alert-circle mr-4" />Prerequisites
                        </v-card-title>
                        <v-card-text class="ml-12">
                            The following parties must have a registered user to participate in the
                            worklow:
                            <ul class="ml-5">
                                <li v-for="(item, i) in preStep" :key="i">{{ item }}
                                    <span v-if="item === 'Generator' && electronicNoGenIdScenario">{{
                                        genIdText
                                        }}</span>
                                </li>
                            </ul>
                            <div v-if="selectedSigMethod === 'paper'" class="mt-2">
                                Since you indicated that the generator is signing on paper, the
                                generator does not
                                need an
                                account for signing, but Large and Small Quantity Generators must
                                maintain an account to access final signed manifests from receiving
                                facilities, submit post-receipt data corrections requested by
                                regulators, and submit
                                exception
                                reports electronically via e-Manifest. </div>
                            <v-alert border="start" border-color="blue accent-4" class="mt-2">Create an
                                account in
                                <a href="https://rcrainfo.epa.gov/" target="_blank">RCRAInfo<v-icon
                                        icon="mdi-open-in-new" size="18" /></a>, then request
                                permission to
                                your party's EPA ID(s).
                            </v-alert>
                            <div v-if="selectedCreateMethod === 'external'" class="mt-3">
                                To integrate with e-Manifest from an external system you need Site
                                Management permission to your EPA ID Number and will need to generate an
                                API ID and
                                Key from
                                the
                                RCRAInfo.</div>
                        </v-card-text>
                    </v-card>
                    <v-card v-for="(step, i) in activeSteps" :key="i" class="my-4">
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
                                    <li><span v-if="selectedSigMethod === 'paper'">1st Copy: </span>To
                                        comply with
                                        DOT
                                        requirement to carry a shipping paper</li>
                                    <li v-if="selectedSigMethod === 'paper'">2nd Copy: For generator and
                                        initial
                                        transporter to
                                        sign - generator retains for recordkeeping</li>
                                </ul>
                                <v-alert border="start" border-color="blue accent-4" class="my-2">
                                    This step can occur later, but must happen before the waste leaves
                                    the generator
                                    site. Copies can be printed by any party. There are <a href="#"
                                        @click.prevent="printDialog = true">two options</a> for printing
                                    the
                                    manifest.
                                    Copies may be marked up to match shipment
                                    actuals, but these changes must be updated in e-Manifest before
                                    the first party's signature.
                                </v-alert>
                            </div>
                            <div v-if="step.signature">
                                <v-btn class="mt-2" color="primary" size="small" @click="dialog = true"><v-icon
                                        class="mr-2" icon="mdi-file-sign" />Signature Options</v-btn>
                            </div>
                            <div v-if="step.video" class="mt-4">
                                <video-button :url="step.url" />
                            </div>
                        </v-card-text>
                    </v-card>
                </div>
            </v-col>
        </v-row>
    </v-container>

    <!--DIALOGS-->

    <!--video dialog component-->
    <video-dialog />

    <v-dialog v-model="dialog" max-width="700">
        <v-card title="Electronic Signature Options">
            <v-card-text>
                <div class="text-subtitle-1 font-weight-bold">Quick Signature using RCRAInfo</div>
                <div>Field personnel responsible for shipment logs into RCRAInfo with their own account and
                    electronically signs.</div>
                <video-button class="mt-2" :url="generatorQuickSignUrl" />

                <v-divider class="my-2" />
                <div class="text-subtitle-1 font-weight-bold">Remote Signature using RCRAInfo </div>
                <div>Field personnel responsible for shipment authorizes remote signer to sign manifest - remote signer
                    logs into RCRAInfo with their own account and completes remote signature (provide name of field
                    personnel and date).</div>
                <video-button class="mt-2" :url="generatorRemoteSignUrl" />
                <v-alert border="start" border-color="blue accent-4" class="mt-2">
                    To learn more about the remote signer policy, see <a
                        href="https://rcrapublic.epa.gov/files/14956.pdf" target="_blank">the Remote Signer Policy
                        memo</a>
                </v-alert>
                <v-divider class="my-2" />
                <div class="text-subtitle-1 font-weight-bold">Remote Signature using External System</div>
                <div>Field personnel responsible for shipment executes signature event though company's own hazardous
                    waste software - signature info submitted to e-Manifest via application programming interface (API).
                    Requires the company to previously configure their software to integrate with e-Manifest API.
                    View our <a href="https://usepa.github.io/e-manifest/" target="_blank">documentation <v-icon
                            icon="mdi-open-in-new" size="18" /></a> to learn more about APIs.
                </div>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn text="Close" @click="dialog = false" />
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog v-model="printDialog" max-width="700">
        <v-card title="Printing Options">
            <v-card-text>
                Copies can be printed from e-Manifest or directly from another system using EPA's template.
                If you have your own system and would like to populate the manifest copy directly, download EPA's
                manifest and continuation sheet <a
                    href="https://github.com/USEPA/e-manifest/tree/master/Services-Information/Shipping-Paper-PDF"
                    target="_blank">templates <v-icon icon="mdi-open-in-new" size="18" /></a>. Then configure
                your system to
                populate these documents.
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn text="Close" @click="printDialog = false" />
            </v-card-actions>
        </v-card>
    </v-dialog>

</template>
<style scoped></style>
<script setup>
import { computed, nextTick, ref, unref, watch } from 'vue'
import { useGoTo } from 'vuetify'

import VideoButton from '@/components/VideoButton.vue'
import VideoDialog from '@/components/VideoDialog.vue'
import Tooltip from '../components/Tooltip.vue'

const goTo = useGoTo()

const questionTitleClasses = ['text-subtitle-1', 'font-weight-bold', 'mb-3']

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
    { value: 'broker', text: 'Broker' },
]
const createMethods = [
    { value: 'eman', text: 'In e-Manifest' },
    { value: 'external', text: 'In external system and uploading to e-Manifest' },
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

watch(allFieldsFilled, async newValue => {
    if (newValue) {
        await nextTick()
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
        show: true,
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
        show: true,
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
        show: true,
    }
})

const dataEditText = 'Data edits must be submitted to match shipment actuals prior to signing.'

const step4 = computed(() => {
    const step = {
        title: 'Generator Signs',
        text: '',
        show: true,
        signature: false,
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
        signature: true,
        text: selectedSigMethod.value === 'paper' ? 'Initial transporter signs paper manifest copy, then signs manifest electronically. ' + dataEditText : 'Initial transporter signs manifest electronically. '
    }

    return step
})

const step6 = computed(() => {
    const step = {
        title: '',
        text: '',
        show: true,
        signature: true,
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
        signature: false,
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
    return unref(allSteps)
        .map(step => unref(step))
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
