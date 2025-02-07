<template>
  <v-app @click="handleOutsideClick">
    <!-- Hide app bar and navigation drawer on login page -->
    <template v-if="!isLoginPage">
      <v-app-bar app color="#1E2A38" dark height="64">
        <!-- Menu toggle button -->
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        
        <v-spacer></v-spacer>
        <v-toolbar-title class="text-center">自動生成</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-app-bar>

      <v-navigation-drawer 
        v-model="drawer" 
        app
        @click.stop
        temporary
        color="#243447"
        dark
        class="sidebar-nav"
      >
        <div class="menu-header">
          <span class="menu-title">メニュー</span>
        </div>

        <!-- Menu Items -->
        <v-list nav dense class="menu-items">
          <v-list-item to="/create" class="menu-item">
            <v-list-item-icon>
              <v-icon color="#42b883">mdi-plus-circle</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>自動化シナリオ作成</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item to="/update" class="menu-item">
            <v-list-item-icon>
              <v-icon color="#42b883">mdi-update</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>自動化シナリオ更新</v-list-item-title>
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

        <!-- User Profile Section at bottom -->
        <template v-slot:append>
          <v-divider color="rgba(255, 255, 255, 0.1)"></v-divider>
          <v-list-item class="user-profile">
            <v-list-item-avatar size="40">
              <v-icon color="#42b883">mdi-account-circle</v-icon>
            </v-list-item-avatar>
            <v-list-item-content class="user-info">
              <v-list-item-title class="subtitle-2">{{ userName }}</v-list-item-title>
              <v-list-item-subtitle class="caption">{{ userEmail }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          
          <v-list-item @click="logout" class="menu-item">
            <v-list-item-icon>
              <v-icon color="#42b883">mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>ログアウト</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-navigation-drawer>
    </template>

    <v-main>
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
    // Lắng nghe sự kiện login-success
    this.$root.$on('login-success', () => {
      this.drawer = false;
    });
  },
  beforeDestroy() {
    // Cleanup event listener
    this.$root.$off('login-success');
  },
  watch: {
    // Theo dõi thay đổi route để đóng sidebar
    '$route'() {
      this.drawer = false;
    }
  },
  computed: {
    isLoginPage() {
      return this.$route.name === 'LoginPage';
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
      
      // Đảm bảo drawer đóng khi kiểm tra trạng thái đăng nhập
      this.drawer = false;
    },
    logout() {
      // Delete cookies by setting expiry to past date
      document.cookie = 'isLoggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'userName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      this.isLoggedIn = false;
      this.userName = '';
      this.$router.push('/login');
    },
    handleOutsideClick() {
      // Implement the logic to close the drawer when clicking outside
    }
  }
};
</script>

<style scoped>
.sidebar-nav {
  padding: 0;
}

.menu-header {
  padding: 20px 16px;
  background-color: #1a2634; /* Adjusted for new color scheme */
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.menu-title {
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.9);
}

.menu-items {
  padding-top: 8px;
  background-color: #243447; /* Match with sidebar base color */
}

.menu-item {
  margin: 4px 8px;
  border-radius: 4px;
}

.menu-item:hover {
  background-color: rgba(66, 184, 131, 0.1) !important;
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
  background-color: #1a2634; /* Match with menu header */
}

.user-info .v-list-item-title {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
}

.user-info .v-list-item-subtitle {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
}

.v-divider {
  margin: 8px 0;
}

/* Style for menu item text */
.v-list-item__title {
  color: rgba(255, 255, 255, 0.9) !important; /* Bright white for menu items */
}
</style>
