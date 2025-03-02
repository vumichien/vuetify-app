<template>
  <Bar
    :data="chartData"
    :options="chartOptions"
    :height="250"
  />
</template>

<script>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ChartDataLabels)

export default {
  name: 'TimeBarChart',
  components: {
    Bar
  },
  props: {
    normalTime: {
      type: Number,
      required: true
    },
    automatedTime: {
      type: Number,
      required: true
    },
    veteranTime: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      chartData: {
        labels: ['①一般ユーザ', '②自動化', '③ベテラン'],
        datasets: [
          {
            data: [0, 0, 0],
            backgroundColor: ['rgba(25, 118, 210, 0.2)', 'rgba(76, 175, 80, 0.2)', 'rgba(255, 152, 0, 0.2)'],
            borderColor: ['#1976D2', '#4CAF50', '#FF9800'],
            borderWidth: 2
          }
        ]
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: false  // 値を表示しているのでツールチップを無効にする
          },
          datalabels: {
            anchor: 'end',
            align: 'top',
            offset: 4,
            color: function(context) {
              return context.dataset.borderColor[context.dataIndex];
            },
            font: {
              weight: 'bold',
              size: 16,
              family: "'Meiryo'"
            },
            formatter: function(value) {
              return value + '秒';
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: '処理時間 (秒)',
              font: {
                size: 14,
                weight: 'bold',
                family: "'Meiryo'"
              }
            },
            ticks: {
              font: {
                size: 12,
                family: "'Meiryo'"
              },
              callback: function(value) {
                return value + '秒';
              }
            }
          },
          x: {
            ticks: {
              font: {
                size: 12,
                weight: 'bold',
                family: "'Meiryo'"
              }
            }
          }
        }
      }
    }
  },
  watch: {
    normalTime: {
      handler() {
        this.updateChartData();
      }
    },
    automatedTime: {
      handler() {
        this.updateChartData();
      }
    },
    veteranTime: {
      handler() {
        this.updateChartData();
      }
    }
  },
  methods: {
    updateChartData() {
      this.chartData = {
        labels: ['①一般ユーザ', '②自動化', '③ベテラン'],
        datasets: [
          {
            data: [this.normalTime, this.automatedTime, this.veteranTime],
            backgroundColor: ['rgba(25, 118, 210, 0.2)', 'rgba(76, 175, 80, 0.2)', 'rgba(255, 152, 0, 0.2)'],
            borderColor: ['#1976D2', '#4CAF50', '#FF9800'],
            borderWidth: 2
          }
        ]
      }
    }
  },
  mounted() {
    this.updateChartData();
  }
}
</script> 