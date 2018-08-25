//
//  FileModule.m
//  SlowChat
//
//  Created by zhaocw on 2018/8/19.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "FileModule.h"

@implementation FileModule

RCT_EXPORT_MODULE();
RCT_EXPORT_METHOD(getInfo:(NSString *)filePath resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  NSFileManager* manager = [NSFileManager defaultManager];
  NSError *error;
//  if ([manager fileExistsAtPath:filePath]){
  
    NSString *fileName = [manager displayNameAtPath:filePath];

    NSFileManager *fileManager = [NSFileManager defaultManager];
    NSDictionary *fileAttributes = [fileManager attributesOfItemAtPath:filePath error:&error];
    NSNumber *fileSize = [fileAttributes objectForKey:NSFileSize];
//    if ((fileSize = [fileAttributes objectForKey:NSFileSize])) {
//      fileLength = [fileSize unsignedLongLongValue];
//    }
  
    if (error) {
      reject(@"FILE_INFO_FAIL", nil, error);
    } else {
      resolve(
        @{
            @"fileName": fileName,
            @"fileSize": fileSize
          }
        );
    }
  
//  }
}

@end
