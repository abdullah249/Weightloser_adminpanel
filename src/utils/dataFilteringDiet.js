import { sweetDishesList } from "constants/sweetDishes";
import { butterCream } from "constants/filtering";

/* Error Handling Variables */
var caloriesErrors = 0;
var sweetDishErrors = 0;
var butterCreamErrors = 0;
var indexOfErrors = [];

/* Per Day Nutrition Values For Phases */
var netCarbs = 0;
var carbs = 0;
var protein = 0;
var fat = 0;
var calories = 0;

/* Additional Checks on Phases */
var phase1MondayCalories = 0;
var phase2ThursdayCalories = 0;
var phase1CategoryType = "";

const errorTypesHandling = (el, errorName) => {
  let ind = indexOfErrors.findIndex(
    (o) => o.Day === el.Day && o.MealType === el.MealType
  );
  if (ind >= 0 && Array.isArray(indexOfErrors[ind].ErrorType))
    indexOfErrors[ind]?.ErrorType?.push(errorName);
  else indexOfErrors.push({ ...el, ErrorType: [errorName] });
};

const mealTypeErrorHandling = (el, meal, start, end) => {
  if (
    el.MealType.toLowerCase() === meal &&
    (el.Calories < start || el.Calories > end)
  )
    errorTypesHandling(el, "Out of range Calories");
};

const duplicateNameErrorHandling = (el, i, arr) => {
  if (i <= arr.length - 1) {
    console.log("UNIQUE", el, i, arr);
    let duplicate = arr.slice(0, i).filter((o) => o.Name === el.Name);
    if (duplicate.length > 0) {
      errorTypesHandling(
        el,
        `Duplicate Name [${duplicate?.map(
          (d) => "Day-" + d.Day + "-" + d.MealType + " "
        )}]`
      );
    }
  }
};

const errorHandlingPhase = (el, i, arr) => {
  if (!el.Procedure) errorTypesHandling(el, "Procedure is Missing");
  if (!el.fat) errorTypesHandling(el, "Fat is Missing");
  if (!el.Carbs) errorTypesHandling(el, "Carbs are Missing");
  if (!el.Protein) errorTypesHandling(el, "Protein is Missing");
  if (!el.SR) errorTypesHandling(el, "Net Carbs are Missing");
  if (!el.SatFat) errorTypesHandling(el, "Saturated Fat is Missing");

  mealTypeErrorHandling(el, "breakfast", 200, 400);
  mealTypeErrorHandling(el, "lunch", 400, 600);
  mealTypeErrorHandling(el, "snacks", 150, 300);
  mealTypeErrorHandling(el, "dinner", 400, 800);

  caloriesErrors++;
  return true;
};

const errorHandlingSweetDishes = (el) => {
  errorTypesHandling(el, "Sweet Dish");
  sweetDishErrors++;
  return false;
};

const errorHandlingButterCream = (el) => {
  errorTypesHandling(el, "Cream and Butter in Ingredients");
  butterCreamErrors++;
  return false;
};

/* Error Handling Function */
export const phaseBasedCalories_1_2_3_4 = (data) => {
  data.map((el, i, arr) => {
    return (el.Day >= 1 && el.Day <= 7) /* Phase 1 ( 1 Week ) */ ||
      (el.Day >= 22 && el.Day <= 42) /* Phase 3 ( 3 Weeks ) */ ||
      (el.Day >= 43 && el.Day <= 70) /* Phase 4 ( 4 Weeks ) */
      ? el.MealType.toLowerCase() === "breakfast" &&
        el.Calories >= 200 &&
        el.Calories <= 400 &&
        el.Protein &&
        el.Procedure &&
        el.Carbs &&
        el.SatFat &&
        el.fat &&
        el.SR
        ? true
        : el.MealType.toLowerCase() === "lunch" &&
          el.Calories >= 400 &&
          el.Calories <= 600 &&
          el.Protein &&
          el.Procedure &&
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
          el.Procedure &&
          el.Carbs &&
          el.SatFat &&
          el.fat &&
          el.SR
        ? true
        : errorHandlingPhase(el, i, arr)
      : el.Day >= 8 && el.Day <= 21
      ? el.MealType.toLowerCase() === "breakfast" &&
        el.Calories >= 200 &&
        el.Calories <= 400 &&
        el.Protein &&
        el.Procedure &&
        el.Carbs &&
        el.SatFat &&
        el.fat &&
        el.SR
        ? true
        : el.MealType.toLowerCase() === "lunch" &&
          el.Calories >= 400 &&
          el.Calories <= 600 &&
          el.Protein &&
          el.Procedure &&
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
          el.Procedure &&
          el.SatFat &&
          el.fat &&
          el.SR
        ? true
        : errorHandlingPhase(el, i, arr)
      : errorHandlingPhase(el, i, arr);
  });
  let caloriesSuccess = caloriesErrors > 0 ? false : true;
  caloriesErrors = 0;
  return caloriesSuccess;
};

/* To Check Whether a Food is a Sweet Dish or not */
export const checkSweetDishes = (data) => {
  let lowerCaseList = sweetDishesList.map((d) => d.toLowerCase());
  data.map((el, i) => {
    return lowerCaseList.includes(el.Name.toLowerCase())
      ? errorHandlingSweetDishes(el)
      : true;
  });
  let sweetDishSuccess = sweetDishErrors > 0 ? false : true;
  sweetDishErrors = 0;
  return sweetDishSuccess;
};

