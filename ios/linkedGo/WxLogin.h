//
//  WxLogin.h
//  linkedGo
//
//  Created by Krysha on 2024/5/18.
//

#ifndef WxLogin_h
#define WxLogin_h

#import <Foundation/Foundation.h>
#import <React/RCTBridge.h>
#import <WXApi.h>

@interface WxLogin : NSObject <RCTBridgeModule, WXApiDelegate>

@end

#endif /* WxLogin_h */
