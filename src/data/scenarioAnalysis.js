export const scenarioAnalysis = [
    {
        name: 'Excel検索',
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
        stepsStyle: [
            'gray-dot',
            'gray-dot',
            'gray-dot',
            'gray-dot',
            'gray-dot',
            'gray-dot',
            'gray-dot',
            'blue-fill',
            'blue-fill',
            'orange-fill'
        ],
        stepComments: [
            "繰り返し操作が検出（同じフォルダの遷移が複数回発生）",
            "繰り返し操作が検出（同じフォルダの遷移が複数回発生）",
            "繰り返し操作が検出（同じフォルダの遷移が複数回発生）",
            "Excelファイルを開く操作が頻繁に発生",
            "ファイル内容の確認に時間を要する",
            "繰り返し操作が検出（同じフォルダの遷移が複数回発生）",
            "繰り返し操作が検出（同じフォルダの遷移が複数回発生）",
            "重要な操作ステップ",
            "重要な操作ステップ",
            "確認作業が必要なプロセス",
        ],
        stepTimes: [
            10,  // フォルダ遷移
            10,  // フォルダ遷移
            10,  // フォルダ遷移
            5,   // Excelを開く
            20,  // Excelの中身確認
            10,  // フォルダ遷移
            10,  // フォルダ遷移
            10,  // フォルダ遷移
            5,   // Excelを開く
            20,  // Excelの中身確認
        ],
        
        // 自動化によって業務改善が見込めるステップ
        automationProposal: [
            "フォルダ遷移の回数が多いため、アクセス履歴を活用し、ナビゲーションを自動化する。",
            "頻繁に開くフォルダを自動登録し、ショートカットから直接開ける仕組みを導入。",
            "ファイル名のパターン認識による検索機能を追加し、手動検索の負担を軽減。",
            "Excelの自動起動と事前検索を組み合わせることで、ファイルオープン時間を短縮。",
            "Excelのデータ確認をOCRや自動スクリプトで処理し、手動作業を減らす。",
        ],
        
        // ベテランのノウハウを活用して効率化が図れるステップ
        veteranProposals: [
            "フォルダ管理のルールを統一し、ベテランが効率的に行っているフォルダ分類手法を新規メンバーに共有。",
            "Windowsエクスプローラーのアドレスバー入力技術やショートカット活用をベテランから学ぶことで、検索速度を向上。",
            "ファイル検索時の適切なフィルタリング方法（更新日・ファイルサイズ）をベテランの経験を元に共有。",
            "Excelファイルの開き方（テンプレート利用・頻繁に使うデータをピン留めする方法）をベテランが指導。",
            "Excelの確認作業における重要ポイントをマニュアル化し、ベテランのチェックポイントを新規メンバーに引き継ぐ。",
        ],
        
        // 自動化またはベテランのノウハウを活用しても、改善効果が少ないステップ
        noImprovementProposals: [
            "Excelファイルの開閉作業は業務フロー上必須であり、自動化してもメリットが少ない。",
            "フォルダ遷移は業務要件に基づくものであり、現状の操作フローを維持するのが最適。",
            "ファイル内容の確認は手動で行う必要があるため、自動化の効果が限定的。",
            "確認作業は人の判断が必要なため、完全自動化が難しい。",
            "エクスプローラの遷移は既に最適化されており、大幅な改善の余地が少ない。",
        ],
        manualRef: {
            document: '旅費精算システム利用マニュアル.pdf',
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
        name: '決裁システム検索',
        steps: [
            'ブラウザを起動する',
            '社内サイトを起動する',
            '社内サイトを遷移してページのリンクを押す',
            '決裁システムかを確認する',
            '社内サイトを遷移してページのリンクを押す',
            '決裁システムかを確認する'
        ],
        stepsStyle: [
            'gray-dot',
            'gray-dot',
            'gray-dot',
            'gray-dot',
            'blue-fill',
            'orange-fill'
        ],
        stepComments: [
            '繰り返し操作が検出（ブラウザ起動と社内サイト遷移の頻発）',
            '繰り返し操作が検出（社内サイトへのアクセスが多い）',
            '繰り返し操作が検出（同じリンクのクリックを繰り返している）',
            '決裁システムへの遷移確認に時間を要している',
            '重要な操作ステップ（システムへの適切な移動）',
            '確認作業が必要なプロセス（決裁システムの正当性をチェック）'
        ],
        stepTimes: [
            8,  // ブラウザ起動
            10, // 社内サイト起動
            2,  // 社内サイト遷移
            20, // 決裁システム確認
            2,  // 再遷移
            20  // 決裁システム確認
        ],

        // 自動化によって業務改善が見込めるステップ
        automationProposal: [
            "決裁システムへのログインを自動化し、認証プロセスを簡素化することで作業時間を短縮。",
            "頻繁に使用する決裁システムのリンクを自動ブックマーク登録し、遷移の手間を削減。",
            "決裁システムへのアクセス履歴を記録し、ユーザーの行動パターンに基づいたナビゲーションを最適化。",
            "認証情報の安全な自動入力機能を導入し、ログインの繰り返し作業を削減。"
        ],

        // ベテランのノウハウを活用して効率化が図れるステップ
        veteranProposals: [
            "決裁システムのブックマーク管理をベテランが指導し、アクセス時間を短縮。",
            "決裁システムへの最適な遷移手順をベテランが共有し、クリック回数を減らす。",
            "社内サイトのナビゲーション構造を理解し、無駄な画面遷移を防ぐ方法を学ぶ。",
            "決裁システムの認証エラーや遅延発生時の対応方法をベテランの経験から学ぶ。"
        ],

        // 自動化またはベテランのノウハウを活用しても、改善効果が少ないステップ
        noImprovementProposals: [
            "ブラウザの起動は業務上必須であり、現状のプロセスが最適。",
            "社内サイトへのアクセスは避けられない作業であり、現状のフローを維持。",
            "決裁システムの認証プロセスはシステム仕様上変更が困難であり、大幅な改善が見込めない。",
            "決裁システムの確認作業は人の判断が必要なため、完全な自動化は困難。",
            "既に最適なプロセスが導入されているため、特段の改善は不要。"
        ],
        manualRef: {
            document: '旅費精算システム利用マニュアル.pdf',
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
        name: '新規起票作成',
        steps: [
            "システムにログインする",
            "システム内を遷移する",
            "システム内を遷移する",
            "システム内を遷移する",
            "新規起票のページを開く",
            '中身確認'
        ],
        stepsStyle: [
            'blue-norm',
            'gray-dot',
            'gray-dot',
            'gray-dot',
            'blue-fill',
            'orange-fill'
        ],
        stepComments: [
            '重要な操作ステップ（システムへのログイン）',
            '重要な操作ステップ（適切なページへ遷移）',
            '重要な操作ステップ（適切なページへ遷移）',
            '重要な操作ステップ（適切なページへ遷移）',
            '重要な操作ステップ（新規起票ページへのアクセス）',
            '確認作業（入力内容の精査）'
        ],
        stepTimes: [
            10, // ログイン
            2,  // 遷移
            2,  // 遷移
            2,  // 遷移
            5,  // 起票ページを開く
            20  // 入力内容の確認
        ],

        // 自動化によって業務改善が見込めるステップ
        automationProposal: [
            "ログイン情報の安全な自動入力を導入し、手入力の負担を軽減。",
            "システム内のページ遷移を自動化し、よく使用するページへのショートカット機能を追加。",
            "新規起票ページへの直接アクセス機能を追加し、不要な遷移を削減。",
            "入力内容の自動検証機能を実装し、誤入力を事前に防ぐ。",
            "添付ファイルのフォーマットチェックを自動化し、アップロードの手間を削減。"
        ],

        // ベテランのノウハウを活用して効率化が図れるステップ
        veteranProposals: [
            "ベテランのナビゲーション手法を共有し、最短ルートで目的のページへアクセスする方法を学ぶ。",
            "事前に入力情報を整理し、コピーペーストを活用することで、入力の効率を上げる。",
            "承認ルートの適切な設定方法をベテランから学び、不要な承認フローを省略する。",
            "添付資料の標準フォーマットや整理方法をベテランから学び、準備時間を短縮。",
            "ショートカットキーの活用をベテランが指導し、作業スピードを向上させる。"
        ],

        // 自動化またはベテランのノウハウを活用しても、改善効果が少ないステップ
        noImprovementProposals: [
            "システムへのログインは業務上必須であり、自動化しても大きな効果は期待できない。",
            "システム内の遷移は業務フローに基づいており、最適な手順がすでに確立されている。",
            "新規起票ページのアクセスは必須ステップであり、業務要件として変更が難しい。",
            "入力内容の確認作業は人の判断が必要であり、完全な自動化が困難。",
            "既にシステム標準の手順が確立されており、大幅な改善の余地が少ない。"
        ],
        manualRef: {
            document: '海外出張費精算ガイド.pdf',
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
        name: '新規起票入力',
        steps: [
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
        stepsStyle: [
            'gray-dot',
            'blue-fill',
            'blue-fill',
            'blue-fill',
            'gray-dot',
            'gray-dot',
            'blue-fill',
            'blue-fill',
            'green-fill',
            'green-fill',
            'green-fill',
            'blue-fill',
            'blue-fill',
            'blue-fill',
            'blue-norm',
            'orange-fill',
            'blue-norm',
            'blue-norm'
        ],
        stepComments: [
            '繰り返し操作が検出（同じ日付入力が複数回発生）',
            '重要な操作ステップ（初期設定の一環）',
            '重要な操作ステップ（データ取得）',
            '重要な操作ステップ（データ入力）',
            '繰り返し操作が検出（手作業によるコピー＆ペーストの多発）',
            '繰り返し操作が検出（手作業によるコピー＆ペーストの多発）',
            '重要な操作ステップ（データ入力）',
            '重要な操作ステップ（データ入力）',
            '効率化できる可能性が高い箇所（システム操作）',
            '効率化できる可能性が高い箇所（検索機能の最適化）',
            '効率化できる可能性が高い箇所（入力作業）',
            '重要な操作ステップ（データ取得）',
            '重要な操作ステップ（データ入力）',
            '重要な操作ステップ（最終確認ステップ）',
            '重要な操作ステップ（確認画面）',
            '確認作業（データの正確性確認）',
            '重要な操作ステップ（申請処理の実行）',
            '重要な操作ステップ（システムの終了）'
        ],
        stepTimes: [
            30, // 日付選択
            30, // 日付選択
            2,  // Excelからコピー
            2,  // GUIにペースト
            2,  // Excelからコピー
            2,  // GUIにペースト
            2,  // Excelからコピー
            2,  // GUIにペースト
            8,  // ボタン押下
            15, // 検索
            20, // 検索結果入力
            2,  // Excelからコピー
            5,  // GUIにペースト
            6,  // ボタン押下
            2,  // 確認画面
            10, // 入力内容の確認
            5,  // 申請処理の通知
            2   // システム終了
        ],

        // 自動化によって業務改善が見込めるステップ
        automationProposal: [
            "日付入力を一括選択できる機能を追加し、同じ日付を複数回入力する手間を削減。",
            "Excelからのデータコピー＆ペーストを自動化し、手動作業を削減。",
            "検索キーワードの自動入力機能を導入し、手動検索の時間を短縮。",
            "過去の入力履歴を活用し、類似する申請内容のデータを自動入力できる機能を追加。",
            "入力ミスを防ぐため、リアルタイムでデータを検証し、不備があれば即座に通知。"
        ],

        // ベテランのノウハウを活用して効率化が図れるステップ
        veteranProposals: [
            "ベテランが使用するショートカットキーやマクロを活用し、データ入力のスピードを向上させる。",
            "効率的なコピー＆ペースト手順を学び、最小限の操作で入力を完了させる。",
            "申請プロセスを体系的に理解し、最適な承認ルートを事前に計画する。",
            "確認作業のポイントをベテランから学び、チェックリストを活用することで精度を向上。",
            "検索時の適切なフィルタリング設定を学び、必要な情報を素早く取得する。"
        ],

        // 自動化またはベテランのノウハウを活用しても、改善効果が少ないステップ
        noImprovementProposals: [
            "申請処理の最終確認は業務上不可欠であり、手作業が必要。",
            "システムを閉じる操作は業務フロー上必須であり、改善の必要なし。",
            "入力確認の作業は慎重に行う必要があるため、自動化の影響が限定的。",
            "申請処理の通知は必須業務であり、自動化しても大きな効率化は期待できない。",
            "GUIのボタン押下は操作の一部であり、作業負担が少ないため特別な改善策は不要。"
        ],
        manualRef: {
            document: '海外出張費精算ガイド.pdf',
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
]; 