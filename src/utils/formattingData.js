const groceryList = [
  "Breads and Cereals",
  "Grains",
  "Dairy",
  "Meat and Poultry",
  "Soy Products",
  "Nuts and Seeds",
  "Fruits and Vegetables",
  "Fats and Oil",
  "Baking",
];

let simpleArray = ["AllergicFood", "DetailsDesc"];
export const formattingData = (data) => {
  data.map((row) => {
    return Object.entries(row)?.forEach(([key, value]) => {
      if (groceryList.includes(key)) {
        if (value) {
          if (!Array.isArray(row.Grocery)) row.Grocery = [];
          row.Grocery.push({ title: key, items: value.split(",") });
          delete row[key];
        }
      }
      if (simpleArray.includes(key) && value) {
        row[key] = value.split(",");
      }
    });
  });
  return data;
};
