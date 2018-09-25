package com.slowchat;

import android.app.Application;
import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;

import com.baidu.mobstat.MtjConfig;
import com.baidu.mobstat.StatService;
import com.facebook.react.ReactApplication;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import org.hstar.reactnative.easyupgrade.RNEasyUpgradePackage;
import com.baidu.reactnativemobstat.RNBaiduMobStatPackage;
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
import com.slowchat.setting.SettingReactPackage;

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
            new PickerPackage(),
            new RNEasyUpgradePackage(),
            new RNBaiduMobStatPackage(),
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
              new FileReactPackage(),
              new SettingReactPackage()
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
    StatService.setDebugOn(true);
//    StatService.setTrackEnabled(true);
    String JPUSH_APPKEY = getMetaDataValue(this, "JPUSH_APPKEY",
            "c4d58ccfd28897a5d21e93ea");
    StatService.setPushId(this, MtjConfig.PushPlatform.JIGUANG, JPUSH_APPKEY);
    StatService.autoTrace(this, true, true);
    StatService.start(this);
  }

  public static String getMetaDataValue(Context context, String name,
                                        String def) {
    String value = getMetaDataValue(context, name);
    return (value == null) ? def : value;
  }

  public static String getMetaDataValue(Context context, String name) {
    Object value = null;
    PackageManager packageManager = context.getPackageManager();
    ApplicationInfo applicationInfo;
    try {
      applicationInfo = packageManager.getApplicationInfo(
              context.getPackageName(), PackageManager.GET_META_DATA);
      if (applicationInfo != null && applicationInfo.metaData != null) {
        value = applicationInfo.metaData.get(name);
      }
    } catch (PackageManager.NameNotFoundException e) {
      throw new RuntimeException(
              "Could not read the name in the manifest file.", e);
    }
    if (value == null) {
      throw new RuntimeException("The name '" + name
              + "' is not defined in the manifest file's meta data.");
    }
    return value.toString();
  }
}
