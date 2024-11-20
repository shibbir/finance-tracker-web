import 'primeicons/primeicons.css';
import '@/assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';

import { VueFire, VueFireAuth } from 'vuefire';
import { firebaseApp } from '@/libs/firebase';

import App from '@/App.vue';
import router from '@/router';

const app = createApp(App);

app.use(createPinia());
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.my-app-dark',
            cssLayer: {
                name: 'primevue'
            }
        }
    }
});
app.use(router);

app.use(VueFire, {
    firebaseApp,
    modules: [VueFireAuth()]
});

app.mount('#app');
