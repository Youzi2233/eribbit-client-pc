// 扩展vue原有的功能： 全局组件，自定义指令，挂载原型方法，注意：没有全局过滤器
// 这就是插件
// vue2.0插件写法要素：导入一个对象，有install函数，默认传入了Vue构造函数，在Vue基础之上拓展
// vue3.0插件写法要素：导入一个对象，有install函数，默认传入了app应用实例，app基础之上拓展

import defaultImg from '@/assets/images/200.png';
// import XtxSkeleton from './xtx-skeleton';
// import XtxCarousel from './xtx-carousel.vue';
// import XtxMore from './xtx-more.vue';
// import XtxBread from './xtx-bread.vue';
// import XtxBreadItem from './xtx-bread-item.vue';

// 1.使用require提供的函数context，加载某一个目录下的所有 .vue 文件
// 2.然后context函数会返回一个导入函数importFn
// 3.它有一个属性 keys() 获取所有的文件路径
// 4.通过文件路径数组，通过遍历数组，再使用importFn，根据路径导入组件对象
// 5.遍历的同时进行全局注册即可

// context(目录路径，是否加载子目录，加载文件的匹配)
const importFn = require.context('./', false, /\.vue$/);
// console.log(importFn.keys());

export default {
  install(app) {
    // 在app上进行拓展：app提供 component directive 函数
    // 如果要挂载原型 app.config.globalProperties
    // app.component(XtxSkeleton.name, XtxSkeleton);
    // app.component(XtxCarousel.name, XtxCarousel);
    // app.component(XtxMore.name, XtxMore);
    // app.component(XtxBread.name, XtxBread);
    // app.component(XtxBreadItem.name, XtxBreadItem);

    // 根据keys批量注册
    importFn.keys().forEach(path => {
      // 导入组件
      const component = importFn(path).default;
      // 进行注册
      app.component(component.name, component);
    });

    // 定义指令
    defineDirective(app);
  },
};

// 定义指令
const defineDirective = app => {
  // 1.图片懒加载指令
  // 原理：先存储图片地址不能在src上，然后当图片进入可视区域时，将存储图片地址设置给图片元素
  app.directive('lazy', {
    // vue2.0 监听使用指令的DOM是否创建好，钩子函数：inserted
    // vue3.0 的指令拥有的钩子函数和组件的一样，使用指令的DOM是否创建好，钩子函数：mounted
    mounted(el, binding) {
      // console.log('lazy mounted');
      // 2. 创建一个观察对象，来观察当前使用指令的元素
      const observe = new IntersectionObserver(
        ([{ isIntersecting }]) => {
          if (isIntersecting) {
            // 停止观察
            observe.unobserve(el);
            // 3.将指令上的地址设置给el的src属性 binding.value就是指令的值
            // 4.处理图片加载失败，error图片加载失败的事件，load图片加载成功
            el.onerror = () => {
              el.src = defaultImg;
            };
            el.src = binding.value;
          }
        },
        {
          threshold: 0.01,
        }
      );
      // 开启观察
      observe.observe(el);
    },
  });
};
