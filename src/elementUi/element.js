import Vue from 'vue'
import {
  Button, Form, FormItem, Input, Message, Container, Header, Aside, Main, Menu, Submenu, MenuItem, MenuItemGroup} from 'element-ui'

// 若想使用element-ui组件，需要引用对应的组件，并且需要挂载
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
Vue.prototype.$message = Message
