import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  theme: { dark: false },
  options: {
    customProperties: true
  },
  typography: {
    fontFamily: 'Meiryo'
  }
});