<template>
    <v-expansion-panels class="group-panel">
        <v-expansion-panel>
            <v-expansion-panel-header class="title text-center">
                <div class="d-flex align-center">
                    <v-icon 
                        small 
                        color="success"
                        class="mr-2"
                    >
                        mdi-check-circle
                    </v-icon>
                    {{ groupName }}
                </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content class="panel-content">
                <div class="content-wrapper">
                    <div 
                        class="flowchart clickable"
                        @click="showComparison = true"
                    >
                        <div 
                            v-for="(step, index) in steps" 
                            :key="index"
                            class="step-container"
                        >
                            <v-tooltip 
                                right
                                :open-delay="0"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                    <div 
                                        :class="['step-box', stepsStyle[index]]"
                                        v-bind="attrs"
                                        v-on="on"
                                    >
                                        {{ step }}
                                    </div>
                                </template>
                                <span>{{ stepComments[index] }}</span>
                            </v-tooltip>
                            <div v-if="index < steps.length - 1" class="arrow">
                                <v-icon>mdi-arrow-down</v-icon>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Time Comparison Dialog -->
                <v-dialog
                    v-model="showComparison"
                    max-width="900"
                >
                    <v-card>
                        <v-card-title class="headline">
                            時間分析
                        </v-card-title>
                        <v-card-text>
                            <TimeComparison 
                                :steps="steps"
                                :steps-style="stepsStyle"
                                :step-times="stepTimes"
                            />
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                color="primary"
                                text
                                @click="showComparison = false"
                            >
                                閉じる
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-expansion-panel-content>
        </v-expansion-panel>
    </v-expansion-panels>
</template>

<script>
import TimeComparison from './TimeComparison.vue';

export default {
    components: {
        TimeComparison
    },
    data() {
        return {
            showComparison: false
        };
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
        stepComments: {
            type: Array,
            required: true
        },
        stepTimes: {
            type: Array,
            required: true
        }
    }
};
</script>

<style scoped>
.group-panel {
    width: 400px;
}

.panel-content {
    max-height: 1000px; /* Chiều cao cố định */
    overflow: hidden; /* Ẩn overflow ban đầu */
}

.content-wrapper {
    max-height: 800px; /* Để lại khoảng trống cho padding */
    overflow-y: auto; /* Cho phép scroll theo chiều dọc */
    padding: 16px;
}

/* Tùy chỉnh thanh scroll */
.content-wrapper::-webkit-scrollbar {
    width: 8px;
}

.content-wrapper::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
}

.content-wrapper::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
}

.content-wrapper::-webkit-scrollbar-thumb:hover {
    background: #666;
}

.title {
    font-size: 1.1rem;
    font-weight: 500;
    color: #2c3e50;
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
    padding: 10px 16px;
    margin: 6px 0;
    border: 2px solid #1976D2;
    border-radius: 4px;
    background-color: white;
    width: 90%;
    text-align: center;
    font-size: 0.85rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
}

.step-box:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.arrow {
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1976D2;
}

.clickable {
    cursor: pointer;
    transition: all 0.2s ease;
}

.clickable:hover {
    background-color: rgba(0, 0, 0, 0.03);
    border-radius: 4px;
}

/* Analysis styles */
.gray-dot {
    background-color: #e0e0e0;
    border: 2px dashed #1976D2;
    color: #424242;
}

.blue-fill {
    background-color: #E3F2FD;
    border: 2px solid #1976D2;
    color: #1976D2;
    font-weight: 500;
}

.blue-norm {
    background-color: white;
    border: 2px solid #1976D2;
    color: #1976D2;
}

.orange-fill {
    background-color: #FFF3E0;
    border: 2px solid #FF9800;
    color: #FF9800;
    font-weight: 500;
}

.green-fill {
    background-color: #E8F5E9;
    border: 2px solid #4CAF50;
    color: #4CAF50;
    font-weight: 500;
}

/* Add styles for tooltip */
:deep(.v-tooltip__content) {
    background-color: rgba(97, 97, 97, 0.9) !important;
    font-size: 0.85rem !important;
    padding: 8px 12px !important;
    max-width: 300px !important;
}
</style> 