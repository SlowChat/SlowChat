import React, { PureComponent } from 'react';
import {
  Animated,
  CameraRoll,
  Dimensions,
  I18nManager,
  Image,
  PanResponder,
  Platform,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle
} from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import styles from './style';
import { Props, State } from './type';

export default class ImageViewer extends PureComponent<Props, State> {
  static defaultProps = new Props();
  state = new State();

  // 背景透明度渐变动画
  fadeAnim = new Animated.Value(0);

  // 当前基准位置
  standardPositionX = 0;

  // 整体位移，用来切换图片用
  positionXNumber = 0;
  positionX = new Animated.Value(0);

  width = 0;
  height = 0;

  styles = styles(0, 0, 'transparent');

  // 是否执行过 layout. fix 安卓不断触发 onLayout 的 bug
  hasLayout = false;

  // 记录已加载的图片 index
  loadedIndex = new Map();

  handleLongPressWithIndex = new Map();

  componentWillMount() {
    this.init(this.props);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.index !== this.state.currentShowIndex) {
      this.setState(
        {
          currentShowIndex: nextProps.index
        },
        () => {
          // 立刻预加载要看的图
          this.loadImage(nextProps.index || 0);

          this.jumpToCurrentImage();

          // 显示动画
          Animated.timing(this.fadeAnim, {
            toValue: 1,
            duration: 200
          }).start();
        }
      );
    }
  }

  /**
   * props 有变化时执行
   */
  init(nextProps: Props) {
    if (nextProps.imageUrls.length === 0) {
      // 隐藏时候清空
      this.fadeAnim.setValue(0);
      return this.setState(new State());
    }

    // 给 imageSizes 塞入空数组
    const imageSizes = [];
    nextProps.imageUrls.forEach(imageUrl => {
      imageSizes.push({
        width: imageUrl.width || 0,
        height: imageUrl.height || 0,
        status: 'loading'
      });
    });

    this.setState(
      {
        currentShowIndex: nextProps.index,
        imageSizes
      },
      () => {
        // 立刻预加载要看的图
        this.loadImage(nextProps.index || 0);

        this.jumpToCurrentImage();

        // 显示动画
        Animated.timing(this.fadeAnim, {
          toValue: 1,
          duration: 200
        }).start();
      }
    );
  }

  /**
   * 调到当前看图位置
   */
  jumpToCurrentImage() {
    // 跳到当前图的位置
    this.positionXNumber = this.width * (this.state.currentShowIndex || 0) * (I18nManager.isRTL ? 1 : -1);
    this.standardPositionX = this.positionXNumber;
    this.positionX.setValue(this.positionXNumber);
  }

  /**
   * 加载图片，主要是获取图片长与宽
   */
  loadImage(index) {
    if (!this.state.imageSizes[index]) {
      return;
    }

    if (this.loadedIndex.has(index)) {
      return;
    }
    
    this.loadedIndex.set(index, true);

    const image = this.props.imageUrls[index];
    const imageStatus = { ...this.state.imageSizes[index] };

    // 保存 imageSize
    const saveImageSize = () => {
      // 如果已经 success 了，就不做处理
      if (this.state.imageSizes[index] && this.state.imageSizes[index].status !== 'loading') {
        return;
      }

      const imageSizes = this.state.imageSizes.slice();
      imageSizes[index] = imageStatus;
      this.setState({ imageSizes });
    };

    if (this.state.imageSizes[index].status === 'success') {
      // 已经加载过就不会加载了
      return;
    }

    // 如果已经有宽高了，直接设置为 success
    if (this.state.imageSizes[index].width > 0 && this.state.imageSizes[index].height > 0) {
      imageStatus.status = 'success';
      saveImageSize();
      return;
    }

    // 是否加载完毕了图片大小
    const sizeLoaded = false;
    // 是否加载完毕了图片
    let imageLoaded = false;

    // Tagged success if url is started with file:, or not set yet(for custom source.uri).
    if (!image.url || image.url.startsWith(`file:`)) {
      imageLoaded = true;
    }

    Image.getSize(
      image.url,
      (width, height) => {
        imageStatus.width = width;
        imageStatus.height = height;
        imageStatus.status = 'success';
        saveImageSize();
      }, () => {
        try {
          const data = Image.resolveAssetSource(image.props.source);
          imageStatus.width = data.width;
          imageStatus.height = data.height;
          imageStatus.status = 'success';
          saveImageSize();
        } catch (newError) {
          // Give up..
          imageStatus.status = 'fail';
        }
      }
    );
  }

  /**
   * 触发溢出水平滚动
   */
  handleHorizontalOuterRangeOffset = (offsetX = 0) => {
    this.positionXNumber = this.standardPositionX + offsetX;
    this.positionX.setValue(this.positionXNumber);

    const offsetXRTL = !I18nManager.isRTL ? offsetX : -offsetX;

    if (offsetXRTL < 0) {
      if (this.state.currentShowIndex || 0 < this.props.imageUrls.length - 1) {
        this.loadImage((this.state.currentShowIndex || 0) + 1);
      }
    } else if (offsetXRTL > 0) {
      if (this.state.currentShowIndex || 0 > 0) {
        this.loadImage((this.state.currentShowIndex || 0) - 1);
      }
    }
  };

  /**
   * 手势结束，但是没有取消浏览大图
   */
  handleResponderRelease = (vx = 0) => {
    const vxRTL = I18nManager.isRTL ? -vx : vx;
    const isLeftMove = I18nManager.isRTL
      ? this.positionXNumber - this.standardPositionX < -(this.props.flipThreshold || 0)
      : this.positionXNumber - this.standardPositionX > (this.props.flipThreshold || 0);
    const isRightMove = I18nManager.isRTL
      ? this.positionXNumber - this.standardPositionX > (this.props.flipThreshold || 0)
      : this.positionXNumber - this.standardPositionX < -(this.props.flipThreshold || 0);

    if (vxRTL > 0.7) {
      // 上一张
      this.goBack.call(this);

      // 这里可能没有触发溢出滚动，为了防止图片不被加载，调用加载图片
      if (this.state.currentShowIndex || 0 > 0) {
        this.loadImage((this.state.currentShowIndex || 0) - 1);
      }
      return;
    } else if (vxRTL < -0.7) {
      // 下一张
      this.goNext.call(this);
      if (this.state.currentShowIndex || 0 < this.props.imageUrls.length - 1) {
        this.loadImage((this.state.currentShowIndex || 0) + 1);
      }
      return;
    }

    if (isLeftMove) {
      // 上一张
      this.goBack.call(this);
    } else if (isRightMove) {
      // 下一张
      this.goNext.call(this);
      return;
    } else {
      // 回到之前的位置
      this.resetPosition.call(this);
      return;
    }
  };

  /**
   * 到上一张
   */
  goBack = () => {
    if (this.state.currentShowIndex === 0) {
      // 回到之前的位置
      this.resetPosition.call(this);
      return;
    }

    this.positionXNumber = !I18nManager.isRTL
      ? this.standardPositionX + this.width
      : this.standardPositionX - this.width;
    this.standardPositionX = this.positionXNumber;
    Animated.timing(this.positionX, {
      toValue: this.positionXNumber,
      duration: 100
    }).start();

    const nextIndex = (this.state.currentShowIndex || 0) - 1;

    this.setState(
      {
        currentShowIndex: nextIndex
      },
      () => {
        if (this.props.onChange) {
          this.props.onChange(this.state.currentShowIndex);
        }
      }
    );
  };

  /**
   * 到下一张
   */
  goNext = () => {
    if (this.state.currentShowIndex === this.props.imageUrls.length - 1) {
      // 回到之前的位置
      this.resetPosition.call(this);
      return;
    }

    this.positionXNumber = !I18nManager.isRTL
      ? this.standardPositionX - this.width
      : this.standardPositionX + this.width;
    this.standardPositionX = this.positionXNumber;
    Animated.timing(this.positionX, {
      toValue: this.positionXNumber,
      duration: 100
    }).start();

    const nextIndex = (this.state.currentShowIndex || 0) + 1;

    this.setState(
      {
        currentShowIndex: nextIndex
      },
      () => {
        if (this.props.onChange) {
          this.props.onChange(this.state.currentShowIndex);
        }
      }
    );
  };

  /**
   * 回到原位
   */
  resetPosition() {
    this.positionXNumber = this.standardPositionX;
    Animated.timing(this.positionX, {
      toValue: this.standardPositionX,
      duration: 150
    }).start();
  }

  /**
   * 长按
   */
  handleLongPress = (image) => {
    if (this.props.onLongPress) {
      this.props.onLongPress(image);
    }
  };

  /**
   * 单击
   */
  handleClick = () => {
    if (this.props.onClick) {
      this.props.onClick(this.handleCancel);
    }
  };

  /**
   * 双击
   */
  handleDoubleClick = () => {
    if (this.props.onDoubleClick) {
      this.props.onDoubleClick(this.handleCancel);
    }
  };

  /**
   * 退出
   */
  handleCancel = () => {
    this.hasLayout = false;
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  };

  /**
   * 完成布局
   */
  handleLayout = (event: any) => {
    if (event.nativeEvent.layout.width !== this.width) {
      this.hasLayout = true;

      this.width = event.nativeEvent.layout.width;
      this.height = event.nativeEvent.layout.height;
      this.styles = styles(this.width, this.height, this.props.backgroundColor || 'transparent');

      // 强制刷新
      this.forceUpdate();
      this.jumpToCurrentImage();
    }
  };

  /**
   * 获得整体内容
   */
   
 renderContent(status, params) {
   if (status == 'fail') {
     const { failImageSource } = this.props
     if (failImageSource.url) {
       return <Image source={{uri: failImageSource.url}} style={{width:failImageSource.width, height:failImageSource.height}} />
     } else {
       return null
     }
   }
   return [
     <Image key="image" source={{uri: params.url}} style={{width: params.width, height: params.height}}
      onLoadStart={(e) => {
        console.log("------onLoadStart---")
      }}
      onLoadEnd={(e) => {
        console.log("----onLoadEnd-----", e)
      }}
     />,
     status == 'loading' && <View key="loading" style={this.styles.loadingContainer}>
       {this.props.loadingRender()}
     </View>
   ]
 }
  getContent() {
    // 获得屏幕宽高
    const screenWidth = this.width;
    const screenHeight = this.height;

    const ImageElements = this.props.imageUrls.map((image, index) => {
      if ((this.state.currentShowIndex || 0) > index + 1 || (this.state.currentShowIndex || 0) < index - 1) {
        return <View key={index} style={{ width: screenWidth, height: screenHeight }} />;
      }

      if (!this.handleLongPressWithIndex.has(index)) {
        this.handleLongPressWithIndex.set(index, this.handleLongPress.bind(this, image));
      }

      const imageInfo = this.state.imageSizes[index];

      if (!imageInfo || !imageInfo.status) {
        return <View key={index} style={{ width: screenWidth, height: screenHeight }} />;
      }
      
      let width = imageInfo && imageInfo.width;
      let height = imageInfo && imageInfo.height;
      

      // 如果宽大于屏幕宽度,整体缩放到宽度是屏幕宽度
      if (width > screenWidth) {
        const widthPixel = screenWidth / width;
        width *= widthPixel;
        height *= widthPixel;
      }

      // 如果此时高度还大于屏幕高度,整体缩放到高度是屏幕高度
      if (height > screenHeight) {
        const HeightPixel = screenHeight / height;
        width *= HeightPixel;
        height *= HeightPixel;
      }
      let style = {}
      if (imageInfo.status == 'fail') {
        style = this.styles.modalContainer
        const failImageSource = this.props.failImageSource || {}
        width = failImageSource.width || screenWidth
        height = failImageSource.height || screenHeight
      }
      return (
        <ImageZoom
          key={index}
          style={style}
          cropWidth={this.width}
          cropHeight={this.height}
          maxOverflow={this.props.maxOverflow}
          horizontalOuterRangeOffset={this.handleHorizontalOuterRangeOffset}
          responderRelease={this.handleResponderRelease}
          onLongPress={this.handleLongPressWithIndex.get(index)}
          onClick={this.handleClick}
          onDoubleClick={this.handleDoubleClick}
          imageWidth={width}
          imageHeight={height}
          enableSwipeDown={this.props.enableSwipeDown}
          onSwipeDown={this.handleSwipeDown}
        >
          {this.renderContent(imageInfo.status, { url: image.url, width: 300, height: 300})}
        </ImageZoom>
      );
    });

    return (
      <Animated.View style={{ zIndex: 9 }}>
        <Animated.View style={{ ...this.styles.container, opacity: this.fadeAnim }}>
          {this.props.renderHeader(this.state.currentShowIndex)}
          <Animated.View
            style={{
              ...this.styles.moveBox,
              transform: [{ translateX: this.positionX }],
              width: this.width * this.props.imageUrls.length
            }}
          >
            {ImageElements}
          </Animated.View>
          {this.props.renderIndicator((this.state.currentShowIndex || 0) + 1, this.props.imageUrls.length)}

          <View style={[{ bottom: 0, position: 'absolute', zIndex: 9 }, this.props.footerContainerStyle]}>
            {this.props.renderFooter(this.state.currentShowIndex)}
          </View>
        </Animated.View>
      </Animated.View>
    );
  }

  handleSwipeDown = () => {
    if (this.props.onSwipeDown) {
      this.props.onSwipeDown();
    }
    this.handleCancel();
  };

  render() {
    return (
      <View
        onLayout={this.handleLayout}
        style={{
          flex: 1,
          overflow: 'hidden',
          ...this.props.style
        }}
      >
      <View>
        {this.getContent()}
      </View>
      </View>
    );
  }
}
