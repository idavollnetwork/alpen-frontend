<template>
  <b-modal
           v-model="showModal" hide-footer hide-header centered>
    <div class="modal-container">
      <div class="title-cont d-flex align-items-center justify-content-between">
        <div id="title">Add image</div>
        <img class="title-img" src="@/assets/delete_model.png" alt="" @click="tapCancel">
      </div>
      <b-img
        :src="picUrl"></b-img>
      <b-form-input
        :placeholder="$t('image_url')"
        v-model="src"
        :state="isUrl"
      ></b-form-input>
      <b-form-input
        v-model="name"
        :placeholder="$t('image_name')"
      >
      </b-form-input>
      <b-button class="confirm-button"
                variant="primary"
                pill
                :disabled="!canConfirm"
                @click="tapConfirm">{{ $t('v11.confirm') }}</b-button>
    </div>
  </b-modal>
</template>

<script>
export default {
  name: 'image-input-modal',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      src: '',
      name: '',
    };
  },
  computed: {
    showModal: {
      get() {
        return this.value;
      },
      set() {
        this.$emit('input', false);
      },
    },
    isUrl() {
      return /^(https?:\/\/(([a-zA-Z0-9]+-?)+[a-zA-Z0-9]+\.)+[a-zA-Z]+)(:\d+)?(\/.*)?(\?.*)?(#.*)?$/.test(this.src);
    },
    picUrl() {
      return this.isUrl ? this.src : '';
    },
    canConfirm() {
      return this.src.length > 0 && this.isUrl;
    },
  },
  methods: {
    input(value) {
      this.$emit('input', value);
    },
    tapConfirm() {
      this.input(false);
      this.$emit('didadd', {
        src: this.src, name: this.name,
      });
    },
    tapCancel() {
      this.input(false);
    },
  },
  watch: {
    showModal(newVal) {
      if (newVal) {
        this.src = '';
        this.name = '';
      }
    },
  },
};
</script>

<style scoped lang="scss">
.modal-container {
  padding: 35px 32px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  grid-gap: 20px;

  #title {
    font-size: 24px;
    font-weight: 500;
    color: #000000;
    line-height: 33px;
  }
  .title-img {
    cursor: pointer;
  }
  #loading {
    width: 84px;
    height: 84px;
    margin: 30px 0 0 0;
  }

  #button {
    height: 48px;
    margin: 40px 0 0 0;
    width: 100%;
  }
}
</style>
