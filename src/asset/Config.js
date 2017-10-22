/**
 * 全局配置项
 * Created by ice_b on 2017/10/22.
 */
/**
 * 是否打印
 * @type {boolean}
 */
const isLogToConsole = true;

/**
 * 打印信息到控制台
 * @param obj 要打印的信息
 */
export function log(obj) {
    if(isLogToConsole) {
        console.log(obj);
    }
}