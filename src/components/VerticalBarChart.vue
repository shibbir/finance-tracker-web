<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import Chart from 'primevue/chart';

const chartData = ref();
const chartOptions = ref();

const props = defineProps(['data']);
const primechart = ref();

onMounted(() => {
    chartData.value = props.data;
    chartOptions.value = setChartOptions();
});

watch(
    () => props.data,
    () => {
        chartData.value = props.data;
        primechart.value.refresh();
    }
);

const setChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');

    return {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    display: false
                }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    display: true
                }
            }
        }
    };
};
</script>

<template>
    <Chart ref="primechart" type="bar" :data="chartData" :options="chartOptions" class="h-[25rem]" />
</template>
