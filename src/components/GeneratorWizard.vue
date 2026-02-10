<template>
  <v-sheet class="pa-3">
    <div>
      <div class="text-h6 mb-4">Generator Obligations</div>

      <v-radio-group v-model="selectedFedHaz">
        <template #label><span class="text-wrap">Does your site generate federally-regulated RCRA hazardous waste?</span></template>
        <v-radio label="Yes" value="yes" />
        <v-radio label="No" value="no" />
      </v-radio-group>

      <waste-codes />

      <v-radio-group v-if="selectedFedHaz === 'yes'" v-model="selectedGeneratorMonthly" class="mt-6">
        <template #label><span class="text-wrap">How much waste is generated at your site on a monthly basis?</span></template>
        <v-radio
          v-for="(option,key) in genRadioButtons"
          :key="key"
          :label="option"
          :value="key"
        />
      </v-radio-group>

      <v-alert v-if="selectedFedHaz === 'no'" class="mt-8" type="info" variant="tonal">
        Site is not subject to federal RCRA requirements. Please verify if your site generates any <a
          href="https://www.epa.gov/e-manifest/state-only-hazardous-waste-subject-resource-conservation-and-recovery-act-manifests"
          target="_blank"
        >
          state-only regulated waste subject to RCRA requirements <v-icon
            icon="mdi-open-in-new"
            size="18"
          /></a> and follow applicable regulatory requirements.</v-alert>

      <div v-if="selectedFedHaz === 'yes' && selectedGeneratorMonthly">
        <v-table density="comfortable">
          <thead>
            <tr>
              <th class="text-left">Requirement</th>
              <th v-for="cat in categories" :key="cat.key" class="text-center">
                {{ cat.shortName }} <v-chip
                  v-if="cat.key && cat.key === selectedGeneratorMonthly"
                >Selected</v-chip>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in requirementRows" :key="row.key">
              <td class="font-weight-medium">
                {{ row.label }}
              </td>

              <td
                v-for="cat in categories"
                :key="cat.key"
                :class="cat.key && cat.key === selectedGeneratorMonthly ? 'bg-grey-lighten-3 text-center' : 'text-center'"
              >
                <v-chip
                  :color="genCategories[cat.key][row.key] ? 'success' : 'error'"
                  label
                  :prepend-icon="genCategories[cat.key][row.key] ? 'mdi-check-circle' : 'mdi-close-circle'"
                  size="small"
                  :variant="genCategories[cat.key][row.key] ? 'tonal' : 'outlined'"
                >
                  {{ genCategories[cat.key][row.key] ? 'Yes' : 'No' }}
                </v-chip>
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>

    </div>
    <div class="mt-8">
      <v-card>
        <v-card-title>EPA ID Number Lookup</v-card-title>
        <v-form class="mx-6" @submit.prevent="onSearch">
          <v-text-field
            v-model="epaId"
            class="epa-id-field"
            clearable
            density="comfortable"
            :error="!!error"
            :error-messages="error ? [error] : []"
            label="EPA ID Number"
            variant="outlined"
            @keyup.enter="onSearch"
          >
            <template #append-inner>
              <v-btn
                color="primary"
                :disabled="!epaId || loading"
                :loading="loading"
                size="small"
                variant="flat"
                @click="onSearch"
              >
                Search
              </v-btn>
            </template>
          </v-text-field>
        </v-form>
      </v-card>

      <v-card v-if="result" class="mt-4">
        <v-card-title class="d-flex align-center">
          <div class="flex-grow-1">
            {{ result.handlerName || 'Unknown site name' }}
          </div>
          <v-chip
            v-if="result.activeSite"
            class="ml-2"
            color="success"
            label
            size="small"
          >
            Active Site
          </v-chip>
        </v-card-title>

        <v-card-subtitle>
          {{ result.handlerId }}
        </v-card-subtitle>
        <v-card-text>

          <div v-if="hasAddress" class="mb-2">
            <strong>Address:</strong>
            {{ result.locationAddress }}
          </div>

          <div v-if="generatorCategory" class="mb-2">
            <strong>Generator Category:</strong>
            <v-chip class="ml-2" color="primary" label size="small">
              {{ generatorCategory }}
            </v-chip>
          </div>

          <div v-if="roles.length > 0">
            <strong>Roles:</strong>
            <div class="mt-2">
              <v-chip
                v-for="role in roles"
                :key="role"
                class="mr-2 mb-2"
                color="blue"
                label
                size="small"
              >
                {{ role }}
              </v-chip>
            </div>
          </div>

          <!-- Optional: keep raw JSON for debugging -->

          <!-- <div class="mt-4">
                        <strong>Raw response:</strong>
                        <pre class="text-body-2" style="white-space: pre-wrap">{{ prettyJson }}</pre>
                    </div>-->

        </v-card-text>
      </v-card>
    </div>
  </v-sheet>
