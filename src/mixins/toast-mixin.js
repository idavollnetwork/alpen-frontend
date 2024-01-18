import IconToastOk from '@/components/icons/IconToastOk.vue';
import IconToastError from '@/components/icons/IconToastError.vue';

const ToastMixin = {
  components: { IconToastOk, IconToastError },
  methods: {
    errorToast(message) {
      this.showToast('danger', message);
    },
    successToast(message) {
      this.showToast('success', message);
    },
    infoToast(message) {
      this.showToast('info', message);
    },
    showToast(type, message) {
      const h = this.$createElement;
      const vNodesMsg = h(
        'span',
        { class: ['toast-content'] },
        [
          type === 'success' ? h('icon-toast-ok') : h('icon-toast-error'),
          message,
        ],
      );
      this.$bvToast.toast(
        [vNodesMsg],
        {
          variant: type,
          toaster: 'b-toaster-top-full',
          autoHideDelay: 2000,
        },
      );
    },
  },
};

export default ToastMixin;
