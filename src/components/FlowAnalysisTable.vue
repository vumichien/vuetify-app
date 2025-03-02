<template>
    <v-card class="flow-analysis-table mt-6">
        <v-card-title :class="`text-h6 white--text pa-4 ${getHeaderClass}`">
            操作フロー分析結果
        </v-card-title>
        
        <v-card-text class="pa-4">
            <div v-for="(groupData, groupName) in analysisData" :key="groupName" class="mb-6">
                <v-card outlined class="group-analysis-card">
                    <div class="group-header d-flex align-center px-4 py-3" @click="toggleGroup(groupName)" style="cursor: pointer">
                        <h3 class="text-h6 mb-0">{{ groupName }}</h3>
                        <v-spacer></v-spacer>
                        <v-icon>{{ expandedGroups[groupName] ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                    </div>
                    
                    <v-expand-transition>
                        <v-card-text v-show="expandedGroups[groupName]" class="pa-4">
                            <v-row>
                                <v-col cols="12" md="8">
                                    <v-row>
                                        <!-- 現状分析 -->
                                        <v-col cols="12" md="6">
                                            <v-card outlined class="analysis-card h-100">
                                                <v-card-title class="subtitle-1 analysis-header py-2">
                                                    <v-icon small left>mdi-magnify</v-icon>
                                                    現状分析
                                                </v-card-title>
                                                <v-card-text>
                                                    <div class="analysis-section">
                                                        <div class="section-title success--text">
                                                            <v-icon color="success" small left>mdi-check-circle</v-icon>
                                                            強み
                                                        </div>
                                                        <ul class="strength-list">
                                                            <li v-for="(strength, index) in groupData.normalUserAnalysis.strengths" 
                                                                :key="'strength-' + index">
                                                                {{ strength }}
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <v-divider class="my-3"></v-divider>
                                                    <div class="analysis-section">
                                                        <div class="section-title error--text">
                                                            <v-icon color="error" small left>mdi-alert-circle</v-icon>
                                                            弱み
                                                        </div>
                                                        <ul class="weakness-list">
                                                            <li v-for="(weakness, index) in groupData.normalUserAnalysis.weaknesses" 
                                                                :key="'weakness-' + index">
                                                                {{ weakness }}
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </v-card-text>
                                            </v-card>
                                        </v-col>

                                        <!-- 改善提案 -->
                                        <v-col cols="12" md="6">
                                            <v-card outlined class="analysis-card h-100">
                                                <v-card-title class="subtitle-1 improvement-header py-2">
                                                    <v-icon small left>mdi-lightbulb-on</v-icon>
                                                    改善提案
                                                </v-card-title>
                                                <v-card-text>
                                                    <div class="analysis-section">
                                                        <div class="section-title success--text">
                                                            <v-icon color="success" small left>mdi-robot</v-icon>
                                                            自動化ポイント
                                                        </div>
                                                        <ul class="automation-list">
                                                            <li v-for="(point, index) in groupData.normalUserAnalysis.automationPoints" 
                                                                :key="'auto-' + index">
                                                                {{ point }}
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <v-divider class="my-3"></v-divider>
                                                    <div class="analysis-section">
                                                        <div class="section-title warning--text">
                                                            <v-icon color="warning" small left>mdi-account-star</v-icon>
                                                            ベテラン化ポイント
                                                        </div>
                                                        <ul class="veteran-list">
                                                            <li v-for="(point, index) in groupData.normalUserAnalysis.veteranPoints" 
                                                                :key="'vet-' + index">
                                                                {{ point }}
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </v-card-text>
                                            </v-card>
                                        </v-col>
                                    </v-row>
                                </v-col>
                                
                                <v-col cols="12" md="4">
                                    <v-card outlined class="time-impact-card">
                                        <v-card-title class="subtitle-1 time-header py-2">
                                            <v-icon small left>mdi-clock-outline</v-icon>
                                            時間影響分析
                                        </v-card-title>
                                        <v-card-text class="pa-0">
                                            <PieChart :timeImpact="groupData.timeImpact" />
                                            <v-list dense class="compact-list">
                                                <v-list-item v-for="(time, operation) in groupData.timeImpact" 
                                                   :key="operation"
                                                   class="time-impact-item py-1">
                                                    <v-list-item-content>
                                                        <v-list-item-title class="text-caption font-weight-medium">
                                                            {{ getOperationLabel(operation) }}
                                                        </v-list-item-title>
                                                        <v-list-item-subtitle class="d-flex align-center mt-1">
                                                            <v-progress-linear
                                                                :value="getTimePercentage(time, groupData.timeImpact)"
                                                                :color="getHeaderClass"
                                                                height="3"
                                                                class="flex-grow-1"
                                                            ></v-progress-linear>
                                                            <span class="time-value-compact ml-2">{{ time }}秒</span>
                                                        </v-list-item-subtitle>
                                                    </v-list-item-content>
                                                </v-list-item>
                                            </v-list>
                                        </v-card-text>
                                        <v-card-actions class="pa-4 grey lighten-4">
                                            <v-spacer></v-spacer>
                                            <div class="total-time">
                                                <span class="text-caption grey--text text--darken-1">合計時間:</span>
                                                <span class="font-weight-bold ml-2">{{ getTotalTime(groupData.timeImpact) }}秒</span>
                                            </div>
                                        </v-card-actions>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-expand-transition>
                </v-card>
            </div>
        </v-card-text>
    </v-card>
</template>

<script>
import { flowAnalysisData } from '@/data/flowAnalysisData';
import PieChart from './PieChart.vue';

export default {
    name: 'FlowAnalysisTable',
    components: {
        PieChart
    },
    data() {
        return {
            analysisData: flowAnalysisData,
            activeTab: 0,
            expandedGroups: {} // 各グループの展開状態を追跡
        };
    },
    created() {
        // すべてのグループを展開
        Object.keys(this.analysisData).forEach(groupName => {
            this.$set(this.expandedGroups, groupName, true);
        });
    },
    computed: {
        getHeaderClass() {
            return this.$vuetify.theme.dark ? 'primary darken-1' : 'primary';
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
        },
        getTotalTime(timeImpact) {
            return Object.values(timeImpact).reduce((a, b) => a + b, 0);
        },
        getTimePercentage(time, timeImpact) {
            const total = this.getTotalTime(timeImpact);
            return (time / total) * 100;
        },
        toggleGroup(groupName) {
            this.$set(this.expandedGroups, groupName, !this.expandedGroups[groupName]);
        }
    }
};
</script>

<style scoped>
.flow-analysis-table {
    margin-bottom: 32px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
}

.group-analysis-card {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05) !important;
}

.group-header {
    background: linear-gradient(to right, #f5f5f5, #fafafa);
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    user-select: none; /* クリック時のテキスト選択を防止 */
    transition: background-color 0.2s;
}

.group-header:hover {
    background: linear-gradient(to right, #eeeeee, #f5f5f5);
}

/* 異なるセクションのヘッダーの色 */
.analysis-header {
    background-color: #E8EAF6; /* Indigo 50 */
    color: #1A237E; /* Indigo 900 */
}

.improvement-header {
    background-color: #F3E5F5; /* Purple 50 */
    color: #4A148C; /* Purple 900 */
}

.time-header {
    background-color: #EFEBE9; /* Brown 50 */
    color: #3E2723; /* Brown 900 */
}

/* アイコンの色をヘッダーに一致させる */
.analysis-header .v-icon {
    color: #1A237E !important;
}

.improvement-header .v-icon {
    color: #4A148C !important;
}

.time-header .v-icon {
    color: #3E2723 !important;
}

/* アクセントラインを削除します。カードを使用しているため */
.group-header::before {
    display: none;
}

/* カード間のスペースを調整 */
.analysis-card, .time-impact-card {
    margin-bottom: 0;
}

.analysis-card {
    border-radius: 12px;
    height: 100%;
    border: none !important;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05) !important;
    transition: transform 0.2s, box-shadow 0.2s;
}

.analysis-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08) !important;
}