/* To Check Whether a Food Name contain Cream and Butter */
export const checkCreamAndButter = (data) => {
  let lowerCaseList = butterCream.map((d) => d.toLowerCase());
  data?.map((el, i) => {
    return el?.DetailsDesc?.map((el2) => {
      return lowerCaseList.includes(el2.toLowerCase())
        ? errorHandlingButterCream(el)
        : true;
    });
  });
  let butterCreamSuccess = butterCreamErrors > 0 ? false : true;
  butterCreamErrors = 0;
  return butterCreamSuccess;
};

const perDayNutritionValues = (p, el, i, arr) => {
  netCarbs += el.SR;
  protein += el.Protein;
  fat += el.fat;
  calories += el.Calories;
  carbs += el.Carbs;
  if (p >= 1 && p <= 7 && el.DayName.toLowerCase() === "monday") {
    phase1MondayCalories += el.Calories;
    phase1CategoryType = el.Category;
  }
  if (p >= 8 && p <= 14 && el.DayName.toLowerCase() === "thursday") {
    phase2ThursdayCalories += el.Calories;
  }

  if (p >= 1 && p <= 17)
    duplicateNameErrorHandling(el, i, arr); /* 17 Days Unique FoodName */
};

export const balancedDietPhase1 = (data) => {
  var balancedDietPhaseErrors = 0;
  for (let p = 1; p <= 7; p++) {
    data.map((el, i, arr) => {
      return p === el.Day && perDayNutritionValues(p, el, i, arr);
    });
    if (
      phase1CategoryType.toLowerCase() !== "vegetarian" &&
      netCarbs <= 25 &&
      protein > 100 &&
      fat < 100 &&
      calories >= 1700 &&
      calories <= 1800
    )
      console.log("Except vegetarian Phase 1 NetCarbs", p);
    else if (
      phase1CategoryType.toLowerCase() === "vegetarian" &&
      netCarbs <= 50 &&
      protein > 100 &&
      fat < 100 &&
      calories >= 1700 &&
      calories <= 1800
    ) {
      console.log("Vegetarian Phase 1 NetCarbs", true);
    } else {
      console.log("Error in Phase 1 NetCarbs", p, phase1CategoryType);
      indexOfErrors.push({ Day: p });
      balancedDietPhaseErrors++;
    }
    netCarbs = 0;
    protein = 0;
    fat = 0;
    calories = 0;
    phase1CategoryType = "";
  }
  let balancedDietPhaseSuccess = balancedDietPhaseErrors > 0 ? false : true;
  balancedDietPhaseErrors = 0;
  return balancedDietPhaseSuccess;
};

export const balancedDietPhase2 = (data) => {
  var balancedDietPhaseErrors = 0;
  for (let p = 8; p <= 21; p++) {
    data.map((el, i, arr) => {
      return p === el.Day && perDayNutritionValues(p, el, i, arr);
    });
    if (
      netCarbs <= 50 &&
      protein > 100 &&
      fat < 80 &&
      calories >= 1700 &&
      calories <= 1500
    )
      console.log("");
    else {
      balancedDietPhaseErrors++;
      indexOfErrors.push({ Day: p });
    }
    netCarbs = 0;
    protein = 0;
    fat = 0;
    calories = 0;
  }
  let balancedDietPhaseSuccess = balancedDietPhaseErrors > 0 ? false : true;
  balancedDietPhaseErrors = 0;
  return balancedDietPhaseSuccess;
};

export const balancedDietPhase3 = (data) => {
  var balancedDietPhaseErrors = 0;
  for (let p = 22; p <= 42; p++) {
    data.map((el, i, arr) => {
      return p === el.Day && perDayNutritionValues(p, el, i, arr);
    });
    if (
      carbs >= carbs * 0.45 &&
      carbs <= carbs * 0.65 &&
      protein >= protein * 0.1 &&
      protein <= protein * 0.35 &&
      fat >= fat * 0.2 &&
      fat <= fat * 0.25 &&
      calories <= 1800 &&
      calories == phase1MondayCalories
    )
      console.log("");
    else {
      balancedDietPhaseErrors++;
      indexOfErrors.push({ Day: p });
    }
    netCarbs = 0;
    protein = 0;
    fat = 0;
    calories = 0;
  }
  let balancedDietPhaseSuccess = balancedDietPhaseErrors > 0 ? false : true;
  balancedDietPhaseErrors = 0;
  return balancedDietPhaseSuccess;
};

export const balancedDietPhase4 = (data) => {
  var balancedDietPhaseErrors = 0;
  for (let p = 43; p <= 70; p++) {
    data.map((el, i, arr) => {
      return p === el.Day && perDayNutritionValues(p, el, i, arr);
    });
    if (
      carbs >= carbs * 0.45 &&
      carbs <= carbs * 0.65 &&
      protein >= protein * 0.1 &&
      protein <= protein * 0.35 &&
      fat >= fat * 0.2 &&
      fat <= fat * 0.25 &&
      calories <= 2000 &&
      calories == phase1MondayCalories &&
      calories == phase2ThursdayCalories
    )
      console.log("");
    else {
      balancedDietPhaseErrors++;
      indexOfErrors.push({ Day: p });
    }
    netCarbs = 0;
    protein = 0;
    fat = 0;
    calories = 0;
  }
  let balancedDietPhaseSuccess = balancedDietPhaseErrors > 0 ? false : true;
  balancedDietPhaseErrors = 0;
  return balancedDietPhaseSuccess;
};

/* To get list of all errors found in Excel Data */
export const totalErrors = () => {
  return indexOfErrors;
};
