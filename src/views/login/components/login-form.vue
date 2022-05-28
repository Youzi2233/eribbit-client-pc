<template>
  <div class="account-box">
    <div class="toggle">
      <a @click="isMsgLogin = false" href="javascript:;" v-show="isMsgLogin">
        <i class="iconfont icon-user"></i> 使用账号登录
      </a>
      <a @click="isMsgLogin = true" href="javascript:;" v-show="!isMsgLogin">
        <i class="iconfont icon-msg"></i> 使用短信登录
      </a>
    </div>
    <Form ref="formCom" class="form" v-slot="{ errors }" :validation-schema="schema">
      <!-- 用户名&密码 -->
      <template v-if="!isMsgLogin">
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field
              :class="{ error: errors.account }"
              v-model="form.account"
              name="account"
              type="text"
              placeholder="请输入用户名"
            />
          </div>
          <div v-if="errors.account" class="error"><i class="iconfont icon-warning" />{{ errors.account }}</div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-lock"></i>
            <Field
              :class="{ error: errors.password }"
              v-model="form.password"
              name="password"
              type="password"
              placeholder="请输入密码"
            />
          </div>
          <div v-if="errors.password" class="error"><i class="iconfont icon-warning" />{{ errors.password }}</div>
        </div>
      </template>

      <!-- 手机号&验证码 -->
      <template v-else>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field
              :class="{ error: errors.mobile }"
              v-model="form.mobile"
              name="mobile"
              type="text"
              placeholder="请输入手机号"
            />
          </div>
          <div v-if="errors.mobile" class="error"><i class="iconfont icon-warning" />{{ errors.mobile }}</div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-code"></i>
            <Field
              :class="{ error: errors.code }"
              v-model="form.code"
              name="code"
              type="text"
              placeholder="请输入验证码"
            />
            <span @click="send" class="code">
              {{ time === 0 ? '发送验证码' : `${time}秒后发送` }}
            </span>
          </div>
          <div v-if="errors.code" class="error"><i class="iconfont icon-warning" />{{ errors.code }}</div>
        </div>
      </template>
      <div class="form-item">
        <div class="agree">
          <Field as="XtxCheckbox" name="isAgree" v-model="form.isAgree" />
          <span>我已同意</span>
          <a href="javascript:;">《隐私条款》</a>
          <span>和</span>
          <a href="javascript:;">《服务条款》</a>
        </div>
        <div v-if="errors.isAgree" class="error"><i class="iconfont icon-warning" />{{ errors.isAgree }}</div>
      </div>
      <a @click="login" href="javascript:;" class="btn">登录</a>
    </Form>
    <div class="action">
      <!-- <span id="qqLoginBtn"></span> -->
      <a
        href="https://graph.qq.com/oauth2.0/authorize?client_id=100556005&response_type=token&scope=all&redirect_uri=http%3A%2F%2Fwww.corho.com%3A8080%2F%23%2Flogin%2Fcallback"
      >
        <img src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png" alt="" />
      </a>
      <div class="url">
        <a href="javascript:;">忘记密码</a>
        <a href="javascript:;">免费注册</a>
      </div>
    </div>
  </div>
</template>

<script>
import { onUnmounted, reactive, ref, watch } from 'vue';
import { Form, Field } from 'vee-validate';
import schema from '@/utils/vee-validate-schema';
import Message from '@/components/library/Message';
import { userAccountLogin, userMobileLoginMsg, userMobileLogin } from '@/api/user';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { useIntervalFn } from '@vueuse/shared';

