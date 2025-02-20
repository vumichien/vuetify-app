<template>
    <v-container fluid class="manual-create pa-6">
        <v-card class="manual-card">
            <v-card-title class="text-h4 pa-6">
                <v-icon large left :color="getTitleColor">mdi-file-document-edit</v-icon>
                {{ getTitle }}
            </v-card-title>

            <v-card-text class="pa-6">
                <!-- Flow Summary - Only show if restoring state -->
                <template v-if="restoreState">
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

                    <!-- Flow Groups -->
                    <v-expansion-panels class="mb-6">
                        <v-expansion-panel
                            v-for="(group, groupIndex) in flowData?.groups"
                            :key="groupIndex"
                        >
                            <v-expansion-panel-header>
                                <div class="d-flex align-center">
                                    <v-icon left :color="getTitleColor">mdi-folder-outline</v-icon>
                                    {{ group.name }}
                                    <v-chip 
                                        class="ml-4" 
                                        small 
                                        outlined 
                                        :color="getTitleColor"
                                    >
                                        {{ group.steps.length }}ステップ
                                    </v-chip>
                                </div>
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <div class="timeline-container">
                                    <v-timeline dense>
                                        <v-timeline-item
                                            v-for="(step, stepIndex) in group.steps"
                                            :key="`${groupIndex}-${stepIndex}`"
                                            :color="getTitleColor"
                                            small
                                        >
                                            <div class="d-flex justify-space-between align-center">
                                                <div class="step-content">
                                                    <strong class="text-subtitle-1">ステップ {{ stepIndex + 1 }}</strong>
                                                    <div class="text-body-1 mt-1">{{ step }}</div>
                                                </div>
                                                <v-chip 
                                                    medium 
                                                    outlined 
                                                    :color="getTitleColor"
                                                    class="time-chip"
                                                >
                                                    <span class="text-h6">{{ group.stepTimes[stepIndex] }}</span>
                                                    <span class="text-caption ml-1">秒</span>
                                                </v-chip>
                                            </div>
                                        </v-timeline-item>
                                    </v-timeline>
                                </div>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>

                    <!-- Manual Preview with Edit Feature -->
                    <v-card outlined v-if="restoreState">
                        <v-card-title class="subtitle-1 d-flex justify-space-between align-center">
                            <div>
                                <v-icon left>mdi-book-open-variant</v-icon>
                                マニュアルプレビュー
                            </div>
                            <v-btn
                                small
                                color="primary"
                                @click="toggleEditMode"
                            >
                                <v-icon left>{{ isEditing ? 'mdi-eye' : 'mdi-pencil' }}</v-icon>
                                {{ isEditing ? 'プレビュー' : '編集' }}
                            </v-btn>
                        </v-card-title>
                        <v-card-text>
                            <template v-if="isEditing">
                                <div v-for="group in manualGroups" :key="group.id" class="mb-6">
                                    <v-text-field
                                        v-model="group.name"
                                        label="グループ名"
                                        outlined
                                        dense
                                    ></v-text-field>
                                    <v-textarea
                                        v-model="group.content"
                                        label="内容"
                                        outlined
                                        auto-grow
                                        rows="5"
                                        hint="Markdown形式で入力できます"
                                        persistent-hint
                                    ></v-textarea>
                                    <v-divider class="my-4"></v-divider>
                                </div>
                            </template>
                            <ManualViewer v-else :manual-data="manualData" />
                        </v-card-text>
                    </v-card>
                </template>

                <!-- Manual Content - Only show if not restoring state -->
                <template v-if="!restoreState">
                    <v-text-field
                        label="マニュアルの内容を入力してください"
                        v-model="manualContent"
                        outlined
                        multi-line
                        rows="4"
                    ></v-text-field>
                    
                    <FileUpload class="mt-4" />
                </template>
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
                    @click="createManual"
                    :loading="saving"
                >
                    <v-icon left>mdi-file-document-plus</v-icon>
                    作成
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script>
import FileUpload from '@/components/FileUpload.vue';
import ManualViewer from '@/components/ManualViewer.vue';
import { marked } from 'marked';
import { manualContent } from '@/data/manualContent';

