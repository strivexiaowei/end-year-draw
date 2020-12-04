import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Awards from '../views/Awards.vue'
import Prize from '../views/Prize.vue'
import Winlist from '../views/Winlist.vue'

Vue.use(VueRouter)
const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/awards',
        name: 'Awards',
        component: Awards
    },
    {
        path: '/prize',
        name: 'Prize',
        component: Prize
    },
    {
        path: '/winlist',
        name: 'Winlist',
        component: Winlist
    },
    {
        path: '/about',
        name: 'About',
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
