/**
 * 工具方法
 * Created by biml on 2017/10/23.
 */
import React from 'react';
import {Icon, notification} from 'antd';

export const success = "success";
export const fail = "fail";
/**
 * 员工状态
 * @type {{induction: string, dimission: string}}
 */
export const EMPLOYEE_STATUS = {
    induction: '在职',
    dimission: '离职'
};
/**
 * 设备状态
 * @type {{inuse: string, unused: string}}
 */
export const EQUIPMENT_STATUS = {
    inuse: '使用中',
    unused: '未使用'
};
/**
 * 资产操作
 * @type {{receive: string, return: string}}
 */
export const EQUIPMENT_OPERATIONS = {
    receive: '领用',
    return: '退还'
};
/**
 * 发生错误时提示信息停留时间，单位秒
 * @type {number}
 */
export const ErrorNotifyTime = 5;

/**
 * 消息对应的图标
 * @type {{success: string, fail: string}}
 */
const notificationIconMap = {
    success: "check",
    fail: "close"
};

/**
 * 显示文字映射
 * @type {{success: string, fail: string}}
 */
const msgMap = {
    success:'成功',
    fail:'失败'
}

/**
 * 消息对应的样式名
 * @type {{success: string, fail: string}}
 */
const notificationIconClassMap = {
    success: "icon-success",
    fail: "icon-fail"
};

export const utils = {
    /**
     * 合并验证错误的提示信息
     * @param err   [验证错误信息]
     * @returns {Array} 提示信息数组
     */
    combineValidateError: (err) => {
        let tips = [];
        Object.keys(err).forEach((value) => {
            err[value].errors.forEach((error) => {
                tips.push(error.message);
            });
        });
        return tips;
    },
    /**
     * 显示简单提示通知
     * @param notifyData 通知信息
     * @param handleClose 关闭后处理事件
     */
    showNotification: (notifyData, handleClose) => {
        console.log("notification", JSON.stringify(notifyData));
        if(notifyData && notifyData.status && notifyData.status !== '') {
            notification.open({
                message: msgMap[notifyData.status],
                description: notifyData.message,
                icon: <Icon type={notificationIconMap[notifyData.status]}
                            className={notificationIconClassMap[notifyData.status]}/>,
                duration: notifyData.duration ? notifyData.duration : 3,
                onClose: handleClose
            });
        } else {
            console.log("did not show notification.")
        }
    },

    /**
     * 字符串是否为空
     * @returns {boolean} true 为空 false 不为空
     */
    isStrEmpty : (str) => {
        return (undefined === str) || (null === str) || ('' === str);
    }
};