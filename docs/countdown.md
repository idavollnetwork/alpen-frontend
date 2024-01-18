
## 倒计时
当前项目配置了 vuex 插件来解决随处倒计时的问题 ``/src/store/plugins/countdown``

使用方法:   
假设在某个 component 中从后台获取数据 ``data.time`` 需要倒计时处理:

```
// 在获取数据之后
this.$store.commit('addCountdownValues', {key: 'yourKey', initializeValue: data.time})
// 在 computed 中写下
yourCustomProperty() {
  const value = this.$store.getters.countdownValues['yourKey'];
  // 做一些转换操作
  return value;
}
// 在 beforeDestory 的时候从store 删除这个属性
this.$store.commit('removeCountdownValue', 'yourKey');
```
