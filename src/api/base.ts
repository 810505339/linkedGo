import axios from 'axios';
import qs from 'qs';
import { getGenericPassword, resetGenericPassword } from 'react-native-keychain';
import Toast from 'react-native-toast-message';
import { replace } from '@router/index';
import { loadLanguageStorage } from '@storage/language/action'
/* http://114.67.231.163:9999 */
// https://gateway.point2club.com/
const baseUrl = 'http://114.67.231.163:9999';
//const baseUrl = 'http://114.67.231.163:9999';
export const H5 = 'https://m.point2club.com/'
enum CODELIST {
	TOKENCAN = '424',

}

/**
 * 创建并配置一个 Axios 实例对象
 */
const service = axios.create({
	baseURL: baseUrl,
	timeout: 50000, // 全局超时时间
	paramsSerializer: {
		serialize: (params) => {
			return qs.stringify(params, { arrayFormat: 'repeat' });
		},
	},
	headers: {
		'content-type': 'application/json',
	},
});

/**
 * Axios请求拦截器，对请求进行处理
 * 1. 序列化get请求参数
 * 2. 统一增加Authorization和TENANT-ID请求头
 * 3. 自动适配单体、微服务架构不同的URL
 * @param config AxiosRequestConfig对象，包含请求配置信息
 */
service.interceptors.request.use(async (config) => {
	// 统一增加Authorization请求头, skipToken 跳过增加token

	const generic = await getGenericPassword();
	let token = null;
	if (generic) {
		token = generic.password;
	}

	if (token && !config.headers?.skipToken) {
		config.headers![CommonHeaderEnum.AUTHORIZATION] = `Bearer ${token}`;
	}
	const { language } = await loadLanguageStorage()
	if (language == 'zh') {
		config.headers['Accept-Language'] = 'zh-cn'
	}

	if (language == 'en') {
		config.headers['Accept-Language'] = 'en'
	}

	console.log('现在请求的语言', config.headers['Accept-Language'])


	// 请求报文加密
	// 处理完毕，返回config对象
	return config;
},
	(error) => {
		// 对请求错误进行处理
		console.log(error, 'error');

		return Promise.reject(error);
	}
);

/**
 * 响应拦截器处理函数
 * @param response 响应结果
 * @returns 如果响应成功，则返回响应的data属性；否则，抛出错误或者执行其他操作
 */
// const handleResponse = (response) => {
// 	if (response.data.code === 1) {
// 		throw response.data;
// 	}

// 	// // 针对密文返回解密
// 	// if (response.data.encryption) {
// 	// 	const originData = JSON.parse(other.decryption(response.data.encryption, import.meta.env.VITE_PWD_ENC_KEY));
// 	// 	response.data = originData;
// 	// 	return response.data;
// 	// }



// 	return response.data;
// };

/**
 * 添加 Axios 的响应拦截器，用于全局响应结果处理
 */
service.interceptors.response.use((response) => {
	const data = response.data;



	if (!data.success) {
		if (data?.msg) {
			Toast.show({ text1: data?.msg });
		}

	}

	return response;

}, (error) => {
	const data = error.response?.data;
	console.log(error, 'error');

	if (error?.response?.status == CODELIST.TOKENCAN) {
		resetGenericPassword() //清除token
		replace('Login')
	}


	if (data) {
		if (data?.msg) {
			Toast.show({ text1: data?.msg });
		}

	}

});

// 常用header
export enum CommonHeaderEnum {
	'TENANT_ID' = 'TENANT-ID',
	'ENC_FLAG' = 'Enc-Flag',
	'AUTHORIZATION' = 'Authorization',
}

// 导出 axios 实例
export default service;
