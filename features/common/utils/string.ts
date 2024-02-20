export const isNumeric = (str: string) => {
  return !isNaN(+str);
};

export const isLower = (str: string) => {
  return !isNumeric(str) && str.toLowerCase() === str;
};

export const isUpper = (str: string) => {
  return !isNumeric(str) && str.toUpperCase() === str;
};
