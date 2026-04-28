import { lazy } from 'react';

const routers = [
  {
    path: '/',
    component: lazy(() => import('@/pages/HomePage/HomePage')),
  },
  {
    path: '/login',
    component: lazy(() => import('@/pages/Login/Login')),
  },
  {
    path: '/register',
    component: lazy(() => import('@/pages/Register/Register')),
  },
  {
    path: '/products',
    component: lazy(() => import('@/pages/ProductListPage/ProductListPage')),
  },
  {
    path: '/products/:id',
    component: lazy(() => import('@/pages/ProductDetail')),
  },
  {
    path: '/profile',
    component: lazy(() => import('@/pages/AccountPage/AccountPage')),
  },
  {
    path: '/system',
    component: lazy(() => import('@/pages/Shop/Shop')),
  },
  {
    path: '/cart',
    component: lazy(() => import('@/pages/Cart/Cart')),
  },
  {
    path: '/checkout',
    component: lazy(() => import('@/pages/Checkout/Checkout')),
  },
  {
    path: '/checkout/payment',
    component: lazy(() => import('@/pages/Checkout/Payment')),
  },
  {
    path: '/checkout/confirm',
    component: lazy(() => import('@/pages/Checkout/Confirm')),
  },
  {
    path: '/checkout/success',
    component: lazy(() => import('@/pages/Checkout/Success/Success')),
  },
  {
    path: '/checkout/vnpay-return',
    component: lazy(() => import('@/pages/Checkout/VNPayReturn')),
  },
];
export default routers;
