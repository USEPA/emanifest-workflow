<template>
    <div class="d-flex align-center justify-center">
        <div class="text-h5 mr-2">Electronic Manifest Basics </div>
    </div>
    <v-container>
        <div class="text-h6 mb-2">Electronic Manifests Have Four Main Requirements</div>
        <v-expansion-panels variant="accordion">
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
    <v-container>
        <div class="text-h6 mb-2">Electronic Manifest Types</div>
        <div>There are two different types of electronic manifests: fully electronic and hybrid.</div>
        <div class="subtitle-2 mb-2">The table below shows a comparison of signature methods for fully electronic and
            hybrid manifests.</div>
        <v-table class="w-50" density="compact" striped="odd">
            <thead>
                <tr>
                    <th></th>
                    <th class="text-center">
                        <div>Generator</div>
                        <v-icon icon="mdi-factory"></v-icon>
                    </th>
                    <th  class="text-center">
                        <div>Transporter 1</div>
                        <v-icon icon="mdi-truck"></v-icon>
                    </th>
                    <th  class="text-center">
                        <div>Other Transporters</div>
                        <v-icon icon="mdi-truck"></v-icon>
                    </th  class="text-center">
                    <th  class="text-center">
                        <div>Receiving Facility</div>
                        <v-icon icon="mdi-recycle"></v-icon>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="text-right">Fully Electronic</td>
                    <td class="text-center">Electronic</td>
                    <td class="text-center">Electronic</td>
                    <td class="text-center">Electronic</td>
                    <td class="text-center">Electronic</td>
                </tr>
                <tr>
                    <td class="text-right">Hybrid</td>
                    <td class="text-center">Paper</td>
                    <td class="text-center">Paper + Electronic</td>
                    <td class="text-center">Electronic</td>
                    <td class="text-center">Electronic</td>
                </tr>

            </tbody>

        </v-table>
    </v-container>
</template>
<script setup>
const steps = [
    {
        title: 'Create Shipment in e-Manifest',
        main: ' Must create shipment in e-Manifest before it ships.',
        bullets: ['Any party (generator, transporter, designated facility, broker) can create and update it',
            'Must be set to Scheduled status by the TSDF* before shipping.'
        ]
    },
    {
        title: 'Print DOT Shipping Paper',
        main: ' DOT requires that a hard copy shipping paper be placed in the cab of the transport vehicle during transportation',
        bullets: ['A single sheet shipping paper can be printed from e-Manifest to satisfy the DOT HMR requirement',
            'Edits can be made on paper after printing out'
        ]
    },
    {
        title: 'Electronically Sign as Shipment Changes Custody',
        main: ' Signatures occur in the e-Manifest user interface or are submitted from external systems to e-Manifest (via API) when the shipment changes custody between parties',
        bullets: ['Field personnel (i.e. drivers/dock workers) can sign for themselves or through registered users located remotely',
            'Hybrid option available for generators unable to electronically sign'
        ]
    },
    {
        title: 'Final Submission within 30 days',
        main: 'The final receiving facility must submit the final manifest within 30 days of receipt by completing a CROMERR signature'
    }
]
</script>