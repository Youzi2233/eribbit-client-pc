<template>
  <XtxDialog :title="`${formData.id ? '修改' : '添加'}收货地址`" v-model:visible="visibleDialog">
    <div class="xtx-form">
      <div class="xtx-form-item">
        <div class="label">收货人：</div>
        <div class="field">
          <input v-model="formData.receiver" class="input" placeholder="请输入收货人" />
        </div>
      </div>
      <div class="xtx-form-item">
        <div class="label">手机号：</div>
        <div class="field">
          <input v-model="formData.contact" class="input" placeholder="请输入手机号" />
        </div>
      </div>
      <div class="xtx-form-item">
        <div class="label">地区：</div>
        <div class="field">
          <XtxCity :fullLocation="formData.fullLocation" @change="changeCity" placeholder="请选择所在地区" />
        </div>
      </div>
      <div class="xtx-form-item">
        <div class="label">详细地址：</div>
        <div class="field">
          <input v-model="formData.address" class="input" placeholder="请输入详细地址" />
        </div>
      </div>
      <div class="xtx-form-item">
        <div class="label">邮政编码：</div>
        <div class="field">
          <input v-model="formData.postalCode" class="input" placeholder="请输入邮政编码" />
        </div>
      </div>
      <div class="xtx-form-item">
        <div class="label">地址标签：</div>
        <div class="field">
          <input v-model="formData.addressTags" class="input" placeholder="请输入地址标签，逗号分隔" />
        </div>
      </div>
    </div>
    <template v-slot:footer>
      <XtxButton @click="visibleDialog = false" type="gray" style="margin-right: 20px">取消</XtxButton>
      <XtxButton @click="submit" type="primary">确认</XtxButton>
    </template>
  </XtxDialog>
</template>
<script>
import { ref, reactive } from 'vue';
import { addAddress, editAddress } from '@/api/order';
import Message from '@/components/library/Message';
export default {
  name: 'AddressEdit',
  setup(props, { emit }) {
    const visibleDialog = ref(false);

    // 定义一个open函数，作为打开对话框函数，组件实例上拥有open函数
    const open = address => {
      visibleDialog.value = true;
      if (address.id) {
        //   修改，填充表单
        for (const key in address) {
          formData[key] = address[key];
        }
      } else {
        //   添加
        for (const key in formData) {
          if (key === 'isDefault') {
            formData[key] = 0;
          } else {
            formData[key] = '';
          }
        }
      }
    };

    // 定义表单数据对象
    const formData = reactive({
      receiver: '',
      contact: '',
      provinceCode: '',
      cityCode: '',
      countyCode: '',
      address: '',
      postalCode: '',
      addressTags: '',
      isDefault: 0,
      //   城市组件显示的文字（完整行政区地址）
      fullLocation: '',
    });

    // 城市选中
    const changeCity = result => {
      formData.provinceCode = result.provinceCode;
      formData.cityCode = result.cityCode;
      formData.countyCode = result.countyCode;
      formData.fullLocation = result.fullLocation;
    };

    // 添加时候提交操作（修改）
    const submit = () => {
      // 省略了校验
      if (
        !formData.receiver ||
        !formData.contact ||
        !formData.fullLocation ||
        !formData.address ||
        !formData.postalCode ||
        !formData.addressTags
      ) {
        Message({ text: '请填写完整的收货地址信息' });
        return;
      }
      // 发送请求
      if (formData.id) {
        //   修改请求
        editAddress(formData).then(() => {
          Message({ type: 'success', text: '修改成功' });
          visibleDialog.value = false;
          // 触发自定义事件
          emit('on-success', formData);
        });
      } else {
        //   添加
        addAddress(formData).then(data => {
          //   需要设置ID
          formData.id = data.result.id;
          Message({ type: 'success', text: '添加成功' });
          visibleDialog.value = false;
          // 触发自定义事件
          emit('on-success', formData);
        });
      }
    };

    return { visibleDialog, open, formData, changeCity, submit };
  },
};
</script>
<style scoped lang="less">
.xtx-dialog {
  :deep(.wrapper) {
    width: 780px;
    .body {
      font-size: 14px;
    }
  }
}
.xtx-form {
  padding: 0;
  input {
    outline: none;
    &::placeholder {
      color: #ccc;
    }
  }
}
.xtx-city {
  width: 320px;
  :deep(.select) {
    height: 50px;
    line-height: 48px;
    display: flex;
    padding: 0 10px;
    justify-content: space-between;
    .placeholder {
      color: #ccc;
    }
    i {
      color: #ccc;
      font-size: 18px;
    }
    .value {
      font-size: 14px;
    }
  }
  :deep(.option) {
    top: 49px;
  }
}
</style>
