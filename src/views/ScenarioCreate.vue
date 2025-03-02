<template>
    <v-container>
        <h1>自動化シナリオ作成</h1>
        <v-text-field 
            label="情報を入力してください" 
            v-model="text"
            class="mb-4"
        ></v-text-field>
        <FileUpload 
            ref="fileUpload"
            :initial-files="initialFiles"
            @files-selected="handleFilesSelected"
            class="mb-4"
        />
        
        <v-btn
            color="#42b883"
            dark
            @click="createScenario"
            class="mb-6"
        >
            作成
        </v-btn>

        <!-- AI思考ダイアログ -->
        <AIThinking 
            :show.sync="isThinking" 
            :text="thinkingText"
        />

        <!-- フロータイトル -->
        <div v-if="showSteps" class="flow-title mb-4">
            <h2 class="text-h5 font-weight-medium text-center">
                {{ isAnalysisMode ? '分析後のフロー' : 'アップロードされたフロー' }}
            </h2>
        </div>

        <!-- 分析の凡例 -->
        <div v-if="showSteps && isAnalysisMode" class="legend-container mb-4">
            <div class="legend-title mb-2">操作の分析について</div>
            <div class="legend-items">
                <div class="legend-item">
                    <div class="legend-box gray-dot"></div>
                    <span>繰り返しの操作（省略可能）</span>
                </div>
                <div class="legend-item">
                    <div class="legend-box blue-fill"></div>
                    <span>簡略化後の必要な操作</span>
                </div>
                <div class="legend-item">
                    <div class="legend-box blue-norm"></div>
                    <span>変更のない操作</span>
                </div>
                <div class="legend-item">
                    <div class="legend-box orange-fill"></div>
                    <span>確認操作</span>
                </div>
                <div class="legend-item">
                    <div class="legend-box green-fill"></div>
                    <span>処理時間改善のため自動化可能な操作</span>
                </div>
            </div>
        </div>

        <!-- グループのスクロール可能なコンテナ -->
        <div class="groups-scroll-container" v-if="showSteps">
            <div class="groups-container">
                <template v-for="(group, index) in currentGroups">
                    <div :key="'group-wrapper-' + index" class="group-wrapper">
                        <component
                            :is="currentComponent"
                            :key="'group-' + index"
                            :group-name="group.name"
                            :steps="group.steps"
                            :steps-style="group.stepsStyle"
                            :step-comments="group.stepComments"
                            :step-times="group.stepTimes"
                            :automation-proposal="group.automationProposal"
                            :veteran-proposals="group.veteranProposals"
                            :no-improvement-proposals="group.noImprovementProposals"
                        />
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                    icon
                                    small
                                    color="#1976D2"
                                    class="info-button"
                                    v-bind="attrs"
                                    v-on="on"
                                    @click="showManualInfo(group.manualRef)"
                                >
                                    <v-icon small>mdi-information</v-icon>
                                </v-btn>
                            </template>
                            <span>マニュアル参照情報を表示</span>
                        </v-tooltip>
                    </div>
                    <div 
                        v-if="index < currentGroups.length - 1"
                        :key="'connector-' + index"
                        class="group-connector"
                    >
                        <v-icon large color="#1976D2">mdi-arrow-right</v-icon>
                    </div>
                </template>
            </div>
        </div>

        <!-- 分析ボタン -->
        <div v-if="showSteps" class="text-center mt-6">
            <v-btn
                color="primary"
                @click="toggleAnalysis"
                class="mb-6 mr-4"
            >
                {{ isAnalysisMode ? '通常表示' : '分析' }}
            </v-btn>

            <!-- 分析モードでない場合にのみマニュアル作成ボタンを表示 -->
            <v-btn
                v-if="isAnalysisMode"
                color="warning"
                @click="createVeteranManual"
                class="mb-6"
            >
                <v-icon left>mdi-file-document-outline</v-icon>
                マニュアル作成
            </v-btn>
        </div>

        <!-- フロー分析テーブル -->
        <!-- <FlowAnalysisTable v-if="showSteps && isAnalysisMode" /> -->

        <!-- マニュアル参照ダイアログ -->
        <v-dialog v-model="showManualDialog" max-width="600">
            <v-card>
                <v-card-title class="manual-dialog-header">
                    <v-icon large color="white" class="mr-2">
                        mdi-book-open-page-variant
                    </v-icon>
                    <span>マニュアル参照情報</span>
                    <v-btn
                        icon
                        @click="showManualDialog = false"
                        class="close-button"
                    >
                        <v-icon color="white">mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text class="pt-4">
                    <div v-if="selectedManualRef" class="manual-info">
                        <p><strong>マニュアル：</strong> {{ selectedManualRef.document }}</p>
                        <p><strong>章：</strong> {{ selectedManualRef.chapter }}</p>
                        <p><strong>セクション：</strong> {{ selectedManualRef.section }}</p>
                        <p><strong>項目：</strong> {{ selectedManualRef.item }}</p>
                        <p><strong>ページ：</strong> {{ selectedManualRef.page }}</p>
                        <div v-if="selectedManualRef.content" class="manual-content">
                            <p><strong>内容：</strong></p>
                            <div v-html="selectedManualRef.content"></div>
                        </div>
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="primary"
                        text
                        @click="showManualDialog = false"
                    >
                        閉じる
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import FileUpload from '@/components/FileUpload.vue';
import StepGroup from '@/components/StepGroup.vue';
import StepGroupAnalysis from '@/components/StepGroupAnalysis.vue';
import AIThinking from '@/components/AIThinking.vue';
import FlowAnalysisTable from '@/components/FlowAnalysisTable.vue';
import { scenarioGroups } from '@/data/scenarioGroups.js';
import { scenarioAnalysis } from '@/data/scenarioAnalysis.js';

