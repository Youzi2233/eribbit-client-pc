<template lang="">
  <div class="member-order-detail" v-if="order">
    <!-- 头部 -->
    <DetailAction :order="order" />
    <!-- 进度 -->
    <DetailSteps :order="order" />
    <!-- 物流 -->
    <!-- 信息 -->
    <DetailInfo :order="order" />
  </div>
  <div class="member-order-detail loading" v-else></div>
</template>
<script>
import { findOrderDetail } from '@/api/order';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import DetailAction from './components/detail-action.vue';
import DetailSteps from './components/detail-steps.vue';
import DetailInfo from './components/detail-info.vue';
export default {
  name: 'MemberOrderDetail',
  components: { DetailAction, DetailSteps, DetailInfo },
  setup() {
    const order = ref(null);
    const route = useRoute();
    findOrderDetail(route.params.id).then(data => {
      order.value = data.result;
    });
    return {
      order,
    };
  },
};
</script>
<style lang="less" scoped>
.member-order-detail {
  background-color: #fff;
  height: 100%;
}

.loading {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(255, 255, 255, 0.9) url(../../../assets/images/loading.gif) no-repeat center;
}
</style>
