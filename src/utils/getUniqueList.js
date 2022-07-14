export const getUniqueListBy = (arr, key) => {
  return [...new Map(arr.map((item) => [item.data[key], item])).values()];
};
