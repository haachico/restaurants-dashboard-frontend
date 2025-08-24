import React, { useEffect, useRef, useState } from "react";
import { getRestaurants, ordersTrends } from "../services/apis";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import LineGraph from "../components/LineGraph";
import HeatmapGraph from "../components/HeatmapGraph";
import GroupedBarGraph from "../components/GroupedBarGraph";

// const restaurants = [
//   { name: "The Spice House", location: "Downtown", cuisine: "Indian" },
//   { name: "Bella Italia", location: "Uptown", cuisine: "Italian" },
//   { name: "Sushi Zen", location: "Midtown", cuisine: "Japanese" },
//   { name: "Burger Barn", location: "Suburbs", cuisine: "American" },
// ];

const Dashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const [allCuisines, setAllCuisines] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [ordersTrendsData, setOrdersTrendsData] = useState(null);
  const [trendyHrs, setTrendyHrs] = useState(null);

  const [topRestaurants, setTopRestaurants] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  const [totalRestaurants, setTotalRestaurants] = useState(1);

  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);

  const totalPages = Math.ceil(totalRestaurants / 2);

  const dateRef = useRef();

  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);

    // Call the parent component's function with the new dates
    // if (start && end) {
    //   onDateChange(
    //     start.toISOString().split("T")[0],
    //     end.toISOString().split("T")[0]
    //   );
    // }
  };

  const restaurantName = restaurants.find(
    (r) => r.id === selectedRestaurantId
  )?.name;

  useEffect(() => {
    const fetchRestaurants = async () => {
      const data = await getRestaurants(
        searchInput,
        selectedLocation,
        selectedCuisine,
        currentPage
      );
      console.log(data, "data");
      setRestaurants(data.data);
      setAllLocations([...new Set(data.data.map((r) => r.location))]);
      setAllCuisines([...new Set(data.data.map((r) => r.cuisine))]);
      setTotalRestaurants(data.total_count);
    };
    fetchRestaurants();
  }, [searchInput, selectedLocation, selectedCuisine, currentPage]);

  useEffect(() => {
    const fetchOrdersTrends = async () => {
      if (selectedRestaurantId && startDate && endDate) {
        const formatedStartDate = startDate.toISOString().slice(0, 10);
        const formatedEndDate = endDate.toISOString().slice(0, 10);
        const response = await ordersTrends(
          selectedRestaurantId,
          formatedStartDate,
          formatedEndDate
        );
        console.log(response, "orders trends data");
        setOrdersTrendsData(response?.data.daily_records);
        setTrendyHrs(response?.data?.trendy_hours);
        setTopRestaurants(response?.data?.max_revenue_restaurants);
      }
    };
    fetchOrdersTrends();
  }, [selectedRestaurantId, startDate, endDate]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dateRef.current && !dateRef.current.contains(event.target)) {
        setShowDatePicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  console.log(ordersTrendsData, "checkkk");

  const dailyRevenueData =
    ordersTrendsData?.map((el) => {
      return {
        date: el.order_date,
        revenue: el.daily_revenue,
      };
    }) || [];

  console.log(dailyRevenueData, "dailyRevenueData");

  const dailyOrdersCount =
    ordersTrendsData?.map((el) => {
      return {
        date: el.order_date,
        count: el.orders_count,
      };
    }) || [];

  const dailyAverageOrderValue =
    ordersTrendsData?.map((el) => {
      return {
        date: el.order_date,
        average: el.average_order_value,
      };
    }) || [];

  console.log(dailyAverageOrderValue, "dailyAverageOrderValue");



  return (
    <div>
      {/* table */}
      <div className="p-6 w-full">
        <h2 className="text-2xl font-semibold mb-4">Restaurants</h2>

        <div className="flex justify-end items-center mb-4 gap-4">
          {/* Search input on the left */}
          <input
            type="text"
            placeholder="Search restaurants..."
            className="border border-[#000] text-[#000] rounded px-3 py-2 w-64 bg-white"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />

          {/* Dropdown filters on the right */}
          <div className="flex gap-4">
            <select
              className="border border-[#000] text-[#000] rounded px-3 py-2 bg-white"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">All locations</option>
              {allLocations.map((location, index) => (
                <option key={index} value={location}>
                  {location}
                </option>
              ))}
            </select>
            <select
              className="border border-[#000] text-[#000] rounded px-3 py-2 bg-white"
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
            >
              <option value="">All cuisines</option>
              {allCuisines.map((cuisine, index) => (
                <option key={index} value={cuisine}>
                  {cuisine}
                </option>
              ))}
            </select>
          </div>
        </div>

        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-800 px-4 py-2 text-left">
                Name
              </th>
              <th className="border border-gray-800 px-4 py-2 text-left">
                Location
              </th>
              <th className="border border-gray-800 px-4 py-2 text-left">
                Cuisine
              </th>
            </tr>
          </thead>
          <tbody>
            {restaurants?.length === 0 ? (
              <tr>
                <td
                  colSpan="3"
                  className="border border-gray-800 px-4 py-2 text-center"
                >
                  No restaurants found
                </td>
              </tr>
            ) : (
              restaurants?.map((r, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td
                    className="border border-gray-800 px-4 py-2 text-left"
                    onClick={() => setSelectedRestaurantId(r.id)}
                  >
                    {r.name}
                  </td>
                  <td className="border border-gray-800 px-4 py-2 text-left">
                    {r.location}
                  </td>
                  <td className="border border-gray-800 px-4 py-2 text-left">
                    {r.cuisine}
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50 bg-blue-500 text-white rounded px-4 py-2"
            >
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50 bg-blue-500 text-white rounded px-4 py-2"
            >
              Next
            </button>
          </div>
      </div>

      {/* graph */}

      <div>
        <div className="p-6 w-full flex justify-between items-center">
          <h3 className="text-xl font-semibold">
            {selectedRestaurantId && startDate && endDate ? (
              <span>
                Showing performance for {restaurantName} from{" "}
                {startDate.toLocaleDateString()} to{" "}
                {endDate.toLocaleDateString()}
              </span>
            ) : (
              <span>
                Select a restaurant and date range to see its performance.
              </span>
            )}
          </h3>

          <button
            onClick={() => setShowDatePicker((prev) => !prev)}
            className="bg-blue-500 text-white rounded px-4 py-2"
          >
            {" "}
            {startDate && endDate ? (
              <span>
                {startDate.toLocaleDateString()} -{" "}
                {endDate.toLocaleDateString()}
              </span>
            ) : (
              "Select Date Range"
            )}
          </button>

          {showDatePicker && (
            <div className="absolute right-5 bottom-20" ref={dateRef}>
              <DatePicker
                selected={startDate}
                onChange={onChange}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                inline
              />
            </div>
          )}
        </div>

        {dailyRevenueData &&
          dailyOrdersCount &&
          dailyAverageOrderValue &&
          trendyHrs && (
            <>
              <div className="flex justify-around items-center mb-8">
                <div className="w-1/2 pr-2">
                  <LineGraph
                    dataProps={dailyRevenueData}
                    label="Daily Revenue"
                  />
                </div>
                <div className="w-1/2 pl-2">
                  <LineGraph
                    dataProps={dailyOrdersCount}
                    label="Daily Orders"
                  />
                </div>
              </div>
              <div className="flex justify-around items-center mt-8">
                <div className="w-1/2 pl-2">
                  <LineGraph
                    dataProps={dailyAverageOrderValue}
                    label="Daily Average Order Value"
                  />
                </div>
                <div className="w-1/2 pr-2">
                  <GroupedBarGraph trendy_hours={trendyHrs} />
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2">
                  Top 3 Restaurants by Revenue
                </h3>
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr>
                      <th className="border border-gray-800 px-4 py-2 text-left">
                        Restaurant Name
                      </th>
                      <th className="border border-gray-800 px-4 py-2 text-left">
                        Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {topRestaurants && topRestaurants.length > 0 ? (
                      topRestaurants.map((restaurant) => (
                        <tr key={restaurant.restaurant_name}>
                          <td className="border border-gray-800 px-4 py-2 text-left">
                            {restaurant.restaurant_name}
                          </td>
                          <td className="border border-gray-800 px-4 py-2 text-left">
                            ${restaurant.max_revenue}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="2"
                          className="border border-gray-800 px-4 py-2 text-center"
                        >
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
      </div>
    </div>
  );
};

export default Dashboard;
