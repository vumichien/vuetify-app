<template>
    <v-card class="time-comparison pa-4">
        <h3 class="text-h6 mb-4 text-center">操作時間の比較</h3>
        
        <div class="flows-container">
            <!-- Normal Flow -->
            <div class="flow-column">
                <div class="flow-header mb-4">
                    <div class="flow-title">① 一般ユーザ操作時間: {{ timeCalculations.normalTime }}秒</div>
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

            <!-- Automated Flow -->
            <div class="flow-column">
                <div class="flow-header mb-4">
                    <div class="flow-title">② 自動化操作時間: {{ timeCalculations.automatedTime }}秒</div>
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

            <!-- Veteran Flow -->
            <div class="flow-column">
                <div class="flow-header mb-4">
                    <div class="flow-title">③ ベテランの操作時間: {{ timeCalculations.veteranTime }}秒</div>
                </div>
                <div class="flowchart">
                    <div 
                        v-for="(step, index) in steps" 
                        :key="`veteran-${index}`"
                        class="step-container"
                    >
                        <div 
                            class="step-box"
                            :class="{ 
                                'step-skipped': stepsStyle[index] === 'gray-dot' && !isFirstGrayDot(index)
                            }"
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

        <!-- Analysis Section -->
        <div class="analysis-section mt-6">
            <div class="slider-settings mb-4">
                <v-row align="center" justify="center">
                    <v-col cols="12" sm="6" md="4">
                        <v-text-field
                            v-model.number="sliderMin"
                            label="最小値"
                            type="number"
                            min="0"
                            :max="sliderMax"
                            @input="updateSliderRange"
                            dense
                            outlined
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                        <v-text-field
                            v-model.number="sliderMax"
                            label="最大値"
                            type="number"
                            :min="sliderMin"
                            @input="updateSliderRange"
                            dense
                            outlined
                        ></v-text-field>
                    </v-col>
                </v-row>
            </div>

            <div class="slider-container mb-4">
                <div class="slider-label mb-2">誤差ε: {{ epsilon }}秒</div>
                <v-slider
                    v-model="epsilon"
                    :min="sliderMin"
                    :max="sliderMax"
                    step="5"
                    thumb-label
                    class="align-center"
                >
                    <template v-slot:prepend>
                        <v-btn
                            icon
                            small
                            @click="decrementEpsilon"
                        >
                            <v-icon>mdi-minus</v-icon>
                        </v-btn>
                    </template>
                    <template v-slot:append>
                        <v-btn
                            icon
                            small
                            @click="incrementEpsilon"
                        >
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </template>
                </v-slider>
            </div>

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
                    <div 
                        v-if="normalAutomatedGap >= epsilon || veteranAutomatedGap >= epsilon"
                        class="result-content result-normal-automated mb-2"
                    >
                        自動化を提案
                    </div>
                    <div 
                        v-if="normalVeteranGap >= epsilon"
                        class="result-content result-normal-veteran mb-2"
                    >
                        自動化の前にまずはベテランのノウハウ引継ぎを提案
                    </div>
                    <div 
                        v-if="normalAutomatedGap < -epsilon || veteranAutomatedGap < -epsilon"
                        class="result-content result-warning mb-2"
                    >
                        自動化より早い．確認処理の短縮化など別のノウハウの可能性があり．要ヒアリング
                    </div>
                    <div 
                        v-if="normalVeteranGap < -epsilon"
                        class="result-content result-warning mb-2"
                    >
                        このユーザが新たなスーパーマンの可能性がある．または操作の漏れがある可能性がある
                    </div>
                    <div 
                        v-if="!hasAnyResult"
                        class="result-content result-normal"
                    >
                        現状の処理フローで改善提案できません
                    </div>
                </div>
            </div>
        </div>
    </v-card>
</template>

<script>
export default {
    name: 'TimeComparison',
    props: {
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
        }
    },
    data() {
        return {
            epsilon: 30,
            sliderMin: 10,
            sliderMax: 100
        };
    },
    computed: {
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
        hasAnyResult() {
            return (
                (this.normalAutomatedGap >= this.epsilon || this.veteranAutomatedGap >= this.epsilon) ||
                this.normalVeteranGap >= this.epsilon ||
                (this.normalAutomatedGap < -this.epsilon || this.veteranAutomatedGap < -this.epsilon) ||
                this.normalVeteranGap < -this.epsilon
            );
        }
    },
    methods: {
        isFirstGrayDot(index) {
            const grayDotIndices = this.stepsStyle
                .map((style, i) => style === 'gray-dot' ? i : -1)
                .filter(i => i !== -1);
            return grayDotIndices.length > 0 && grayDotIndices[0] === index;
        },
        getGapClass(gap, type) {
            if (Math.abs(gap) < this.epsilon) return 'gap-normal';
            
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
        incrementEpsilon() {
            if (this.epsilon < this.sliderMax) {
                this.epsilon = Math.min(this.epsilon + 5, this.sliderMax);
            }
        },
        decrementEpsilon() {
            if (this.epsilon > this.sliderMin) {
                this.epsilon = Math.max(this.epsilon - 5, this.sliderMin);
            }
        },
        updateSliderRange() {
            // Ensure min is not greater than max
            if (this.sliderMin > this.sliderMax) {
                this.sliderMax = this.sliderMin;
            }
            
            // Ensure epsilon stays within new range
            this.epsilon = Math.max(this.sliderMin, Math.min(this.epsilon, this.sliderMax));
        }
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

.result-content {
    padding: 12px;
    border-radius: 4px;
    font-weight: 500;
}

.result-normal-automated {
    background-color: #E8F5E9;
    color: #2E7D32;
    border-left: 4px solid #4CAF50;
}

.result-normal-veteran {
    background-color: #FFF3E0;
    color: #F57C00;
    border-left: 4px solid #FF9800;
}

.result-warning {
    background-color: #FFEBEE;
    color: #C62828;
    border-left: 4px solid #f44336;
}

.result-normal {
    background-color: #E3F2FD;
    color: #1565C0;
    border-left: 4px solid #1976D2;
}

/* Add styles for the input fields */
:deep(.v-text-field.v-text-field--outlined .v-label) {
    font-size: 0.875rem;
}

:deep(.v-text-field.v-text-field--outlined.v-input--dense .v-label) {
    top: 0px;
}
</style> 