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
  "Traditional Flan Custard",
  "Tres Leches Pastel",
  "Mexican Churros",
  "Mexican Chocolate Sauce",
  "Vietnamese Three Color Desserts",
  "Che Ba Mau or Chè Ba Mau Chè Ba Màu",
  "Che Bap or Chè Bắp – Sweet Corn Pudding",
  "Che Troi Nuoc or Chè Trôi Nước",
  "Che Chuoi or Chè Chuối",
  "Vietnamese Sweet Corn Pudding",
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
  "Dessert",
  "Cupcake",
  "Chocolate Dessert",
  "Brownies",
  "Sweet Pastry",
  "Doughnut",
  "Frozen Dessert",
  "Milkshake",
  "Chocolate salami",
  "Napoleon cake",
  "Bird’s milk cake",
  "Russian Fudge",
  "Kartoshka",
  "Viktor Kuzmin",
  "Borshch",
  "Portuguese Custard Tarts",
  "Queijadas de Sintra",
  "Bola de Berlim",
  "Bolo Rei",
  "Pastéis de Nata",
  "Serradura Dessert",
  "Pao De Lo",
  "Chocolate Salami",
  "Ranginak",
  "Faloodeh",
  "Shirini Morabai",
  "Shirini Zaban",
  "Noon Khamei",
  "Qottab",
  "Persian Black Tea with Cardamom & Dried Rose Petals",
  "Kheer",
  "Gajjar Ka Halwa",
  "Gulab Jamun",
  "Sohan Halwa",
  "Halwa",
  "Barfi ",
  "Gulab Jamun",
  "Ras Malai",
  "Yomari",
  "Lakhamari",
  "Juju Dhau",
  "Jerry",
  "Gud-paak",
  "Til ko Laddu",
  "Peda",
  "Rasbari",
  "Khuwa Barfi",
  "Kheer",
  "Khajuri",
  "Italian Apple Olive Oil Cake",
  "Popped Quinoa Crunch Bar",
  "Honey Almond Ricotta Spread With Peaches",
  "Blueberry Muffins ",
  "Flourless Chocolate Olive Oil Cake",
  "Roasted Fruit",
  "Vegan Lemon Olive Oil Cake",
  "Maple Vanilla Baked Pears",
  "Pudding",
  "Layali lubnan",
  "Maamoul",
  "Shaabiyat",
  "Lebanese Baklava",
  "Halawet El Jibn",
  "Cookie",
  "Ma'amoul ",
  "Sweet Pastry",
  "Kunāfah",
  "Red bean porridge",
  "Sweet pancakes",
  "Sugar candy",
  "Shaved ice",
  "Bungeoppang",
  "Hotteok",
  "Sweet Pancake",
  "Sweet Rice Mini Bundt Cake",
  "Bingsu",
  "Shaved Ice",
  "Dalgona",
  "Sponge Candy",
  "Poached Pears",
  "Baesuk",
  "Sweet Korean Pancakes",
  "Blueberry Cream Cheese Babka",
  "Lekach",
  "Honey Cake",
  "Passover Rainbow Cookies",
  "Ingredient Chewy Coconut Macaroons",
  "Apricot Hamantaschen",
  "Mandel Bread",
  "Sufganiyah",
  "Easy Halva Recipe",
  "Rugelach",
  "Hanukkah Gelt",
  "Daifuku",
  "Green tea mochi",
  "matcha mochi",
  "Sakura mochi",
  "Japanese cherry blossom mochi",
  "Japanese parfait",
  "Japanese sweet potato dessert",
  "Mochi ice cream",
  "Japanese red bean paste",
  "anko",
  "Dango",
  "Black sesame seed cookies",
  "Traditional anmitsu",
  "Tiramisu",
  "Authentic Recipe",
  "Easy Classic Pizzelle Recipe",
  "Italian Waffle Cookies",
  "Chocolate Vanilla Berry Panna Cotta Tart",
  "Almond Biscotti Recipe with Cranberries",
  "Italian-Style Candied Chestnuts",
  "Italian Butter Cookies",
  "Canestrelli",
  "Italian Egg Yolk Cookies",
  "Traditional Italian Breakfast Cookies",
  "Easy Panettone Recipe",
  "Lemon Ricotta Cake with Almonds",
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
      : el.Day >= 8 &&
        el.Day <= 21 &&
        el.Procedure &&
        arr[i].Name !== arr[i + 1].Name
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
