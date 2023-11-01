export function setAttr(obj: any, key: string, value: any) {
  key.split('.').reduce((obj, key, i, keys) => {
    if (i === keys.length - 1) {
      obj[key] = value;
    }
    return obj[key];
  }, obj);
}

export function getAttr(obj: any, key: string): any {
  return key.split('.').reduce((obj, key) => obj[key], obj);
}

export function clearObject(obj: any) {
  if (!obj || typeof obj !== 'object') {
    return;
  }

  if (Array.isArray(obj)) {
    obj.length = 0;
  }

  for (const k in obj) {
    obj[k] = undefined;
  }
}

export function updateObject(obj: any, v: any) {
  clearObject(obj);
  Object.assign(obj, v);
}
