import React, { useEffect, useRef, useState } from "react";
import { getRestaurants, ordersTrends } from "../services/apis";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import LineGraph from "../components/LineGraph";
import HeatmapGraph from "../components/HeatmapGraph";
import GroupedBarGraph from "../components/GroupedBarGraph";

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

  const [selectedRestaurantName, setSelectedRestaurantName] = useState("");

  const totalPages = Math.ceil(totalRestaurants / 2);
  const dateRef = useRef();

  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    // After selecting both dates, hide the date picker
    if (start && end) {
      setShowDatePicker(false);
    }
  };

  const restaurantName = selectedRestaurantName;

  // Fetch restaurants data based on filters and pagination
  useEffect(() => {
    const fetchRestaurants = async () => {
      const data = await getRestaurants(
        searchInput,
        selectedLocation,
        selectedCuisine,
        currentPage
      );
      setRestaurants(data.data);
      // Generate unique lists of locations and cuisines for dropdowns
      setAllLocations([...new Set(data.distinct_locations_cuisines.map((r) => r.location))]);
      setAllCuisines([...new Set(data.distinct_locations_cuisines.map((r) => r.cuisine))]);
      setTotalRestaurants(data.total_count);
    };
    fetchRestaurants();
  }, [searchInput, selectedLocation, selectedCuisine, currentPage]);

  // Fetch orders trends data when a restaurant or date range is selected
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
        setOrdersTrendsData(response?.data.daily_records);
        setTrendyHrs(response?.data?.trendy_hours);
        setTopRestaurants(response?.data?.max_revenue_restaurants);
      }
    };
    fetchOrdersTrends();
  }, [selectedRestaurantId, startDate, endDate]);

  // Handle clicking outside the date picker to close it
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

  // Format data for Line Graphs
  const dailyRevenueData =
    ordersTrendsData?.map((el) => ({
      date: el.order_date,
      revenue: el.daily_revenue,
    })) || [];

  const dailyOrdersCount =
    ordersTrendsData?.map((el) => ({
      date: el.order_date,
      count: el.orders_count,
    })) || [];

  const dailyAverageOrderValue =
    ordersTrendsData?.map((el) => ({
      date: el.order_date,
      average: el.average_order_value,
    })) || [];

  console.log(restaurantName, selectedRestaurantId, "Restaurant Name");

  return (
    <div className="bg-gray-100 min-h-screen p-8 font-sans pt-20">
      {/* Restaurants Table Section */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        {/* <h2 className="text-3xl font-bold mb-8 text-center tracking-tight text-gray-800">
          DineDash
        </h2> */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <input
            type="text"
            placeholder="Search restaurants..."
            className="border border-gray-300 text-gray-700 rounded-lg px-4 py-2 w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 rounded px-3 py-2 bg-white"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <button onClick={() => {
              setSearchInput("");
              setSelectedLocation("");
              setSelectedCuisine("");
              setSelectedRestaurantName("");
              setSelectedRestaurantId(null);
            }} className="border border-gray-300 text-gray-700 rounded-lg px-4 py-2 w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 border border-[#000] text-[#000] rounded px-3 py-2 bg-white" >
              Clear Filters
            </button>
            <select
              className="border border-gray-300 text-gray-700 rounded-lg px-4 py-2 w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 border border-[#000] text-[#000] rounded px-3 py-2 bg-white"
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
              className="border border-gray-300 text-gray-700 rounded-lg px-4 py-2 w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 border border-[#000] text-[#000] rounded px-3 py-2 bg-white"
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
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full bg-white divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 border border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 border border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 border border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Cuisine
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {restaurants?.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No restaurants found
                  </td>
                </tr>
              ) : (
                restaurants?.map((r, idx) => (
                  <tr
                    key={idx}
                    className={`hover:bg-blue-50 transition duration-150 cursor-pointer text-left ${
                      selectedRestaurantId === r.id ? "bg-blue-100" : ""
                    }`}
                    onClick={() => {
                      setSelectedRestaurantId(r.id);
                      setSelectedRestaurantName(r.name);
                    }}
                  >
                    <td className="px-6 py-4 border border-gray-200">
                      {r.name}
                    </td>
                    <td className="px-6 py-4 border border-gray-200">
                      {r.location}
                    </td>
                    <td className="px-6 py-4 border border-gray-200">
                      {r.cuisine}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-blue-500 text-white rounded-lg px-4 py-2 disabled:opacity-50 hover:bg-blue-600 transition"
          >
            Prev
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="bg-blue-500 text-white rounded-lg px-4 py-2 disabled:opacity-50 hover:bg-blue-600 transition"
          >
            Next
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 relative">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 md:mb-0">
            {selectedRestaurantId && startDate && endDate ? (
              <span>
                Showing metrics for **{restaurantName}** from{" "}
                {startDate.toLocaleDateString()} to{" "}
                {endDate.toLocaleDateString()}
              </span>
            ) : (
              <span className="text-gray-500">
                Select a restaurant and date range to see its metrics.
              </span>
            )}
          </h3>
          <button
            onClick={() => setShowDatePicker((prev) => !prev)}
            className="bg-blue-500 text-white rounded-lg px-4 py-2 shadow-sm hover:bg-blue-600 transition"
          >
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
            <div className="absolute top-full right-0 mt-2 z-10" ref={dateRef}>
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

        {selectedRestaurantId && startDate && endDate && ordersTrendsData && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              {/* Daily Revenue Graph Card */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <LineGraph dataProps={dailyRevenueData} label="Daily Revenue" />
              </div>

              {/* Daily Orders Count Graph Card */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <LineGraph dataProps={dailyOrdersCount} label="Daily Orders" />
              </div>

              {/* Daily Average Order Value Graph Card */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <LineGraph
                  dataProps={dailyAverageOrderValue}
                  label="Daily Average Order Value"
                />
              </div>

              {/* Peak Hours Graph Card */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <GroupedBarGraph trendy_hours={trendyHrs} />
              </div>
            </div>

            {/* Top Restaurants Table */}
            <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
              <h3 className="text-xl font-semibold mb-6 text-gray-800">
                Top 3 Restaurants by Revenue from{" "}
                {startDate.toLocaleDateString()} to{" "}
                {endDate.toLocaleDateString()}
              </h3>
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="border border-gray-200 px-4 py-2 text-left bg-gray-50 text-sm text-gray-700 font-semibold">
                        Restaurant Name
                      </th>
                      <th className="border border-gray-200 px-4 py-2 text-left bg-gray-50 text-sm text-gray-700 font-semibold">
                        Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {topRestaurants && topRestaurants.length > 0 ? (
                      topRestaurants.map((restaurant, idx) => (
                        <tr key={idx}>
                          <td className="border border-gray-200 px-4 py-2 text-left">
                            {restaurant.restaurant_name}
                          </td>
                          <td className="border border-gray-200 px-4 py-2 text-left">
                            ${restaurant.max_revenue}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="2"
                          className="border border-gray-200 px-4 py-2 text-center text-gray-500"
                        >
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
