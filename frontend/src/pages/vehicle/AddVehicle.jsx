import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Car, Calendar, CreditCard, CarFront, Plus } from 'lucide-react';
import styles from '../../stylings/AddVehicle.module.css';

const AddVehicle = () => {
  const [vehicleData, setVehicleData] = useState({
    model: '',
    year: '',
    registrationNumber: '',
    usageType: '',
    rentalType: '',
  });

  const navigate = useNavigate();

  const [customModel, setCustomModel] = useState('');

  const ADD_VEHICLE_URL = import.meta.env.VITE_ADD_VEHICLE_URL;

  const handleChange = (e) => {
    setVehicleData({ ...vehicleData, [e.target.name]: e.target.value });
  };

  const isValidRegistration = (regNum) => {
    const pattern = /^[A-Z]{2}\s?[0-9]{1,2}\s?[A-Z]{1,2}\s?[0-9]{4}$/;
    return pattern.test(regNum);
  };  
    
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem('userId');
    if (!userId) {
      toast.error('User not logged in. Please login to continue.');
      return;
    }

    let modelToSubmit = vehicleData.model === 'Others' ? customModel : vehicleData.model;

    const { year, registrationNumber, usageType } = vehicleData;
    if (!modelToSubmit || !year || !registrationNumber || !usageType) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (!isValidRegistration(registrationNumber)) {
      toast.error('Invalid registration number format');
      return;
    }

    const payload = {
      ...vehicleData,
      model: modelToSubmit,
      userId: Number(userId),
    };

    try {
      await axios.post(ADD_VEHICLE_URL, payload);
      toast.success('Vehicle added successfully!');
      setVehicleData({
        model: '',
        year: '',
        registrationNumber: '',
        usageType: '',
        rentalType: '',
      });
      setCustomModel('');
      setTimeout(() => {
        navigate('/user/vehicles');
      }, 3000);
    } catch (error) {
      console.error(error);
      toast.error('Failed to add vehicle. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        <Car className={styles.titleIcon} /> Add New Vehicle
      </h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <CreditCard className={styles.inputIcon} />
          <input
            name="registrationNumber"
            placeholder="Registration Number"
            value={vehicleData.registrationNumber}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <CarFront className={styles.inputIcon} />
          <select
            name="model"
            value={vehicleData.model}
            onChange={handleChange}
            className={styles.input}
          >
            <option value="">Select Model</option>
            <option value="Maruti Suzuki Swift">Maruti Suzuki Swift</option>
            <option value="Tata Nexon">Tata Nexon</option>
            <option value="Royal Enfield">Royal Enfield</option>
            <option value="Yamaha MT 15">Yamaha MT 15</option>
            <option value="Kia Seltos">Kia Seltos</option>
            <option value="Hyundai">Hyundai</option>
            <option value="Supra">Supra</option>
            <option value="KTM 390">KTM 390</option>
            <option value="Hero Honda">Hero Honda</option>
            <option value="Others">Others</option>
          </select>
        </div>

        {vehicleData.model === 'Others' && (
          <div className={styles.inputGroup}>
            <CarFront className={styles.inputIcon} />
            <input
              type="text"
              name="customModel"
              value={customModel}
              onChange={(e) => setCustomModel(e.target.value)}
              placeholder="Enter your vehicle model"
              className={styles.input}
            />
          </div>
        )}

        <div className={styles.inputGroup}>
          <Calendar className={styles.inputIcon} />
          <input
            name="year"
            type="date"
            placeholder="Manufacture Date"
            value={vehicleData.year}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <Car className={styles.inputIcon} />
          <select
            name="usageType"
            value={vehicleData.usageType}
            onChange={handleChange}
            className={styles.input}
          >
            <option value="">Select Usage Type</option>
            <option value="Personal">Personal</option>
            <option value="Commercial">Commercial</option>
            <option value="Rental">Rental</option>
          </select>
        </div>

        <button type="submit" className={styles.button}>
          <Plus className={styles.buttonIcon} /> Insure your Vehicle
        </button>
      </form>
    </div>
  );
};

export default AddVehicle;