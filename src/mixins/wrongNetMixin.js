const WrongNetMixin = {
  data() {
    return {
      currentNet: 'Ethereum',
    };
  },
  computed: {
    shouldCheckNet() {
      // 只有创建提案和投票需要检查
      return this.$route.path === '/proposal-detail' || this.$route.path === '/initiate-proposal';
    },
    isWrongNet() {
      const envChainId = this.currentNet === 'Ethereum' ? process.env.VUE_APP_ETH_CHAIN_ID
        : process.env.VUE_APP_CHAIN_ID;
      const envChainIdInt = this.currentNet === 'Ethereum' ? process.env.VUE_APP_ETH_CHAIN_ID_INT
        : process.env.VUE_APP_CHAIN_ID_INT;
      const { chainId } = this.$store.state.connect;
      return (`${chainId}` !== `${envChainIdInt}`)
        && (`${chainId}` !== `${envChainId}`);
    },
  },
};

export default WrongNetMixin;