export default {
    name: 'ScenarioCreate',
    components: { 
        FileUpload,
        StepGroup,
        StepGroupAnalysis,
        AIThinking,
        FlowAnalysisTable
    },
    data() {
        return {
            text: '',
            initialFiles: [],
            currentFiles: [],
            showSteps: false,
            showManualDialog: false,
            selectedManualRef: null,
            isThinking: false,
            isAnalysisMode: false,
            scenarioGroups: scenarioGroups,
            scenarioAnalysis: scenarioAnalysis,
            thinkingText: 'AI分析中'
        };
    },

    computed: {
        currentGroups() {
            return this.isAnalysisMode ? this.scenarioAnalysis : this.scenarioGroups;
        },
        currentComponent() {
            return this.isAnalysisMode ? 'StepGroupAnalysis' : 'StepGroup';
        }
    },

    created() {
        console.log('ScenarioCreate - Component created');
        if (this.$route.params.restoreState) {
            try {
                const state = JSON.parse(decodeURIComponent(this.$route.params.restoreState));
                console.log('ScenarioCreate - Restoring state:', state);
                
                if (state.text) {
                    this.text = state.text;
                }
                
                if (state.files && state.files.length > 0) {
                    console.log('ScenarioCreate - Restoring files:', state.files);
                    // base64をFileオブジェクトに戻す
                    const fileObjects = state.files.map(fileData => {
                        try {
                            // base64をブロブに変換
                            const byteString = atob(fileData.data.split(',')[1]);
                            const mimeString = fileData.data.split(',')[0].split(':')[1].split(';')[0];
                            const ab = new ArrayBuffer(byteString.length);
                            const ia = new Uint8Array(ab);
                            
                            for (let i = 0; i < byteString.length; i++) {
                                ia[i] = byteString.charCodeAt(i);
                            }
                            
                            const blob = new Blob([ab], { type: mimeString });
                            return new File([blob], fileData.name, {
                                type: fileData.type,
                                lastModified: fileData.lastModified
                            });
                        } catch (error) {
                            console.error('Error converting file data:', error);
                            return null;
                        }
                    }).filter(file => file !== null);
                    
                    this.initialFiles = fileObjects;
                    this.currentFiles = fileObjects;
                    console.log('ScenarioCreate - Files restored:', this.initialFiles);
                }
                
                if (state.isAnalysisMode) {
                    this.isAnalysisMode = state.isAnalysisMode;
                    this.showSteps = true;
                }
            } catch (error) {
                console.error('Error restoring state:', error);
            }
        }
    },

    mounted() {
        console.log('ScenarioCreate - Component mounted', {
            text: this.text,
            initialFiles: this.initialFiles,
            currentFiles: this.currentFiles,
            refs: this.$refs
        });
    },

    updated() {
        console.log('ScenarioCreate - Component updated', {
            text: this.text,
            initialFiles: this.initialFiles,
            currentFiles: this.currentFiles,
            refs: this.$refs
        });
    },

    methods: {
        async createScenario() {
            this.thinkingText = 'AI分析中';
            this.isThinking = true;
            try {
                await new Promise(resolve => setTimeout(resolve, 2000));
                this.showSteps = true;
            } finally {
                this.isThinking = false;
            }
        },
        showManualInfo(manualRef) {
            this.selectedManualRef = manualRef;
            this.showManualDialog = true;
        },
        toggleAnalysis() {
            this.isAnalysisMode = !this.isAnalysisMode;
        },
        expandAnalysis() {
            // 分析パネルを展開するメソッド
            // このメソッドは、コンポーネントの構造に依存します
        },
        handleFilesSelected(files) {
            console.log('ScenarioCreate - Files selected:', files);
            this.currentFiles = files;
        },
        async createVeteranManual() {
            this.thinkingText = 'AIマニュアル作成中';
            this.isThinking = true;
            try {
                // すべてのグループからすべてのベテランステップを収集し、グループ情報を含める
                const veteranGroups = [];
                let totalTime = 0;
                let totalSteps = 0;

                this.currentGroups.forEach(group => {
                    const groupSteps = [];
                    const groupStepTimes = [];
                    
                    group.steps.forEach((step, index) => {
                        const isGrayDot = group.stepsStyle[index] === 'gray-dot';
                        const isFirstGrayDot = isGrayDot && 
                            group.stepsStyle.findIndex(style => style === 'gray-dot') === index;
                        
                        if (!isGrayDot || isFirstGrayDot) {
                            groupSteps.push(step);
                            groupStepTimes.push(group.stepTimes[index]);
                            totalTime += group.stepTimes[index];
                            totalSteps++;
                        }
                    });

                    if (groupSteps.length > 0) {
                        veteranGroups.push({
                            name: group.name,
                            steps: groupSteps,
                            stepTimes: groupStepTimes
                        });
                    }
                });

                const flowData = {
                    type: 'default',
                    groups: veteranGroups,
                    totalTime: totalTime,
                    totalSteps: totalSteps
                };

                // 現在の状態を保存
                const currentState = {
                    text: this.text,
                    files: await Promise.all(this.currentFiles.map(async file => {
                        // Fileをbase64に変換
                        const base64 = await this.fileToBase64(file);
                        return {
                            name: file.name,
                            size: file.size,
                            type: file.type,
                            lastModified: file.lastModified,
                            data: base64
                        };
                    })),
                    showSteps: true,
                    isAnalysisMode: this.isAnalysisMode
                };

                await new Promise(resolve => setTimeout(resolve, 2000));

                const encodedState = encodeURIComponent(JSON.stringify(currentState));

                this.$router.push({
                    name: 'Manual',
                    params: {
                        flowData: JSON.stringify(flowData),
                        restoreState: encodedState
                    }
                });
            } catch (error) {
                console.error('Error creating veteran manual:', error);
            } finally {
                this.isThinking = false;
            }
        },

        // Fileをbase64に変換するヘルパーメソッド
        fileToBase64(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });
        }
    },
    watch: {
        text(newVal) {
            console.log('ScenarioCreate - Text changed:', newVal);
        },
        currentFiles: {
            handler(newVal) {
                console.log('ScenarioCreate - Current files changed:', 
                    newVal.map(file => ({
                        name: file.name,
                        size: file.size,
                        type: file.type
                    }))
                );
            },
            deep: true
        }
    }
};
</script>

