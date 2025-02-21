<template>
  <div class="pie-chart-container">
    <Pie :data="chartData" :options="chartOptions" />
  </div>
</template>

<script>
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

export default {
  name: 'PieChart',
  components: { Pie },
  props: {
    timeImpact: {
      type: Object,
      required: true
    }
  },
  computed: {
    chartData() {
      const labels = Object.keys(this.timeImpact).map(key => this.getOperationLabel(key))
      const data = Object.values(this.timeImpact)
      const total = data.reduce((a, b) => a + b, 0)
      const percentages = data.map(value => ((value / total) * 100).toFixed(1))

      return {
        labels,
        datasets: [{
          data: percentages,
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF'
          ]
        }]
      }
    },
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
              font: {
                size: 11
              }
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                return `${context.label}: ${context.raw}%`
              }
            }
          }
        }
      }
    }
  },
  methods: {
    getOperationLabel(operation) {
      const labels = {
        repetitiveOperations: '繰り返し操作による損失',
        inefficientSearch: '非効率な検索による損失',
        confirmationDelay: '確認作業による損失',
        systemNavigation: 'システム遷移による損失',
        searchPreparation: '検索準備による損失',
        confirmationTime: '確認時間による損失',
        screenTransition: '画面遷移による損失',
        inputPreparation: '入力準備による損失',
        dataEntry: 'データ入力による損失',
        dataVerification: 'データ確認による損失',
        searchOperation: '検索操作による損失'
      };
      return labels[operation] || operation;
    }
  }
}
</script>

<style scoped>
.pie-chart-container {
  height: 300px;
  margin: 16px 0;
}
</style> 