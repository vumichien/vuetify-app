<template>
    <v-card class="time-comparison pa-4">
        <h3 class="text-h6 mb-4 text-center">操作時間の比較</h3>
        
        <!-- Bar Chart Section -->
        <div class="chart-section mb-4">
            <div class="chart-container">
                <TimeBarChart
                    :normal-time="timeCalculations.normalTime"
                    :automated-time="timeCalculations.automatedTime"
                    :veteran-time="timeCalculations.veteranTime"
                />
            </div>
        </div>

        <!-- Toggle Flowchart Button -->
        <div class="text-center mb-4">
            <v-btn
                elevation="2"
                :color="showFlowchart ? 'primary' : 'grey lighten-1'"
                @click="showFlowchart = !showFlowchart"
                class="toggle-flow-btn"
            >
                <v-icon left>
                    {{ showFlowchart ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                </v-icon>
                <span class="font-weight-medium">
                    {{ showFlowchart ? 'フローを隠す' : 'フローを表示' }}
                </span>
            </v-btn>
        </div>

        <!-- Flowchart Section -->
        <v-expand-transition>
            <div v-show="showFlowchart" class="flows-container mb-4">
                <!-- 通常のフロー -->
                <div class="flow-column">
                    <div class="flow-header mb-4">
                        <div class="flow-title">①一般ユーザ操作時間: {{ timeCalculations.normalTime }}秒</div>
                    </div>
                    <div class="flowchart">
                        <div 
                            v-for="(step, index) in steps" 
                            :key="`normal-${index}`"
                            class="step-container"
                        >
                            <div class="step-box">
                                {{ step }}
                                <div class="step-time">{{ stepTimes[index] }}秒</div>
                            </div>
                            <div v-if="index < steps.length - 1" class="arrow">
                                <v-icon>mdi-arrow-down</v-icon>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 自動化されたフロー -->
                <div class="flow-column">
                    <div class="flow-header mb-4">
                        <div class="flow-title">②自動化操作時間: {{ timeCalculations.automatedTime }}秒</div>
                    </div>
                    <div class="flowchart">
                        <div 
                            v-for="(step, index) in steps" 
                            :key="`automated-${index}`"
                            class="step-container"
                        >
                            <div 
                                class="step-box"
                                :class="{ 'step-skipped': stepsStyle[index] === 'gray-dot' }"
                            >
                                {{ step }}
                                <div class="step-time" v-if="stepsStyle[index] !== 'gray-dot'">{{ stepTimes[index] }}秒</div>
                                <div class="step-skip" v-else>省略</div>
                            </div>
                            <div v-if="index < steps.length - 1" class="arrow">
                                <v-icon>mdi-arrow-down</v-icon>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ベテランのフロー -->
                <div class="flow-column">
                    <div class="flow-header mb-4">
                        <div class="flow-title">③ベテランの操作時間: {{ timeCalculations.veteranTime }}秒</div>
                    </div>
                    <div class="flowchart">
                        <div 
                            v-for="(step, index) in steps" 
                            :key="`veteran-${index}`"
                            class="step-container"
                        >
                            <div 
                                class="step-box"
                                :class="{ 'step-skipped': stepsStyle[index] === 'gray-dot' && !isFirstGrayDot(index) }"
                            >
                                {{ step }}
                                <div class="step-time" v-if="stepsStyle[index] !== 'gray-dot' || isFirstGrayDot(index)">{{ stepTimes[index] }}秒</div>
                                <div class="step-skip" v-else>省略</div>
                            </div>
                            <div v-if="index < steps.length - 1" class="arrow">
                                <v-icon>mdi-arrow-down</v-icon>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </v-expand-transition>

        <!-- 分析セクション -->
        <div class="analysis-section mt-6">
            <div class="time-gaps mb-4">
                <div class="gap-item">
                    <div class="gap-label">①-②の差分:</div>
                    <div class="gap-value" :class="getGapClass(normalAutomatedGap, 'normal-automated')">
                        {{ normalAutomatedGap }}秒
                    </div>
                </div>
                <div class="gap-item">
                    <div class="gap-label">③-②の差分:</div>
                    <div class="gap-value" :class="getGapClass(veteranAutomatedGap, 'veteran-automated')">
                        {{ veteranAutomatedGap }}秒
                    </div>
                </div>
                <div class="gap-item">
                    <div class="gap-label">①-③の差分:</div>
                    <div class="gap-value" :class="getGapClass(normalVeteranGap, 'normal-veteran')">
                        {{ normalVeteranGap }}秒
                    </div>
                </div>
            </div>

            <div class="analysis-result">
                <div class="result-label mb-2">分析結果:</div>
                <div class="results-container">
                    <v-expansion-panels v-model="openPanels" multiple>
                        <!-- 自動化を提案 -->
                        <v-expansion-panel
                            v-if="normalAutomatedGap >= EPSILON || veteranAutomatedGap >= EPSILON"
                        >
                            <v-expansion-panel-header class="result-header automation-header">
                                自動化を提案
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <div class="proposal-content">
                                    <div v-for="(item, index) in automationProposals" :key="index">
                                        • {{ item }}
                                    </div>
                                </div>
                            </v-expansion-panel-content>
                        </v-expansion-panel>

                        <!-- ベテランのノウハウ引継ぎを提案 -->
                        <v-expansion-panel
                            v-if="normalVeteranGap >= EPSILON"
                        >
                            <v-expansion-panel-header class="result-header veteran-header">
                                自動化の前にまずはベテランのノウハウ引継ぎを提案
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <div class="proposal-content">
                                    <div v-for="(item, index) in veteranProposals" :key="index">
                                        • {{ item }}
                                    </div>
                                </div>
                            </v-expansion-panel-content>
                        </v-expansion-panel>

                        <!-- 自動化より早い -->
                        <v-expansion-panel
                            v-if="normalAutomatedGap < -EPSILON || veteranAutomatedGap < -EPSILON"
                        >
                            <v-expansion-panel-header class="result-header warning-header">
                                自動化より早い．確認処理の短縮化など別のノウハウの可能性があり．要ヒアリング
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <div class="proposal-content">
                                    <div v-for="(item, index) in fasterThanAutomationProposals" :key="index">
                                        • {{ item }}
                                    </div>
                                </div>
                            </v-expansion-panel-content>
                        </v-expansion-panel>

                        <!-- スーパーマンの可能性 -->
                        <v-expansion-panel
                            v-if="normalVeteranGap < -EPSILON"
                        >
                            <v-expansion-panel-header class="result-header warning-header">
                                このユーザが新たなスーパーマンの可能性がある．または操作の漏れがある可能性がある
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <div class="proposal-content">
                                    <div v-for="(item, index) in superUserProposals" :key="index">
                                        • {{ item }}
                                    </div>
                                </div>
                            </v-expansion-panel-content>
                        </v-expansion-panel>

                        <!-- 改善提案なし -->
                        <v-expansion-panel
                            v-if="!hasAnyResult"
                        >
                            <v-expansion-panel-header class="result-header normal-header">
                                現状の処理フローで改善提案できません
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <div class="proposal-content">
                                    <div v-for="(item, index) in noImprovementProposals" :key="index">
                                        • {{ item }}
                                    </div>
                                </div>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </div>
            </div>
        </div>
    </v-card>
</template>

<script>
import TimeBarChart from './TimeBarChart.vue'
import { scenarioAnalysis } from '@/data/scenarioAnalysis'

export default {
    components: {
        TimeBarChart
    },
    props: {
        groupName: {
            type: String,
            required: true
        },
        steps: {
            type: Array,
            required: true
        },
        stepsStyle: {
            type: Array,
            required: true
        },
        stepTimes: {
            type: Array,
            required: true
        },
        totalSteps: {
            type: Number,
            default: 0
        },
        totalTime: {
            type: Number,
            default: 0
        }
    },

    data() {
        return {
            showFlowchart: false,
            EPSILON: 30,
            openPanels: [0, 1, 2, 3, 4], // All panels open by default
        };
    },

    computed: {
        currentGroup() {
            return scenarioAnalysis.find(group => group.name === this.groupName);
        },

        automationProposals() {
            console.log('automationProposals', this.currentGroup.automationProposal);
            return this.currentGroup?.automationProposal || [];
        },

        veteranProposals() {
            return this.currentGroup?.veteranProposals || [];
        },

        noImprovementProposals() {
            return this.currentGroup?.noImprovementProposals || [];
        },

        hasAnyResult() {
            return this.normalAutomatedGap >= this.EPSILON || 
                   this.veteranAutomatedGap >= this.EPSILON || 
                   this.normalVeteranGap >= this.EPSILON || 
                   this.normalAutomatedGap < -this.EPSILON || 
                   this.veteranAutomatedGap < -this.EPSILON || 
                   this.normalVeteranGap < -this.EPSILON;
        },

        timeCalculations() {
            const normalTime = this.stepTimes.reduce((sum, time) => sum + time, 0);
            
            const automatedTime = this.stepTimes.reduce((sum, time, index) => 
                this.stepsStyle[index] !== 'gray-dot' ? sum + time : sum, 0
            );
            
            const grayDotIndices = this.stepsStyle
                .map((style, i) => style === 'gray-dot' ? i : -1)
                .filter(i => i !== -1);
            
            const veteranTime = this.stepTimes.reduce((sum, time, index) => {
                if (this.stepsStyle[index] !== 'gray-dot' || 
                    (grayDotIndices.length > 0 && grayDotIndices[0] === index)) {
                    return sum + time;
                }
                return sum;
            }, 0);

            return {
                normalTime,
                automatedTime,
                veteranTime
            };
        },
        normalAutomatedGap() {
            return this.timeCalculations.normalTime - this.timeCalculations.automatedTime;
        },
        veteranAutomatedGap() {
            return this.timeCalculations.veteranTime - this.timeCalculations.automatedTime;
        },
        normalVeteranGap() {
            return this.timeCalculations.normalTime - this.timeCalculations.veteranTime;
        },
        fasterThanAutomationProposals() {
            return this.veteranProposals;
        },
        superUserProposals() {
            return this.automationProposals;
        },
        yAxisValues() {
            const maxTime = Math.max(
                this.timeCalculations.normalTime,
                this.timeCalculations.automatedTime,
                this.timeCalculations.veteranTime
            );
            const step = Math.ceil(maxTime / 5); // 5 divisions
            return Array.from({ length: 6 }, (_, i) => step * (5 - i)); // Reverse order for top-to-bottom
        },
    },
    methods: {
        isFirstGrayDot(index) {
            const grayDotIndices = this.stepsStyle
                .map((style, i) => style === 'gray-dot' ? i : -1)
                .filter(i => i !== -1);
            return grayDotIndices.length > 0 && grayDotIndices[0] === index;
        },
        getGapClass(gap, type) {
            if (Math.abs(gap) < this.EPSILON) return 'gap-normal';
            
            switch(type) {
                case 'normal-automated':
                    return 'gap-normal-automated';
                case 'veteran-automated':
                    return 'gap-veteran-automated';
                case 'normal-veteran':
                    return 'gap-normal-veteran';
                default:
                    return 'gap-normal';
            }
        },
        getNormalizedHeight(value) {
            const maxValue = Math.max(...this.yAxisValues);
            return (value / maxValue) * 80; // 80% of container height
        },
        async createManual(type) {
            // Filter out skipped steps
            const activeSteps = this.steps.filter((_, index) => {
                if (type === 'automated') {
                    return this.stepsStyle[index] !== 'gray-dot';
                }
                if (type === 'veteran') {
                    return this.stepsStyle[index] !== 'gray-dot' || this.isFirstGrayDot(index);
                }
                return true;
            });

            const activeStepTimes = this.stepTimes.filter((_, index) => {
                if (type === 'automated') {
                    return this.stepsStyle[index] !== 'gray-dot';
                }
                if (type === 'veteran') {
                    return this.stepsStyle[index] !== 'gray-dot' || this.isFirstGrayDot(index);
                }
                return true;
            });

            const flowData = {
                type,
                steps: activeSteps,
                stepTimes: activeStepTimes,
                totalTime: this.timeCalculations[`${type}Time`],
                totalSteps: activeSteps.length
            };
            
            // Tìm ScenarioCreate component
            let scenarioCreateComponent = this.$parent;
            while (scenarioCreateComponent && scenarioCreateComponent.$options.name !== 'ScenarioCreate') {
                scenarioCreateComponent = scenarioCreateComponent.$parent;
            }
            
            if (!scenarioCreateComponent) {
                console.error('Could not find ScenarioCreate component');
                return;
            }

            // Convert files to base64
            const files = await Promise.all(
                scenarioCreateComponent.currentFiles.map(file => 
                    new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () => {
                            resolve({
                                name: file.name,
                                size: file.size,
                                type: file.type,
                                lastModified: file.lastModified,
                                data: reader.result
                            });
                        };
                        reader.onerror = reject;
                        reader.readAsDataURL(file);
                    })
                )
            );

            const currentState = {
                text: scenarioCreateComponent.text,
                files: files,
                showSteps: true,
                isAnalysisMode: true
            };

            // Encode state as URI component
            const encodedState = encodeURIComponent(JSON.stringify(currentState));
            
            console.log('TimeComparison - Saving state:', currentState);
            
            this.$router.push({
                name: 'Manual',
                params: { 
                    flowData: JSON.stringify(flowData),
                    restoreState: encodedState
                }
            });
        },
    }
};
</script>

