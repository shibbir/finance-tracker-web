import 'primevue/resources/themes/aura-light-green/theme.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';

import { VueFire, VueFireAuth } from 'vuefire';
import { firebaseApp } from './libs/firebase';

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(PrimeVue);
app.use(router);

app.use(VueFire, {
    firebaseApp,
    modules: [VueFireAuth()]
});

app.mount('#app');
