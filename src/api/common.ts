import { fileStore } from '@storage/store/getfileurl';
import service from './base';

//上传文件(私有)
export const updateFile = async (file: any) => {
	const { data } = await service({
		url: '/admin/sys-file/upload/private',
		method: 'post',
		headers: {
			'Content-Type': 'multipart/form-data',
		},
		data: file,
	});
	return data;
};


/*
storeId 门店id
type  轮播图类型,1:PC,0:移动
limitNum  条数,示例值(5)
*/
export type IParams = {
	storeId: string,
	type?: string,
	limitNum?: string
}

//获取轮播图
export const getcarouselList = async (params: IParams) => {
	const { data } = await service({
		url: '/operation/carousel/listByStore',
		method: 'GET',
		params,
	});



	return data?.data?.map((item: any) => {
		item.pictureFile = `${fileStore.fileUrl}/${item.pictureFile[0].fileName}`;
		return item;
	});
};


//获取公共地址
export const getCommonFileUrl = async () => {
	const { data } = await service({
		url: '/admin/sys-file/access/common',
		method: 'get',
	});


	return data;
};


//广告模块
/*localType 	广告位置类型,1:弹窗广告,0:置顶广告   */
export const getHomePageAdvertising = async (localType: '0' | '1', storeId: string) => {
	const { data } = await service({
		url: '/operation/windowAdvertising/HomePageAdvertising',
		method: 'get',
		params: {
			type: 0,
			localType: localType,
			storeId
		}
	});


	return data;
};


//发送设置支付密码验证码
export const sendSetPayPasswordSmsCode = async () => {
	return await service({
		url: `/consumption/customer/sendSetPayPasswordSmsCode`,
		method: 'get'
	});
};
//设置支付密码
export const setPayPassword = async (data: any) => {
	return await service({
		url: `/consumption/customer/setPayPassword`,
		method: 'put',
		data
	});
};

/* 查询结果 */
export const queryPayResult = (data: any) => {
	return service({
		url: `/consumption/order/queryPayResult`,
		method: 'post',
		data
	});
};

export default {
	setPayPassword
}
