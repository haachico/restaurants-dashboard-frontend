const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getRestaurants = async (searchInput, selectedLocation, selectedCuisine, currentPage) => {
  const response = await fetch(`${BASE_URL}/restaurants.php?search=${searchInput}&location=${selectedLocation}&cuisine=${selectedCuisine}&page=${currentPage}`);
  return response.json();
};


export const ordersTrends = async (restaurantId, startDate, endDate, amountMin, amountMax, hourMin, hourMax) => {
  const response = await fetch(`${BASE_URL}/order_trends.php?restaurant_id=${restaurantId}&start_date=${startDate}&end_date=${endDate}&amount_min=${amountMin}&amount_max=${amountMax}&hour_min=${hourMin}&hour_max=${hourMax}`);
  return response.json();
};