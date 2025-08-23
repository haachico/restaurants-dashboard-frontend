import React, { useEffect, useState } from "react";
import { getRestaurants, ordersTrends } from "../services/apis";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);

  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);

    // Call the parent component's function with the new dates
    if (start && end) {
      onDateChange(
        start.toISOString().split("T")[0],
        end.toISOString().split("T")[0]
      );
    }
  };

  const restaurantName = restaurants.find((r) => r.id === selectedRestaurantId)?.name;

  useEffect(() => {
    const fetchRestaurants = async () => {
      const data = await getRestaurants(
        searchInput,
        selectedLocation,
        selectedCuisine
      );
      console.log(data, "data");
      setRestaurants(data.data);
      setAllLocations([...new Set(data.data.map((r) => r.location))]);
      setAllCuisines([...new Set(data.data.map((r) => r.cuisine))]);
    };
    fetchRestaurants();
  }, [searchInput, selectedLocation, selectedCuisine]);



  useEffect(() => {
    const fetchOrdersTrends = async () => {
      if (selectedRestaurantId && startDate && endDate) {

        const formatedStartDate = startDate.toISOString().slice(0, 10);
        const formatedEndDate = endDate.toISOString().slice(0, 10);
        const data = await ordersTrends(
          selectedRestaurantId,
          formatedStartDate,
          formatedEndDate
        );
        console.log(data, "orders trends data");
      }
    };
    fetchOrdersTrends();
  }, [selectedRestaurantId, startDate, endDate]);



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
                  <td className="border border-gray-800 px-4 py-2 text-left" onClick={() => setSelectedRestaurantId(r.id)}>
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
      </div>

      {/* graph */}


      <div>

      <div className="p-6 w-full flex justify-between items-center">
        <h3 className="text-xl font-semibold">
      {
        selectedRestaurantId && startDate && endDate ? (
          <span>
            Showing performance for {restaurantName} from {startDate.toLocaleDateString()} to {endDate.toLocaleDateString()}
          </span>
        ) : (
          <span>Select a restaurant and date range to see its performance.</span>
        )
      }


        </h3>

        <button
          onClick={() => setShowDatePicker((prev) => !prev)}
          className="bg-blue-500 text-white rounded px-4 py-2"
        >
          {" "}
          {startDate && endDate ? (
            <span>
              {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
            </span>
          ) : (
            "Select Date Range"
          )}
        </button>
      </div>

      <div>

      </div>
      </div>
      {showDatePicker && (
        <DatePicker
          selected={startDate}
          onChange={onChange}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          inline
        />
      )}
    </div>
  );
};

export default Dashboard;
