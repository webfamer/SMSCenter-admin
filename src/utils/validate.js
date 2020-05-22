
/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

export function validatePhone(rule, value,callback) {//匹配电话号码
  const reg =/^[1][3-9][0-9]{9}$/;
    if ((!reg.test(value)) && value != '') {
      callback(new Error('请输入正确的电话号码'));
    } else {
      callback();
    }
}


export function validateChinese(rule, value,callback) {//匹配中文
  const reg =/^[\u4E00-\u9FA5]+$/;
    if ((!reg.test(value)) && value != '') {
      callback(new Error('请输入中文'));
    } else {
      callback();
    }
}
export function validateEnglish(rule, value,callback) {//匹配英文
  const reg =/^[a-zA-Z\s]+$/;
    if ((!reg.test(value)) && value != '') {
      callback(new Error('请输入英文'));
    } else {
      callback();
    }
}


export function validateApi(rule, value,callback) {//匹配API
  const reg =/^(\/[a-zA-z]+)+$/;
    if ((!reg.test(value)) && value != '') {
      callback(new Error('请输入正确api'));
    } else {
      callback();
    }
}


export function validateSymbol(rule, value,callback) {//匹配特殊字符
  const reg =/((?=[\x21-\x7e]+)[^A-Za-z0-9])+/;
    if ((reg.test(value)) && value != '') {
      callback(new Error('请不要输入特殊字符'));
    } else {
      callback();
    }
}



export function validateAppName(rule, value,callback) {//匹配中文英文数字
  const reg =/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/;
    if ((!reg.test(value)) && value != '') {
      callback(new Error('请不要输入特殊字符'));
    } else {
      callback();
    }
}
