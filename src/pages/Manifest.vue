<template>
  <div class="mt-12 d-flex align-center justify-center">
    <div class="text-h5 mr-2">Manifest Form Workflow </div>
    <tooltip tip-location="workflowHeading" type="info" />
  </div>
  <!--status bar-->
  <status-bar />

  <!--main content-->
  <v-sheet class="mx-2 mx-md-12 my-3 pa-0" :elevation="1">
    <v-container class="ma-0 pa-4">
      <v-row>
        <v-col cols="12" md="4">
          <label-field
            name="mtn"
            :tooltip-info="{ tipLocation: 'mtn', type: 'info' }"
            type="text"
          />
        </v-col>
        <v-col cols="12" md="4">
          <label-field name="erPhone" type="text" />
        </v-col>
      </v-row>
    </v-container>
    <v-divider />
    <v-container class="ma-0 pa-4">
      <h2 class="my-2">1-5. Generator Information</h2>
      <v-row>
        <v-col cols="12" md="4">
          <label-field name="generator.epaId" type="text" />
        </v-col>
        <v-col cols="12" md="4">
          <label-field name="generator.name" type="text" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="4">
          <label-field name="generator.mailingAddress" type="textarea" />
        </v-col>
        <v-col cols="12" md="4">
          <label-field name="generator.siteAddress" type="textarea" />
        </v-col>

        <v-col cols="12" md="4">
          <label-field name="generator.phone" type="text" />
        </v-col>
      </v-row>
    </v-container>
    <v-divider />
    <v-container class="ma-0 pa-4">
      <div class="d-flex align-center">
        <h2 class="my-2">6-7. Transporter Information</h2>
        <label-required status="Scheduled" />
        <tooltip class="ml-2" tip-location="transporters" type="info" />
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
    <v-divider />
    <v-container class="ma-0 pa-4">
      <div class="d-flex align-center">
        <h2 class="my-2">8. Designated Facility Information</h2>
        <tooltip status="TSig" tip-location="tsdfWarning" type="warning" />
      </div>
      <v-row>
        <v-col cols="12" md="4">
          <label-field name="tsdf.epaId" type="text" />
        </v-col>
        <v-col cols="12" md="4">
          <label-field name="tsdf.name" type="text" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="4">
          <label-field name="tsdf.siteAddress" type="textarea" />
        </v-col>

        <v-col cols="12" md="4">
          <label-field name="tsdf.phone" type="text" />
        </v-col>
      </v-row>
    </v-container>
    <v-divider />
    <v-container class="ma-0 pa-4" fluid>
      <div class="d-flex align-center">
        <h2 class="my-2">9-13. Waste Information </h2>
        <tooltip tip-location="waste" type="info" />
        <tooltip status="TSig" tip-location="wasteWarning" type="warning" />
      </div>
      <!--waste table-->
      <waste-info />
    </v-container>
    <v-divider />
    <v-container class="ma-0 pa-4">
      <div class="d-flex align-center">
        <h2 class="my-2">15. Generator Signature Information </h2>
        <tooltip tip-location="generator" type="info" />
      </div>
      <v-row>
        <v-col cols="12" md="4">
          <label-field name="generator.signature.name" type="text" />
        </v-col>
        <v-col cols="12" md="4">
          <label-field name="generator.signature.date" type="text" />
        </v-col>
      </v-row>
    </v-container>
    <v-divider />
    <v-container class="ma-0 pa-4">
      <h2 class="my-2">17. Transporter Acknowledgment of Receipt of Materials </h2>
      <v-row>
        <v-col cols="12" md="4">
          <label-field name="transporter.signature.name" type="text" />
        </v-col>
        <v-col cols="12" md="4">
          <label-field name="transporter.signature.date" type="text" />
        </v-col>
      </v-row>
    </v-container>
    <v-divider />
    <v-container class="ma-0 pa-4">
      <h2 class="my-2"> 18. Discrepancy, Residue and Rejection Information </h2>
      <v-row>
        <v-col cols="12">
          Discrepancy, residue and rejection information is not currently covered on this page.
        </v-col>
      </v-row>
    </v-container>
    <v-divider />
    <v-container class="ma-0 pa-4">
      <h2 class="my-2">19. Hazardous Waste Management Method Codes </h2>
      <v-row> <v-col cols="6" md="3">
                <label-field name="managemementMethod1" type="text" />
              </v-col>
        <v-col cols="6" md="3">
          <label-field name="managemementMethod2" type="text" />
        </v-col>
        <v-col cols="6" md="3">
          <label-field name="managemementMethod3" type="text" />
        </v-col>
        <v-col cols="6" md="3">
          <label-field name="managemementMethod4" type="text" />
        </v-col>
      </v-row>
    </v-container>
    <v-divider />
    <v-container class="ma-0 pa-4">
      <h2 class="my-2">20. Designated Facility Owner or Operator </h2>
      <v-row>
        <v-col cols="12" md="4">
          <label-field name="tsdf.signature.name" type="text" />
        </v-col>
        <v-col cols="12" md="4">
          <label-field name="tsdf.signature.date" type="text" />
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>
<script setup>
  import { ref } from 'vue'

  import { onBeforeRouteLeave } from 'vue-router'
  import { useAppStore } from '@/stores/app'

  import LabelField from '../components/LabelField.vue'
  import LabelRequired from '../components/LabelRequired.vue'
  import StatusBar from '../components/StatusBar.vue'
  import Tooltip from '../components/Tooltip.vue'
  import WasteInfo from '../components/WasteInfo.vue'

  const store = useAppStore()

  onBeforeRouteLeave(() => {
    store.resetSteps()
  })

  const addedTransporters = [{ order: 1, epaId: 'NCD123456789', name: 'Test Transporter Company' }, { order: 2, epaId: 'NCD311567890', name: 'Test Hauling Co' }]

  const transporters = ref(addedTransporters)

</script>
