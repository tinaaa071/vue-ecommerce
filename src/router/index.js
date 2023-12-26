import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  // 新增 login 路由
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginHome.vue')
  },
  // 新增 DashBoard 路由
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/DashBoard.vue'),
    // 巢狀路由 children
    children: [
      // 產品列表
      {
        path: 'products',
        name: 'products',
        component: () => import('../views/ProductsList.vue')
      },
      // 訂單列表
      {
        path: 'orders',
        component: () => import('../views/OrderList.vue')
      },
      // 折價券列表
      {
        path: 'coupons',
        component: () => import('../views/CouponList.vue')
      },
      // 路徑 /user 之下不需驗證
      // 使用者頁面、購物車、商品頁
      {
        path: '/user',
        component: () => import('../views/UserBoard.vue'),
        children: [
          {
            path: 'cart',
            component: () => import('../views/UserCart.vue')
          },
          {
            path: 'product/:productId',
            component: () => import('../views/UserProduct.vue')
          },
          {
            path: 'checkout/:orderId',
            component: () => import('../views/UserCheckout.vue')
          }
        ]
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  linkActiveClass: 'active',
  routes
})

export default router