export default {
  name: 'LoginForm',
  components: { Form, Field },
  setup() {
    // 是否短信登录
    const isMsgLogin = ref(false);
    // 表单信息对象
    const form = reactive({
      isAgree: true,
      account: 'youzi2233',
      password: '123456',
      mobile: '15772110000',
      code: '123456',
    });

    // vee-validate 效验基本步骤
    // 1. 导入Form Field组件 将form 和 input 进行替换，需要加上name用来指定将来的效验规则函数
    // 2. Field需要进行数据绑定
    // 3. 定义Field组件的name属性指定效验规则函数，Form的validation-schema接收定义好的效验规则
    // 4. 自定义组件需要效验必须支持v-model，然后Field使用as指定为组件名称
    const mySchema = {
      // 效验函数规则：返回true就是效验成功，返回一个字符串就是失败，字符串就是错误提示
      account: schema.account,
      password: schema.password,
      mobile: schema.mobile,
      code: schema.code,
      isAgree: schema.isAgree,
    };

    // 监听isMesLogin重置表单（数据 + 清除效验结果）
    // ref 组件拿的是实例 Dom拿的Dom
    const formCom = ref(null);
    watch(isMsgLogin, () => {
      // 重置数据
      form.isAgree = true;
      form.account = 'youzi2233';
      form.password = '123456';
      form.mobile = '15772110000';
      form.code = '123456';
      // 如果是没有销毁Field组件，之前的效验结果不会清除 例如v-show切换
      // Form组件提供了一个resetForm函数清除效验结果
      //   formCom.value.resetForm();
    });

    // 需要在点击登录的时候对整体表单进行效验
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const login = async () => {
      // Form组件提供了一个validate函数作为整体表单效验，但是返回的是一个promise
      const validRes = await formCom.value.validate();
      if (validRes) {
        try {
          let data = null;
          if (isMsgLogin.value) {
            // 手机号登录
            // 1.发送验证码
            // 1.1绑定发送验证码按钮点击事件
            // 1.2效验手机号，如果成功才去发送短信（定义API），请求成功开启60秒倒计时，不能再次点击
            //   1.3效验失败
            // 2.手机号登录
            const { mobile, code } = form;
            data = await userMobileLogin({ mobile, code });
          } else {
            // 账号登录
            // 1.准备一个API做账号登录
            // 2.调用API函数
            // 3.成功：存储用户信息 + 跳转到来源页或者首页 + 消息提示
            // 4.失败：消息提示
            const { account, password } = form;
            data = await userAccountLogin({ account, password });
          }
          //   存储用户信息
          const { id, account, avatar, mobile, nickname, token } = data.result;
          store.commit('user/setUser', { id, account, avatar, mobile, nickname, token });
          store.dispatch('cart/mergeCart').then(() => {
            // 进行跳转
            router.push(route.query.redirectUrl ?? '/');
            // 成功的消息提示
            Message({ type: 'success', text: '登录成功' });
          });
        } catch (e) {
          // 失败提示
          Message({ type: 'error', text: e.response.data.message || '登录失败' });
        }
      }
    };

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
    const send = async () => {
      const valid = mySchema.mobile(form.mobile);
      if (valid === true) {
        // 通过
        // 没有倒计时才可以发送
        if (time.value === 0) {
          userMobileLoginMsg(form.mobile)
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

    // 初始化QQ登录按钮（官方）
    // 1.准备span有id
    // QC.Login({ btnId: 'qqLoginBtn' });
    // onMounted(() => {
    //   QC.Login({ btnId: 'qqLoginBtn' });
    // });

    return { login, isMsgLogin, form, schema: mySchema, formCom, send, time };
  },
};
</script>

<style lang="less" scoped>
// 账号容器
.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;
    a {
      color: @xtxColor;
      i {
        font-size: 14px;
      }
    }
  }
  .form {
    padding: 0 40px;
    &-item {
      margin-bottom: 28px;
      .input {
        position: relative;
        height: 36px;
        > i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }
        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;
          &.error {
            border-color: @priceColor;
          }
          &.active,
          &:focus {
            border-color: @xtxColor;
          }
        }
        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
        }
      }
      > .error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: @priceColor;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }
    .agree {
      a {
        color: #069;
      }
    }
    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: @xtxColor;
      &.disabled {
        background: #cfcdcd;
      }
    }
  }
  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
</style>
