class Timer {
  constructor(store) {
    this.name = 'timer';
    this.store = store;
  }

  /**
   * 倒计时
   */
  countdown() {
    this.store.commit('updateCountdownValues');
    setTimeout(() => {
      this.countdown();
    }, 1000);
  }
}

/**
 * 倒计时插件
 */
const timerPlugin = (store) => {
  const counter = new Timer(store);
  counter.countdown();
};

export default timerPlugin;
