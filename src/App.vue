<template>
  <div id="app">
    <ApHeader id="app-header"></ApHeader>
    <search-result-page v-if="$store.state.search.showResPage"></search-result-page>
    <router-view :key="$route.fullpath" class="router-view" v-else/>
<!--    <a class="help-card" href="https://alpen.idavoll.network/docs"-->
<!--       target="_blank">-->
<!--      <IconHomeHelp></IconHomeHelp>-->
<!--    </a>-->
  </div>
</template>
<script>
import web3Connector from '@/common/web3/connector';
import ApHeader from '@/views/header/index.vue';
import ConnectMixin from '@/mixins/connect-mixin';
import ToastMixin from '@/mixins/toast-mixin';
import web3Manager from '@/common/web3/web3';
import SearchResultPage from '@/views/search/index.vue';

export default {
  components: {
    SearchResultPage,
    ApHeader,
  },
  mixins: [ToastMixin, ConnectMixin],
  methods: {
    initialConnect() {
      if (web3Connector.web3Modal.cachedProvider === 'injected') {
        this.connectWallet();
      }
    },
    tapChangeNet() {
      web3Manager.addChainToEthereum();
    },
    initialSDKs() {
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(process.env.VUE_APP_KAKAO_KEY);
      }
    },
    loadNetInfo() {
      this.$store.dispatch('updateNets');
    },
  },
  computed: {
    // showWrongNet() {
    //   const { chainId } = this.$store.state.connect;
    //   const flag = chainId !== 0
    //     && (`${chainId}` !== process.env.VUE_APP_CHAIN_ID_INT)
    //     && (`${chainId}` !== process.env.VUE_APP_CHAIN_ID)
    //     && (this.$store.state.connect.isConnected);
    //   if (flag) {
    //     this.$nextTick(() => {
    //       this.$refs.errorLoading.start();
    //     });
    //   } else {
    //     this.$nextTick(() => {
    //       if (this.$refs.errorLoading) {
    //         this.$refs.errorLoading.complete();
    //       }
    //     });
    //   }
    //   return flag;
    // },
  },
  mounted() {
    this.loadNetInfo();
    this.initialConnect();
    this.initialSDKs();
  },
  watch: {
    '$store.state.connect.shouldConnect': function (newVal) {
      if (newVal === true) {
        this.connectWallet();
        this.$store.commit('connect', { should: false });
      }
    },
  },
};
</script>

<style lang="scss">
@import "assets/css/public.scss";
#app {
  .router-view {
    margin-top: 21.33vw;
    @include media-breakpoint-up(md) {
      margin-top: 80px;
    }
  }
}

.toast-content {
  width: 100%;
  max-width: 1360px;
  margin: auto;
  padding: 0 8vw 0 8vw;
  display: flex;
  grid-gap: 10px;
  align-items: center;
  @include media-breakpoint-up(md) {
    padding: 0 30px 0 30px;
  }
}

// bootstrap toast 样式修改
.b-toaster-top-full {
  left: 0 !important;
  right: 0 !important;
  top: 21.33vw !important;
  @include FontM;
  @include media-breakpoint-up(md) {
    top: 80px !important;
  }
  .b-toaster-slot {
    margin: 0 !important;
    top: 0 !important;
    left: 0;
    border: none !important;
  }
  .toast {
    border: none;
    @include FontM;
  }
  .toast-header {
    height: 0;
    opacity: 0;
    padding: 0 !important;
  }
  .toast-body {
    border: none !important;
    @include FontM;
  }

  .b-toast-danger {
    background: #f6eaee;
    .toast {
      color: #db3a46 !important;
    }
  }

  .b-toast-success {
    background: #e4f8ed;
    .toast {
      color: #20a85f !important;
    }
  }
}

.help-card {
  position: fixed;
  right: 8vw;
  bottom: 10vw;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: box-shadow 0.3s linear, opacity 0.3s linear;
  width: 60px;
  height: 76px;
  z-index: 10;
  background: white;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.28);
  border-radius: 6px;
  opacity: 0.8;
  &:hover {
    opacity: 1;
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.28);
  }
  @include media-breakpoint-up(md) {
    right: 30px;
    bottom: 100px;
    opacity: 0.3;
  }
}
html {
  height: 100vh;
}

//html {
//  overflow-y: scroll; //这是为了兼容ie8，不支持:root, vw
//}
//
//:root {
//  overflow-y: auto;
//  overflow-x: hidden;
//}
//
//:root body {
//  position: absolute;
//}
//
//body {
//  width: 100vw;
//  overflow: hidden;
//}

html, body {
  padding: 0;
  margin: 0;
  scroll-margin-top: 80px;
  font-family: 'Poppins', 'Noto Sans', sans-serif !important;
}

html {
  overflow-y: overlay;
}

button {
  &:focus {
    box-shadow: none;
  }
}

#footer-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

</style>
