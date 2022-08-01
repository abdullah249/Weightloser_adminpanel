import { sweetDishesList } from "constants/sweetDishes";
var caloriesErrors = 0;
var sweetDishErrors = 0;
const errorHandlingPhase = (el, i, arr) => {
  console.log(
    "Error:",
    "Day=",
    el.Day,
    "MealType=",
    el.MealType,
    "Calories=",
    el.Calories,
    "Protein=",
    el.Protein,
    "Fats=",
    el.fat,
    "SaturatedFats=",
    el.SatFat,
    "TotalCarbs=",
    el.Carbs,
    "NetCarbs=",
    el.SR,
    "Procedure=",
    el.Procedure,
    "arraylength=",
    arr.length,
    "FoodName=",
    arr[i].Name,
    "Food Unique=",
    arr[i].Name !== arr[i + 1].Name
  );
  caloriesErrors++;
  return true;
};

const errorHandlingSweetDishes = (el) => {
  console.log(
    "Sweet Dish Error:",
    "FoodName=",
    el.Name,
    "Day=",
    el.Day,
    "MealType=",
    el.MealType
  );
  sweetDishErrors++;
  return false;
};

export const phaseBasedCalories1_3_4 = (data) => {
  data.map((el, i, arr) => {
    return (el.Day >= 1 && el.Day <= 7 && el.Procedure) ||
      (el.Day >= 22 && el.Day <= 42 && el.Procedure) ||
      (el.Day >= 43 && el.Day <= 70 && el.Procedure)
      ? el.MealType.toLowerCase() === "breakfast" &&
        el.Calories >= 200 &&
        el.Calories <= 400 &&
        el.Protein &&
        el.Carbs &&
        el.SatFat &&
        el.fat &&
        el.SR
        ? true
        : el.MealType.toLowerCase() === "lunch" &&
          el.Calories >= 400 &&
          el.Calories <= 600 &&
          el.Protein &&
          el.Carbs &&
          el.SatFat &&
          el.fat &&
          el.SR
        ? true
        : el.MealType.toLowerCase() === "snacks" &&
          el.Calories >= 150 &&
          el.Calories <= 300 &&
          el.Protein &&
          el.Carbs &&
          el.SatFat &&
          el.fat &&
          el.SR
        ? true
        : el.MealType.toLowerCase() === "dinner" &&
          el.Calories >= 400 &&
          el.Calories <= 800 &&
          el.Protein &&
          el.Carbs &&
          el.SatFat &&
          el.fat &&
          el.SR
        ? true
        : errorHandlingPhase(el, i, arr)
      : el.Day >= 8 &&
        el.Day <= 21 &&
        el.Procedure &&
        arr[i].Name !== arr[i + 1].Name
      ? el.MealType.toLowerCase() === "breakfast" &&
        el.Calories >= 200 &&
        el.Calories <= 400 &&
        el.Protein &&
        el.Carbs &&
        el.SatFat &&
        el.fat &&
        el.SR
        ? true
        : el.MealType.toLowerCase() === "lunch" &&
          el.Calories >= 400 &&
          el.Calories <= 600 &&
          el.Protein &&
          el.Carbs &&
          el.SatFat &&
          el.fat &&
          el.SR
        ? true
        : el.MealType.toLowerCase() === "snacks" &&
          el.Calories >= 150 &&
          el.Calories <= 300 &&
          el.Protein &&
          el.Carbs &&
          el.SatFat &&
          el.fat &&
          el.SR
        ? true
        : el.MealType.toLowerCase() === "dinner" &&
          el.Carbs === 0 &&
          el.Calories >= 400 &&
          el.Calories <= 800 &&
          el.Protein &&
          el.SatFat &&
          el.fat &&
          el.SR
        ? true
        : errorHandlingPhase(el, i, arr)
      : errorHandlingPhase(el, i, arr);
  });
  let caloriesSuccess = caloriesErrors > 0 ? false : true;
  console.log("Calories Errors:", caloriesErrors);
  console.log("Calories Success:", caloriesSuccess);
  caloriesErrors = 0;
  return caloriesSuccess;
};

export const checkSweetDishes = (data) => {
  let lowerCaseList = sweetDishesList.map((d) => d.toLowerCase());
  data.map((el) => {
    return lowerCaseList.includes(el.Name.toLowerCase())
      ? errorHandlingSweetDishes(el)
      : true;
  });
  let sweetDishSuccess = sweetDishErrors > 0 ? false : true;
  console.log("Sweet Erros", sweetDishErrors);
  console.log("Sweet Success ", sweetDishSuccess);
  sweetDishErrors = 0;
  return sweetDishSuccess;
};

export const checkAllNutrition = () => {};

export const checkAllProcedure = () => {};
