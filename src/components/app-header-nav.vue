<template>
  <ul class="app-header-nav">
    <li class="home"><router-link to="/">首页</router-link></li>
    <li v-for="item in list" :key="item.id" @mousemove="show(item.id)" @mouseleave="hide(item.id)">
      <router-link @click="hide(item.id)" :to="`/category/${item.id}`">{{ item.name }}</router-link>
      <div class="layer" :class="{ open: item.open }">
        <ul>
          <li v-for="sub in item.children" :key="sub.id">
            <router-link @click="hide(item.id)" :to="`/category/sub/${sub.id}`">
              <img :src="sub.picture" alt="" />
              <p>{{ sub.name }}</p>
            </router-link>
          </li>
        </ul>
      </div>
    </li>
  </ul>
</template>
<script>
import { useStore } from 'vuex';
import { computed } from 'vue';

export default {
  name: 'AppHeaderNav',
  setup() {
    const store = useStore();
    // 拿到vuex中的分类列表
    const list = computed(() => {
      return store.state.category.list;
    });

    // 跳转的时候不会关闭二级类目，通过数据来控制
    // 1. 每个分类加上open数据
    // 2. vuex提供显示和隐藏函数，修改open数据
    // 3. 组件中使用vuex中的函数，使用事件来绑定，提供一个类名显示隐藏的类名
    const show = id => {
      store.commit('category/show', id);
    };

    const hide = id => {
      store.commit('category/hide', id);
    };

    return {
      list,
      show,
      hide,
    };
  },
};
</script>
<style lang="less" scoped>
.app-header-nav {
  width: 820px;
  display: flex;
  justify-content: space-around;
  padding-left: 40px;
  position: relative;
  z-index: 998;
  > li {
    margin-right: 40px;
    width: 38px;
    text-align: center;
    > a {
      font-size: 16px;
      line-height: 32px;
      height: 32px;
      display: inline-block;
    }
    &:hover {
      > a {
        color: @xtxColor;
        border-bottom: 1px solid @xtxColor;
      }
      //   显示二级类目
      //   > .layer {
      //     height: 132px;
      //     opacity: 1;
      //   }
    }
  }
}

// 二级类名弹层
.layer {
  &.open {
    height: 132px;
    opacity: 1;
  }
  width: 1240px;
  background-color: #fff;
  position: absolute;
  left: -200px;
  top: 56px;
  height: 0;
  overflow: hidden;
  opacity: 0;
  // z-index: 999;
  box-shadow: 0 0 5px #ccc;
  transition: all 0.2s 0.1s;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 70px;
    align-items: center;
    height: 132px;
    li {
      width: 110px;
      text-align: center;
      img {
        width: 60px;
        height: 60px;
      }
      p {
        padding-top: 10px;
      }
      &:hover {
        p {
          color: @xtxColor;
        }
      }
    }
  }
}
</style>
