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
 * fetch url base
 */
export const urlBase = "http://localhost:9090/assets/v1"

/**
 * 打印信息到控制台
 */
export function log() {
    if(isLogToConsole) {
        let str = '';
        for(let i=0;i<arguments.length;i++){
            str += arguments[i];
        }
        console.log(str);
    }
}