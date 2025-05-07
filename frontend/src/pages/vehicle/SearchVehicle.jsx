import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
/* import styles from "../../stylings/SearchVehicle.module.css"; */

function SearchVehicle() {
  const [regNumber, setRegNumber] = useState('');
  const [vehicle, setVehicle] = useState(null);

  const SEARCH_VEHICLE_URL = import.meta.env.VITE_SEARCH_VEHICLE_URL;

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${SEARCH_VEHICLE_URL}/${regNumber}`);
      setVehicle(response.data);
      toast.success("Vehicle found");
    } catch {
      setVehicle(null);
      toast.error('Vehicle not found.');
    }
  };

  return (
    <div className="p-4">
      <h2 className="font-bold mb-3">Search Vehicle</h2>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          placeholder="Enter Registration Number"
          value={regNumber}
          onChange={(e) => setRegNumber(e.target.value)}
          className="border p-2 rounded"
        />
        <button onClick={handleSearch} className="bg-blue-500 text-white px-3 py-1 rounded">
          Search
        </button>
      </div>
      {vehicle && (
        <div className="p-3 border rounded bg-gray-50">
          <p><strong>User ID:</strong> {vehicle.userId}</p>
          <p><strong>Model:</strong> {vehicle.model}</p>
          <p><strong>Year:</strong> {vehicle.year}</p>
          <p><strong>Usage Type:</strong> {vehicle.usageType}</p>
        </div>
      )}
    </div>
  );
}

export default SearchVehicle;