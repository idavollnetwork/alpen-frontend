const InitProposalImageMixin = {
  data() {
    return {
      images: [
        { name: '', src: '' },
      ],
      showPicInputModal: false,
    };
  },
  computed: {
  },
  methods: {
    imagesToUpload() {
      const arr = [];
      this.images.forEach((item) => {
        if (item.src.length > 0) {
          arr.push(item);
        }
      });
      return arr;
    },
    didAddImage(source) {
      const arr = [...this.images];
      if (arr.length >= 5) {
        arr.splice(4, 1, source);
      } else {
        arr.splice(arr.length - 1, 0, source);
      }
      this.images = arr;
    },
    tapAddImage() {
      this.showPicInputModal = true;
    },
    tapDeleteImage(index) {
      const arr = [...this.images];
      arr.splice(index, 1);
      if (arr.length < 5 && arr[arr.length - 1].src.length > 0) {
        arr.push({ name: '', src: '' });
      }
      this.images = arr;
    },
  },
};

export default InitProposalImageMixin;
