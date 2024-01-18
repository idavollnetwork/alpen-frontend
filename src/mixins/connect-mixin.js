import { SignData } from '@/common/loading-modal-data';
import web3Connector from '@/common/web3/connector';
import web3Manager from '@/common/web3/web3';
import { login } from '@/common/api/user-repository';

const ConnectMixin = {
  methods: {
    async connectWallet() {
      // 如果当前有 provider, 删除监听
      if (web3Connector.provider !== null) {
        web3Connector.provider.removeAllListeners('accountsChanged');
      }
      let loading = null;
      try {
        // 连接
        const provider = await web3Connector.connect();
        // const account = provider.selectedAddress;
        // 设置 web3manager 的 provider
        web3Manager.setupWeb3(provider);
        // 获取相关数据
        const accounts = await web3Manager.getAccounts();
        const chainId = await web3Manager.getChainId();
        const account = accounts[0].toLowerCase();
        // 签名
        loading = this.$showModal({
          type: 'metamask',
          data: SignData(),
        });
        loading.next();
        // 签名
        const { msg, sign } = await web3Manager.loginSign(account);
        const loginRes = await login({ address: account, msg, sig: sign });
        localStorage.setItem('userToken', loginRes.response.token);
        this.$store.commit('updateUserInfo', { userInfo: loginRes.response });
        loading.next();
        loading.hide();
        // this.successToast('Connect Success');
        // 这里的时机还没有监听,所以主动调用方法
        this.$store.commit('accountsChanged', { account });
        this.$store.commit('chainChanged', { chainId });
        // 监听
        this.subscribe({
          provider,
          accountsChanged: this.accountsChanged,
          chainChanged: this.chainChanged,
          connected: this.connected,
          disconnect: this.didDisconnect,
        });
      } catch (e) {
        if (loading !== null) {
          loading.hide();
        }
        if (e) {
          let msg = e.message;
          if (typeof e === 'string') {
            msg = e;
          }
          this.errorToast(msg);
        }
      }
    },
    didDisconnect() {
      this.$store.commit('accountsChanged', { account: '' });
      web3Connector.web3Modal.clearCachedProvider();
    },
    disconnect() {
      web3Connector.disconnect();
      this.$store.commit('accountsChanged', { account: '' });
    },
    // 主动连接的操作不会触发这里的监听, 只有切换账号的时候会调用
    async accountsChanged(accounts) {
      if (accounts.length > 0) {
        const loading = this.$showModal({
          type: 'metamask',
          data: SignData(),
        });
        try {
          const account = accounts[0].toLowerCase();
          loading.next();
          const { msg, sign } = await web3Manager.loginSign(account);
          const loginRes = await login({ address: account, msg, sig: sign });
          localStorage.setItem('userToken', loginRes.response.token);
          this.$store.commit('updateUserInfo', { userInfo: loginRes.response });
          const chainId = await web3Manager.getChainId();
          this.$store.commit('accountsChanged', { account });
          this.$store.commit('chainChanged', { chainId });
          loading.next();
          loading.hide();
          // this.successToast('Connect Success');
        } catch (e) {
          loading.hide();
          this.errorToast(e.message);
        }
      } else {
        this.$store.commit('accountsChanged', { account: '' });
        web3Connector.disconnect();
      }
    },
    chainChanged(chainId) {
      console.log('chainChanged', chainId);
      this.$store.commit('chainChanged', { chainId });
    },
    connected() {
      window.console.log('connected');
    },
    removeSubscription(provider) {
      provider.removeAllListeners('connect');
      provider.removeAllListeners('accountsChanged');
      provider.removeAllListeners('chainChanged');
    },

    subscribe({
      provider, accountsChanged, chainChanged, connected, disconnect,
    }) {
      if (provider.listeners('accountsChanged').length > 0) {
        this.removeSubscription(provider);
      }
      provider.on('accountsChanged', accountsChanged);
      provider.on('chainChanged', chainChanged);
      provider.on('connect', connected);
      provider.on('disconnect', disconnect);
    },
  },
};

export default ConnectMixin;
