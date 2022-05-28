// 提供商品相关的API函数
import request from '@/utils/request';

/**
 * 获取商品详情
 * @param {String} id 商品ID
 */
export const findGoods = id => {
  return request('/goods', 'get', { id });
};

/**
 * 获取相关推荐商品 | 猜你喜欢商品
 * @param {String} id - 商品ID，传入相关推荐，不传猜你喜欢
 * @param {Integer} limit - 商品数量
 */
export const findRelevantGoods = ({ id, limit = 16 }) => {
  return request('/goods/relevant', 'get', { id, limit });
};

/**
 * 获取热销榜数据
 * @param {String} id - 商品ID
 * @param {String} limit - 商品数量
 * @param {Integer} type - 热销类型 1为24小时 2为周榜 3为总榜 默认为1
 */
export const findGoodsHot = ({ id, limit = 3, type = 1 }) => {
  return request('/goods/hot', 'get', { id, limit, type });
};

/**
 * 获取商品的评价统计信息
 * @param {String} id - 商品ID
 */
export const findGoodsCommentInfo = id => {
  // return request(`/goods/${id}/info`, 'get');
  return request(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate`, 'get');
};

/**
 * 获取商品的评价统计信息
 * @param {String} id - 商品ID
 * @param {Integer} params
 */
export const findGoodsCommentList = (id, params) => {
  // return request(`/goods/${id}/info`, 'get');
  return request(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate/page`, 'get', params);
};
