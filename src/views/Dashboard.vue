<script setup lang="ts">
import Navbar from '../components/Navbar.vue';
</script>

<template>
    <div class="grid">
        <div class="col-3">
            <Suspense>
                <Navbar />
                <template #fallback> Loading... </template>
            </Suspense>
        </div>
        <div class="col-9">Hello</div>
    </div>
</template>
