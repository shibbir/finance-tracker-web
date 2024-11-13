<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Chart from 'primevue/chart';

const chartData = ref();
const chartOptions = ref();

const props = defineProps(['data']);

onMounted(() => {
    chartData.value = props.data;
    chartOptions.value = setChartOptions();
});

const setChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');

    return {
        plugins: {
            legend: {
                labels: {
                    cutout: '60%',
                    color: textColor
                }
            }
        }
    };
};
</script>

<template>
    <Chart type="doughnut" :data="chartData" :options="chartOptions" class="w-full md:w-[30rem]" />
</template>
