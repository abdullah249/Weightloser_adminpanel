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

var carbsPercentage = 0;
var proteinPercentage = 0;
var fatPercentage = 0;

/* Additional Checks on Phases */
var phase1MondayCalories = 0;
var phase2ThursdayCalories = 0;
var phase1CategoryType = "";
var dayName = "";
var phase2RepeatCalories = 0;

const errorTypesHandling = (el, errorName) => {
  let ind = indexOfErrors.findIndex(
    (o) => o.Day === el.Day && o.MealType === el.MealType
  );
  if (ind >= 0 && Array.isArray(indexOfErrors[ind].ErrorType))
    indexOfErrors[ind]?.ErrorType?.push(errorName);
  else indexOfErrors.push({ ...el, ErrorType: [errorName] });
};

const errorTypesHandlingBalancedDiet = (p, errorName) => {
  let ind = indexOfErrors.findIndex((o) => o.Day === p && !o.MealType);
  if (ind >= 0 && Array.isArray(indexOfErrors[ind].ErrorType))
    indexOfErrors[ind].ErrorType.push(errorName);
  if (ind >= 0 && !indexOfErrors[ind].ErrorType)
    indexOfErrors[ind].ErrorType = [errorName];
};

const mealTypeErrorHandling = (el, meal, start, end) => {
  if (
    el.MealType.toLowerCase() === meal &&
    (el.Calories < start || el.Calories > end)
  )
    errorTypesHandling(el, "Calories Out of range");
};

