//
//  WxLogin.m
//  linkedGo
//
//  Created by Krysha on 2024/5/18.
//

#import "WxLogin.h"

#import <React/RCTLog.h>
#import <React/RCTEventDispatcher.h>
#import <WXApiObject.h>
@implementation WxLogin

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(login:(NSString *)name location:(NSString *)location)
{
  //构造SendAuthReq结构体
  SendAuthReq* req =[[SendAuthReq alloc]init];
  req.scope = @"snsapi_userinfo"; // 只能填 snsapi_userinfo
  req.state = @"123";
  //第三方向微信终端发送一个SendAuthReq消息结构
  [WXApi sendReq:req completion:nil];
  RCTLogInfo(@"Pretending to create an event %@ at %@", name, location);
}

@end
