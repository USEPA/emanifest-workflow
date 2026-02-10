<template>
  <v-data-table
    v-if="mobile"
    :headers="headers"
    hide-default-footer
    item-key="line"
    :items="wastes"
  >
    <template v-for="header in headers" :key="header.key" #[`header.${header.key}`]="{ column }">
      <span>{{ column.title }}</span>
      <v-icon
        v-if="required(header.key)"
        class="pl-2 pb-2"
        color="red"
        icon="mdi-asterisk"
        size="x-small"
      />
    </template>
    <template #item.description="{ item, index }">
      <v-textarea
        v-model="item.description"
        :aria-describedby="undefined"
        :aria-label="labelValue('description', index)"
        no-resize="true"
        readonly
        rows="2"
        variant="solo-filled"
      />
    </template>
    <template #item.containerNumber="{ item, index }">
      <v-text-field
        v-model="item.containerNumber"
        :aria-describedby="undefined"
        :aria-label="labelValue('containerNumber', index)"
        readonly
        variant="solo-filled"
      />
    </template>
    <template #item.containerType="{ item, index }">
      <v-text-field
        v-model="item.containerType"
        :aria-describedby="undefined"
        :aria-label="labelValue('containerType', index)"
        readonly
        variant="solo-filled"
      />
    </template>
    <template #item.quantity="{ item, index }">
      <v-text-field
        v-model="item.quantity"
        :aria-describedby="undefined"
        :aria-label="labelValue('quantity', index)"
        readonly
        variant="solo-filled"
      />
    </template>
    <template #item.uom="{ item, index }">
      <v-text-field
        v-model="item.uom"
        :aria-describedby="undefined"
        :aria-label="labelValue('uom', index)"
        readonly
        variant="solo-filled"
      />
    </template>
    <template #item.wasteCodes="{ item, index }">
      <v-textarea
        v-model="item.wasteCodes"
        :aria-describedby="undefined"
        :aria-label="labelValue('wasteCodes', index)"
        no-resize="true"
        readonly
        rows="2"
        variant="solo-filled"
      />
    </template>
  </v-data-table>
  <v-row v-else>
    <v-col v-for="(item, index) in wastes" :key="index" cols="12">
      <v-card>
        <v-card-text>
          <div v-for="header in headers" :key="header.key">
            <div v-if="header.key == 'line'">Line {{ item[header.key] }}</div>
            <div v-else>
              <label-field
                :name="`waste.${header.key}`"
                :over-ride-value="item[header.key]"
                type="text"
              />
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script setup>
  import { computed, watch } from 'vue'
  import { useDisplay } from 'vuetify'

  import { useAppStore } from '@/stores/app'
  const { mdAndUp } = useDisplay()
  const mobile = mdAndUp
  const store = useAppStore()

  const headers = [
    { title: 'Line', key: 'line' },
    { title: '9a HM', key: 'haz' },
    { title: '9b. U.S. DOT Description', key: 'description' },
    { title: 'Container Number', key: 'containerNumber' },
    { title: 'Container Type', key: 'containerType' },
    { title: 'Total Quantity', key: 'quantity' },
    { title: 'Unit Of Measure', key: 'uom' },
    { title: 'Waste Codes', key: 'wasteCodes' },
  ]

  function labelValue (key, index) {
    const header = headers.find(item => item.key === key)
    return header ? `${header.title} - ${index + 1}` : null
  }

  const addedWastes = [{ line: 1, haz: 'X', description: 'UN1993 Waste', containerNumber: '0', containerType: 'DM', quantity: '0', uom: 'G', wasteCodes: ['D001', 'D002'] },
                       { line: 2, haz: 'X', description: 'UN1993 Waste', containerNumber: '0', containerType: 'DM', quantity: '0', uom: 'G', wasteCodes: ['D001', 'D002'] },
  ]
  const wastes = reactive(addedWastes)

  function required (name) {
    const field = store.lookupField(`waste.${name}`)
    if (field.optional) {
      return false
    }
    return store.lookupStatusId(field.required) <= store.currentStep + 1
  }

  // popualates the waste container and quantity values at scheduled
  const currentStep = computed(() => store.currentStep)
  watch(currentStep, () => {
    if (currentStep.value >= store.lookupStatusId('Scheduled')) {
      wastes[0].containerNumber = '4'
      wastes[0].quantity = '200'
      wastes[1].containerNumber = '3'
      wastes[1].quantity = '150'
    } else {
      wastes[0].containerNumber = '0'
      wastes[0].quantity = '0'
      wastes[1].containerNumber = '0'
      wastes[1].quantity = '0'
    }
  })

</script>
