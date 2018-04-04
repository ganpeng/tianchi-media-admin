// 定义常量

// 定义正则表达式
// 空
const EMPTY = /^$/
// 邮箱地址
const EMAIL = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/
// 手机号码
const MOBILE = /^1[0-9]{10}$/
// 固定电话号码
const TELEPHONE = /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/
// h5-admin项目中密码的要求，6-8位大小写字母或数字
const PASSWORD = /^[\da-zA-Z]{6,8}$/

let RegExpConstants = {
    EMPTY,
    EMAIL,
    MOBILE,
    TELEPHONE,
    PASSWORD
}

let constants = {RegExpConstants}

export default constants
