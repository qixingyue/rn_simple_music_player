/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"
#import "RCTRootView.h"
#import <AVFoundation/AVFoundation.h>

@implementation AppDelegate

- (NSString *) applicationDocumentsDirectory
{
  NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
  NSString *basePath = ([paths count] > 0) ? [paths objectAtIndex:0] : nil;
  return basePath;
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
 
  NSURL *jsCodeLocation;

  jsCodeLocation = [NSURL URLWithString:@"http://localhost:8081/loading.ios.bundle?platform=ios&dev=true"];
  
  
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"rn_simple_music_player"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  
  NSError *setCategoryErr = nil;
  NSError *activationErr  = nil;
  [[AVAudioSession sharedInstance] setCategory: AVAudioSessionCategoryPlayback error: &setCategoryErr];
  [[AVAudioSession sharedInstance] setActive: YES error: &activationErr];
  
  return YES;
}

- (void)applicationRefreshView:(NSString *) name  : (NSString *) moduleName{
  
  NSString *rootPath = [self applicationDocumentsDirectory];
  NSString *jsPath = [rootPath stringByAppendingString:name];
  NSURL *jsCodeLocation ;

  jsCodeLocation = [NSURL fileURLWithPath:jsPath];

  
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:moduleName
                                               initialProperties:nil
                                                   launchOptions:nil];
  
  [[self.window rootViewController]setView:rootView];
}




@end
