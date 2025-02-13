<template>
    <v-expansion-panels class="group-panel">
        <v-expansion-panel>
            <v-expansion-panel-header class="title text-center">
                {{ groupName }}
            </v-expansion-panel-header>
            <v-expansion-panel-content class="panel-content">
                <div class="content-wrapper">
                    <div class="flowchart">
                        <div 
                            v-for="(step, index) in steps" 
                            :key="index"
                            class="step-container"
                        >
                            <div class="step-box">
                                {{ step }}
                            </div>
                            <div v-if="index < steps.length - 1" class="arrow">
                                <v-icon>mdi-arrow-down</v-icon>
                            </div>
                        </div>
                    </div>
                </div>
            </v-expansion-panel-content>
        </v-expansion-panel>
    </v-expansion-panels>
</template>

<script>
export default {
    name: 'StepGroup',
    props: {
        groupName: {
            type: String,
            required: true
        },
        steps: {
            type: Array,
            required: true
        }
    }
}
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
    color: #2c3e50;
    width: 90%;
    text-align: center;
    font-size: 0.85rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.arrow {
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1976D2;
}
</style> 