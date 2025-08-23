const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getRestaurants = async (searchInput, selectedLocation, selectedCuisine) => {
  const response = await fetch(`${BASE_URL}/restaurants.php?search=${searchInput}&location=${selectedLocation}&cuisine=${selectedCuisine}`);
  return response.json();
};


export const ordersTrends = async (restaurantId, startDate, endDate) => {
  const response = await fetch(`${BASE_URL}/order_trends.php?restaurant_id=${restaurantId}&start_date=${startDate}&end_date=${endDate}`);
  return response.json();
};