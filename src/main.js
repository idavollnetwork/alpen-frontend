import Vue from 'vue';
import axios from 'axios';
import bv from '@/bootstrapvue';
import ModalContainer from '@/components/modal-container';
import infiniteScroll from 'vue-infinite-scroll';
import VueClipboard from 'vue-clipboard2';
import DatePicker from 'vue2-datepicker';
import moment from 'moment';
import VueViewer from 'v-viewer';
import App from './App.vue';
import router from './router';
import store from './store';
import i18n from './i18n';
import '@/assets/css/bvtheme.scss';
import 'vue2-datepicker/index.css';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'viewerjs/dist/viewer.css';

VueClipboard.config.autoSetContainer = true;
Vue.prototype.$moment = moment;
Vue.config.productionTip = false;
Vue.prototype.$axios = axios;
Vue.prototype.$eventBus = new Vue();
Vue.use(bv);
Vue.use(ModalContainer);
Vue.use(infiniteScroll);
Vue.use(VueClipboard);
Vue.use(DatePicker);
Vue.use(VueViewer);

const vue = new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app');

export default vue;