<style scoped>
.time-comparison {
    max-width: 1400px;
    margin: 0 auto;
}

.flows-container {
    display: flex;
    gap: 32px;
    justify-content: space-between;
    padding: 0 16px;
}

.flow-column {
    width: calc((100% - 64px) / 3);
    min-width: 0;
    max-width: none;
    padding-bottom: 20px;
}

.flow-header {
    text-align: center;
    padding-bottom: 8px;
    border-bottom-width: 2px;
    border-bottom-style: solid;
}

.flow-title {
    font-weight: 500;
    font-size: 1rem;
    white-space: nowrap;
}

.flowchart {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px 0;
}

.step-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

.step-box {
    padding: 12px 16px;
    margin: 6px 0;
    border-width: 2px;
    border-style: solid;
    border-radius: 4px;
    background-color: white;
    width: 90%;
    min-height: 80px;
    height: auto;
    text-align: center;
    font-size: 0.85rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    box-sizing: border-box;
    overflow-wrap: break-word;
    word-break: break-all;
    overflow: visible;
}

.arrow {
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.step-time {
    font-size: 0.8rem;
    font-weight: 500;
}

.step-skip {
    font-size: 0.8rem;
    color: #9e9e9e;
    font-style: italic;
}

.step-skipped {
    border-style: dashed;
    background-color: #f5f5f5;
    color: #9e9e9e;
    border-color: #9e9e9e;
}

/* Normal Flow */
.flow-column:nth-child(1) {
    .flow-header {
        border-bottom-color: #1976D2;
    }
    
    .flow-title {
        color: #1976D2;
    }

    .step-box {
        border-color: #1976D2;
    }

    .step-time {
        color: #1976D2;
    }

    .arrow {
        color: #1976D2;
    }
}

/* Automated Flow */
.flow-column:nth-child(2) {
    .flow-header {
        border-bottom-color: #4CAF50;
    }
    
    .flow-title {
        color: #4CAF50;
    }

    .step-box:not(.step-skipped) {
        border-color: #4CAF50;
    }

    .step-time {
        color: #4CAF50;
    }

    .arrow {
        color: #4CAF50;
    }
}

/* Veteran Flow */
.flow-column:nth-child(3) {
    .flow-header {
        border-bottom-color: #FF9800;
    }
    
    .flow-title {
        color: #FF9800;
    }

    .step-box:not(.step-skipped) {
        border-color: #FF9800;
    }

    .step-time {
        color: #FF9800;
    }

    .arrow {
        color: #FF9800;
    }
}

.analysis-section {
    border-top: 1px solid #e0e0e0;
    padding-top: 20px;
}

.slider-settings {
    max-width: 700px;
    margin: 0 auto;
}

.slider-container {
    max-width: 500px;
    margin: 0 auto;
    padding: 0 12px; /* Add padding for the buttons */
}

.slider-label {
    font-weight: 500;
    color: #2c3e50;
    text-align: center;
}

.time-gaps {
    display: flex;
    justify-content: center;
    gap: 32px;
    flex-wrap: wrap;
}

.gap-item {
    display: flex;
    align-items: center;
    gap: 8px;
}

.gap-label {
    font-size: 0.9rem;
    color: #2c3e50;
}

.gap-value {
    font-weight: 500;
    font-size: 0.9rem;
}

.gap-normal {
    color: #757575;
}

.gap-normal-automated {
    color: #4CAF50;
}

.gap-veteran-automated {
    color: #4CAF50;
}

.gap-normal-veteran {
    color: #FF9800;
}

.analysis-result {
    text-align: center;
    max-width: 800px;
    margin: 0 auto;
}

.result-label {
    font-weight: 500;
    color: #2c3e50;
}

.results-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.result-header {
    font-weight: 500;
}

.automation-header {
    background-color: #E8F5E9 !important;
    color: #2E7D32 !important;
}

.veteran-header {
    background-color: #FFF3E0 !important;
    color: #E65100 !important;
}

.warning-header {
    background-color: #FFEBEE !important;
    color: #C62828 !important;
}

.normal-header {
    background-color: #F5F5F5 !important;
    color: #424242 !important;
}

.proposal-content {
    padding: 12px;
    font-size: 0.95rem;
    line-height: 1.6;
    text-align: left;
}

.proposal-content > div {
    margin-bottom: 8px;
    text-align: left;
    padding-left: 8px;
}

.proposal-content > div:last-child {
    margin-bottom: 0;
}

:deep(.v-expansion-panel-header) {
    padding: 12px 16px;
    text-align: left;
}

:deep(.v-expansion-panel-content__wrap) {
    padding: 0;
}

:deep(.v-expansion-panels) {
    border-radius: 4px;
    overflow: hidden;
}

/* 入力フィールドのスタイルを追加 */
:deep(.v-text-field.v-text-field--outlined .v-label) {
    font-size: 0.875rem;
}

:deep(.v-text-field.v-text-field--outlined.v-input--dense .v-label) {
    top: 0px;
}

.chart-section {
    padding: 20px;
}

.chart-container {
    height: 300px;
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 8px;
}

/* Smooth transition for flowchart */
.flows-container {
    transition: all 0.3s ease;
}

.manual-button {
    width: 90%;
    height: 56px;
    margin: 6px 0;
    color: white !important;
    font-weight: 500;
}

/* Normal Flow */
.flow-column:nth-child(1) .manual-button {
    background-color: #1976D2 !important;
}

/* Automated Flow */
.flow-column:nth-child(2) .manual-button {
    background-color: #4CAF50 !important;
}

/* Veteran Flow */
.flow-column:nth-child(3) .manual-button {
    background-color: #FF9800 !important;
}

.manual-button:hover {
    opacity: 0.9;
}

/* Remove old button container styles */
.manual-button-container {
    display: none;
}

.toggle-flow-btn {
    min-width: 160px;
    height: 40px;
    border-radius: 20px;
    text-transform: none;
    letter-spacing: 0.5px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.toggle-flow-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.toggle-flow-btn .v-icon {
    margin-right: 4px;
    transition: transform 0.3s ease;
}

.toggle-flow-btn:hover .v-icon {
    transform: translateY(showFlowchart ? -2px : 2px);
}

/* Thêm animation cho icon */
@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(3px); }
}

.toggle-flow-btn:not(:hover) .v-icon {
    animation: bounce 2s infinite;
}
</style> 
