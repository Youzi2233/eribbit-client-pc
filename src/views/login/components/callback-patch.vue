<template>
  <Form ref="formCom" v-slot="{ errors }" :validation-schema="schema" class="xtx-form" autocapitalize="off">
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-user"></i>
        <Field
          :class="{ err: errors.account }"
          v-model="form.account"
          name="account"
          class="input"
          type="text"
          placeholder="请输入用户名"
        />
      </div>
      <div v-if="errors.account" class="error">{{ errors.account }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field
          :class="{ err: errors.mobile }"
          v-model="form.mobile"
          name="mobile"
          class="input"
          type="text"
          placeholder="请输入手机号"
        />
      </div>
      <div v-if="errors.mobile" class="error">{{ errors.mobile }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field
          :class="{ err: errors.code }"
          v-model="form.code"
          name="code"
          class="input"
          type="text"
          placeholder="请输入验证码"
        />
        <span @click="send" class="code">{{ time === 0 ? '发送验证码' : `${time}` }}</span>
      </div>
      <div v-if="errors.code" class="error">{{ errors.code }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field
          :class="{ err: errors.password }"
          v-model="form.password"
          name="password"
          class="input"
          type="password"
          placeholder="请输入密码"
        />
      </div>
      <div v-if="errors.password" class="error">{{ errors.password }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field
          :class="{ err: errors.rePassword }"
          v-model="form.rePassword"
          name="rePassword"
          class="input"
          type="password"
          placeholder="请确认密码"
        />
      </div>
      <div v-if="errors.rePassword" class="error">{{ errors.rePassword }}</div>
    </div>
    <a @click="submit" href="javascript:;" class="submit">立即提交</a>
  </Form>
</template>

<script>
import { Form, Field } from 'vee-validate';
import schema from '@/utils/vee-validate-schema';
import { onUnmounted, reactive, ref } from 'vue';
import { userQQPatchCode, userQQPatchLogin } from '@/api/user';
import Message from '@/components/library/Message';
import { useIntervalFn } from '@vueuse/shared';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
export default {
  name: 'CallbackPatch',
  props: {
    unionId: {
      type: String,
      default: '',
    },
  },
  components: { Form, Field },

  setup(props) {
    // 1.表单校验  多两个校验：用户名是否存在，再次输入密码是否一致
    // 2.发送短信验证码：发送的接口API定义
    // 3.完善信息

    // 表单数据对象
    const form = reactive({
      account: null,
      password: null,
      mobile: null,
      code: null,
      rePassword: null,
    });
    // 表单校验规则
    const mySchema = {
      account: schema.accountApi,
      password: schema.password,
      code: schema.code,
      mobile: schema.mobile,
      rePassword: schema.rePassword,
    };

    const formCom = ref(null);
    // pause 暂停 resume 开启
    // useInterValFn(回调函数，执行时间，是否立即开始)
    const time = ref(0);
    const { pause, resume } = useIntervalFn(
      () => {
        time.value--;
        if (time.value <= 0) {
          pause();
        }
      },
      1000,
      false
    );
    onUnmounted(() => {
      pause();
    });

    // 发短信验证码
    const send = async () => {
      const valid = mySchema.mobile(form.mobile);
      if (valid === true) {
        // 通过
        // 没有倒计时才可以发送
        if (time.value === 0) {
          userQQPatchCode(form.mobile)
            .then(data => {
              Message({ type: 'success', text: '发送成功' });
              time.value = 60;
              resume();
            })
            .catch(e => {
              formCom.value.setFieldError('mobile', e.response.data.message);
              //   console.log(e.response.data.message);
            });
        }
      } else {
        // 失败，使用vee的错误函数显示错误信息，setFieldError（字段，错误信息）
        formCom.value.setFieldError('mobile', valid);
      }
    };

    // 立即提交
    const store = useStore();
    const router = useRouter();
    const submit = async () => {
      const valid = formCom.value.validate();
      if (valid) {
        userQQPatchLogin({ unionId: props.unionId, ...form })
          .then(data => {
            // 实现和之前登录一样的逻辑
            const { id, account, avatar, mobile, nickname, token } = data.result;
            store.commit('user/setUser', { id, account, avatar, mobile, nickname, token });
            store.dispatch('cart/mergeCart').then(() => {
              // 2. 进行跳转,跳转到来源页
              router.push(store.state.user.redirectUrl);
              // 3.成功提示
              Message({ type: 'success', text: 'QQ完善信息成功' });
            });
          })
          .catch(e => {
            Message({ type: 'error', text: '完善信息失败' });
          });
      }
    };
    return { form, schema: mySchema, formCom, send, time, submit };
  },
};
</script>

<style scoped lang="less">
.code {
  position: absolute;
  right: 0;
  top: 0;
  line-height: 50px;
  width: 80px;
  color: #999;
  &:hover {
    cursor: pointer;
  }
}
</style>
