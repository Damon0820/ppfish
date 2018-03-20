/* eslint-disable no-console */
import differenceInSeconds from 'date-fns/difference_in_seconds';
import format from 'date-fns/format';
import classNames from 'classnames';

const noop = () => {
};
export const getTimeBarStr = (timestamp) => {
  let diffTime = differenceInSeconds(timestamp, new Date());
  // 超过一年
  if (diffTime > 365 * 24 * 60 * 60) {
    return format(timestamp, 'YYYY-MM-DD HH:mm:ss');
    // 超过一天
  } else if (diffTime > 24 * 60 * 60) {
    return format(timestamp, 'MM-DD HH:mm:ss');
    // 超过一分钟
  } else if (diffTime > 60) {
    return format(timestamp, 'HH:mm:ss');
  } else {
    return '刚刚';
  }
};

/**
 * 时间戳转换
 * @param timestamp 时间戳
 * @param showSecond 秒
 * @returns {string}
 */
export const getTimeStamp = (timestamp, showSecond = false) => {
  //当日
  const today = new Date().setHours(0, 0, 0, 0);
  const diffTime = timestamp - today;

  //当年
  const toYear = new Date(`${new Date().getFullYear()}-01-01`).setHours(0, 0, 0, 0);
  const diffDate = timestamp - toYear;

  const oneDay = 24 * 60 * 60 * 1000;

  // 今天
  if (timestamp >= today && Math.abs(diffTime) <= oneDay) {
    return `今天 ${format(timestamp, `HH:mm${showSecond ? ':ss' : ''}`)}`;
    // 昨天
  } else if (timestamp < today && Math.abs(diffTime) <= oneDay) {
    return `昨天 ${format(timestamp, `HH:mm${showSecond ? ':ss' : ''}`)}`;
    // 今年
  } else if (timestamp >= toYear && Math.abs(diffDate) <= oneDay * 365) {
    return format(timestamp, `MM-DD HH:mm${showSecond ? ':ss' : ''}`);
    // 其余
  } else {
    return format(timestamp, `YYYY-MM-DD HH:mm${showSecond ? ':ss' : ''}`);
  }
};

// 获取动态classNames
export const getDynamicCls = (clsArr, addCls, condition) => {
  let clsObj = {};
  if (typeof clsArr == 'string') {
    clsArr = [clsArr];
  }
  clsArr.forEach((item) => {
    clsObj[item] = true;
  });
  if (addCls && condition()) {
    clsObj[addCls] = true;
  }
  return classNames(clsObj);
};

/***
 * 将时间转换为时间段，返回[开始时间，结束时间]的时间戳列表
 * 1.当传入参数为数字N，代表从过去N天到 【endDate】23：59：59 的时间段
 * 2.当传入参数为日期范围字符2017/10/04 ~ 2017/11/10，代表 开始时间 ~ 结束时间
 ***/
export const formatTimestamp = (param, endDate='昨天') => {
  let startTime = 0;
  let endTime = 0;
  //1.传入参数为数字
  if (Number.isInteger(param)) {
    const N = param;
    //临时代码：处理昨天没有数据的情况，将来会删掉
    if(endDate === '前天'){
      //开始时间为N天前的00：00：00
      startTime = Date.parse(new Date(new Date(new Date().setDate(new Date().getDate()-N-1)).setHours(0,0,0,0)));
      //结束时间为前天的23:59:59
      endTime = Date.parse(new Date(new Date(new Date().setDate(new Date().getDate()-1)).setHours(0,0,0,0))) - 1;
    }else{
      //开始时间为N天前的00：00：00
      startTime = Date.parse(new Date(new Date(new Date().setDate(new Date().getDate()-N)).setHours(0,0,0,0)));
      //结束时间为昨天的23:59:59
      endTime = Date.parse(new Date(new Date().setHours(0,0,0,0))) - 1;
    }
    //2.传入参数为日期范围字符
  } else if (Object.prototype.toString.call(param) === "[object String]") {
    let arr = param.split('~');
    if (arr && arr.length === 2) {
      startTime = Date.parse(new Date(arr[0]));
      endTime = Date.parse(new Date(arr[1])) + 86400000 - 1;
    }
  }
  return [startTime, endTime];
};

//由时间戳转为显示的日期
export const getTimeFromTimestamp = (startTime, endTime) => {
  if(!startTime || !endTime){
    return null;
  }else{
    return new Date(parseInt(startTime)).toLocaleDateString() + ' ~ ' + new Date(parseInt(endTime)).toLocaleDateString();
  }
};
