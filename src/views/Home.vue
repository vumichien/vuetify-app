<template>
    <v-container fluid class="home-container pa-0">
        <!-- Welcome Section -->
        <v-row no-gutters class="welcome-section">
            <v-col cols="12">
                <div class="welcome-content text-center">
                    <h1 class="welcome-title mb-4">
                        自動化シナリオ生成システム
                    </h1>
                    <p class="welcome-subtitle">AIを活用した業務自動化の効率的な実現</p>
                </div>
            </v-col>
        </v-row>

        <!-- Main Features -->
        <v-row class="features-section mx-4">
            <v-col cols="12" md="4" class="pa-4">
                <v-card class="feature-card" elevation="2">
                    <v-card-text class="text-center d-flex flex-column">
                        <v-icon x-large color="#42b883" class="feature-icon mb-4">mdi-plus-circle</v-icon>
                        <h2 class="feature-title mb-4">シナリオ作成</h2>
                        <p class="feature-description mb-6 flex-grow-1">
                            AIを活用して、業務フローを自動的に分析し、最適な自動化シナリオを生成します。
                        </p>
                        <div class="text-center">
                            <v-btn
                                color="#42b883"
                                dark
                                rounded
                                to="/create"
                                class="feature-button"
                                min-width="120"
                                max-width="160"
                            >
                                作成する
                                <v-icon right>mdi-arrow-right</v-icon>
                            </v-btn>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" md="4" class="pa-4">
                <v-card class="feature-card" elevation="2">
                    <v-card-text class="text-center d-flex flex-column">
                        <v-icon x-large color="#42b883" class="feature-icon mb-4">mdi-update</v-icon>
                        <h2 class="feature-title mb-4">シナリオ更新</h2>
                        <p class="feature-description mb-6 flex-grow-1">
                            既存のシナリオを編集・更新し、より効率的な業務フローを実現します。
                        </p>
                        <div class="text-center">
                            <v-btn
                                color="#42b883"
                                dark
                                rounded
                                to="/update"
                                class="feature-button"
                                min-width="120"
                                max-width="160"
                            >
                                更新する
                                <v-icon right>mdi-arrow-right</v-icon>
                            </v-btn>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" md="4" class="pa-4">
                <v-card class="feature-card" elevation="2">
                    <v-card-text class="text-center d-flex flex-column">
                        <v-icon x-large color="#42b883" class="feature-icon mb-4">mdi-book-open-variant</v-icon>
                        <h2 class="feature-title mb-4">マニュアル作成</h2>
                        <p class="feature-description mb-6 flex-grow-1">
                            シナリオから自動的に詳細な操作マニュアルを生成します。
                        </p>
                        <div class="text-center">
                            <v-btn
                                color="#42b883"
                                dark
                                rounded
                                to="/manual"
                                class="feature-button"
                                min-width="120"
                                max-width="160"
                            >
                                作成する
                                <v-icon right>mdi-arrow-right</v-icon>
                            </v-btn>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- Statistics Section -->
        <v-row class="stats-section mx-4 mt-8">
            <v-col cols="12" md="4" class="text-center">
                <div class="stat-item">
                    <div class="stat-number">1,234</div>
                    <div class="stat-label">作成済みシナリオ</div>
                </div>
            </v-col>
            <v-col cols="12" md="4" class="text-center">
                <div class="stat-item">
                    <div class="stat-number">98%</div>
                    <div class="stat-label">自動化成功率</div>
                </div>
            </v-col>
            <v-col cols="12" md="4" class="text-center">
                <div class="stat-item">
                    <div class="stat-number">5,678</div>
                    <div class="stat-label">工数削減時間</div>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
.home-container {
    background-color: #f8f9fa;
    min-height: calc(100vh - 64px);
}

.welcome-section {
    background: linear-gradient(135deg, #1E2A38 0%, #2C3E50 100%);
    padding: 60px 0;
    margin-bottom: 40px;
}

.welcome-content {
    color: white;
}

.welcome-title {
    font-size: 2.2rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
}

.welcome-subtitle {
    font-size: 1.2rem;
    opacity: 0.9;
    margin: 0;
}

.feature-card {
    height: 100%;
    transition: transform 0.3s ease;
    border-radius: 12px;
    background: white;
    display: flex;
}

.feature-card:hover {
    transform: translateY(-5px);
}

.v-card__text {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 24px;
}

.feature-icon {
    font-size: 48px;
}

.feature-title {
    font-size: 1.5rem;
    font-weight: 500;
    color: #2c3e50;
}

.feature-description {
    color: #6c757d;
    font-size: 1rem;
    line-height: 1.6;
    min-height: 80px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

.feature-button {
    text-transform: none;
    font-weight: 500;
    letter-spacing: 1px;
    padding: 0 20px;
    height: 36px;
}

.stats-section {
    padding: 40px 0;
}

.stat-item {
    padding: 20px;
}

.stat-number {
    font-size: 2.5rem;
    font-weight: 600;
    color: #42b883;
    margin-bottom: 8px;
}

.stat-label {
    font-size: 1.1rem;
    color: #6c757d;
}
</style>

<script>
export default {
    name: 'HomePage'
}
</script> 