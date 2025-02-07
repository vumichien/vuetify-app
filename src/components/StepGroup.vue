<template>
    <v-expansion-panels class="group-panel">
        <v-expansion-panel>
            <v-expansion-panel-header class="title text-center">
                {{ groupName }}
            </v-expansion-panel-header>
            <v-expansion-panel-content>
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