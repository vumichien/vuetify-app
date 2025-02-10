<template>
    <v-container>
        <h1>自動化シナリオ作成</h1>
        <v-text-field 
            label="情報を入力してください" 
            v-model="text"
            class="mb-4"
        ></v-text-field>
        <FileUpload class="mb-4"/>
        
        <v-btn
            color="#42b883"
            dark
            @click="createScenario"
            class="mb-6"
        >
            作成
        </v-btn>

        <!-- AI Thinking Dialog -->
        <AIThinking :show.sync="isThinking" />

        <!-- Scrollable container for groups -->
        <div class="groups-scroll-container" v-if="showSteps">
            <div class="groups-container">
                <template v-for="(group, index) in scenarioGroups">
                    <div :key="'group-wrapper-' + index" class="group-wrapper">
                        <StepGroup
                            :key="'group-' + index"
                            :group-name="group.name"
                            :steps="group.steps"
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
                        v-if="index < scenarioGroups.length - 1"
                        :key="'connector-' + index"
                        class="group-connector"
                    >
                        <v-icon large color="#1976D2">mdi-arrow-right</v-icon>
                    </div>
                </template>
            </div>
        </div>

        <!-- Manual Reference Dialog -->
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
import AIThinking from '@/components/AIThinking.vue';
import { scenarioGroups } from '@/data/scenarioGroups.js';

export default {
    components: { 
        FileUpload,
        StepGroup,
        AIThinking
    },
    data() {
        return {
            text: '',
            showSteps: false,
            showManualDialog: false,
            selectedManualRef: null,
            isThinking: false,
            scenarioGroups: scenarioGroups
        };
    },

    methods: {
        async createScenario() {
            this.isThinking = true;
            try {
                // Giả lập thời gian xử lý AI
                await new Promise(resolve => setTimeout(resolve, 2000));
                this.showSteps = true;
            } finally {
                this.isThinking = false;
            }
        },
        showManualInfo(manualRef) {
            this.selectedManualRef = manualRef;
            this.showManualDialog = true;
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
    gap: 24px;
    min-width: min-content;
    padding: 0 20px;
}

.group-connector {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 0 12px;
    flex-shrink: 0;
    margin-top: 18px;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.groups-scroll-container::-webkit-scrollbar {
    height: 8px;
}

/* Track */
.groups-scroll-container::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
}

/* Handle */
.groups-scroll-container::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
}

/* Handle on hover */
.groups-scroll-container::-webkit-scrollbar-thumb:hover {
    background: #666;
}

/* Panel styles for expansion panels */
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
</style>