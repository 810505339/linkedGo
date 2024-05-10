import { uuid } from 'react-native-uuid';
import service from './base';
import { btoa } from 'js-base64';
import { setGenericPassword } from 'react-native-keychain';
import storage from '@storage/index';
import { IM_KEY } from '@storage/shop/key';
import * as CryptoJS from 'crypto-js';

/**
 *加密处理
 */
export function encryption(src: string, keyWord: string) {
	const key = CryptoJS.enc.Utf8.parse(keyWord);
	// 加密
	var encrypted = CryptoJS.AES.encrypt(src, key, {
		iv: key,
		mode: CryptoJS.mode.CFB,
		padding: CryptoJS.pad.NoPadding,
	});
	return encrypted.toString();
}


/**
 * https://www.ietf.org/rfc/rfc6749.txt
 * OAuth 协议 4.3.1 要求格式为 form 而不是 JSON 注意！
 */
const FORM_CONTENT_TYPE = 'application/x-www-form-urlencoded';
/* 手机验证码登录 */
const BASICAUTH = 'app_customer_sms:app_customer_sms';
/* 手机密码登录 */
const BASICAUTH_PASSWORD = 'app_customer:app_customer';

type IData = {
	[key in string]: string
}


//登录 grant_type =mobile or password

export const loginApi = async ({ code, grant_type = 'mobile', scope = 'server', mobile = undefined, password, username = undefined, authCode = undefined, phoneAreaCode = '86' }: IData) => {
	const basicAuth = grant_type === 'mobile' ? 'Basic ' + btoa(BASICAUTH) : 'Basic ' + btoa(BASICAUTH_PASSWORD);
	let encPassword = grant_type === 'password' ? encryption(password, 'club.2023.09.01@') : undefined;

	const res = await service({
		url: '/auth/oauth2/token',
		method: 'post',
		params: { code: code, grant_type: grant_type, scope, mobile, username, authCode, phoneAreaCode: phoneAreaCode },
		data: { password: encPassword },
		headers: {
			'content-Type': FORM_CONTENT_TYPE,
			skipToken: true,
			Authorization: basicAuth,
		},
	});

	console.log(res.data, '这是请求发出去的返回的真正东西');
	const data = res.data

	if (data) {
		//sub 手机号 token //登录token
		await setGenericPassword(data?.sub, data?.access_token,);
		await storage.save({
			key: IM_KEY,
			data: {
				userId: data?.user_id,
				userSig: data?.user_info?.userSig,
				userInfo: data?.user_info,
			},
		});

		return data;



		// const { data } = await service({
		// 	url: '/auth/oauth2/token',
		// 	method: 'post',
		// 	params: { code: code, grant_type: grant_type, scope, mobile, username, authCode },
		// 	data: { password: encPassword },
		// 	headers: {
		// 		'content-Type': FORM_CONTENT_TYPE,
		// 		skipToken: true,
		// 		Authorization: basicAuth,
		// 	},
		// });


		// console.log(data, '111111111111111111111111111111111111111111111');



		// }
		// return data;


	}
}


//发送客户登录验证码
export const sendYzmApi = ({ mobile, phoneAreaCode }: any) => {
	return service({
		url: `/admin/mobile/customer_login/${mobile}?phoneAreaCode=${phoneAreaCode}`,
	});
};


// 参数接口
export interface EditSelfParams {
	/*头像文件id */
	avatarFileId: string;

	/*昵称 */
	nickname: string;

	/*生日 */
	birthday: string;
	/* 个性签名 */
	personalSignature: string
}


/**
 * 修改个人信息（用户操作）
 * @param {object} params 修改个人信息（用户操作）
 * @param {number} params.avatarFileId 头像文件id
 * @param {string} params.nickname 昵称
 * @param {object} params.birthday 生日
 * @param {object} params.personalSignature 个性签名
 * @returns
 */
export const editUserInfoApi = (data: EditSelfParams) => {
	return service({
		url: '/consumption/customer/edit-self',
		method: 'put',
		data,
	});
};



export const mediaLogin = (type: string, token: string) => {
	return service({
		url: `/consumption/customer/social/auth/code?authCode=${type}@${token}`,
		method: 'get',
	});

}

/* 地区列表 */
export const allPhoneAreaCode = () => {
	return service({
		url: `/admin/mobile/allPhoneAreaCode`,
		method: 'get',
	});
}
