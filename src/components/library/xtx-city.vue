<template>
  <div class="xtx-city" ref="target">
    <div @click="toggle" class="select" :class="{ active: visible }">
      <span v-if="!fullLocation" class="placeholder">{{ placeholder }}</span>
      <span v-else class="value">{{ fullLocation }}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="option" v-show="visible">
      <div v-if="loading" class="loading"></div>
      <template v-else>
        <span @click="changeItem(item)" class="ellipsis" v-for="item in currList" :key="item.code">{{
          item.name
        }}</span>
      </template>
    </div>
  </div>
</template>

<script>
import { onClickOutside } from '@vueuse/core';
import axios from 'axios';
import { computed, reactive, ref } from 'vue';

export default {
  name: 'XtxCity',
  props: {
    fullLocation: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '请选择配送地址',
    },
  },
  setup(props, { emit }) {
    //   显示隐藏数据
    const visible = ref(false);

    // 所有省市区数据
    const allCityData = ref([]);
    // 正在加载数据
    const loading = ref(false);

    // 提供打开和关闭的方法
    const open = () => {
      visible.value = true;
      //  获取地区数据
      loading.value = true;
      getCityData().then(data => {
        allCityData.value = data;
        loading.value = false;
      });
      //   清空之前的选择
      for (const key in changeResult) {
        changeResult[key] = '';
      }
    };
    const close = () => {
      visible.value = false;
    };
    // 提供一个切换函数给select使用
    const toggle = () => {
      visible.value ? close() : open();
    };
    // 实现点击组件外部元素关闭操作
    const target = ref(null);
    onClickOutside(target, () => {
      // 参数1：监听哪个元素
      // 参数2.点击外部元素的回调
      close();
    });

    // 实现计算属性：获取当前显示的地区数组
    const currList = computed(() => {
      // 默认显示省级
      let list = allCityData.value;
      // 可能：  市一级
      if (changeResult.provinceCode && changeResult.provinceName) {
        list = list.find(p => p.code === changeResult.provinceCode).areaList;
      }
      // 可能 县地区一级
      if (changeResult.cityCode && changeResult.cityName) {
        list = list.find(p => p.code === changeResult.cityCode).areaList;
      }
      return list;
    });

    // 定义选择的 省市区 数据
    const changeResult = reactive({
      provinceCode: '',
      provinceName: '',
      cityCode: '',
      cityName: '',
      countyCode: '',
      countyName: '',
      fullLocation: '',
    });
    // 当点击地区按钮时记录
    const changeItem = item => {
      if (item.level === 0) {
        // 省
        changeResult.provinceCode = item.code;
        changeResult.provinceName = item.name;
      }
      if (item.level === 1) {
        // 市
        changeResult.cityCode = item.code;
        changeResult.cityName = item.name;
      }
      if (item.level === 2) {
        // 县
        changeResult.countyCode = item.code;
        changeResult.countyName = item.name;
        // 这是最后一级，关闭对话框，把数据通知给父组件
        close();
        changeResult.fullLocation = `${changeResult.provinceName} ${changeResult.cityName} ${changeResult.countyName}`;
        emit('change', changeResult);
      }
    };

    return { visible, toggle, target, loading, currList, changeItem };
  },
};

// 获取省市区数据函数
const getCityData = () => {
  // 数据：https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json
  // 1. 当本地没有缓存，发请求获取数据
  // 2. 当本地有缓存，取出本地数据
  // 返回一个promise在then中后去数据，这里可能是异步操作可能是同步
  return new Promise((resolve, reject) => {
    // 约定：数据存储在window上的cityData字段
    if (window.cityData) {
      resolve(window.cityData);
    } else {
      const url = 'https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json';
      axios.get(url).then(res => {
        //   缓存
        window.cityData = res.data;
        resolve(res.data);
      });
    }
  });
};
</script>

<style lang="less" scoped>
.xtx-city {
  display: inline-block;
  position: relative;
  z-index: 400;
  .select {
    border: 1px solid #e4e4e4;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    cursor: pointer;
    &.active {
      background: #fff;
    }
    .placeholder {
      color: #999;
    }
    .value {
      color: #666;
      font-size: 12px;
    }
    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .option {
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    // 省略...
    .loading {
      height: 290px;
      width: 100%;
      background: url(../../assets/images/loading.gif) no-repeat center;
    }
    > span {
      width: 130px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 3px;
      &:hover {
        background: #f5f5f5;
      }
    }
  }
}
</style>
