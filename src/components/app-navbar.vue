<template>
  <nav class="app-topnav">
    <div class="container">
      <ul>
        <template v-if="profile.token">
          <li>
            <router-link to="/member"><i class="iconfont icon-user"></i>{{ profile.account }}</router-link>
          </li>
          <li><a @click="logout" href="javascript:;">退出登录</a></li>
        </template>
        <template v-else>
          <li><router-link to="/login">请先登录</router-link></li>
          <li><a href="javascript:;">免费注册</a></li>
        </template>
        <li><router-link to="/member/order">我的订单</router-link></li>
        <li><a href="javascript:;">会员中心</a></li>
        <li><a href="javascript:;">帮助中心</a></li>
        <li><a href="javascript:;">关于我们</a></li>
        <li>
          <a href="javascript:;"><i class="iconfont icon-phone"></i>手机版</a>
        </li>
      </ul>
    </div>
  </nav>
</template>
<script>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
  name: 'AppTopnav',
  setup() {
    // 获取用户的登录信息才能控制切换导航菜单
    const store = useStore();
    // 使用计算属性，让vuex里的数据变为响应式
    const profile = computed(() => {
      return store.state.user.profile;
    });

    // 退出登录
    // 1.清空本地存储信息和vuex的用户信息
    // 2.跳转登录
    const router = useRouter();
    const logout = () => {
      store.commit('user/setUser', {});
      // 清空购物车
      store.commit('cart/setCart', []);
      router.push('/login');
    };
    return {
      profile,
      logout,
    };
  },
};
</script>
<style scoped lang="less">
.app-topnav {
  background: #333;
  ul {
    display: flex;
    height: 53px;
    justify-content: flex-end;
    align-items: center;
    li {
      a {
        padding: 0 15px;
        color: #cdcdcd;
        line-height: 1;
        display: inline-block;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
        &:hover {
          color: @xtxColor;
        }
      }
      ~ li {
        a {
          border-left: 2px solid #666;
        }
      }
    }
  }
}
// ~选择器作用： 选择当前选择器后台的所有的元素
</style>
