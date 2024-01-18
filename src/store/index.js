import Vue from 'vue';
import Vuex from 'vuex';
import timerPlugin from '@/store/plugins/countdown/timerPlugin';
import countdownModule from '@/store/plugins/countdown/Countdown';
import ConnectModule from '@/store/conect';
import SearchModule from '@/store/search';
// eslint-disable-next-line import/no-cycle
import { fetchAllNet } from '@/common/api/space-repository';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    countdown: countdownModule,
    connect: ConnectModule,
    search: SearchModule,
  },
  plugins: [timerPlugin],
  state: {
    allNets: [],
    allNetsMap: {},
  },
  mutations: {
    saveNets(state, payload) {
      // eslint-disable-next-line prefer-destructuring
      state.allNets = payload[0];
      // eslint-disable-next-line prefer-destructuring
      state.allNetsMap = payload[1];
    },
  },
  actions: {
    async updateNets(context) {
      const res = await fetchAllNet();
      if (res.code === 1) {
        const map = {};
        res.response.forEach((item) => {
          map[item.name] = item;
        });
        context.commit('saveNets', [res.response, map]);
      }
    },
  },
});
