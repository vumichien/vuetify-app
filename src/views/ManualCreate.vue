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
                                <div class="manual-groups">
                                    <div v-for="group in manualGroups" :key="group.id" class="manual-group mb-6">
                                        <v-card outlined class="group-card">
                                            
                                            <v-card-text>
                                                <v-text-field
                                                    v-model="group.name"
                                                    label="グループ名"
                                                    outlined
                                                    dense
                                                    class="mb-4"
                                                ></v-text-field>
                                                
                                                <div class="editor-container">
                                                    <quill-editor
                                                        v-model="group.content"
                                                        :options="editorOption"
                                                        @ready="onEditorReady($event)"
                                                    />
                                                </div>
                                            </v-card-text>
                                        </v-card>
                                    </div>
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
import 'quill/dist/quill.snow.css';
import { quillEditor } from 'vue-quill-editor';

export default {
    name: 'ManualCreate',
    components: { 
        FileUpload,
        ManualViewer,
        quillEditor
    },
    data() {
        return {
            manualContent: '',
            flowData: null,
            saving: false,
            restoreState: null,
            isEditing: false,
            manualGroups: [],
            title: 'マニュアル作成',
            editorOption: {
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],
                        ['blockquote', 'code-block'],
                        [{ 'header': 1 }, { 'header': 2 }],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        [{ 'indent': '-1'}, { 'indent': '+1' }],
                        ['clean']
                    ]
                },
                placeholder: '内容を入力してください...'
            }
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
        // Convert markdown to HTML for editor
        this.manualGroups = manualContent.groups.map((group, index) => ({
            id: this.generateId(group.name || 'group', index),
            name: group.name,
            content: this.markdownToHtml(group.content)
        }));

        if (this.$route.params.flowData) {
            try {
                this.flowData = JSON.parse(this.$route.params.flowData);
            } catch (e) {
                console.error('Failed to parse flow data:', e);
            }
        }

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
        markdownToHtml(markdown) {
            return marked(markdown);
        },
        onEditorReady(editor) {
            // You can do something when editor is ready
            console.log('Editor is ready!', editor);
        },
        generateHTML() {
            const template = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.title}</title>
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
    <h1 class="manual-title">${this.title}</h1>
    ${this.manualGroups.map(group => `
        <div class="group-section">
            <h2 class="group-title">${group.name}</h2>
            <div class="content">
                ${group.content}
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

.editor-container {
    margin-top: 1rem;
    margin-bottom: 1rem;
}

.editor-container >>> .ql-container {
    height: 200px;
}

.editor-container >>> .ql-toolbar {
    background-color: #f5f5f5;
}

.manual-groups {
    max-width: 1200px;
    margin: 0 auto;
}

.manual-group {
    background: #fff;
    border-radius: 8px;
}

.group-card {
    border: 1px solid #e0e0e0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05) !important;
}

.group-header {
    background: #f5f5f5;
    border-bottom: 1px solid #e0e0e0;
}

.editor-container {
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    min-height: 300px;
}

/* Increase editor width and adjust styling */
:deep(.quill-editor) {
    width: 100%;
    max-width: none;
}

:deep(.ql-container) {
    min-height: 250px;
    font-size: 14px;
}

:deep(.ql-editor) {
    padding: 16px 20px;
    min-height: 250px;
}

:deep(.ql-toolbar) {
    border-bottom: 1px solid #e0e0e0;
    padding: 8px 16px;
    background: #f8f9fa;
}

/* Responsive adjustments */
@media (min-width: 960px) {
    .editor-container {
        min-height: 400px;
    }
    
    :deep(.ql-container) {
        min-height: 350px;
    }
    
    :deep(.ql-editor) {
        min-height: 350px;
    }
}
</style>