.analysis-card .v-card__title {
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    background: linear-gradient(to right, #f8f9fa, #ffffff);
    border-radius: 12px 12px 0 0;
}

.analysis-section {
    margin-bottom: 20px;
    padding: 0 4px;
}

.section-title {
    font-weight: 600;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    font-size: 0.95rem;
    letter-spacing: 0.3px;
}

.section-title .v-icon {
    margin-right: 8px;
}

.time-impact-card {
    height: 100%;
    border-radius: 12px;
    border: none !important;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05) !important;
}

.time-impact-card .v-card__title {
    background: linear-gradient(to right, #f8f9fa, #ffffff);
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    border-radius: 12px 12px 0 0;
}

ul {
    padding-left: 24px;
    margin: 0;
}

li {
    margin-bottom: 10px;
    line-height: 1.6;
    font-size: 0.875rem;
    position: relative;
    padding-left: 4px;
}

li:last-child {
    margin-bottom: 0;
}

/* 現代的なバレットを使用したカスタムリストスタイル */
.strength-list li, .weakness-list li, 
.automation-list li, .veteran-list li {
    list-style: none;
    position: relative;
}

.strength-list li::before {
    content: '●';
    position: absolute;
    left: -20px;
    color: #2E7D32;
}

.weakness-list li::before {
    content: '●';
    position: absolute;
    left: -20px;
    color: #C62828;
}

.automation-list li::before {
    content: '●';
    position: absolute;
    left: -20px;
    color: #4CAF50;
}

.veteran-list li::before {
    content: '●';
    position: absolute;
    left: -20px;
    color: #F57C00;
}

.time-impact-item {
    padding: 8px 16px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    transition: background-color 0.2s;
}

.time-impact-item:hover {
    background-color: rgba(25, 118, 210, 0.02);
}

.time-value-compact {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--v-primary-base);
    min-width: 50px;
    text-align: right;
    padding: 2px 6px;
    border-radius: 4px;
    background-color: rgba(25, 118, 210, 0.05);
}

.total-time {
    font-size: 0.875rem;
    padding: 8px 16px;
    border-radius: 20px;
    background-color: rgba(0, 0, 0, 0.02);
}

.v-progress-linear {
    border-radius: 4px;
    overflow: hidden;
}

.v-progress-linear__determinate {
    transition: width 0.3s ease-out;
}

/* レスポンシブな調整 */
@media (max-width: 960px) {
    .group-analysis {
        padding-bottom: 24px;
    }
    
    .analysis-card {
        margin-bottom: 16px;
    }
}

/* ホバー効果のアニメーション */
.analysis-card, .time-impact-card {
    transition: all 0.3s ease;
}

.time-impact-item {
    transition: all 0.2s ease;
}

.v-card__title {
    transition: background-color 0.3s ease;
}

.compact-list {
    max-height: 300px;
    overflow-y: auto;
}
</style> 