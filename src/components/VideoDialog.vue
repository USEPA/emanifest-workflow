<template>
    <v-dialog max-width="700" v-model="isOpen">
        <v-card title="Demonstration Video">
            <v-card-text>
                <div class="video-container">
                    <v-progress-circular v-if="isLoading" indeterminate color="primary" size="64"
                        class="video-spinner"></v-progress-circular>
                    <iframe v-show="!isLoading" @load="onIframeLoad" class="video-iframe" width="560" height="315"
                        :src="videoUrl" title="YouTube video player" frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                </div>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text="Close" @click="close"></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
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

<script setup>
import { useVideoDialog } from '@/composables/useVideoDialog'

const { isOpen, videoUrl, close } = useVideoDialog()

const isLoading = ref(false)

watch([videoUrl, isOpen], ([url, open]) => {
  isLoading.value = !!url && !!open
})

function onIframeLoad() {
  isLoading.value = false
}
</script>