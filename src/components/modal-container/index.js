import modalContainer from './ModalContainer.vue';

/*
   传入的 data 参考 utils 目录中的 LoadingModalData 文件写法,
   如下:
   const withdrawData = {
      title: i18n.t('mLoadingModal.title'),   // 标题(固定写法)
      stateTexts: loadingModalStateTexts(),   // 各种状态的文字(固定写法)
      steps: [                                // 步骤配置数据(几个步骤即往数组添加几个对象)
        {
          title: i18n.t('mLoadingModal.withdraw'),      // 单个步骤的标题
          subtitle: i18n.t('mLoadingModal.withdrawDetail'),     // 单个步骤的说明
          state: 0,                                   // 步骤的初始状态 1. 等待中 2. 开始 loading 3. 结束
        },
      ],
    };

*/

/*
用法:
        const loadingView = this.$showModal({
          type: 'metamask',         // 固定写法, 后期扩展其他 modal 用
          data: withdrawData        // 定义好的 data
        });
        // 下一步(插件内自动处理UI状态, 等待 ==> loading ==> complete ==> next step loading)
        loadingView.next();
        // 隐藏
        loadingView.hide();
*/
const modal = {};
modal.install = (Vue) => {
  // eslint-disable-next-line no-param-reassign
  Vue.prototype.$showModal = ({ type, data }) => {
    const ModalContainer = Vue.extend(modalContainer);
    const container = new ModalContainer();
    container.$mount(document.createElement('div'));
    // 处理数据
    container.type = type;
    container.configureData = data;
    container.showModal();
    return container;
  };
};

export default modal;
