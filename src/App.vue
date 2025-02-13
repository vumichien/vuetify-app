<template>
  <v-app @click="handleOutsideClick">
    <!-- ログインページ以外でヘッダーを表示 -->
    <template v-if="!isLoginPage">
      <v-app-bar app elevation="1" color="#1E2A38" dark height="64">
        <v-app-bar-nav-icon 
          @click.stop="drawer = !drawer"
          class="ml-1"
        ></v-app-bar-nav-icon>
        
        <v-spacer></v-spacer>
        <v-toolbar-title class="app-title">
          <v-icon large color="#42b883" class="mr-2">mdi-robot</v-icon>
          自動生成
        </v-toolbar-title>
        <v-spacer></v-spacer>
      </v-app-bar>

      <v-navigation-drawer 
        v-model="drawer" 
        app
        @click.stop
        temporary
        color="#243447"
        dark
        width="280"
        class="sidebar-nav"
      >
        <div class="menu-header">
          <v-icon color="#42b883" size="28" class="mr-2">mdi-view-dashboard</v-icon>
          <span class="menu-title">メニュー</span>
        </div>

        <!-- Menu Items -->
        <v-list nav dense class="menu-items py-0">
          <v-list-item to="/" exact class="menu-item">
            <v-list-item-icon>
              <v-icon color="#42b883">mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>ホーム</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item to="/create" class="menu-item">
            <v-list-item-icon>
              <v-icon color="#42b883">mdi-plus-circle</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>シナリオ作成</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item to="/update" class="menu-item">
            <v-list-item-icon>
              <v-icon color="#42b883">mdi-update</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>シナリオ更新</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item to="/manual" class="menu-item">
            <v-list-item-icon>
              <v-icon color="#42b883">mdi-book-open-variant</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>マニュアル作成</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <!-- User Profile Section -->
        <template v-slot:append>
          <v-divider color="rgba(255, 255, 255, 0.1)"></v-divider>
          <div class="user-profile">
            <v-list-item class="px-2">
              <v-list-item-avatar size="40" color="rgba(66, 184, 131, 0.1)">
                <v-icon color="#42b883">mdi-account-circle</v-icon>
              </v-list-item-avatar>
              <v-list-item-content class="user-info">
                <v-list-item-title class="user-name">{{ userName }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            
            <v-btn
              block
              text
              @click="logout"
              class="logout-btn mt-2"
              color="#42b883"
            >
              <v-icon left>mdi-logout</v-icon>
              ログアウト
            </v-btn>
          </div>
        </template>
      </v-navigation-drawer>
    </template>

    <v-main :class="{ 'pa-0': isLoginPage }">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      drawer: false,
      isLoggedIn: false,
      userName: '',
      userEmail: 'admin@example.com'
    }
  },
  created() {
    this.checkLoginStatus();
    // login-successイベントをリッスン
    this.$root.$on('login-success', () => {
      this.drawer = false;
    });
  },
  beforeDestroy() {
    // イベントリスナーのクリーンアップ
    this.$root.$off('login-success');
  },
  watch: {
    // サイドバーを閉じるためにルートの変更を監視する
    '$route'() {
      this.drawer = false;
    }
  },
  computed: {
    isLoginPage() {
      return this.$route.name === 'Login'
    }
  },
  methods: {
    checkLoginStatus() {
      const cookies = document.cookie.split(';');
      const isLoggedInCookie = cookies.find(cookie => cookie.trim().startsWith('isLoggedIn='));
      const userNameCookie = cookies.find(cookie => cookie.trim().startsWith('userName='));
      
      this.isLoggedIn = isLoggedInCookie ? isLoggedInCookie.split('=')[1] === 'true' : false;
      this.userName = userNameCookie ? userNameCookie.split('=')[1] : '';

      if (!this.isLoggedIn && !this.isLoginPage) {
        this.$router.push('/login');
      }
      
      // ログイン状態を確認するときにドロワーが閉じていることを確認する
      this.drawer = false;
    },
    logout() {
      // 有効期限を過去の日付に設定してクッキーを削除
      document.cookie = 'isLoggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'userName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      this.isLoggedIn = false;
      this.userName = '';
      this.$router.push('/login');
    },
    handleOutsideClick() {
      // 外側をクリックしたときにドロワーを閉じるロジックを実装
    }
  }
};
</script>

<style scoped>
.app-title {
  font-size: 1.4rem;
  font-weight: 500;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
}

.sidebar-nav {
  padding: 0;
}

.menu-header {
  padding: 20px;
  background-color: #1a2634;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
}

.menu-title {
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.9);
}

.menu-items {
  padding: 12px 8px !important;
  background-color: #243447;
}

.menu-item {
  margin: 4px 0;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.menu-item:hover {
  background-color: rgba(66, 184, 131, 0.1) !important;
}

.menu-subtitle {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5) !important;
  margin-top: 2px;
}

.v-list-item--active {
  background-color: rgba(66, 184, 131, 0.15) !important;
}

.v-list-item--active .v-icon,
.v-list-item--active .v-list-item__title {
  color: #42b883 !important;
}

.user-profile {
  padding: 16px;
  background-color: #1a2634;
}

.user-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
}

.user-email {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
}

.logout-btn {
  text-transform: none !important;
  letter-spacing: 1px;
  height: 36px;
  font-weight: 400;
}

.v-divider {
  margin: 0;
}
</style>
