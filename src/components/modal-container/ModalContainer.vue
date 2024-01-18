<template>
  <b-modal
    hide-header
    hide-footer
    centered
    id="metamask-modal"
    v-model="showMetamaskModal"
    modal-class="metamask-loading-modal"
    body-class="metamask-loading-modal-body"
    content-class="metamask-loading-modal-content"
    dialog-class="metamask-loading-modal-dialog"
    :no-close-on-backdrop="true"
    :no-close-on-esc="true"
  >
    <div
      class="metamask-modal-content"
      v-if="showUI"
      ref="content"
    >
      <span class="modal-title">
        {{ configureData.title }}
      </span>
      <span class="modal-subtitle">
        {{configureData.subtitle}}
      </span>
      <div
        class="step-item d-flex align-items-center justify-content-start"
        v-for="(item, index) in configureData.steps"
        :key="index"
      >
        <CircleSpinner
          v-if="showUI"
          ref="loading"
          class="loading-circle"
        />
        <span class="d-flex flex-column align-items-start justify-content-start title-item">
          <span class="step-title">{{ item.title }}</span>
          <span class="step-subtitle">{{ item.subtitle }}</span>
        </span>

      </div>
    </div>
  </b-modal>
</template>

<script>
import CircleSpinner from '@/components/circle-spinner/index.vue';

export default {
  name: 'ModalContainer',
  components: { CircleSpinner },
  data() {
    return {
      showMetamaskModal: false,
      showUI: false,
      type: '',
      configureData: {
      },
    };
  },
  methods: {
    showModal() {
      this.showMetamaskModal = true;
      this.showUI = true;
    },
    next() {
      this.$nextTick(() => {
        for (let i = 0; i < this.configureData.steps.length; i += 1) {
          const item = this.configureData.steps[i];
          if (item.state < 2) {
            this.changeState({ index: i, state: item.state + 1 });
            if (item.state + 1 === 2 && i < this.configureData.steps.length - 1) {
              this.changeState({ index: i + 1, state: 1 });
            }
            break;
          }
        }
      });
    },
    changeState({ index, state }) {
      this.$nextTick(() => {
        if (this.configureData.steps.length <= index) {
          return;
        }
        this.configureData.steps[index].state = state;
        const loading = this.$refs.loading[index];
        switch (state) {
          case 0:
            break;
          case 1:
            loading.start();
            break;
          case 2:
            loading.complete();
            break;
          default:
            loading.reset();
            break;
        }
      });
    },
    reset() {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < this.configureData.steps.length; i++) {
        this.changeState({ index: i, state: 0 });
      }
    },
    hide() {
      setTimeout(() => {
        this.showMetamaskModal = false;
        setTimeout(() => {
          this.showUI = false;
          this.reset();
          this.$destroy();
        }, 250);
      }, 1000);
    },
  },
};
</script>

<style scoped lang="scss">

.metamask-modal-content {
  background-color: transparent;
  width: 100%;
  padding: 5.33vw 3.33vw;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  @include media-breakpoint-up(md) {
    width: calc(100%);
    padding: 35px 40px;
  }
  .modal-title {
    font-size: 4vw;
    @include FontB;
    font-weight: 600;
    color: #000000;
    @include media-breakpoint-up(md) {
      font-size: 30px;
    }
  }
  .modal-subtitle {
    @include FontR;
    font-size: 16px;
    font-weight: 400;
    color: #000000;
    line-height: 22px;
    margin: 22px 0 0 0;
  }

  .step-item {
    width: 100%;
    margin-top: 5.33vw;
    @include media-breakpoint-up(md) {
      margin-top: 41px;
    }
    .title-item {
      max-width: 45vw;
      margin: 0 0 0 6.4vw;
      @include media-breakpoint-up(md) {
        margin: 0 0 0 24px;
      }
    }
  }

  .step-item-margin {
    margin-top: 5.33vw;
    @include media-breakpoint-up(md) {
      margin-top: 60px;
    }
  }

  .step-title {
    @include FontM;
    font-size: 3.2vw;
    font-weight: 500;
    color: #000000;
    opacity: 0.6;
    @include media-breakpoint-up(md) {
      font-size: 16px;
    }
  }

  .step-subtitle {
    @include FontR;
    font-size: 3.2vw;
    font-weight: 400;
    color: #000000;
    opacity: 0.3;
    @include media-breakpoint-up(md) {
      font-size: 14px;
    }
  }

  .step-state-text {
    @include FontM;
    font-size: 3.2vw;
    font-weight: 500;
    color: #FFFFFF;
    background-color: transparent !important;
    border: none !important;
    box-shadow: none !important;
    margin-right: 8.53vw;
    @include media-breakpoint-up(md) {
      margin-right: 52px;
    }
    &.wait {
      opacity: 0.6;
    }
    &.loading {
      opacity: 0.6;
    }
    &.success {
      opacity: 1;
    }
    @include media-breakpoint-up(md) {
      font-size: 14px;
    }
  }
  .loading-circle {
    width: 5.07vw;
    height: 5.07vw;
    @include media-breakpoint-up(md) {
      width: 40px;
      height: 40px;
    }
  }
}

</style>
