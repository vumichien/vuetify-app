<template>
  <v-container fluid fill-height class="login-container">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="6" md="3">
        <v-card class="elevation-12">
          <v-toolbar color="#1E2A38" dark flat>
            <v-toolbar-title>ログインフォーム</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="login">
              <v-text-field
                v-model="username"
                label="ユーザー名"
                prepend-icon="mdi-account"
                type="text"
                :error-messages="errorMessage"
                color="#42b883"
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="パスワード"
                prepend-icon="mdi-lock"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                @click:append="showPassword = !showPassword"
                :error-messages="errorMessage"
                color="#42b883"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions class="pb-4 px-4">
            <v-spacer></v-spacer>
            <v-btn 
              color="#42b883" 
              dark 
              @click="login"
              :elevation="2"
              class="px-6"
            >
              ログイン
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      username: '',
      password: '',
      errorMessage: '',
      showPassword: false
    }
  },
  methods: {
    login() {
      if (this.username === 'admin' && this.password === 'admin') {
        const expiryDate = new Date();
        expiryDate.setTime(expiryDate.getTime() + (24 * 60 * 60 * 1000));
        document.cookie = `isLoggedIn=true; expires=${expiryDate.toUTCString()}; path=/`;
        document.cookie = `userName=admin; expires=${expiryDate.toUTCString()}; path=/`;
        
        // イベントを発行してサイドバーを閉じる
        this.$root.$emit('login-success');
        
        this.$router.push('/');
      } else {
        this.errorMessage = 'ユーザー名またはパスワードが間違っています。';
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  background-color: #f5f5f5;
}

.v-card {
  width: 100%;
  max-width: 600px;
  margin: auto;
  border-radius: 8px;
}

.v-text-field ::v-deep .v-input__icon--append .v-icon {
  color: rgba(0, 0, 0, 0.6);
}

.v-text-field ::v-deep .v-input__icon--append:hover .v-icon {
  color: #42b883;
}

.v-text-field ::v-deep .v-input__icon--prepend .v-icon {
  color: #42b883;
}

.v-btn {
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.v-toolbar {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.v-toolbar__title {
  font-size: 1.1rem;
  font-weight: 500;
}

.v-text-field ::v-deep .v-label {
  font-size: 0.95rem;
}

.v-text-field.error--text ::v-deep .v-messages__message {
  color: #ff5252;
  font-size: 0.8rem;
}
</style>
