import { translateDictionary } from '../config/translate-dictionary';

export const translate = (...keys: string[]) => {
  return keys.map(resolve).join(' ');
}

const resolve = (key: string) => {
  const value = translateDictionary[key];
  return value || key;
}
