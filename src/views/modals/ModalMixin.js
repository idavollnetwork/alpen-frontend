const ModalMixin = {
  data() {
    return {
      showModal: false,
    };
  },
  methods: {
    show() {
      if (this.reset) {
        this.reset();
      }
      this.showModal = true;
      if (this.didShow) {
        this.didShow();
      }
    },
    hide() {
      this.showModal = false;
    },
  },
};

export default ModalMixin;
