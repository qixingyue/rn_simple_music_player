//
//  RctUpdate.m
//  rn_simple_music_player
//
//  Created by qixingyue on 16/1/5.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "RctUpdate.h"
#import <RCTRootView.h>

@implementation RctUpdate {
  NSString *jsbundlePath;
}

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();


// 调用demo
// NSString *url = @"http://localhost:8081/index.ios.bundle";
//  [self refreshApplicationViewWithUrl:url];
- (void) refreshApplicationViewWithUrl : (NSString*) url : (NSString*) moduleName {
  
  NSString *savefileName = @"/main.jsbundle";
  
  AppDelegate *appDelegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
  
  NSString *documentPath = [appDelegate applicationDocumentsDirectory];
  
  NSLog(@"%@",url);
  //下载文件，从URL下载
  NSURL *jsCodeLocation = [NSURL URLWithString:url];
  NSData *data = [NSData dataWithContentsOfURL:jsCodeLocation];
  NSString *path = [documentPath stringByAppendingString:savefileName];
  
  [data writeToFile:path atomically:YES];
  
  
  //通知主线程UI更新
  dispatch_sync(dispatch_get_main_queue(), ^{
    
    NSString *rootPath = [appDelegate applicationDocumentsDirectory];
    NSString *jsPath = [rootPath stringByAppendingString:savefileName];
    NSURL *jsCodeLocation ;
    
    jsCodeLocation = [NSURL fileURLWithPath:jsPath];
    
    
    RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                        moduleName:moduleName
                                                 initialProperties:nil
                                                     launchOptions:nil];
    
    [[appDelegate.window rootViewController]setView:rootView];
    
  });
  
}

RCT_EXPORT_METHOD(loadFromUrl : (NSString*) url : (NSString*) moduleName)
{
  [self refreshApplicationViewWithUrl:url:moduleName];
}


RCT_EXPORT_METHOD(simpleTest)
{
  NSLog(@"This is only a simple test ...");
}



@end
