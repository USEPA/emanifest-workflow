<template>
    <v-container class="w-66 bg-surface">

        <div class="text-h4 mr-2">Electronic Manifest Basics </div>

    </v-container>


    <v-container class="w-66 bg-surface px-6">
        <div class="text-h5 mb-2">Electronic Manifests Have Four Main Requirements</div>
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
    </v-container>

    <v-container class="w-66 bg-surface px-6">
        <div class="text-h5 mb-2">Electronic Manifest Types</div>
        <div class="mb-3">
            There are two different types of electronic manifests - fully electronic and hybrid. The
            primary difference between the two is how the signatures occur when waste changes custody between the
            generator and initial transporter at pickup.</div>
        <v-row align="stretch">
            <v-col cols="12" md="6" v-for="(type) in electronicCards">
                <v-card color="primary-darken-1 fill-height">
                    <v-card-title>{{ type.title }}</v-card-title>
                    <v-card-text>
                        <ul class="ml-6">
                            <li v-for="(item) in type.main">{{ item }}</li>
                            <ul class="ml-6">
                                <li v-for="(item) in type.sub">{{ item }}</li>
                            </ul>
                        </ul>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <div class="subtitle-2 mb-2 mt-6">
            The table below shows a comparison of signature methods for fully electronic
            and hybrid manifests.
        </div>
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
    </v-container>
    <v-container class="w-66 bg-surface px-6 pb-6 mb-8">
        <div class="text-h5 mb-2">Signature Options</div>
        <div>There are multiple options for performing signatures on electronic manifests. The below table summarize the
            available options.</div>
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
                        <div v-if="item.link"><a :href="item.link" target="_blank">Video <v-icon icon="mdi-open-in-new"
                                    size="18"></v-icon></a></div>
                        <div v-else>N/A</div>
                    </td>
                </tr>
            </tbody>
        </v-table>

        <div class="text-h6 mt-6 mb-2">Remote Signature Timing Flexibility</div>
        <div class="font-weight-regular">EPA's remote signer policy offers flexiblity in the timing that the electronic
            signature needs to occurs.</div>
        <div>Remote signers have until the earlier of either: </div>
        <div class="ml-6">(1) 24 hours from the time that their field personnel received the waste from the preceding
            waste handler (i.e., generator or transporter) or</div>
        <div class="ml-6">(2) before transferring the waste to another handler (i.e., another transporter or receiving
            facility),</div>
        <div> to execute an electronic signature to the hazardous waste manifest.</div>
        <div class="text-subtitle-1 my-2">Example 1</div>
        <div> A truck driver contacts their dispatcher that they received waste at 11:00 AM on a Tuesday. The remote
            signer has until 11:00 AM on Wednesday to execute the electronic signature.</div>
        <div class="text-subtitle-1 my-2">Example 2</div>
        <div>A truck driver contacts their dispatcher that they received waste at 11:00 AM on a Tuesday and will drop it
            with another waste hauler at 5:00 PM that same day. The remote signer has until before the transfer of
            custody occurs (in this case, 5:00 PM Tuesday) to execute the electronic signature.</div>

        <v-alert class="mt-2" border="start" border-color="blue accent-4">
            To learn more about the remote signer policy, see <a href="https://rcrapublic.epa.gov/files/14956.pdf"
                target="_blank">the Remote Signer Policy
                memo</a>
        </v-alert>
    </v-container>
</template>
<script setup>
const steps = [
    {
        title: 'Create Shipment in e-Manifest',
        main: ' Must create shipment in e-Manifest before it ships.',
        bullets: [
            'Any party (generator, transporter, designated facility, broker) can create and update it',
            'Must be set to Scheduled status by the TSDF* before shipping.'
        ]
    },
    {
        title: 'Print DOT Shipping Paper',
        main: ' DOT requires that a hard copy shipping paper be placed in the cab of the transport vehicle during transportation',
        bullets: [
            'A single sheet shipping paper can be printed from e-Manifest to satisfy the DOT HMR requirement',
            'Edits can be made on paper after printing out'
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
        title: 'Final Submission within 30 days',
        main: 'The final receiving facility must submit the final manifest within 30 days of receipt by completing a CROMERR signature'
    }
]

const electronicCards =
    [
        {
            title: 'Fully Electronic',
            main: [
                'All parties (generator, transporters, receiving facility) sign manifest electronically as waste changes custody',
                'Considerations for the generator'
            ],
            sub: [
                'Generator signs electronically',
                'Generator uses e-Manifest system to access their copy to meet recordkeeping requirement'
            ]
        },
        {
            title: 'Hybrid',
            main: [
                'Generator and intial transporter sign paper copy of electionic manifest.',
                'All transporters and receiving faciliy sign manifest electronically as waste changes custody.',
                'Considerations for the generator'
            ],
            sub: [
                'Use if no registered user is available to sign',
                'Use if no access to internet at pickup',
                'Use if EPA ID not assigned (i.e. Very Small Quanity Generator)',
                'Required to retain paper copy to meet recordkeeping requirement'
            ]
        }

    ]

const manifestTypeHeadings = [
    { text: 'Generator', icon: 'mdi-factory' },
    { text: 'Transporter 1', icon: 'mdi-truck' },
    { text: 'Other Transporters', icon: 'mdi-truck' },
    { text: 'Receiving Facility', icon: 'mdi-recycle' }
]

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
        type: 'Remote Signature using Company System',
        description: 'Field personnel responsible for shipment executes signature event though company\'s own hazardous waste software - signature info submitted to e-Manifest via API. Requires the company to previously configure their software to integrate with e-Manifest API.',
        link: ''
    },
    {
        type: 'Hybrid Generator Signature',
        description: 'Available to Generators only - Field personnel responsible for shipment signs Item 15. Generator’s/Offeror’s Certifications of printed copy of the electronic manifest.',
        link: 'https://youtu.be/V1341MjT9uY'
    }
]


const electronic = 'Electronic Signature'
const paper = 'Paper Signature'
</script>