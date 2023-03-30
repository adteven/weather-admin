import { IObject } from "@/../types/interface";

/**
 * 获取对象下的字段值
 * @param record {}
 * @param key 'a.b.c'
 * @param defaultValue
 * @returns
 */
export const getValueByKeys = (
  record: IObject = {},
  key: string,
  defaultValue?: unknown
): any => {
  const keys = key.split(".");
  for (let i = 0; i < keys.length; i++) {
    record = record[keys[i]] || (i === keys.length - 1 ? defaultValue : {});
  }
  return record || defaultValue;
};

/**
 * 获取svg图标(id)列表
 */
export const getIconList = (): string[] => {
  const rs: string[] = [];
  const list = document.querySelectorAll("svg symbol");
  for (let i = 0; i < list.length; i++) {
    rs.push(list[i].id);
  }
  return rs;
};


export const getUuid = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * 邮箱
 * @param {*} s
 */
export const isEmail = (s: string): boolean => {
  return /^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s);
};

/**
 * 手机号码
 * @param {*} s
 */
export const isMobile = (s: string): boolean => {
  return /^1[0-9]{10}$/.test(s);
};
