import Vue from 'vue'
import App from './App.vue'

import ElementUI, {
  Button,
  Form,
  FormItem,
  Input,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu, MenuItem, MenuItemGroup, Breadcrumb, BreadcrumbItem, Row, Col, Table, TableColumn, Pagination, Dialog
} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import VueRouter from 'vue-router'
import router from './router'

import axios from 'axios'
import VueAxios from 'vue-axios'

import PersonalDia from '@/components/user/PersonalDia.vue'
import store from '@/router/store'

axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(VueAxios, axios)

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(PersonalDia)

Vue.prototype.$message = Message

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