<style scoped>
.groups-scroll-container {
    width: 100%;
    overflow-x: auto;
    padding: 20px 0;
}

.groups-container {
    display: inline-flex;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 12px; 
    min-width: min-content;
    padding: 0 12px;
}

.group-connector {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 18px;
}

/* Chrome、Safari、Operaのスクロールバーを非表示にする */
.groups-scroll-container::-webkit-scrollbar {
    height: 8px;
}

/* トラック */
.groups-scroll-container::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
}

/* ハンドル */
.groups-scroll-container::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
}

/* ハンドルのホバー時 */
.groups-scroll-container::-webkit-scrollbar-thumb:hover {
    background: #666;
}

/* 展開パネルのスタイル */
:deep(.v-expansion-panel) {
    border: 1px solid rgba(0, 0, 0, 0.12);
}

:deep(.v-expansion-panel-header) {
    position: sticky;
    top: 0;
    z-index: 2;
    background-color: #f5f5f5;
}

:deep(.v-expansion-panel-content) {
    background-color: #f8f9fa;
}

:deep(.v-expansion-panel-header__icon) {
    margin-left: auto;
}

:deep(.v-expansion-panel-header > *:not(.v-expansion-panel-header__icon)) {
    flex: 0 1 auto;
    margin: auto;
}

.group-wrapper {
    position: relative;
    max-width: 380px;
}

.info-button {
    position: absolute;
    top: 8px;
    right: 48px;
    z-index: 3;
}

.manual-info p {
    margin-bottom: 8px;
    font-size: 0.95rem;
    color: #2c3e50;
}

.manual-info strong {
    color: #1976D2;
    margin-right: 8px;
}

.manual-content {
    margin-top: 16px;
    padding: 16px;
    background-color: #f8f9fa;
    border-radius: 4px;
    line-height: 1.6;
    font-size: 0.9rem;
}

.manual-content :deep(br) {
    content: "";
    display: block;
    margin-bottom: 8px;
}

.manual-dialog-header {
    background-color: #1976D2;
    color: white;
    padding: 16px 24px;
    display: flex;
    align-items: center;
    font-size: 1.25rem;
    position: relative;
}

.close-button {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
}

.manual-info {
    padding: 8px 0;
}

.legend-container {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 16px;
    margin: 0 auto;
    max-width: 800px;
}

.legend-title {
    font-weight: 500;
    color: #2c3e50;
    font-size: 1rem;
}

.legend-items {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9rem;
}

.legend-box {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    flex-shrink: 0;
}

/* 分析のスタイル */
.legend-box.gray-dot {
    background-color: #e0e0e0;
    border: 2px dashed #1976D2;
}

.legend-box.blue-fill {
    background-color: #E3F2FD;
    border: 2px solid #1976D2;
}

.legend-box.blue-norm {
    background-color: white;
    border: 2px solid #1976D2;
}

.legend-box.orange-fill {
    background-color: #FFF3E0;
    border: 2px solid #FF9800;
}

.legend-box.green-fill {
    background-color: #E8F5E9;
    border: 2px solid #4CAF50;
}

.flow-title {
    color: #2c3e50;
    margin-top: 16px;
}
</style>