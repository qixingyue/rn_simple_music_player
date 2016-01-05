//
//  RctUpdate.m
//  rn_simple_music_player
//
//  Created by qixingyue on 16/1/5.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "RctUpdate.h"

@implementation RctUpdate {
  NSString *jsbundlePath;
}

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();


// 调用demo
// NSString *url = @"http://localhost:8081/index.ios.bundle";
//  [self refreshApplicationViewWithUrl:url];
- (void) refreshApplicationViewWithUrl : (NSString*) url{
  
  NSString *savefileName = @"/main.jsbundle";
  NSString *moduleName = @"rn_simple_music_player";
  
  AppDelegate *appDelegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
  
  NSString *documentPath = [appDelegate applicationDocumentsDirectory];
  
  NSLog(@"%@",url);
  //下载文件，从URL下载
  NSURL *jsCodeLocation = [NSURL URLWithString:url];
  NSData *data = [NSData dataWithContentsOfURL:jsCodeLocation];
  NSString *path = [documentPath stringByAppendingString:savefileName];
  
  [data writeToFile:path atomically:YES];
  
  NSLog(@"Donload Path : %@",path);
  
  //通知主线程UI更新
  
  dispatch_sync(dispatch_get_main_queue(), ^{
    [appDelegate applicationRefreshView:savefileName : moduleName];
  });
  
}

RCT_EXPORT_METHOD(loadFromUrl : (NSString*) url)
{
  [self refreshApplicationViewWithUrl:url];
}


RCT_EXPORT_METHOD(simpleTest)
{
  NSLog(@"This is only a simple test ...");
}



@end
