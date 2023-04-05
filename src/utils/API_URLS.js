export const API_URLS = {
  diet: {
    list: "plan/1",
    getCounts: (id) => "activeplans/Count/" + id,
    create: "plan/addplan",
    updata: "plan/update",
    addFoodPlan: "plan/foodplan",
    getFoodId: "food/Foodid",
    getFoods: ({ planId, day }) => `plan/FoodPlan?planId=${planId}&day=${day}`,
    deleteFood: "plan/FoodDelete",
    dashboard: "plan/dashboard",
    getLogging: (userId, foodId) =>
      `history/LoggedFood?userId=${userId}&foodId=${foodId}`,
  },
  exercise: {
    list: "plan/2",
    getCounts: (id) => "activeplans/Count/" + id,
    dashboard: "plan/exercise",
    create: "plan/addplan",
    update: "plan/update",
    categories: "category/exercise",
    delete: (id) => "plan/delete/" + id,
    addExercise: "plan/ExercisePlan",
    deleteBurner: (planId, burnerId) =>
      `plan/ExercisePlan?planId=${planId}&exerciseId=${burnerId}`,
    getPlanDetails: (planId, day) =>
      `plan/ExercisePlan?planId=${planId}&day=${day}`,
    getLogging: (userId, exerciseId) =>
      `history/LoggedExercise?userId=${userId}&exerciseId=${exerciseId}`,
  },
  food: {
    search: (name) => "food/foodsearch?name=" + name,
    add: "plan/foodplan",
    getById: (id) => `food/${id}`,
    new: "food/add",
    addDetails: `foodDetails`,
    update: "food/update",
  },
  burner: {
    search: (name) => `burner/search/${name}`,
    types: "burner/type",
    create: "burner",
    update: "burner/update",
  },
  blog: {
    create: `blog`,
    update: "blog/update",
    list: `blog`,
    getById: (id) => "blog/" + id,
    delete: (id) => "blog/" + id,
    listTrending: `blog/BookMarked/`,
    types: "blog/type",
    counts: (blogId) => `blog/Count/${blogId}`,
  },
  coupons: {
    list: `coupon`,
    create: `coupon`,
    getById: (id) => `coupon/${id}`,
    update: `coupon/update`,
    dashboard: "coupon/dashboard",
  },
  customer: {
    list: "profile/customerdetails",
  },
  dashboard: {
    counts: "dashboard",
    transactions: "dashboard/payment",
    customerCounts: "dashboard/country",
  },
  cuisine: {
    list: "cuisine",
  },
  category: {
    list: "category/food",
  },
  video: {
    create: "video",
    delete: (id) => "video/" + id,
  },
  mind: {
    list: "plan/4",
    meditation: {
      create: "plan/addplan",
      attachVideo: "plan/mindplan",
      getVideos: (planId, day) => `plan/MindPlan?planId=${planId}&day=${day}`,
      getCategories: "category/mind",
    },
    cbt: {
      create: "video",
      list: "mind/videos",
    },
  },
  restaurants: {
    list: "restaurant",
    create: "restaurant",
    update: "restaurant/UpdateRestaurant",
    delete: (id) => "restaurant/" + id,
    counts: (id) => "restaurant/count/" + id,
    items: (id) => "restaurant/FoodItems/" + id,
    addFood: "restaurantfood",
    deleteFood: (foodId, restaurantId) =>
      `restaurant?FoodId=${foodId}&RestaurantId=${restaurantId}`,
  },
  user: {
    list: "/user",
    listDevices: "/user/Devices",
    search: (name) => `user/search/${name}`,
    dashboard: (userId) => "plan/UserPlans/" + userId,
    exerciseDashboard: (userId) => "plan/UserExercisePlans/" + userId,
    mindDashboard: (userId) => "plan/UserMindPlans/" + userId,
    sendEmail: "/login/PortalEmail",
    sendPush:  "/firebase/PortalNotifications",
  },
  staff: {
    list: "staff",
    create: "staff",
    delete: (id) => "staff/" + id,
    update: "staff/update",
    login: "staff/login",
  },
};
