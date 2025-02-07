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
                <v-card-title class="headline">
                    マニュアル参照情報
                </v-card-title>
                <v-card-text>
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

export default {
    components: { 
        FileUpload,
        StepGroup
    },
    data() {
        return {
            text: '',
            showSteps: false,
            showManualDialog: false,
            selectedManualRef: null,
            scenarioGroups: [
                {
                    name: 'Excel探す',
                    steps: [
                        'エクスプローラでフォルダ遷移する',
                        'エクスプローラでフォルダ遷移する',
                        'エクスプローラでフォルダ遷移する',
                        'Excelを開く',
                        'Excelの中身を確認',
                        'エクスプローラでフォルダ遷移する',
                        'エクスプローラでフォルダ遷移する',
                        'エクスプローラでフォルダ遷移する',
                        'Excelを開く',
                        '中身確認'
                    ],
                    manualRef: {
                        chapter: '第3章：基本操作',
                        section: '3.2 ファイル操作',
                        item: 'Excelファイルの検索と確認',
                        page: '25',
                        content: `
                        3.2.1 ファイル検索の基本手順<br>
                        本手順では、エクスプローラーを使用したファイル検索の方法について説明します。以下の手順に従い、目的のファイルを効率的に検索してください。<br><br>
                        1. エクスプローラーの起動<br>
                        - Windowsキー + E を押してエクスプローラーを起動します。<br>
                        - アドレスバーに直接パスを入力することで、目的のフォルダへ迅速に移動することも可能です。<br><br>
                        2. フォルダ階層の移動<br>
                        - 以下の順序でフォルダを開き、目的のファイルが格納されているフォルダへ移動します。<br>
                        共有フォルダ<br>
                        部署フォルダ<br>
                        案件フォルダ<br><br>
                        - パンくずリスト（アドレスバー）を確認し、現在のフォルダの位置を把握してください。<br><br>
                        3. Excelファイルの確認ポイント<br>
                        - 目的のファイルを見つけたら、以下の点を確認してください。<br>
                        - ファイル名：命名規則に従っているか確認する。<br>
                        - 最終更新日時：最新のファイルかどうか確認する。<br>
                        - ファイルサイズ：異常に大きなファイルでないか確認する。<br><br>
                        4. ファイル内容の確認<br>
                        - ファイルの内容を確認する際は、以下の点に注意してください。<br>
                        - ファイルを開く際は、読み取り専用 で開くことを推奨します。<br>
                        - シート構成 を確認し、必要な情報が含まれているか確認してください。<br>
                        - 基本情報（タイトル、作成者、データの正確性など）をチェックしてください。<br>
                        `
                    }
                },
                {
                    name: '決裁システムを探す',
                    steps: [
                        'ブラウザを起動する',
                        '社内サイトを起動する',
                        '社内サイトを遷移してページのリンクを押す',
                        '決裁システムかを確認する',
                        '社内サイトを遷移してページのリンクを押す',
                        '決裁システムかを確認する'
                    ],
                    manualRef: {
                        chapter: '第4章：社内システム',
                        section: '4.1 決裁システム',
                        item: 'システムへのアクセス方法',
                        page: '42',
                        content: `
                            4.1.1 決裁システムへのアクセス手順<br>
                            本手順では、決裁システムへのアクセス方法について説明します。以下の手順に従い、安全かつ確実にシステムへアクセスしてください。<br><br>
                            1. 社内ポータルサイトへのアクセス<br>
                            - Internet Explorer を使用して社内ポータルサイトへアクセスしてください。<br>
                            - ブックマークからアクセスすることを推奨します。<br><br>
                            2. 認証とセキュリティ<br>
                            - 社員番号とパスワードを使用して認証を行います。<br>
                            - セキュリティトークンを確認し、適切に入力してください。<br><br>
                            3. 決裁システムの特定<br>
                            - 「業務システム」タブを選択します。<br>
                            - 「決裁・承認」カテゴリを確認し、該当するシステムを探します。<br>
                            - システムアイコンの視覚的特徴を確認し、正しいシステムを選択してください。<br><br>
                            4. アクセス時の注意点<br>
                            - 推奨ブラウザを使用し、適切な環境でアクセスしてください。<br>
                            - ポップアップブロックの設定を確認し、必要に応じて解除してください。<br>
                            - セッションタイムアウトに注意し、一定時間操作しない場合は再認証が必要となることを理解してください。<br><br>
                            以上の手順に従い、決裁システムへ適切にアクセスしてください。<br>
                        `
                    }
                },
                {
                    name: '新規起票ページを起こす',
                    steps: [
                        "システムにログインする",
                        "システム内を遷移する",
                        "システム内を遷移する",
                        "システム内を遷移する",
                        "新規起票のページを開く",
                    ],
                    manualRef: {
                        chapter: '第4章：社内システム',
                        section: '4.2 起票処理',
                        item: '新規起票画面へのアクセス',
                        page: '45',
                        content: `
                            4.2.1 新規起票の開始手順<br>
                            本手順では、新規起票を開始する方法について説明します。以下の手順に従い、正しく起票を行ってください。<br><br>
                            1. メインメニューからの遷移<br>
                            - 「新規起票」ボタンの位置を確認し、クリックしてください。<br>
                            - メニュー階層を理解し、適切な手順で遷移してください。<br><br>
                            2. 起票種別の選択<br>
                            - 申請種別の一覧から適切なものを選択してください。<br>
                            - 各種別の特徴と用途を確認し、業務に合った種別を選択してください。<br>
                            - 選択時に誤りがないよう、内容を再確認してください。<br><br>
                            3. 画面構成の理解<br>
                            - 必須項目を確認し、漏れなく入力してください。<br>
                            - 入力フィールドの種類（テキスト入力、プルダウン選択など）を把握してください。<br>
                            - 添付ファイルが必要な場合は、添付ファイル領域を活用してください。<br><br>
                            4. 事前準備事項<br>
                            - 起票に必要な情報を事前に確認してください。<br>
                            - 関連資料がある場合は、事前に準備してください。<br>
                            - 承認ルートを事前に確認し、適切なフローで進めてください。<br><br>
                            以上の手順に従い、新規起票を正しく行ってください。<br>
                        `
                    }
                },
                {
                    name: '新規起票ページに入力',
                    steps: [
                        "ブラウザを起動する",
                        "社内サイトを起動する",
                        "社内サイトを遷移してページのリンクを押す",
                        "決裁システムかを確認する",
                        "社内サイトを遷移してページのリンクを押す",
                        "決裁システムかを確認する",
                        "システムにログインする",
                        "システム内を遷移する",
                        "システム内を遷移する",
                        "システム内を遷移する",
                        "新規起票のページを開く",
                        "GUI1の日付を選択",
                        "GUI1の日付を選択",
                        "ExcelからXXをコピー",
                        "XXXをGUI2にペーストする",
                        "Excelの○○からXXXをコピー",
                        "XXXをGUI3にペーストする",
                        "Excelの○○からXXXをコピー",
                        "XXXをGUI3にペーストする",
                        "GUI4を押下",
                        "別画面からXXをキーワードに検索",
                        "検索結果をGUI5に入力",
                        "Excelの○○からXXXをコピー",
                        "XXXをGUI6にペーストする",
                        "GUI7をクリック",
                        "別画面の確認画面",
                        "入力内容の確認",
                        "申請処理の通知",
                        "システムを閉じる"
                    ],
                    manualRef: {
                        chapter: '第4章：社内システム',
                        section: '4.2 起票処理',
                        item: '申請情報の入力と送信',
                        page: '47',
                        content: `
                            4.2.2 申請情報の入力手順<br>
                            本手順では、申請情報の入力方法について説明します。以下の手順に従い、正しく情報を入力してください。<br><br>
                            1. 基本情報の入力<br>
                            - 申請日をカレンダーから選択するか、手動で入力してください。<br>
                            - 申請者情報が正しく反映されているか確認してください。<br>
                            - 部署コードの入力規則に従い、正確に入力してください。<br><br>
                            2. 申請内容の入力<br>
                            - 件名は、簡潔かつ明確に記入してください。<br>
                            - 金額入力時は、桁区切りや小数点の扱いに注意してください。<br>
                            - 理由・目的は、具体的かつ分かりやすく記載してください。<br><br>
                            3. 添付資料の準備<br>
                            - 添付可能なファイル形式（PDF、Excel、Word など）を確認してください。<br>
                            - ファイルサイズの制限を超えないように注意してください。<br>
                            - 添付方法は、「ファイル選択」ボタンを使用し、指定の場所にアップロードしてください。<br><br>
                            4. 承認ルートの設定<br>
                            - 適切な承認者を選択し、ルートを設定してください。<br>
                            - 承認者の決裁権限を事前に確認してください。<br>
                            - ルートを変更する際は、影響範囲を考慮し、適切に修正してください。<br><br>
                            5. 申請前の最終確認<br>
                            - 入力内容に誤りがないか、最終確認を行ってください。<br>
                            - システムのエラーチェック機能を活用し、入力ミスを防止してください。<br>
                            - 必要に応じて、一時保存機能を使用し、後で修正・提出できるようにしてください。<br><br>
                            以上の手順に従い、申請情報を正しく入力してください。<br>
                        `
                    }
                }
            ]
        };
    },

    methods: {
        createScenario() {
            this.showSteps = true;
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
    display: inline-flex; /* Changed to inline-flex */
    align-items: center;
    justify-content: flex-start; /* Changed to flex-start */
    gap: 24px;
    min-width: min-content; /* Ensures container fits all content */
    padding: 0 20px; /* Add padding for better appearance */
}

.group-connector {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 12px;
    flex-shrink: 0; /* Prevents arrow from shrinking */
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
    z-index: 1;
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
</style>