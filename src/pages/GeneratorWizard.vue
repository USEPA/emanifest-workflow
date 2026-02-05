<template>
    <v-container class="py-12">
        <v-row justify="center">
            <v-col cols="12" md="8" lg="7">
                <generator-wizard></generator-wizard>
            </v-col>
        </v-row>
    </v-container>

</template>
<script setup>
import GeneratorWizard from '@/components/GeneratorWizard.vue';
</script>