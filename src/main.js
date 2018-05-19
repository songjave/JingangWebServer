import Vue from 'vue';
import Clipboard from 'v-clipboard'
import App from './App';
import router from './router';
import axios from 'axios';
import ElementUI from 'element-ui';
import VueCookie from 'vue-cookie';
import 'element-ui/lib/theme-default/index.css';    // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import "babel-polyfill";
import echarts from 'echarts';
Vue.prototype.$echarts = echarts;


Vue.use(ElementUI);
Vue.use(Clipboard);
Vue.use(VueCookie);
Vue.prototype.$axios = axios;
new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
