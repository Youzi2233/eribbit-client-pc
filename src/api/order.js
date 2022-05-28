// 订单相关的API函数

import request from '@/utils/request';

// 结算页面-购物车-生成订单
export const createOrder = () => {
  return request('/member/order/pre', 'get');
};

// 结算页面-根据订单详情请再次购买-生成订单
export const repurchaseOrder = orderId => {
  return request(`/member/order/repurchase/${orderId}`, 'get');
};

/**
 * 添加收货地址
 * @param {Object} form
 */
export const addAddress = form => {
  return request('/member/address', 'post', form);
};

/**
 * 修改收货地址
 * @param {Object} form
 */
export const editAddress = form => {
  return request(`/member/address/${form.id}`, 'put', form);
};

/**
 * 结算页面-提交订单
 * @param {Object} params
 */
export const submitOrder = params => {
  return request('/member/order', 'post', params);
};

/**
 * 获取订单详情
 * @param {String} orderId -订单ID
 */
export const findOrderDetail = orderId => {
  return request(`/member/order/${orderId}`, 'get');
};

/**
 * 获取订单
 * @param {Object} page - 页码
 * @param {String} pageSize - 每页条数
 * @param {String} orderState -订单ID 订单状态，1为待付款、2为待发货、3为待收货、4为待评价、5为已完成、6为已取消，未传该参数或0为全部
 */
export const findOrderList = ({ page = 1, pageSize = 10, orderState = 0 }) => {
  return request('/member/order', 'get', { page, pageSize, orderState });
};

/**
 * 取消订单
 * @param {String} orderId - 订单ID
 * @param {String} cancelReason - 取消原因
 * @returns
 */
export const cancelOrder = ({ orderId, cancelReason }) => {
  return request(`/member/order/${orderId}/cancel`, 'put', { cancelReason });
};

/**
 * 删除订单
 * @param {String} orderId - 订单ID
 * @returns
 */
export const deleteOrder = orderId => {
  return request('/member/order', 'delete', { ids: [orderId] });
};
