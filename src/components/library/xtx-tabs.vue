<script>
import { useVModel } from '@vueuse/core';
import { provide } from 'vue';
export default {
  name: 'XtxTabs',
  props: {
    modelValue: {
      type: [String, Number],
      default: '',
    },
  },
  setup(props, { emit }) {
    //   接收v=model的值
    const activeName = useVModel(props, 'modelValue', emit);
    // 点击选项卡触发的函数
    const tabClick = (name, index) => {
      activeName.value = name;
      emit('tab-click', { name, index });
    };
    // 给每一个panel传当前激活的name
    provide('activeName', activeName);
    return { activeName, tabClick };
  },
  render() {
    //   获取插槽内容
    const panels = this.$slots.default();
    // console.log(panels);

    // 动态的panels组件集合
    const dynamicPanels = [];
    panels.forEach(item => {
      // 静态
      if (item.type.name === 'XtxTabsPanel') {
        dynamicPanels.push(item);
      } else {
        item.children.forEach(item => {
          dynamicPanels.push(item);
        });
      }
    });

    // 需要在这里进行组织
    // 1. tabs组件大容器
    // 2. 选项卡标签
    // 3. 内容容器
    const nav = (
      <nav>
        {dynamicPanels.map((item, i) => {
          return (
            <a
              onClick={() => this.tabClick(item.props.name, i)}
              class={{ active: item.props.name === this.activeName }}
              href="javascript:;"
            >
              {item.props.label}
            </a>
          );
        })}
      </nav>
    );
    return <div class="xtx-tabs">{[nav, dynamicPanels]}</div>;
  },
};
</script>

<style lang="less" scoped>
.xtx-tabs {
  background: #fff;
  > nav {
    height: 60px;
    line-height: 60px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    > a {
      width: 110px;
      border-right: 1px solid #f5f5f5;
      text-align: center;
      font-size: 16px;
      &.active {
        border-top: 2px solid @xtxColor;
        height: 60px;
        background: #fff;
        line-height: 56px;
      }
    }
  }
}
</style>
