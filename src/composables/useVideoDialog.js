import { ref } from 'vue'

const isOpen = ref(false)
const videoUrl = ref(null)
const isLoading = ref(true)

function open (url) {
  videoUrl.value = url
  isOpen.value = true
}

function close () {
  isOpen.value = false
  videoUrl.value = null
  isLoading.value = true
}

export function useVideoDialog () {
  return { isOpen, videoUrl, open, close }
}
