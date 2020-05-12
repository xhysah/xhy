import Vue from 'vue'
import Router from 'vue-router'
import login from '../pages/login.vue'
import home from '../pages/home.vue'
import welcome from '../components/welcome.vue'
import users from '../components/users.vue'
import roles from '../components/power/roles.vue'
import rights from '../components/power/rights.vue'
import categories from '../components/goodsManagement/categories.vue'
import goods from '../components/goodsManagement/goods.vue'
import params from '../components/goodsManagement/params.vue'
import orders from '../components/order/order.vue'
import reports from '../components/data/reports.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '',
      redirect: '/login'
    },
    {
      path: '/login',
      component: login,
      name: 'sss'
    },
    {
      path: '/home',
      component: home,
      redirect: '/welcome',
      // home的子路由,可以在home组件中引用<router-view>标签实现，在home组件中显示子组件
      children: [
        {
          path: '/welcome',
          component: welcome
        },
        {
          path: '/users',
          component: users
        },
        {
          path: '/roles',
          component: roles
        },
        {
          path: '/rights',
          component: rights
        },
        {
          path: '/categories',
          component: categories
        },
        {
          path: '/goods',
          component: goods
        },
        {
          path: '/params',
          component: params
        },
        {
          path: '/reports',
          component: reports
        },
        {
          path: '/orders',
          component: orders
        }
      ]
    }
  ]
})

// 挂载路由导航对象路由守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 从哪个路径跳转而来
  // next()放行  next('/login') 强制跳转
  console.log(to)
  if (to.path === '/login') return next()
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})
export default router
