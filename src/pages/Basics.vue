<template>
    <v-container :class="`px-6 pb-6 mb-12 w-${pageWidth}`">
        <section>
            <div class="text-h4 mr-2 mb-3">Electronic Manifest Basics </div>
            <p class="text-body-1 mb-6">{{ intro }} </p>
            <div class="text-h5 mb-2">Main Requirements</div>
            <p class="text-body-1 mb-2">Electronic manifests have four main requirements. Click each panel to see more
                information.</p>
            <v-expansion-panels variant="accordion" class="elevation-6">
                <v-expansion-panel v-for="(item, i) in steps" :key="i" :title="`${i + 1}. ${item.title}`">
                    <v-expansion-panel-text>
                        {{ item.main }}
                        <ul class="ml-6">
                            <li v-for="(listItem, idx) in item.bullets" :key="idx"> {{ listItem }}</li>
                        </ul>
                    </v-expansion-panel-text>
                </v-expansion-panel>
            </v-expansion-panels>
        </section>
        <section>
            <div class="text-h5 mt-6 mb-2">Electronic Manifest Types</div>
            <p class="text-body-1 mb-3">
                There are two different types of electronic manifests - fully electronic and hybrid. The
                primary difference between the two is how the signatures occur when waste changes custody between the
                generator and initial transporter at pickup.</p>
            <v-row align="stretch">
                <v-col cols="12" md="6" v-for="(card) in electronicCards">
                    <v-card :color="themeStore.themeColor" elevation="8" rounded="lg">
                        <v-card-title>{{ card.title }}</v-card-title>
                        <v-card-text>
                            <ul>
                                <li v-for="(bullet, bulletIndex) in card.bullets" :key="bulletIndex" class="ml-6">
                                    {{ bullet.text }}
                                    <!-- Check if this bullet has sub-bullets -->
                                    <ul v-if="bullet.sub">
                                        <li v-for="(subBullet, subIndex) in bullet.sub" :key="subIndex" class="ml-6">
                                            {{ subBullet }}
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <p class="subtitle-2 mb-2 mt-6">
                The table below shows a comparison of signature methods for fully electronic
                and hybrid manifests.
            </p>
            <v-table class="elevation-6" striped="odd">
                <thead>
                    <tr>
                        <th class="text-right">Type</th>
                        <th class="text-center" v-for="(item) in manifestTypeHeadings">
                            <div>{{ item.text }}</div>
                            <v-icon color="success" size="30" :icon="item.icon"></v-icon>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="text-right font-weight-bold">Fully Electronic</td>
                        <td class="text-center">{{ electronic }}</td>
                        <td class="text-center">{{ electronic }}</td>
                        <td class="text-center">{{ electronic }}</td>
                        <td class="text-center">{{ electronic }}</td>
                    </tr>
                    <tr>
                        <td class="text-right font-weight-bold">Hybrid</td>
                        <td class="text-center">{{ paper }}</td>
                        <td class="text-center">{{ paper }} + {{ electronic }}</td>
                        <td class="text-center">{{ electronic }}</td>
                        <td class="text-center">{{ electronic }}</td>
                    </tr>
                </tbody>
            </v-table>
        </section>
        <section>
            <div class="text-h5 mt-6 mb-2">Signature Options</div>
            <p class="text-body-1">There are multiple options for performing signatures on electronic manifests. The
                below table summarize
                the
                available options.</p>
            <v-table striped="odd" class="elevation-6 mt-3">
                <thead>
                    <tr>
                        <th>
                            Signature Type
                        </th>
                        <th>
                            Description
                        </th>
                        <th>
                            Demonstration Video
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, i) in signatureTypes" :key="i">
                        <td>{{ item.type }}</td>
                        <td>{{ item.description }}</td>
                        <td>
                            <div v-if="item.link"><a :href="item.link" target="_blank">Video <v-icon
                                        icon="mdi-open-in-new" size="18"></v-icon></a></div>
                            <div v-else>N/A</div>
                        </td>
                    </tr>
                </tbody>
            </v-table>

            <div class="text-h6 mt-6 mb-2">Remote Signature Timing Flexibility</div>
             <v-alert class="my-2" border="start" border-color="blue accent-4">
                To learn more about the remote signer policy, see <a href="https://rcrapublic.epa.gov/files/14956.pdf"
                    target="_blank">the Remote Signer Policy
                    memo <v-icon icon="mdi-open-in-new" size="18"></v-icon> </a>
            </v-alert>
            <p class="text-body-1">EPA's remote signer policy offers flexiblity in the timing that the
                electronic
                signature needs to occurs.</p>
            <p class="text-body-1">Remote signers have until the earlier of either: </p>
            <p class="text-body-1 ml-6">(1) 24 hours from the time that their field personnel received the waste from
                the
                preceding
                waste handler (i.e., generator or transporter) or</p>
            <p class="text-body-1 ml-6">(2) before transferring the waste to another handler (i.e., another transporter
                or
                receiving
                facility),</p>
            <p class="text-body-1"> to execute an electronic signature to the hazardous waste manifest.</p>
            <div class="text-subtitle-1 my-2">Example 1</div>
            <p class="text-body-1"> A truck driver contacts their dispatcher that they received waste at 11:00 AM on a
                Tuesday. The remote
                signer has until 11:00 AM on Wednesday to execute the electronic signature.</p>
            <div class="text-subtitle-1 my-2">Example 2</div>
            <p class="text-body-1">A truck driver contacts their dispatcher that they received waste at 11:00 AM on a
                Tuesday and will
                drop it
                with another waste hauler at 5:00 PM that same day. The remote signer has until before the transfer of
                custody occurs (in this case, 5:00 PM Tuesday) to execute the electronic signature.</p>
        </section>
    </v-container>
