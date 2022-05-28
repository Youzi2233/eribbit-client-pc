<template lang="">
  <div class="member-order">
    <XtxTabs @tab-click="changeTab" v-model="activeName">
      <XtxTabsPanel v-for="item in orderStatus" :key="item.name" :label="item.label" :name="item.name"> </XtxTabsPanel>
    </XtxTabs>

    <!-- 列表 -->
    <div class="list">
      <div v-if="loading" class="loading"></div>
      <div class="none" v-if="!loading && orderList.length === 0">暂无数据</div>
      <OrderItem
        @on-delete="handlerDelete"
        @on-cancel="handlerCancel"
        v-for="item in orderList"
        :key="item.id"
        :order="item"
      />
    </div>
    <!-- 分页 -->
    <XtxPagination
      v-if="total > 0"
      :current-page="reqParams.page"
      :page-size="reqParams.pageSize"
      :total="total"
      @current-change="reqParams.page = $event"
    />
    <!-- 取消原因组件 -->
    <Teleport to="#model">
      <OrderCancel ref="orderCancelCom" />
    </Teleport>
  </div>
</template>
<script>
import { reactive, ref, watch } from 'vue';
import { orderStatus } from '@/api/constants';
import OrderItem from './components/order-item.vue';
import { findOrderList, deleteOrder } from '@/api/order';
import OrderCancel from './components/order-cancel.vue';
import confirm from '@/components/library/confirm';
import Message from '@/components/library/Message';

export default {
  name: 'MemberOrder',
  components: { OrderItem, OrderCancel },
  setup() {
    const activeName = ref('all');

    // 获取数据
    const reqParams = reactive({
      page: 1,
      pageSize: 5,
      orderState: 0,
    });
    const orderList = ref([]);
    const loading = ref(false);
    const total = ref(0);

    const getOrderList = () => {
      loading.value = true;
      findOrderList(reqParams).then(data => {
        orderList.value = data.result.items;
        total.value = data.result.counts;
        loading.value = false;
      });
    };

    // 筛选条件发生变化重新加载
    watch(
      reqParams,
      () => {
        getOrderList();
      },
      { immediate: true }
    );

    // 点击切换筛选条件
    const changeTab = obj => {
      reqParams.page = 1;
      reqParams.orderState = obj.index;
    };

    // 删除订单
    const handlerDelete = order => {
      confirm({ text: '亲，您确认删除该订单吗？' })
        .then(() => {
          deleteOrder(order.id).then(() => {
            Message({ type: 'success', text: '删除成功' });
            getOrderList();
          });
        })
        .catch(() => {});
    };
    return { activeName, changeTab, orderStatus, orderList, loading, total, reqParams, handlerDelete, ...useCancel() };
  },
};

// 取消订单逻辑
export const useCancel = () => {
  // 组件实例
  const orderCancelCom = ref(null);
  // 点击取消
  const handlerCancel = order => {
    orderCancelCom.value.open(order);
  };
  return { handlerCancel, orderCancelCom };
};
</script>
<style lang="less" scoped>
.list {
  background-color: #fff;
  padding: 20px;
  position: relative;
  min-height: 600px;
}
.loading {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(255, 255, 255, 0.9) url(../../../assets/images/loading.gif) no-repeat center;
}
.none {
  height: 100%;
  text-align: center;
  line-height: 600px;
  color: #999;
}
</style>
