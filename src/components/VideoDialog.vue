<template>
  <v-dialog v-model="isOpen" max-width="700">
    <v-card title="Demonstration Video">
      <v-card-text>
        <div class="video-container">
          <v-progress-circular
            v-if="isLoading"
            class="video-spinner"
            color="primary"
            indeterminate
            size="64"
          />
          <iframe
            v-show="!isLoading"
             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            class="video-iframe"
            frameborder="0"
            height="315"
             allowfullscreen
            referrerpolicy="strict-origin-when-cross-origin"
            :src="videoUrl"
            title="YouTube video player"
            width="560"
            @load="onIframeLoad"
          />
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text="Close" @click="close" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
  import { useVideoDialog } from '@/composables/useVideoDialog'

  const { isOpen, videoUrl, close } = useVideoDialog()

  const isLoading = ref(false)

  watch([videoUrl, isOpen], ([url, open]) => {
    isLoading.value = !!url && !!open
  })

  function onIframeLoad () {
    isLoading.value = false
  }
</script>

<style>
.video-container {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  /* 16:9 Aspect Ratio */
  /* Add a background color to the container which will be visible until the iframe loads */
  background-color: #f0f0f0;
}

.video-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.video-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}
</style>
