const errorHandlingPhase = (el, i, arr) => {
  console.log(
    "Error in ",
    "index =",
    i,
    ", Day =",
    el.Day,
    ", MealType =",
    el.MealType,
    ", Calories =",
    el.Calories,
    ", Procedure =",
    el.Procedure,
    ", arraylength =",
    arr.length,
    "Name =",
    arr[i].Name,
    arr[i + 1].Name,
    arr[i].Name !== arr[i + 1].Name
  );
  return false;
};

let sweetDishes = [
  "Khoya",
  "Sandesh",
  "Boondi",
  "Mishti Doi",
  "Mohan Bhog",
  "Lobongo",
  "Nikruti",
  "Roshogulla",
  " Traditional Flan Custard",
  "Tres Leches Pastel",
  "Mexican Churros",
  "Mexican Chocolate Sauce",
  "Vietnamese Three Color Desserts",
  "Che Ba Mau or Chè Ba Mau Chè Ba Màu",
  "Che Bap or Chè Bắp – Sweet Corn Pudding",
  "Che Troi Nuoc or Chè Trôi Nước",
  "Che Chuoi or Chè Chuối",
  " Vietnamese Sweet Corn Pudding",
  "Vietnamese Sponge Cake",
  "Vietnamese Fruit Cocktail",
  "Tarta de Santiago",
  "Tarta de Queso",
  "Torrijas",
  "Crema Catalana",
  "Chocolate and Churros",
  "Turrón",
  "Mantecados",
  "Polvorones",
  "Flan",
  "Baklava",
  "Künefe",
  "Lokum",
  "Tavukgöğsü",
  "Kadayif and Kunefe",
  "Firinda Sutlac",
  "Tavuk Gogsu",
  "Asure",
];

export const phaseBasedCalories1_3_4 = (data) => {
  let result = data.every((el, i, arr) => {
    return (el.Day >= 1 && el.Day <= 7 && el.Procedure) ||
      (el.Day >= 22 && el.Day <= 42 && el.Procedure) ||
      (el.Day >= 43 && el.Day <= 70 && el.Procedure)
      ? el.MealType.toLowerCase() === "breakfast" &&
        el.Calories >= 200 &&
        el.Calories <= 400
        ? true
        : el.MealType.toLowerCase() === "lunch" &&
          el.Calories >= 400 &&
          el.Calories <= 600
        ? true
        : el.MealType.toLowerCase() === "snacks" &&
          el.Calories >= 150 &&
          el.Calories <= 300
        ? true
        : el.MealType.toLowerCase() === "dinner" &&
          el.Calories >= 400 &&
          el.Calories <= 800
        ? true
        : errorHandlingPhase(el, i, arr)
      : el.Day >= 8 && el.Day <= 21 && el.Procedure && i < arr.length - 1
      ? el.MealType.toLowerCase() === "breakfast" &&
        el.Calories >= 200 &&
        el.Calories <= 400
        ? true
        : el.MealType.toLowerCase() === "lunch" &&
          el.Calories >= 400 &&
          el.Calories <= 600
        ? true
        : el.MealType.toLowerCase() === "snacks" &&
          el.Calories >= 150 &&
          el.Calories <= 300
        ? true
        : el.MealType.toLowerCase() === "dinner" &&
          el.Carbs === 0 &&
          el.Calories >= 400 &&
          el.Calories <= 800
        ? true
        : errorHandlingPhase(el, i, arr)
      : errorHandlingPhase(el, i, arr);
  });
  console.log("Success", result);
  return result;
};

export const checkSweetDishes = () => {};

export const checkAllNutrition = () => {};

export const checkAllProcedure = () => {};
