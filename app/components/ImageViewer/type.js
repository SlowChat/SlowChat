import React from 'react';
import { Image, Text, View } from 'react-native';
import { simpleStyle } from './style';

export class Props {
  /**
   * 是否显示
   */
  show = false;

  /**
   * 图片数组
   */
  imageUrls = [];

  /**
   * 滑动到下一页的X阈值
   */
  flipThreshold = 80;

  /**
   * 当前页能滑到下一页X位置最大值
   */
  maxOverflow = 300;

  /**
   * 初始显示第几张图
   */
  index = 0;

  /**
   * 加载失败的图
   */
  failImageSource = undefined;

  /**
   * 背景颜色
   */
  backgroundColor = 'black';

  /**
   * style props for the footer container
   */
  footerContainerStyle = {};

  style = {};

  /**
   * Enable swipe down to close image viewer.
   * When swipe down, will trigger onCancel.
   */
  enableSwipeDown = false;

  /**
   * 长按图片的回调
   */
  onLongPress = (image) => {
    //
  };

  /**
   * 单击回调
   */
  onClick = (close) => {
    //
  };

  /**
   * 双击回调
   */
  onDoubleClick = (close) => {
    //
  };

  /**
   * 图片保存到本地方法，如果写了这个方法，就不会调取系统默认方法
   * 针对安卓不支持 saveToCameraRoll 远程图片，可以在安卓调用此回调，调用安卓原生接口
   */
  onSave = (url) => {
    //
  };

  /**
   * 自定义头部
   */
  renderHeader = (currentIndex) => {
    return null;
  };

  /**
   * 自定义尾部
   */
  renderFooter = (currentIndex) => {
    return null;
  };

  /**
   * 自定义计时器
   */
  renderIndicator = (
    currentIndex,
    allSize
  ) => {
    return React.createElement(
      View,
      { style: simpleStyle.count },
      React.createElement(Text, { style: simpleStyle.countText }, currentIndex + '/' + allSize)
    );
  };

  /**
   * 弹出大图的回调
   */
  onShowModal = (content) => {
    //
  };

  /**
   * 取消看图的回调
   */
  onCancel = () => {
    //
  };

  /**
   * function that fires when user swipes down
   */
  onSwipeDown = () => {
    //
  };

  /**
   * 渲染loading元素
   */
  loadingRender = () => {
    return null;
  };

  /**
   * 保存到相册的回调
   */
  onSaveToCamera = (index) => {
    //
  };

  /**
   * 当图片切换时触发
   */
  onChange = (index) => {
    //
  };
}

export class State {
  /**
   * 是否显示
   */
  show = false;

  /**
   * 当前显示第几个
   */
  currentShowIndex = 0;

  /**
   * 图片拉取是否完毕了
   */
  imageLoaded = false;

  /**
   * 图片长宽列表
   */
  imageSizes = [];

  /**
   * 是否出现功能菜单
   */
  isShowMenu = false;
}
