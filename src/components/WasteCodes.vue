<template>
  <v-btn color="primary" @click="wasteCodesOpen = true" tonal>
   <v-icon icon="mdi-format-list-bulleted"></v-icon>  Browse Federal Waste Codes
  </v-btn>

  <v-dialog
    v-model="wasteCodesOpen"
    :fullscreen="smAndDown"
    max-width="1000"
    scrollable
  >
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between">
        <span>Waste Codes</span>
        <v-btn icon="mdi-close" variant="text" @click="wasteCodesOpen = false" />
      </v-card-title>

      <v-divider />

      <v-card-text>
        <div class="d-flex align-center ga-2 mb-2">
          <v-text-field
            v-model="search"
            label="Search codes/descriptions"
            clearable
            prepend-inner-icon="mdi-magnify"
            hide-details
            style="max-width: 340px"
          />
        </div>

        <v-data-table
          :headers="headers"
          :items="filteredItems"
          :loading="loading"
          item-key="id"
          density="compact"
          fixed-header
          height="60vh"
          class="border-t"
        >
          <template #loading>
            <div class="pa-6 text-medium-emphasis">Loading waste codes…</div>
          </template>
        </v-data-table>

        <v-alert
          v-if="error"
          type="error"
          variant="tonal"
          class="mt-3"
          border="start"
          border-color="error"
        >
          {{ error }}
        </v-alert>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useDisplay } from 'vuetify'

const { smAndDown } = useDisplay()

const wasteCodesOpen = ref(false)
const location = ref('HQ')
const items = ref([])
const loading = ref(false)
const error = ref('')
const search = ref('')

const headers = [
  { title: 'Code', key: 'code', sortable: true },
  { title: 'Description', key: 'description', sortable: true, width: '100%' },
]

const filteredItems = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return items.value
  return items.value.filter(r =>
    String(r.code).toLowerCase().includes(q) ||
    String(r.description).toLowerCase().includes(q) ||
    String(r.label || '').toLowerCase().includes(q)
  )
})

async function fetchWasteCodes() {
  loading.value = true
  error.value = ''
  try {
    const url = `https://rcrapublic.epa.gov/rcra-hwip/api/lookup/waste-codes/${encodeURIComponent(location.value)}`
    const res = await fetch(url, { headers: { Accept: 'application/json' } })
    if (!res.ok) throw new Error(`Failed to load waste codes (${res.status})`)
    const data = await res.json()
    items.value = Array.isArray(data) ? data : []
  } catch (e) {
    error.value = e?.message || 'Failed to load waste codes.'
  } finally {
    loading.value = false
  }
}

// Fetch when dialog opens; clear search on close
watch(wasteCodesOpen, (open) => {
  if (open) fetchWasteCodes()
  else search.value = ''
})
</script>