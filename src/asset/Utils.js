/**
 * 工具方法
 * Created by biml on 2017/10/23.
 */

export const utils = {
    /**
     * 合并验证错误的提示信息
     * @param err   [验证错误信息]
     * @returns {Array} 提示信息数组
     */
    combineValidateError : (err)=>{
        let tips = [];
        Object.keys(err).forEach((value) => {
            err[value].errors.forEach((error)=>{
                tips.push(error.message);
            });
        });
        return tips;
    }
}