</template>
<style scoped>
a:link,
a:visited {
    color: inherit !important
}
</style>
<script setup>
import { useDisplay } from 'vuetify'
import { useThemeStore } from '@/stores/themeStore'

const { mdAndUp } = useDisplay()

const themeStore = useThemeStore()

//dynamic width for content based on screen width
const pageWidth = computed(() => {
    if (mdAndUp.value) {
        return '66'
    }
    else {
        return '100'
    }
})

const intro = 'Electronic manifests track shipment information electronically about wastes required to be tracked on the Uniform Hazardous Waste Manifest from cradle-to-grave. They offer numerous benefits over paper manifests such as improved data quality, simplified recordkeeping procedures and timely custody information.'

/**
 * array containing information for the main requirements expand/collapse section
 * title - the text displayed when collapsed
 * main - the text displayed when the section is expanded
 * bullets - array of bullets
 */

const steps = [
    {
        title: 'Create Shipment in e-Manifest',
        main: ' Must create shipment in e-Manifest before it ships.',
        bullets: [
            'Any party (generator, transporter, designated facility, broker) can create and update it',
            'The manifest can be created directly in e-Manifest via RCRAInfo OR via an external system and uploaded via Application Programming Interface (API)',
            'Must be set to Scheduled status by the receiving facility by default before shipping - if the receiving facility opts in via a system setting, other parties may schedule manifests.'
        ]
    },
    {
        title: 'Electronically Sign as Shipment Changes Custody',
        main: ' Signatures occur in the e-Manifest user interface or are submitted from external systems to e-Manifest (via API) when the shipment changes custody between parties',
        bullets: [
            'Field personnel (i.e. drivers/dock workers) can sign for themselves or through registered users located remotely',
            'Hybrid option available for generators unable to electronically sign'
        ]
    },
    {
        title: 'Carry DOT Shipping Paper',
        main: 'DOT requires that a hard copy shipping paper be placed in the cab of the transport vehicle during transportation',
        bullets: [
            'A single sheet shipping paper can be printed from e-Manifest to satisfy the DOT HMR requirement',
            'Edits can be made on paper after printing out'
        ]
    },
    {
        title: 'Final Submission within 30 days',
        main: 'The final receiving facility must submit the final manifest within 30 days of receipt by completing a CROMERR signature'
    }
]


/**
 * array containing information Electronic Manifest Types cards section
 * title - card title
 * bullets - array of bullets
 * **** text - main bullet text
 * **** sub - array of sub-bullets for a given main text bullet
 */

const electronicCards =
    [
        {
            title: 'Fully Electronic',
            bullets: [
                { text: 'All parties (generator, transporters, receiving facility) sign manifest electronically as waste changes custody' },
                {
                    text: 'Considerations for the generator',
                    sub: [
                        'Generator must have a registered user available to sign electronically',
                        'Generator uses e-Manifest system to access their copy to meet recordkeeping requirement'
                    ]
                }
            ],
        },
        {
            title: 'Hybrid',
            bullets: [
                { text: 'Generator and intial transporter sign paper copy of electionic manifest' },
                { text: 'All transporters and receiving faciliy sign manifest electronically as waste changes custody' },
                {
                    text: 'Considerations for the generator',
                    sub: [
                        'Use if no registered user is available to sign',
                        'Use if no access to internet at pickup',
                        'Use if EPA ID not assigned (i.e. Very Small Quanity Generator)',
                        'Required to retain paper copy to meet recordkeeping requirement'
                    ]
                }
            ]
        }

    ]

/**
 * headings for the submission type table
 */
const manifestTypeHeadings = [
    { text: 'Generator', icon: 'mdi-factory' },
    { text: 'Transporter 1', icon: 'mdi-truck' },
    { text: 'Other Transporters', icon: 'mdi-truck' },
    { text: 'Receiving Facility', icon: 'mdi-recycle' }
]

//const text for the submission type table
const electronic = 'Electronic Signature'
const paper = 'Paper Signature'


/**
 * content for signature options table
 * type
 * description
 * link
 */
const signatureTypes = [
    {
        type: 'Quick Signature using RCRAInfo',
        description: 'Field personnel responsible for shipment logs into RCRAInfo with their own account and electronically signs.',
        link: 'https://youtu.be/6vckZ9bTBOM'
    },
    {
        type: 'Remote Signature using RCRAInfo',
        description: 'Field personnel responsible for shipment authorizes remote signer to sign manifest - remote signer logs into RCRAInfo with their own account and completes remote signature (provide name of field personnel and date).',
        link: 'https://youtu.be/3kaGjxf6e80'
    },
    {
        type: 'Remote Signature using External System',
        description: 'Field personnel responsible for shipment executes signature event though company\'s own hazardous waste software (proprietary or ERP) - signature info submitted to e-Manifest via API. Requires the external system to be configured to integrate with e-Manifest API.',
        link: ''
    },
    {
        type: 'Hybrid Generator Signature',
        description: 'Available to Generators only - Field personnel responsible for shipment signs Item 15. Generator’s/Offeror’s Certifications of printed copy of the electronic manifest.',
        link: 'https://youtu.be/V1341MjT9uY'
    }
]

</script>