<template>
    <v-dialog
        :value="show"
        @input="$emit('update:show', $event)"
        persistent
        max-width="400"
        content-class="ai-thinking-dialog"
    >
        <v-card class="ai-card">
            <v-card-text class="ai-thinking-content">
                <div class="ai-icon-wrapper mb-6">
                    <v-icon color="#42b883" size="48" class="ai-icon">mdi-robot</v-icon>
                    <div class="pulse-ring"></div>
                </div>

                <div class="thinking-text mb-6">
                    AI分析中
                    <span class="dots">
                        <span>.</span><span>.</span><span>.</span>
                    </span>
                </div>

                <div class="progress-section">
                    <div class="progress-bar-wrapper">
                        <div class="progress-bar"></div>
                    </div>
                    <div class="progress-text">
                        <span class="percentage">0%</span>
                    </div>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: 'AIThinking',
    props: {
        show: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            progressInterval: null,
            closeTimeout: null
        }
    },
    mounted() {
        if (this.show) {
            this.startProgressAnimation();
        }
    },
    methods: {
        startProgressAnimation() {
            const percentage = document.querySelector('.percentage');
            let progress = 0;
            
            // 既存のインターバル/タイムアウトをクリア
            if (this.progressInterval) clearInterval(this.progressInterval);
            if (this.closeTimeout) clearTimeout(this.closeTimeout);
            
            this.progressInterval = setInterval(() => {
                progress += 1;
                if (percentage) {
                    percentage.textContent = `${progress}%`;
                }
                if (progress >= 100) {
                    clearInterval(this.progressInterval);
                    this.closeTimeout = setTimeout(() => {
                        this.$emit('update:show', false);
                    }, 1000);
                }
            }, 30);
        }
    },
    watch: {
        show(newVal) {
            if (newVal) {
                this.$nextTick(() => {
                    this.startProgressAnimation();
                });
            }
        }
    },
    beforeDestroy() {
        // コンポーネントが破棄されるときにインターバル/タイムアウトをクリーンアップ
        if (this.progressInterval) clearInterval(this.progressInterval);
        if (this.closeTimeout) clearTimeout(this.closeTimeout);
    }
}
</script>

<style scoped>
.ai-thinking-dialog {
    background: transparent !important;
    box-shadow: none;
}

.ai-card {
    background: rgba(255, 255, 255, 0.95) !important;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(66, 184, 131, 0.2);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
    position: relative;
    overflow: hidden;
}

.ai-thinking-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 40px; /* Tăng padding dọc */
    min-height: 300px; /* Thêm chiều cao tối thiểu */
}

.progress-section {
    width: 80%;
    position: relative;
}

.progress-bar-wrapper {
    width: 100%;
    height: 8px; /* Tăng chiều cao của progress bar */
    background: rgba(66, 184, 131, 0.1);
    border-radius: 4px;
    overflow: hidden;
    position: relative;
}

.progress-bar {
    position: absolute;
    width: 0;
    height: 100%;
    background: #42b883;
    border-radius: 4px;
    animation: progress 3s ease-out forwards;
}

.progress-text {
    position: absolute;
    width: 100%;
    text-align: center;
    margin-top: 12px; /* Tăng khoảng cách với progress bar */
    font-size: 1.1rem; /* Tăng kích thước font */
    color: #2c3e50;
    font-weight: 500;
}

.ai-icon-wrapper {
    position: relative;
    width: 96px; /* Tăng kích thước wrapper */
    height: 96px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 40px; /* Tăng khoảng cách với progress section */
}

.ai-icon {
    z-index: 2;
    animation: float 3s ease-in-out infinite;
}

.pulse-ring {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: rgba(66, 184, 131, 0.2);
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes progress {
    0% {
        width: 0;
    }
    100% {
        width: 100%;
    }
}

@keyframes float {
    0% {
        transform: translateY(0px);
    }
    50% {
        transform: translateY(-8px); /* Tăng độ nổi */
    }
    100% {
        transform: translateY(0px);
    }
}

@keyframes pulse {
    0% {
        transform: scale(0.95);
        opacity: 0.5;
    }
    50% {
        transform: scale(1.05);
        opacity: 0.3;
    }
    100% {
        transform: scale(0.95);
        opacity: 0.5;
    }
}

.thinking-text {
    color: #2c3e50;
    font-size: 1.4rem;
    font-weight: 500;
    letter-spacing: 0.5px;
    display: flex;
    align-items: center;
    font-family: 'Roboto', sans-serif;
}

.dots {
    display: inline-flex;
    margin-left: 4px;
}

.dots span {
    opacity: 0;
    animation: dots 1.5s infinite;
    margin-left: 2px;
    font-size: 1.6rem;
    line-height: 1;
    color: #42b883;
}

.dots span:nth-child(2) {
    animation-delay: 0.5s;
}

.dots span:nth-child(3) {
    animation-delay: 1s;
}

@keyframes dots {
    0% {
        opacity: 0;
    }
    50% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}
</style> 
