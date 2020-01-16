// 1.保存token
export function setSession(key,value){
    value = typeof (value) === 'object' ? JSON.stringify(value) : value;
    window.sessionStorage.setItem(key,value)
    return true
}
// 2.获取token
export function getSession(key){
    var tem = '';
    try {
        tem = window.sessionStorage.getItem(key);
        tem = JSON.parse(tem);
    } catch (e) { tem = window.sessionStorage.getItem(key); }
    return tem;
}
