package com.slowchat.file;

import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

import java.io.File;
import java.io.FileInputStream;

import static com.google.android.exoplayer2.mediacodec.MediaCodecInfo.TAG;

/**
 * Created by zhaocw on 2018/8/19.
 */

public class FileModule extends ReactContextBaseJavaModule {

    public FileModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }


    @Override
    public String getName() {
        return "FileModule";
    }

    @ReactMethod
    public void getInfo(String filePath, Promise promise) {
        File mFile = new File(filePath);
        try {
            int size = getFileSize(mFile);
            Log.d(TAG, "### size: " + size);
            String fileName = mFile.getName();
            WritableMap map = Arguments.createMap();
            map.putString("fileName", fileName);
            map.putInt("fileSize", size);
            promise.resolve(map);
        } catch (Exception e) {
//            e.printStackTrace();
            promise.reject(e);
        }
    }
    public int getFileSize(File file) throws Exception {
        if (file == null) {
            return 0;
        }
        int size = 0;
        if (file.exists()) {
            FileInputStream fis = null;
            fis = new FileInputStream(file);
            size = fis.available();
        }
        return size;
    }
}
