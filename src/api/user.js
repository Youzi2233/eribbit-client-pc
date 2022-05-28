// 用户相关的接口

import request from '@/utils/request';

/**
 * 用户名密码登录
 * @param {String} account - 用户名
 * @param {String} password - 密码
 * @returns Promise
 */
export const userAccountLogin = ({ account, password }) => {
  return request('login', 'post', { account, password });
};

/**
 * 获取手机号短信验证码
 * @param {String} mobile - 手机号
 * @returns promise
 */
export const userMobileLoginMsg = mobile => {
  return request('/login/code', 'get', { mobile });
};

/**
 * 手机号登录
 * @param {String} mobile
 * @param {String} code
 * @returns Promise
 */
export const userMobileLogin = ({ mobile, code }) => {
  return request('/login/code', 'post', { mobile, code });
};

/**
 * QQ登录
 * @param {String} unionId - QQ唯一标识，openId
 * @param {*} source - 客户端类型 1 PC
 * @returns
 */
export const userQQLogin = (unionId, source = 1) => {
  return request('/login/social', 'post', { unionId, source });
};

/**
 * 获取QQ绑定的手机的短信验证码
 * @param {String} mobile - 手机号
 * @returns promise
 */
export const userQQBindCode = mobile => {
  return request('/login/social/code', 'get', { mobile });
};

/**
 * QQ登录-绑定账号
 * @param {String} unionId - QQ唯一标识，openId
 * @param {String} mobile - 手机号
 * @param {String} code - 验证码
 * @returns
 */
export const userQQBindLogin = ({ unionId, mobile, code }) => {
  return request('/login/social/bind', 'post', { unionId, mobile, code });
};

/**
 * 校验用户名是否存在
 * @param {String} account - 用户名
 * @returns Promise
 */
export const userAccountCheck = account => {
  return request('/register/check', 'get', { account });
};

/**
 * 做QQ完善信息的手机的短信验证码
 * @param {String} mobile - 手机号
 * @returns promise
 */
export const userQQPatchCode = mobile => {
  return request('/register/code', 'get', { mobile });
};

/**
 * QQ登录-完善信息
 * @param {String} unionId - QQ唯一标识，openId
 * @param {String} mobile - 手机号
 * @param {String} code - 验证码
 * @param {String} account - 用户名
 * @param {String} password - 密码
 * @returns
 */
export const userQQPatchLogin = ({ unionId, mobile, code, account, password }) => {
  return request(`/login/social/${unionId}/complement`, 'post', { unionId, mobile, code, account, password });
};
