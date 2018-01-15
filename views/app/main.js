import Vue from 'vue';
import { sync } from 'vuex-router-sync'
import VueResource from 'vue-resource'

import router from './router';
import store from './store'

import App from './App';

const unsync = sync(store, router)
Vue.use(VueResource)

new Vue({
    el: '#wn-hue-app',
    components: {
        App
    },
    router,
    store,
    template: '<App />',
    data: {
        message: "Hello There"
    },
    destroyed() {
        unsync()
    }
});