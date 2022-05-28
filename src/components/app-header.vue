<template>
  <header class="app-header">
    <div class="container">
      <h1 class="logo"><router-link to="/">小兔鲜</router-link></h1>
      <!-- 使用头部导航组件 -->
      <AppHeaderNav />
      <div class="search">
        <i class="iconfont icon-search"></i>
        <input type="text" placeholder="搜一搜" />
      </div>
      <!-- 使用头部购物车组件 -->
      <AppHeaderCartVue />
    </div>
  </header>
</template>

<script>
import AppHeaderNav from './app-header-nav.vue';
import AppHeaderCartVue from './app-header-cart.vue';
export default {
  name: 'AppHeader',
  components: {
    AppHeaderNav,
    AppHeaderCartVue,
  },
};
</script>

<style scoped lang="less">
.app-header {
  background: #fff;
  .container {
    display: flex;
    align-items: center;
  }
  .logo {
    width: 200px;
    a {
      display: block;
      height: 132px;
      width: 100%;
      text-indent: -9999px;
      background: url(../assets/images/logo.png) no-repeat center 18px / contain;
    }
  }
  .search {
    width: 170px;
    height: 32px;
    position: relative;
    border-bottom: 1px solid #e7e7e7;
    line-height: 32px;
    .icon-search {
      font-size: 18px;
      margin-left: 5px;
    }
    input {
      width: 140px;
      padding-left: 5px;
      color: #666;
    }
  }
}
</style>
