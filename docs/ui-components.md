# UI 组件文档

## IvButton
目前UI 设计中的 button 类型均可用  
示例: 
```html
      <iv-button
        class="iv-button"
        type="gray"
        :circle="true"
        :loading="true"
      >
        button
      </iv-button>
```

属性:  

| 名称 | 类型 | 默认值 | 可用值 |  说明 |
|------|------|-------|-------|------|
| type | String| 'gray' | 'gray', 'white', 'blue'| 颜色类型 |
| plain | Boolean | false |  | 是否是纯文字按钮 |
| round | Boolean | false |  | 是否是小圆角(10px) | 
| loading | Boolean | false | | 是否显示加载中(加载中不可点击) |
| disabled | Boolean | false | | 是否不可点击 | 
| circle | Boolean | false | | 圆角 | 
| outline | Boolean | false | | 边框透明底类型 | 

slots:

| 名称 | 说明 |
|-----|------|
| - | 默认插槽, button 内容, loading 在右侧 |

事件: 

| 名称 | 说明 | 参数 |
|-----|------|-------|
| click | 点击按钮事件 | 无 |

## IvTabs
tab 选择器(活动首页和市场首页)

属性:  


| 名称 | 类型 | 默认值 | 可用值 |  说明 |
|------|------|-------|-------|------|
| type | String | 'normal' | 'normal' 白色,'secondary'灰色, 'blue'蓝色 | 选中底色类型 |
| titles | Array<String> | [] | | tabs 的 title 数组 | 

slots:

| 名称 | 说明 |
|-----|------|
| - | 默认插槽 |


事件:

| 名称 | 说明 | 参数 |
|-----|------|-------|
| input | 切换 tab 事件 | index |

## MarketDropdown 下拉框


## loadingModal 用法
```js
function withdrawData() {
  return {
    title: 'title',   // 标题(固定写法)
    steps: [                                // 步骤配置数据(几个步骤即往数组添加几个对象)
      {
        title: 'step 1 title',      // 单个步骤的标题
        subtitle: 'step 1 subtitle',     // 单个步骤的说明
        state: 0,                                   // 步骤的初始状态 1. 等待中 2. 开始 loading 3. 结束
      },
    ]
  };
};
const loadingView = this.$showModal({
  type: 'metamask',         // 固定写法, 后期扩展其他 modal 用
  data: modalData()        // 定义好的 data
});
// 下一步(插件内自动处理UI状态, 等待 ==> loading ==> complete ==> next step loading)
loadingView.next();
// 隐藏
loadingView.hide();
```
