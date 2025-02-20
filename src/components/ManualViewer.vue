<template>
    <v-container fluid class="manual-viewer">
        <v-row>
            <!-- Left sidebar menu -->
            <v-col cols="3" class="menu-sidebar">
                <v-card flat>
                    <v-list shaped>
                        <v-list-item-group
                            v-model="selectedSection"
                            color="primary"
                        >
                            <v-list-item
                                v-for="group in manual.groups"
                                :key="group.id || generateTempId(group.name)"
                                :value="group.id || generateTempId(group.name)"
                                @click="scrollToSection(group.id || generateTempId(group.name))"
                            >
                                <v-list-item-icon>
                                    <v-icon>mdi-file-document-outline</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title>{{ group.name }}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list-item-group>
                    </v-list>
                </v-card>
            </v-col>

            <!-- Right content area -->
            <v-col cols="9" class="content-area">
                <v-card flat>
                    <v-card-title class="text-h4 mb-4">
                        {{ manual.title }}
                    </v-card-title>
                    <v-card-text>
                        <div
                            v-for="group in manual.groups"
                            :key="group.id || generateTempId(group.name)"
                            :id="group.id || generateTempId(group.name)"
                            class="manual-section"
                        >
                            <div class="markdown-content" v-html="renderMarkdown(group.content)"></div>
                            <v-divider class="my-6"></v-divider>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { marked } from 'marked';

export default {
    name: 'ManualViewer',
    props: {
        manualData: {
            type: Object,
            default: () => ({
                title: '',
                groups: []
            })
        }
    },
    data() {
        return {
            selectedSection: null
        };
    },
    computed: {
        manual() {
            return this.manualData;
        }
    },
    methods: {
        renderMarkdown(content) {
            return marked(content);
        },
        scrollToSection(sectionId) {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        },
        generateTempId(name) {
            return name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
        }
    }
};
</script>

<style scoped>
.manual-viewer {
    height: 100%;
}

.menu-sidebar {
    border-right: 1px solid #e0e0e0;
    height: calc(100vh - 100px);
    position: sticky;
    top: 20px;
}

.content-area {
    height: 100%;
    overflow-y: auto;
}

.manual-section {
    padding: 20px 0;
}

.markdown-content :deep(h1) {
    font-size: 2em;
    color: #1976D2;
    margin-bottom: 1em;
}

.markdown-content :deep(h2) {
    font-size: 1.5em;
    color: #424242;
    margin: 1em 0;
}

.markdown-content :deep(ul), 
.markdown-content :deep(ol) {
    padding-left: 2em;
    margin: 1em 0;
}

.markdown-content :deep(li) {
    margin: 0.5em 0;
}

.markdown-content :deep(p) {
    margin: 1em 0;
    line-height: 1.6;
}
</style> 