</template>
<script setup>
  import { computed, ref } from 'vue'
  import WasteCodes from './WasteCodes.vue'

  const epaId = ref('')
  const loading = ref(false)
  const error = ref('')
  const result = ref(null)
  const selectedFedHaz = ref(null)
  const selectedGeneratorMonthly = ref(null)

  function reset () {
    // clear all your question state here
    selectedFedHaz.value = null
    selectedGeneratorMonthly.value = null
    // ...other refs to null/empty, etc.
  }

  defineExpose({ reset })

  const genRadioButtons = {
    vsqg: '100 kilograms or less of hazardous waste or 1 kilogram or less of acutely hazardous waste',
    sqg: 'More than 100 kilograms, but less than 1,000 kilograms',
    lqg: 'More than 1,000 kilograms or more than one kilogram of acutely hazardous waste',
  }

  const genCategories = {
    vsqg: {
      fullName: 'Very Small Quantity Generators',
      shortName: 'VSQGs',
      registerId: false,
      registerUser: false,
      registerElectronic: true,
    },
    sqg: {
      fullName: 'Small Quantity Generators',
      shortName: 'SQGs',
      registerId: true,
      registerUser: true,
      registerElectronic: true,
    },
    lqg: {
      fullName: 'Large Quantity Generators',
      shortName: 'LQGs',
      registerId: true,
      registerUser: true,
      registerElectronic: true,
    },
  }

  const genRequirements = {
    registerId: 'Required to obtain an EPA ID Number',
    registerUser: 'Required for user to register for an account',
    registerElectronic: 'Required to have a registered user to use Electronic',
  }

  // Columns from categories
  const categories = computed(() =>
    Object.entries(genCategories).map(([key, cat]) => ({ key, ...cat })),
  )

  // Rows from requirements
  const requirementRows = computed(() =>
    Object.entries(genRequirements).map(([key, label]) => ({ key, label })),
  )

  const formattedId = computed(() =>
    epaId.value.trim().toUpperCase().replace(/\s+/g, ''),
  )

  const hasAddress = computed(() =>
    result.value
    && result.value.locationAddress !== null,
  )

  const generatorCategory = computed(() => {
    if (!result.value) return null
    if (result.value.largeQuantityGenerator) return 'LQG'
    if (result.value.smallQuantityGenerator) return 'SQG'
    if (result.value.verySmallQuantityGenerator) return 'VSQG'
    return null
  })

  const roles = computed(() => {
    const r = result.value
    if (!r) return []
    const out = []
    if (r.operatingTsdf) out.push('TSDF')
    if (r.transporter) out.push('Transporter')
    if (r.transferFacility) out.push('Transfer Facility')
    if (r.hwCleanupSite) out.push('Cleanup Site')
    return out
  })

  // Optional: for debugging
  const prettyJson = computed(() =>
    result.value ? JSON.stringify(result.value, null, 2) : '',
  )

  async function onSearch () {
    error.value = ''
    result.value = null

    const id = formattedId.value
    if (!id) {
      error.value = 'Please enter an EPA ID Number.'
      return
    }

    const url = `https://rcrapublic.epa.gov/rcra-hwip/api/site/summary/${encodeURIComponent(id)}`
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10_000)

    loading.value = true
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      })

      if (!res.ok) {
        if (res.status === 404) throw new Error('No site found for that EPA ID.')
        throw new Error(`Lookup failed (${res.status})`)
      }

      const data = await res.json()
      // Service returns an object for site summary; keep array handling just in case
      result.value = Array.isArray(data) ? (data[0] ?? null) : data

      if (!result.value) {
        error.value = 'No site found for that EPA ID.'
      }
    } catch (error_) {
      error.value = error_.name === 'AbortError'
        ? 'Request timed out. Please try again.'
        : (error_.message || 'Lookup failed. Please try again.')
    } finally {
      clearTimeout(timeout)
      loading.value = false
    }
  }
</script>

<style scoped>
a:link,
a:visited {
    color: inherit !important
}
/**508 fix on epa id field */
.epa-id-field :deep(.v-field-label),
.epa-id-field :deep(.v-label) {
  color: rgb(var(--v-theme-on-surface)) !important;
  opacity: .6 !important;  
}
</style>
