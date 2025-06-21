import '@/assets/reset.css';
import '@/assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import { VueFire, VueFireAuth } from 'vuefire';
import { firebaseApp } from '@/libs/firebase';

import App from '@/App.vue';
import router from '@/router';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.use(VueFire, {
    firebaseApp,
    modules: [VueFireAuth()]
});

document.body.classList.add('dark');
app.mount('#app');
