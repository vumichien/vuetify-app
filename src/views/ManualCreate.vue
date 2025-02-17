<template>
    <v-container fluid class="manual-create pa-6">
        <v-card class="manual-card">
            <v-card-title class="text-h4 pa-6">
                <v-icon large left :color="getTitleColor">mdi-file-document-edit</v-icon>
                {{ getTitle }}
            </v-card-title>

            <v-card-text class="pa-6">
                <!-- Flow Summary -->
                <div class="flow-summary mb-4">
                    <v-chip class="mr-4" :color="getTitleColor" outlined>
                        <v-icon left>mdi-clock-outline</v-icon>
                        合計時間: {{ flowData?.totalTime || 0 }}秒
                    </v-chip>
                    <v-chip class="mr-4" :color="getTitleColor" outlined>
                        <v-icon left>mdi-format-list-numbered</v-icon>
                        ステップ数: {{ flowData?.totalSteps || 0 }}
                    </v-chip>
                </div>

                <!-- Flow Steps -->
                <v-expansion-panels>
                    <v-expansion-panel>
                        <v-expansion-panel-header>
                            <div class="d-flex align-center">
                                <v-icon left :color="getTitleColor">mdi-format-list-checks</v-icon>
                                フロー詳細
                            </div>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-timeline dense>
                                <v-timeline-item
                                    v-for="(step, index) in flowData?.steps"
                                    :key="index"
                                    :color="getTitleColor"
                                    small
                                >
                                    <div class="d-flex justify-space-between align-center">
                                        <div>
                                            <strong>ステップ {{ index + 1 }}</strong>
                                            <div>{{ step }}</div>
                                        </div>
                                        <v-chip x-small outlined :color="getTitleColor">
                                            {{ flowData.stepTimes[index] }}秒
                                        </v-chip>
                                    </div>
                                </v-timeline-item>
                            </v-timeline>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>

                <v-divider class="my-6"></v-divider>

                <!-- Manual Content -->
                <v-text-field
                    label="マニュアルの内容を入力してください"
                    v-model="manualContent"
                    outlined
                    multi-line
                    rows="4"
                ></v-text-field>
                
                <FileUpload class="mt-4" />
            </v-card-text>
            
            <v-card-actions class="pa-6">
                <v-spacer></v-spacer>
                <v-btn
                    v-if="showCancelButton"
                    text
                    @click="goBack"
                >
                    キャンセル
                </v-btn>
                <v-btn
                    color="primary"
                    @click="saveManual"
                    :loading="saving"
                >
                    <v-icon left>mdi-content-save</v-icon>
                    保存
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script>
import FileUpload from '@/components/FileUpload.vue';

export default {
    components: { FileUpload },
    data() {
        return {
            manualContent: '',
            flowData: null,
            saving: false,
            restoreState: null
        };
    },
    computed: {
        getTitle() {
            if (!this.flowData) return 'マニュアル作成';
            const titles = {
                normal: '一般ユーザ用マニュアル作成',
                automated: '自動化用マニュアル作成',
                veteran: 'ベテラン用マニュアル作成'
            };
            return titles[this.flowData.type] || 'マニュアル作成';
        },
        getTitleColor() {
            const colors = {
                normal: 'primary',
                automated: 'success',
                veteran: 'warning'
            };
            return colors[this.flowData?.type] || 'primary';
        },
        showCancelButton() {
            return !!this.restoreState;
        }
    },
    created() {
        // Parse flow data
        if (this.$route.params.flowData) {
            try {
                this.flowData = JSON.parse(this.$route.params.flowData);
                console.log('ManualCreate - Parsed flow data:', this.flowData);
            } catch (e) {
                console.error('Failed to parse flow data:', e);
            }
        }

        // Parse restore state
        if (this.$route.params.restoreState) {
            try {
                this.restoreState = this.$route.params.restoreState;
                console.log('ManualCreate - Stored restore state');
            } catch (e) {
                console.error('Failed to parse restore state:', e);
            }
        }
    },
    methods: {
        goBack() {
            if (this.restoreState) {
                console.log('ManualCreate - Going back with restore state');
                this.$router.push({
                    name: 'Create',
                    params: {
                        restoreState: this.restoreState
                    }
                });
            } else {
                this.$router.go(-1);
            }
        },
        saveManual() {
            // TODO: Implement manual saving logic
            console.log('Saving manual:', {
                type: this.flowData.type,
                content: this.manualContent,
                flowSteps: this.flowData.steps,
                stepTimes: this.flowData.stepTimes
            });
        }
    }
};
</script>

<style scoped>
.manual-card {
    max-width: 1000px;
    margin: 0 auto;
}

.flow-summary {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.v-timeline-item {
    margin-bottom: 16px;
}

@media (max-width: 600px) {
    .flow-summary {
        flex-direction: column;
    }
}
</style>