const duplicateNameErrorHandling = (el, i, arr) => {
  if (i <= arr.length - 1) {
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

  if (el.Day >= 8 && el.Day <= 21 && el.MealType.toLowerCase() === "dinner") {
    if (el.Carbs !== 0)
      errorTypesHandling(el, "Dinner carbs should be 0 in Phase 2");
  }
  caloriesErrors++;
  return true;
};

const errorHandlingBalancedDiet = (p, mon, thurs) => {
  if (p >= 1 && p <= 7) {
    if (protein < 100)
      errorTypesHandlingBalancedDiet(p, "Protein out of range(Less than 100)");
    if (fat >= 100)
      errorTypesHandlingBalancedDiet(p, "Fat out of range(Greater than 100)");
    if (calories < 1700 || calories > 1800)
      errorTypesHandlingBalancedDiet(
        p,
        "Calories out of range(Should be between(1700-1800)"
      );

    if (phase1CategoryType.toLowerCase() === "vegetarian") {
      if (netCarbs > 50)
        errorTypesHandlingBalancedDiet(p, "Net Carbs out of range");
    } else {
      if (netCarbs > 25)
        errorTypesHandlingBalancedDiet(p, "Net Carbs out of range");
    }
  }

  if (p >= 8 && p <= 21) {
    if (netCarbs > 50)
      errorTypesHandlingBalancedDiet(
        p,
        "Net Carbs out of range(Less than 100)"
      );
    if (protein < 100)
      errorTypesHandlingBalancedDiet(p, "Protein out of range(Less than 100)");
    if (fat >= 80)
      errorTypesHandlingBalancedDiet(p, "Fat out of range(Greater than 100)");
    if (calories < 1500 || calories > 1600)
      errorTypesHandlingBalancedDiet(
        p,
        "Calories out of range(Should be between(1500-1600)"
      );
    if (p >= 19 && p <= 21) {
      if (calories !== phase2RepeatCalories)
        errorTypesHandlingBalancedDiet(p, "Phase 2 Last 4 Days Repetition");
    }
  }

  if (p >= 22 && p <= 70) {
    if (carbsPercentage < 0.45 || carbsPercentage > 0.65)
      errorTypesHandlingBalancedDiet(
        p,
        "Carbs % out of range (Should be between(45%-65%))"
      );

    if (proteinPercentage < 0.1 || proteinPercentage > 0.35)
      errorTypesHandlingBalancedDiet(
        p,
        "Protein % out of range(Should be between(10%-35%))"
      );

    if (fatPercentage < 0.2 || fatPercentage > 0.25)
      errorTypesHandlingBalancedDiet(
        p,
        "Fat % out of range(Should be between(20%-25%))"
      );
    if (p >= 22 && p <= 42) {
      if (mon === false) {
        if (calories > 1800) {
          errorTypesHandlingBalancedDiet(
            p,
            "Phase 3 Calories out of range(Should not be max than 1800))"
          );
        }
      }
      if (mon === true) {
        if (calories !== phase1MondayCalories) {
          errorTypesHandlingBalancedDiet(
            p,
            "Phase3 Monday Calories out of range(Should be same as Phase1 Monday Calories))"
          );
        }
      }
    }

    if (p >= 43 && p <= 70) {
      if (mon === false) {
        if (calories > 2000) {
          errorTypesHandlingBalancedDiet(
            p,
            "Calories out of range(Should not be max than 2000))"
          );
        }
      }
      if (mon === true) {
        if (calories !== phase1MondayCalories) {
          errorTypesHandlingBalancedDiet(
            p,
            "Phase4 Monday Calories out of range(Should be same as Phase1 Monday Calories))"
          );
        }
      }
      if (thurs === false) {
        if (calories !== phase2ThursdayCalories) {
          errorTypesHandlingBalancedDiet(
            p,
            "Phase 4 Calories out of range(Should not be max than 2000))"
          );
        }
      }
      if (thurs === true) {
        if (calories !== phase1MondayCalories) {
          errorTypesHandlingBalancedDiet(
            p,
            "Phase4 Thursday Calories out of range(Should be same as Phase2 Thursday Calories))"
          );
        }
      }
    }
  }

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
  dayName = el.DayName;

  if (p >= 1 && p <= 17) {
    if (p >= 1 && p <= 7) {
      if (el.DayName.toLowerCase() === "monday")
        phase1MondayCalories += el.Calories;
      phase1CategoryType = el.Category;
    }
    if (p >= 8 && p <= 14 && el.DayName.toLowerCase() === "thursday") {
      phase2ThursdayCalories += el.Calories;
    }
    duplicateNameErrorHandling(el, i, arr);
  }

  if (p === 18) {
    phase2RepeatCalories += el.Calories;
  }

  if (p >= 25 && p <= 39 && el.DayName.toLowerCase() !== "monday")
    duplicateNameErrorHandling(el, i, arr);
};

const perDayNutritionValuesPercentage = () => {
  carbsPercentage = Number(((carbs * 4) / calories).toFixed(2));
  proteinPercentage = Number(((protein * 4) / calories).toFixed(2));
  fatPercentage = Number(((fat * 9) / calories).toFixed(2));
};

const checkMondayAndThursdayCalories = (dayName, checkCalories, day) => {
  if (dayName.toLowerCase() === dayName) {
    if (calories === checkCalories) console.log("");
    else errorHandlingBalancedDiet(day, true, true);
    // else errorTypesHandlingBalancedDiet(day, errMsg);
  }
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
      console.log("");
    else if (
      phase1CategoryType.toLowerCase() === "vegetarian" &&
      netCarbs <= 50 &&
      protein > 100 &&
      fat < 100 &&
      calories >= 1700 &&
      calories <= 1800
    ) {
      console.log("");
    } else {
      indexOfErrors.push({ Day: p });
      errorHandlingBalancedDiet(p);
      balancedDietPhaseErrors++;
    }
    netCarbs = 0;
    protein = 0;
    carbs = 0;
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
      calories >= 1500 &&
      calories <= 1600
    )
      console.log("");
    else {
      balancedDietPhaseErrors++;
      indexOfErrors.push({ Day: p });
      errorHandlingBalancedDiet(p);
    }
    if (p >= 19 && p <= 21) {
      if (calories === phase2RepeatCalories) console.log("");
      else errorHandlingBalancedDiet(p);
    }
    netCarbs = 0;
    carbs = 0;
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
    perDayNutritionValuesPercentage();
    if (
      dayName.toLowerCase() !== "monday" &&
      carbsPercentage >= 0.45 &&
      carbsPercentage <= 0.65 &&
      proteinPercentage >= 0.1 &&
      proteinPercentage <= 0.35 &&
      fatPercentage >= 0.2 &&
      fatPercentage <= 0.25 &&
      calories <= 1800
    )
      console.log("");
    else {
      balancedDietPhaseErrors++;
      indexOfErrors.push({ Day: p });
      errorHandlingBalancedDiet(p, false);
    }
    checkMondayAndThursdayCalories("monday", phase1MondayCalories, p);

    netCarbs = 0;
    carbs = 0;
    protein = 0;
    fat = 0;
    calories = 0;
    carbsPercentage = 0;
    proteinPercentage = 0;
    fatPercentage = 0;
    dayName = "";
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
    perDayNutritionValuesPercentage();
    if (
      carbsPercentage >= 0.45 &&
      carbsPercentage <= 0.65 &&
      proteinPercentage >= 0.1 &&
      proteinPercentage <= 0.35 &&
      fatPercentage >= 0.2 &&
      fatPercentage <= 0.25 &&
      calories <= 2000
    )
      console.log("");
    else {
      balancedDietPhaseErrors++;
      indexOfErrors.push({ Day: p });
      errorHandlingBalancedDiet(p);
    }
    checkMondayAndThursdayCalories("monday", phase1MondayCalories, p);
    checkMondayAndThursdayCalories("thursday", phase2ThursdayCalories, p);

    netCarbs = 0;
    carbs = 0;
    protein = 0;
    fat = 0;
    calories = 0;
    carbsPercentage = 0;
    proteinPercentage = 0;
    fatPercentage = 0;
  }
  let balancedDietPhaseSuccess = balancedDietPhaseErrors > 0 ? false : true;
  balancedDietPhaseErrors = 0;
  return balancedDietPhaseSuccess;
};

/* To get list of all errors found in Excel Data */
export const totalErrors = () => {
  return indexOfErrors;
};
