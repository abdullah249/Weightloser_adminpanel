export const phaseBasedCalories1_3_4 = (data) => {
  data.forEach((el, i) => {
    if (
      (el.Day >= 1 && el.Day <= 7) ||
      (el.Day >= 22 && el.Day <= 42) ||
      (el.Day >= 43 && el.Day <= 70)
    ) {
      if (
        el.MealType.toLowerCase() === "breakfast" &&
        el.Calories >= 200 &&
        el.Calories <= 400
      )
        console.log("Data is Fine For Phase1-3-4 Breakfast");
      else if (
        el.MealType.toLowerCase() === "lunch" &&
        el.Calories >= 400 &&
        el.Calories <= 600
      )
        console.log("Data is Fine For Phase1-3-4 Lunch");
      else if (
        el.MealType.toLowerCase() === "snacks" &&
        el.Calories >= 150 &&
        el.Calories <= 300
      )
        console.log("Data is Fine For Phase1-3-4 Snacks");
      else if (
        el.MealType.toLowerCase() === "dinner" &&
        el.Calories >= 400 &&
        el.Calories <= 800
      )
        console.log("Data is Fine For Phase1-3-4 Dinner");
      else console.log("Wrong Meal Type", i, el.Day, el.MealType, el.Calories);
    }
  });
};

export const phaseBasedCalories2 = () => {};

export const checkAllNutrition = () => {};

export const checkAllProcedure = () => {};

export const checkSweetDishes = () => {};
