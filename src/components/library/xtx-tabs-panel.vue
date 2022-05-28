<template>
  <div class="xtx-tabs-panel" v-show="name === activeName">
    <slot></slot>
  </div>
</template>
<script>
import { inject } from 'vue';

export default {
  name: 'XtxTabsPanel',
  props: {
    // 标签页标题文章 --- $slot.default() 默认插槽内容
    label: {
      type: String,
      default: '',
    },
    // 唯一标识
    name: {
      type: String,
      default: '',
    },
  },
  setup() {
    const activeName = inject('activeName');
    return { activeName };
  },
};
</script>
