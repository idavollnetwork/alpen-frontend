import Vue from 'vue';

const ConnectModule = {
  state: {
    isConnected: false,
    address: '',
    chainId: 0,
    shouldConnect: false,
    userInfo: {},
  },
  mutations: {
    accountsChanged(state, { account }) {
      localStorage.setItem('address', account);
      if (account.length > 0) {
        state.isConnected = true;
        state.address = account;
      } else {
        state.isConnected = false;
        state.address = '';
      }
    },
    updateUserInfo(state, { userInfo }) {
      Object.keys(userInfo).forEach((key) => {
        Vue.set(state.userInfo, key, userInfo[key]);
      });
    },
    chainChanged(state, { chainId }) {
      state.chainId = chainId;
    },
    connect(state, { should }) {
      state.shouldConnect = should;
    },
  },
};

export default ConnectModule;
