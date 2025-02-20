export const flowAnalysisData = {
    "Excel検索": {
        normalUserAnalysis: {
            strengths: [
                "マニュアルの手順に従って基本操作が実行できる",
                "ファイル名とパスの確認を確実に行える",
                "データの正確性を重視した作業が可能"
            ],
            weaknesses: [
                "同一フォルダの探索を複数回実施",
                "フォルダ階層の把握に時間を要する",
                "ファイル検索の非効率性",
                "確認作業に時間がかかる"
            ],
            automationPoints: [
                "フォルダパスの自動記録と再利用",
                "ファイル名パターンによる自動検索",
                "最終更新日時の自動チェック機能",
                "ファイルの自動バックアップ"
            ],
            veteranPoints: [
                "エクスプローラーのアドレスバー活用",
                "検索機能のショートカットキー習得",
                "フォルダ構成の事前把握",
                "効率的な確認手順の確立"
            ]
        },
        timeImpact: {
            repetitiveOperations: 70,  // 秒
            inefficientSearch: 40,     // 秒
            confirmationDelay: 20      // 秒
        },
        manualReference: {
            section: "3.2.1 ファイル検索の基本手順",
            page: "25"
        }
    },
    "決裁システム検索": {
        normalUserAnalysis: {
            strengths: [
                "基本的なシステム操作の理解",
                "セキュリティ意識の保持",
                "手順に基づく確実な実行"
            ],
            weaknesses: [
                "認証・ログイン操作の繰り返し",
                "システム遷移の非効率性",
                "検索条件設定の時間ロス"
            ],
            automationPoints: [
                "認証情報の安全な自動入力",
                "よく使う検索条件の保存機能",
                "システム遷移の自動化",
                "セッション管理の最適化"
            ],
            veteranPoints: [
                "ブラウザのブックマーク活用",
                "システムショートカットの習得",
                "効率的な検索条件の設定方法",
                "セッションタイムアウトの把握"
            ]
        },
        timeImpact: {
            systemNavigation: 30,    // 秒
            searchPreparation: 25,   // 秒
            confirmationTime: 15     // 秒
        },
        manualReference: {
            section: "4.1.1 決裁システムへのアクセス手順",
            page: "42"
        }
    },
    "新規起票作成": {
        normalUserAnalysis: {
            strengths: [
                "必要項目の正確な入力",
                "承認ルートの理解",
                "基本的なシステム操作の把握"
            ],
            weaknesses: [
                "画面遷移の非効率性",
                "入力項目の確認に時間を要する",
                "添付資料の準備に時間がかかる"
            ],
            automationPoints: [
                "定型的な入力項目の自動入力",
                "承認ルートの自動設定",
                "添付ファイルの自動チェック",
                "入力内容の自動検証"
            ],
            veteranPoints: [
                "画面遷移のショートカット活用",
                "入力項目の事前準備",
                "効率的な承認ルート設定",
                "添付資料の効率的な準備"
            ]
        },
        timeImpact: {
            screenTransition: 20,    // 秒
            inputPreparation: 15,    // 秒
            confirmationDelay: 10    // 秒
        },
        manualReference: {
            section: "4.2.1 新規起票の開始手順",
            page: "45"
        }
    },
    "新規起票入力": {
        normalUserAnalysis: {
            strengths: [
                "入力項目の正確な把握",
                "データの整合性確認",
                "必要書類の確実な添付"
            ],
            weaknesses: [
                "データ入力の繰り返し作業",
                "入力内容の確認に時間を要する",
                "検索作業の非効率性"
            ],
            automationPoints: [
                "定型フォーマットの自動入力",
                "データの自動検証機能",
                "入力履歴の活用",
                "検索機能の効率化"
            ],
            veteranPoints: [
                "ショートカットキーの活用",
                "効率的なデータ入力手順",
                "入力内容の事前準備",
                "確認作業の効率化"
            ]
        },
        timeImpact: {
            dataEntry: 45,           // 秒
            dataVerification: 30,    // 秒
            searchOperation: 25      // 秒
        },
        manualReference: {
            section: "4.2.2 申請情報の入力手順",
            page: "47"
        }
    }
}; 