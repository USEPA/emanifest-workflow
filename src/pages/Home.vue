<template>
    <v-container>
        <div class="text-h2">e-Manifest Workflow</div>
        <div class="mt-5">
            This site provides interactive tools to assist with implementing the electronic workflow for the EPA Uniform
            Hazardous Waste Manifest.
        </div>
        <v-row class="mt-5">
            <v-col cols="12" :md="basicsEnabled ? 4 : 6" v-if="basicsEnabled">
                <v-card color="primary-darken-1" elevation="16" rounded="lg"><v-card-title>The Basics</v-card-title>
                    <v-card-text>
                        Foundational information about electronic manifests. Learn about types and signature options.
                    </v-card-text>
                    <v-card-actions class="pb-4"><v-btn variant="outlined" to="/basics">Go</v-btn></v-card-actions>
                </v-card>
            </v-col>
            <v-col cols="12" :md="basicsEnabled ? 4 : 6">
                <v-card color="primary-darken-1" elevation="16" rounded="lg"><v-card-title>Form Workflow</v-card-title>
                    <v-card-text>
                        Shows what information is required and can be edited on the form at various points in the
                        workflow.
                    </v-card-text>
                    <v-card-actions class="pb-4"><v-btn variant="outlined" to="/manifest">Go</v-btn></v-card-actions>
                </v-card>
            </v-col>
            <v-col cols="12" :md="basicsEnabled ? 4 : 6">
                <v-card color="primary-darken-1" elevation="16" rounded="lg"><v-card-title>Workflow
                        Wizard</v-card-title>
                    <v-card-text>
                        Answer some basic questions to find out what each party needs to do in the workflow.
                    </v-card-text>
                    <v-card-actions class="pb-4"><v-btn variant="outlined" to="/wizard">Go</v-btn></v-card-actions>
                </v-card>
            </v-col>
            
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-card :color="linksColor" rounded="lg"><v-card-title>Useful Links</v-card-title>
                    <v-card-text>

                        <v-list :bg-color="linksColor">
                            <v-list-item v-for="(item, i) in listLinks" :key="i" :value="i" :href="item.url"
                                target="_blank">
                                <v-list-item-title>{{ item.text }} <v-icon icon="mdi-open-in-new"
                                        size="18"></v-icon></v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
<script setup>
import { useTheme } from 'vuetify'
import { useAppStore } from '@/stores/app'

const vTheme = useTheme()
const linksColor = computed(() => {
    if (vTheme.global.current.value.dark) {
        return 'grey-darken-4'
    }
    return 'grey-lighten-4'
})

const basicsEnabled = import.meta.env.DEV

const store = useAppStore();
const listLinks = store.linksMenu
</script>