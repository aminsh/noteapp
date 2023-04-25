export class Memory {
  set(key: string, value: any): void {
    const correctedValue = typeof value === 'object'
      ? JSON.stringify(value)
      : value;

    localStorage.setItem(key, correctedValue);
  }

  get<T>(key: string): T | null {
    const result = localStorage.getItem(key);

    if (!result)
      return null;

    return isJsonLike(result)
      ? JSON.parse(result)
      : result;
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }
}

const JSON_START = /^\[|^\{(?!\{)/;
const JSON_ENDS: any = {
  '[': /]$/,
  '{': /}$/
};

function isJsonLike(value: string) {
  const jsonStart = value.match(JSON_START);
  return jsonStart && JSON_ENDS[jsonStart[0]].test(value);
}
