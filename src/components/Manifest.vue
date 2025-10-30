<template>
    <v-app-bar color="#3e6d9b">
        <v-app-bar-title>e-Manifest Workflow</v-app-bar-title>
        <div class="mr-8">
            <v-icon-btn icon="mdi-help-circle" color="#3e6d9b" class="mx-2" @click="dialog = true"></v-icon-btn>
            <v-icon-btn :icon="themeMode" @click="theme.toggle()" color="#3e6d9b" class="mx-2"></v-icon-btn>
        </div>
    </v-app-bar>
    <v-dialog v-model="dialog" width="auto">
        <v-card max-width="600">
            <v-card-title><v-icon icon="mdi-help-circle"></v-icon> Help</v-card-title>
            <v-card-text>
                <p>This tool demonstrates the electronic manifest workflow to show when information is required and can
                    be edited.</p>
                <p>Use the Previous and Next buttons to navigate between the events.</p>
            </v-card-text>
            <v-card-actions>
                <v-btn class="ms-auto" text="Ok" @click="dialog = false"></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <!--status bar-->
    <status-bar></status-bar>

    <v-sheet :elevation="4" class="mx-12 my-3 pa-0" rounded="xl">
        <v-container class="ma-0 pa-4">
            <v-row>
                <v-col cols="12" md="4">
                    <LabelField name="mtn" type="text"></LabelField>
                </v-col>
                <v-col cols="12" md="4">
                    <LabelField name="erPhone" type="text"></LabelField>
                </v-col>
            </v-row>
        </v-container>

        <v-divider></v-divider>
        <v-container class="ma-0 pa-4">
            <h2 class="my-2">Generator Information</h2>
            <v-row>
                <v-col cols="12" md="4">
                    <label-field name="generator.epaId" type="text"></label-field>
                </v-col>
                <v-col cols="12" md="4">
                    <label-field name="generator.name" type="text"></label-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="4">
                    <label-field name="generator.mailingAddress" type="textarea"></label-field>
                </v-col>
                <v-col cols="12" md="4">
                    <label-field name="generator.siteAddress" type="textarea"></label-field>
                </v-col>

                <v-col cols="12" md="4">
                    <label-field name="generator.phone" type="text"></label-field>
                </v-col>
            </v-row>
        </v-container>
        <v-divider></v-divider>
        <v-container class="ma-0 pa-4">
            <div class="d-flex align-center">
                <h2 class="my-2">Transporter Information</h2> <label-required status="Scheduled" class></label-required>
            </div>
            <v-table>
                <thead>
                    <tr>
                        <th class="text-left">
                            Order
                        </th>
                        <th class="text-left">
                            EPA ID
                        </th>
                        <th class="text-left">
                            Name
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in transporters" :key="item.epaId">
                        <td>{{ item.order }}</td>
                        <td>{{ item.epaId }}</td>
                        <td>{{ item.name }}</td>
                    </tr>
                </tbody>
            </v-table>
        </v-container>
        <v-divider></v-divider>
        <v-container class="ma-0 pa-4">
            <div class="d-flex align-center">
                <h2 class="my-2">Designated Facility Information</h2>
                <tooltip tipLocation="tsdfWarning" type="warning" status="TSig"></tooltip>
            </div>

            <v-row>
                <v-col cols="12" md="4">
                    <label-field name="tsdf.epaId" type="text"></label-field>
                </v-col>
                <v-col cols="12" md="4">
                    <label-field name="tsdf.name" type="text"></label-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="4">
                    <label-field name="tsdf.siteAddress" type="textarea"></label-field>
                </v-col>

                <v-col cols="12" md="4">
                    <label-field name="tsdf.phone" type="text"></label-field>
                </v-col>
            </v-row>
        </v-container>
        <v-divider></v-divider>
        <v-container class="ma-0 pa-4" fluid>
            <div class="d-flex align-center">
                <h2 class="my-2">Waste Information </h2>
                <tooltip tipLocation="waste" type="info">
                </tooltip>
                <tooltip tipLocation="wasteWarning" type="warning" status="TSig"></tooltip>
            </div>
            <!--waste table-->
            <waste-info></waste-info>
        </v-container>
        <v-container class="ma-0 pa-4">
            <div class="d-flex align-center">
                <h2 class="my-2">15. Generator Signature Information </h2>
                <tooltip tipLocation="generator" type="info"></tooltip>
            </div>
            <v-row>
                <v-col cols="12" md="4">
                    <label-field name="generator.signature.name" type="text"></label-field>
                </v-col>
                <v-col cols="12" md="4">
                    <label-field name="generator.signature.date" type="text"></label-field>
                </v-col>
            </v-row>
        </v-container>
        <v-container class="ma-0 pa-4">
            <h2 class="my-2">17. Transporter Signature Information </h2>
            <v-row>
                <v-col cols="12" md="4">
                    <label-field name="transporter.signature.name" type="text"></label-field>
                </v-col>
                <v-col cols="12" md="4">
                    <label-field name="transporter.signature.date" type="text"></label-field>
                </v-col>
            </v-row>
        </v-container>
        <v-container class="ma-0 pa-4">
            <h2 class="my-2">Discrepancy Information </h2>
            <v-row>

            </v-row>
        </v-container>
        <v-container class="ma-0 pa-4">
            <h2 class="my-2">19. Management Method Codes </h2>
            <v-row> <v-col cols="6" md="3">
                    <label-field name="managemementMethod1" type="text"></label-field>
                </v-col>
                <v-col cols="6" md="3">
                    <label-field name="managemementMethod2" type="text"></label-field>
                </v-col>
                <v-col cols="6" md="3">
                    <label-field name="managemementMethod3" type="text"></label-field>
                </v-col>
                <v-col cols="6" md="3">
                    <label-field name="managemementMethod4" type="text"></label-field>
                </v-col>
            </v-row>

        </v-container>
        <v-container class="ma-0 pa-4">
            <h2 class="my-2">TSDF Signature Information </h2>
            <v-row>
                <v-col cols="12" md="4">
                    <label-field name="tsdf.signature.name" type="text"></label-field>
                </v-col>
                <v-col cols="12" md="4">
                    <label-field name="tsdf.signature.date" type="text"></label-field>
                </v-col>
            </v-row>
        </v-container>
    </v-sheet>
</template>
<script setup>

import { ref, computed } from 'vue'
import { useTheme } from 'vuetify'
import LabelRequired from './LabelRequired.vue';
import LabelField from './LabelField.vue';
import Tooltip from './Tooltip.vue';
import StatusBar from './StatusBar.vue';
import WasteInfo from './WasteInfo.vue';
import { useAppStore } from '@/stores/app'
const store = useAppStore();



const theme = useTheme()
const themeMode = computed(() => {
    if (theme.global.current.value.dark) {
        return 'mdi-white-balance-sunny'
    } else {
        return 'mdi-weather-night'
    }
})

const dialog = ref(false)


const addedTransporters = [{ order: 1, epaId: 'VA123', name: 'test' }, { order: 2, epaId: 'NC123', name: 'second' }]


const transporters = ref(addedTransporters)

</script>
