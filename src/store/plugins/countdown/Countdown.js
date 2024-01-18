import Vue from 'vue';

const countdownModule = {
  state: {
    // 活动是否开始
    countdownValues: {},
  },
  getters: {
    countdownValues(state) {
      return state.countdownValues;
    },
  },
  mutations: {
    /**
     * 添加需要倒计时处理的数据
     * @param state 当前 state
     * @param key 唯一的 key
     * @param {string | number} initializeValue 需要处理的数据值
     */
    addCountdownValues(state, { key, initializeValue = 0 }) {
      let value = initializeValue;
      if (typeof value === 'string') {
        value = parseInt(value, 10);
      }
      Vue.set(state.countdownValues, key, value);
    },
    /**
     * 移除正在处理的数据
     * @param state
     * @param key 唯一的 key
     */
    removeCountdownValue(state, { key }) {
      Vue.delete(state.countdownValues, key);
    },
    /**
     * 统一更新数据
     * @param state
     */
    updateCountdownValues(state) {
      Object.keys(state.countdownValues).forEach((key) => {
        if (state.countdownValues[key] > 0) {
          // eslint-disable-next-line operator-assignment
          state.countdownValues[key] = state.countdownValues[key] - 1;
        }
      });
    },
  },
};

export default countdownModule;