export default {
    name: 'ManualCreate',
    components: { 
        FileUpload,
        ManualViewer 
    },
    data() {
        return {
            manualContent: '',
            flowData: null,
            saving: false,
            restoreState: null,
            isEditing: false,
            manualGroups: [], // Will store editable manual content
            title: 'マニュアル作成'
        };
    },
    computed: {
        manualData() {
            return {
                title: this.title,
                groups: this.manualGroups.map((group, index) => ({
                    id: this.generateId(group.name || '', index),
                    name: group.name || '',
                    content: group.content || ''
                }))
            };
        },
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
            if (!this.flowData) return 'primary';
            const colors = {
                normal: 'primary',
                automated: 'success',
                veteran: 'warning'
            };
            return colors[this.flowData.type] || 'primary';
        },
        showCancelButton() {
            return !!this.restoreState;
        }
    },
    watch: {
        getTitle: {
            immediate: true,
            handler(newTitle) {
                this.title = newTitle;
            }
        }
    },
    created() {
        this.manualGroups = manualContent.groups.map((group, index) => ({
            id: this.generateId(group.name || 'group', index),
            name: group.name,
            content: group.content
        }));

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
            this.restoreState = this.$route.params.restoreState;
        }
    },
    methods: {
        goBack() {
            if (this.restoreState) {
                console.log('ManualCreate - Going back with restore state: ', this.restoreState);
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
        generateId(name, index) {
            const timestamp = Date.now();
            const sanitizedName = name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            return `${sanitizedName}-${index}-${timestamp}`; // Add index to ID
        },
        generateInitialContent(group) {
            return `# ${group.name}

## 手順
${group.steps.map((step, index) => `${index + 1}. ${step} (${group.stepTimes[index]}秒)`).join('\n')}

## 注意点
- 手順に従って作業を進めてください
- 不明な点があれば上司に確認してください
- 作業時間の目安を参考にしてください
`;
        },
        toggleEditMode() {
            this.isEditing = !this.isEditing;
        },
        async createManual() {
            this.saving = true;
            try {
                // Generate HTML content
                const htmlContent = this.generateHTML();
                
                // Create and download file
                await this.downloadManual(htmlContent);
                
                // Show success message
                this.$emit('success', 'マニュアルが作成されました');
            } catch (error) {
                console.error('Manual creation failed:', error);
                this.$emit('error', 'マニュアルの作成に失敗しました');
            } finally {
                this.saving = false;
            }
        },
        generateHTML() {
            const template = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${manualContent.title}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            line-height: 1.6;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        .manual-title {
            color: #1976D2;
            border-bottom: 2px solid #1976D2;
            padding-bottom: 10px;
            margin-bottom: 30px;
        }
        .group-section {
            margin-bottom: 40px;
        }
        .group-title {
            color: #424242;
            border-left: 4px solid #1976D2;
            padding-left: 10px;
            margin: 20px 0;
        }
        .content {
            padding-left: 20px;
        }
        h1 { font-size: 2em; color: #1976D2; margin-bottom: 1em; }
        h2 { font-size: 1.5em; color: #424242; margin: 1em 0; }
        ul, ol { padding-left: 2em; margin: 1em 0; }
        li { margin: 0.5em 0; }
        p { margin: 1em 0; }
    </style>
</head>
<body>
    <h1 class="manual-title">${manualContent.title}</h1>
    ${this.manualGroups.map(group => `
        <div class="group-section">
            <h2 class="group-title">${group.name}</h2>
            <div class="content">
                ${marked(group.content)}
            </div>
        </div>
    `).join('')}
</body>
</html>`;
            return template;
        },
        async downloadManual(htmlContent) {
            // Create blob and download
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${this.getTitle}.html`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }
    }
};
</script>

<style scoped>
.manual-card {
    max-width: 1200px;
    margin: 0 auto;
}

.flow-summary {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.timeline-container {
    max-height: 400px;
    overflow-y: auto;
    padding-right: 16px;
}

.step-content {
    flex: 1;
    margin-right: 16px;
}

.time-chip {
    min-width: 80px;
    justify-content: center;
}

.v-timeline-item {
    margin-bottom: 24px;
}

@media (max-width: 600px) {
    .flow-summary {
        flex-direction: column;
    }
    
    .time-chip {
        margin-top: 8px;
    }
}

.v-expansion-panel-header {
    background-color: #f5f5f5;
}

.v-expansion-panel {
    margin-bottom: 8px;
}

.timeline-container {
    padding: 16px 8px;
    background-color: #fff;
    border-radius: 4px;
}
</style>