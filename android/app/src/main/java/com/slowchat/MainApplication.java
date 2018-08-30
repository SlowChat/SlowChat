package com.slowchat;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.imagepicker.ImagePickerPackage;
import com.rnfs.RNFSPackage;
import com.reactlibrary.RNReactNativeDocViewerPackage;
import ui.fileselector.RNFileSelectorPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import cn.jiguang.share.android.api.JShareInterface;
import cn.jiguang.share.reactnative.JSharePackage;
import com.microsoft.codepush.react.CodePush;
import com.brentvatne.react.ReactVideoPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;

import cn.jpush.reactnativejpush.JPushPackage;
import fr.greweb.reactnativeviewshot.RNViewShotPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.slowchat.file.FileReactPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  // 设置为 true 将不弹出 toast
  private boolean SHUTDOWN_TOAST = false;
  // 设置为 true 将不打印 log
  private boolean SHUTDOWN_LOG = false;

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        protected String getJSBundleFile() {
        return CodePush.getJSBundleFile();
        }

    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNFSPackage(),
            new RNReactNativeDocViewerPackage(),
          new RNFileSelectorPackage(),
          new RNDeviceInfo(),
          new JSharePackage(SHUTDOWN_TOAST, SHUTDOWN_LOG),
          new CodePush(null, getApplicationContext(), BuildConfig.DEBUG),
          new ReactVideoPackage(),
          new SplashScreenReactPackage(),
          new RNViewShotPackage(),
          new ImagePickerPackage(),
          new JPushPackage(SHUTDOWN_TOAST, SHUTDOWN_LOG),
              new FileReactPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    // 在 Init 之前调用，设置为 true，则会打印 debug 级别日志，否则只会打印 warning 级别以上的日志
    // JShareInterface.setDebugMode(true);
    JShareInterface.init(this);             //   <-- Init here
  }
}
