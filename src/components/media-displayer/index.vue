<template>
  <div class="media-shower">
    <div
      v-if="type === 'img'"
      class="img-container"
    >
      <b-img-lazy
        :src="src"
        class="img"
        :class="{contain: aspect === 'contain'}"
      />
    </div>
    <div
      v-if="type === 'video'"
      class="video-container"
    >
      <video
        ref="video"
        @mouseover="mouseOver"
        @mouseleave="mouseLeave"
        :src="src"
        class="video"
        :class="{contain: aspect === 'contain'}"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'MediaDisplayer',
  props: {
    type: {
      type: String,
      default: 'img',
    },
    src: {
      type: String,
      default: '',
    },
    aspect: {
      type: String,
      default: 'contain',
    },
  },
  methods: {
    mouseOver() {
      this.$refs.video.muted = true;
      this.$refs.video.play();
    },
    mouseLeave() {
      setTimeout(() => {
        this.$refs.video.pause();
      }, 150);
    },
  },
};
</script>

<style scoped lang="scss">
.media-shower {
  overflow: hidden;
  .img-container {
    width: 100%;
    height: 100%;
    .img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .video-container {
    width: 100%;
    height: 100%;
    .video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .contain {
    object-fit: contain;
  }
}
</style>
