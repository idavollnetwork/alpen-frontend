import { mapState } from 'vuex';

const LoginStateMixin = {
  computed: {
    ...mapState({
      loginAddress: (state) => state.connect.address,
    }),
  },
  watch: {
    loginAddress() {
      if (this.currentPage !== undefined) {
        this.currentPage = 1;
      }
      if (this.addressChanged !== undefined) {
        this.addressChanged();
      }
    },
  },
};

export default LoginStateMixin;
