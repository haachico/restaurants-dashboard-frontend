import React, { useEffect, useState } from "react";
import { getRestaurants } from "../services/apis";

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

  useEffect(() => {
    const fetchRestaurants = async () => {
      const data = await getRestaurants(searchInput, selectedLocation, selectedCuisine);
      console.log(data, "data")
      setRestaurants(data.data);
      setAllLocations([...new Set(data.data.map((r) => r.location))]);
      setAllCuisines([...new Set(data.data.map((r) => r.cuisine))]);
    };
    fetchRestaurants();
  }, [searchInput, selectedLocation, selectedCuisine]);

return (
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
                        <option key={index} value={location}>{location}</option>
                    ))}
                </select>
                <select
                    className="border border-[#000] text-[#000] rounded px-3 py-2 bg-white"
                    value={selectedCuisine}
                    onChange={(e) => setSelectedCuisine(e.target.value)}
                >
                    <option value="">All cuisines</option>
                    {allCuisines.map((cuisine, index) => (
                        <option key={index} value={cuisine}>{cuisine}</option>
                    ))}
                </select>
            </div>
        </div>

        <table className="w-full border-collapse border border-gray-300">
            <thead>
                <tr>
                    <th className="border border-gray-800 px-4 py-2 text-left">Name</th>
                    <th className="border border-gray-800 px-4 py-2 text-left">Location</th>
                    <th className="border border-gray-800 px-4 py-2 text-left">Cuisine</th>
                </tr>
            </thead>
            <tbody>
                {restaurants?.length === 0 ? (
                    <tr>
                        <td colSpan="3" className="border border-gray-800 px-4 py-2 text-center">No restaurants found</td>
                    </tr>
                ) : (
                    restaurants?.map((r, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                            <td className="border border-gray-800 px-4 py-2 text-left">{r.name}</td>
                            <td className="border border-gray-800 px-4 py-2 text-left">{r.location}</td>
                            <td className="border border-gray-800 px-4 py-2 text-left">{r.cuisine}</td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    </div>
);
};

export default Dashboard;
