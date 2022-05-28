<template>
  <div class="member-home">
    <!-- 概览 -->
    <HomeOverview />
    <!-- 收藏 -->
    <HomePanel title="我的收藏">
      <GoodsItem v-for="item in collectGoods" :key="item.id" :goods="item" />
    </HomePanel>
    <!-- 足迹 -->
    <HomePanel title="我的足迹">
      <GoodsItem v-for="item in browseHistory" :key="item.id" :goods="item" />
    </HomePanel>
    <!-- 猜你喜欢 -->
    <GoodsRelevant />
  </div>
</template>
<script>
import HomeOverview from './components/home-overview.vue';
import HomePanel from './components/home-panel.vue';
import GoodsRelevant from '@/views/goods/components/goods-relevant.vue';
import GoodsItem from '@/views/category/components/goods-item.vue';
import { ref } from 'vue';
import { findCollect, findBrowseHistory } from '@/api/member';
export default {
  name: 'MemberHome',
  components: { HomeOverview, HomePanel, GoodsRelevant, GoodsItem },
  setup() {
    // 调用模拟的接口
    // 我的收藏数据
    const collectGoods = ref([]);
    // 我的足迹数据
    const browseHistory = ref([]);
    findCollect({
      page: 1,
      pageSize: 4,
    }).then(data => {
      collectGoods.value = data.result.items;
    });
    findBrowseHistory({
      page: 1,
      pageSize: 4,
    }).then(data => {
      browseHistory.value = data.result.items;
    });

    return { collectGoods, browseHistory };
  },
};
</script>
<style scoped lang="less">
:deep(.xtx-carousel) {
  .carousel-btn.prev {
    left: 5px;
  }
  .carousel-btn.next {
    right: 5px;
  }
}
</style>
