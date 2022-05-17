import { createStore } from 'vuex';
import createPersistedstate from 'vuex-persistedstate';

import cart from './modules/cart';
import user from './modules/user';
import category from './modules/category';

export default createStore({
  modules: {
    cart,
    user,
    category,
  },
  plugins: [
    // 默认存储在localStorage中
    createPersistedstate({
      key: 'erabbit-client-pc-store',
      paths: ['user', 'cart'],
    }),
  ],
});
