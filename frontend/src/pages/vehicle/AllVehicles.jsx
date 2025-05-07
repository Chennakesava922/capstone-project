import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Search, Car } from 'lucide-react';
import styles from "../../stylings/AllVehicles.module.css";

function AllVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const vehiclesByUserUrl = import.meta.env.VITE_GET_VEHICLES_BY_USER_URL;

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const userId = localStorage.getItem('userId');

        if (!userId) {
          toast.error('User not logged in. Please login to continue.');
          navigate('/login');
          return;
        }

        const response = await axios.get(`${vehiclesByUserUrl}/${userId}`);
        if (Array.isArray(response.data)) {
          setVehicles(response.data);
          toast.success('Your vehicles loaded successfully!');
        } else {
          throw new Error("Invalid data format");
        }
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        toast.error("Failed to fetch vehicles.");
      }
    };

    fetchVehicles();
  }, [vehiclesByUserUrl, navigate]);

  const handleAddVehicle = () => {
    navigate('/user/addVehicle');
  };

  const handleBuyPolicy = (vehicleId) => {
    localStorage.setItem('VehicleId', vehicleId);
    navigate('/user/policies/buy');
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredVehicles = vehicles.filter(v =>
    v.model.toLowerCase().includes(searchTerm) ||
    v.registrationNumber.toLowerCase().includes(searchTerm)
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>All Vehicles</h2>

        <div className={styles.actions}>
          <div className={styles.searchWrapper}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search vehicles..."
              value={searchTerm}
              onChange={handleSearchChange}
              className={styles.searchInput}
            />
          </div>
          <button onClick={handleAddVehicle} className={styles.addBtn}>
            + Insure your Vehicle
          </button>
        </div>
      </div>

      {filteredVehicles.length > 0 ? (
        <div className={styles.cardsContainer}>
          {filteredVehicles.map((v) => (
            <div key={v.vehicleId} className={styles.vehicleCard}>
              <div className={styles.cardHeader}>
                <Car className={styles.carIcon} />
                <h3 className={styles.vehicleModel}>{v.model}</h3>
              </div>
              <div className={styles.cardDetails}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Year:</span>
                  <span className={styles.detailValue}>{v.year}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Registration:</span>
                  <span className={styles.detailValue}>{v.registrationNumber}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Usage Type:</span>
                  <span className={styles.detailValue}>{v.usageType}</span>
                </div>
              </div>
              <button
                onClick={() => handleBuyPolicy(v.vehicleId)}
                className={styles.buyBtn}
              >
                Buy Policy
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.noData}>No vehicles found. Add your first vehicle to get started!</p>
      )}
    </div>
  );
}

export default AllVehicles;



