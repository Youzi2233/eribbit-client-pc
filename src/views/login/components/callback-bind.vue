<template>
  <Form ref="formCom" class="xtx-form" v-slot="{ errors }" :validation-schema="schema" autocapitalize="off">
    <div class="user-info">
      <img :src="avatar" alt="" />
      <p>Hi，{{ nickname }} 欢迎来小兔鲜，完成绑定后可以QQ账号一键登录哦~</p>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field
          :class="{ err: errors.mobile }"
          name="mobile"
          v-model="form.mobile"
          class="input"
          type="text"
          placeholder="绑定的手机号"
        />
      </div>
      <div v-if="errors.mobile" class="error">{{ errors.mobile }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field
          :class="{ err: errors.code }"
          name="code"
          v-model="form.code"
          class="input"
          type="text"
          placeholder="短信验证码"
        />
        <span @click="send" class="code">
          {{ time === 0 ? '发送验证码' : `${time}` }}
        </span>
      </div>
      <div v-if="errors.code" class="error">{{ errors.code }}</div>
    </div>
    <a @click="submit" href="javascript:;" class="submit">立即绑定</a>
  </Form>
</template>

<script>
import QC from 'qc';
import { reactive, ref, onUnmounted } from 'vue';
import { Form, Field } from 'vee-validate';
import schema from '@/utils/vee-validate-schema';
import { userQQBindCode, userQQBindLogin } from '@/api/user';
import Message from '@/components/library/Message';
import { useIntervalFn } from '@vueuse/shared';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
export default {
  name: 'CallbackBind',
  props: {
    unionId: {
      type: String,
      default: '',
    },
  },
  components: { Form, Field },
  setup(props) {
    // 1.准备信息：openId:unionId  qq头像  昵称
    // 2.完成表单效验
    // 3.发送验证码（校验，定义api，调用，倒计时）
    // 4.进行绑定（绑定成功就是登录成功）
    const nickname = ref('');
    const avatar = ref('');

    if (QC.Login.check()) {
      QC.api('get_user_info').success(res => {
        nickname.value = res.data.nickname;
        avatar.value = res.data.figureurl_qq_1;
      });
    }

    // 表单数据对象
    const form = reactive({
      mobile: '',
      code: '',
    });
    // 定义校验对象
    const mySchema = {
      mobile: schema.mobile,
      code: schema.code,
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
          userQQBindCode(form.mobile)
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

    // 立即绑定
    const store = useStore();
    const router = useRouter();
    const submit = async () => {
      const valid = formCom.value.validate();
      if (valid) {
        userQQBindLogin({ unionId: props.unionId, ...form })
          .then(data => {
            // 实现和之前登录一样的逻辑
            const { id, account, avatar, mobile, nickname, token } = data.result;
            store.commit('user/setUser', { id, account, avatar, mobile, nickname, token });
            store.dispatch('cart/mergeCart').then(() => {
              // 2. 进行跳转,跳转到来源页
              router.push(store.state.user.redirectUrl);
              // 3.成功提示
              Message({ type: 'success', text: '绑定成功' });
            });
          })
          .catch(e => {
            Message({ type: 'error', text: '绑定失败' });
          });
      }
    };

    return { nickname, avatar, form, schema: mySchema, send, formCom, time, submit };
  },
};
</script>

<style scoped lang="less">
.user-info {
  width: 320px;
  height: 70px;
  margin: 0 auto;
  display: flex;
  background: #f2f2f2;
  align-items: center;
  padding: 0 10px;
  margin-bottom: 25px;
  img {
    background: #f2f2f2;
    width: 50px;
    height: 50px;
  }
  p {
    padding-left: 10px;
  }
}
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
