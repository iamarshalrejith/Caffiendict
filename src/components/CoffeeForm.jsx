import React, { useState } from "react";
import { coffeeOptions } from "../utils";
import Modal from "./Modal";
import Authentication from "./Authentication";
import { useAuth } from "../context/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

const CoffeeForm = (props) => {
  const { isAuthenticated } = props;

  const [showModal, setShowModal] = useState(false);
  const [selectedCoffee, setSelectedCoffee] = useState(null);
  const [showCoffeeTypes, setShowCoffeeTypes] = useState(false);
  const [coffeeCost, setCoffeeCost] = useState(0);
  const [hour, setHour] = useState(0);
  const [min, setMin] = useState(0);

  const { globalData, setGlobalData, globalUser } = useAuth();

  async function handleSubmitForm() {
    if (!isAuthenticated) {
      setShowModal(true);
      return;
    }

    if (!selectedCoffee) {
      return;
    }

    const newGlobalData = {
      ...(globalData || {}),
    };

    const nowTime = Date.now();
    const timeToSubtract = (hour * 60 * 60 * 1000) + (min * 60 * 1000); 
    const timestamp = nowTime - timeToSubtract;

    const newData = {
      name: selectedCoffee,
      cost: Number(coffeeCost), 
    };

    newGlobalData[timestamp] = newData;

    // Update global state
    setGlobalData(newGlobalData);

    // Save to Firestore
    try {
      const userRef = doc(db, "users", globalUser.uid);
      await setDoc(
        userRef,
        {
          [timestamp]: newData,
        },
        { merge: true }
      );

      setSelectedCoffee(null)
      setHour(0)
      setMin(0)
      setCoffeeCost(0)
      console.log("Saved:", timestamp, selectedCoffee, coffeeCost);
    } catch (err) {
      console.error("Failed to save data:", err);
    }
  }

  return (
    <>
      {showModal && (
        <Modal handleCloseModal={() => setShowModal(false)}>
          <Authentication handleCloseModal={() => setShowModal(false)} />
        </Modal>
      )}

      <div className="section-header">
        <i className="fa-solid fa-pencil"></i>
        <h2>Start Tracking Today</h2>
      </div>

      <h4>Select coffee type</h4>
      <div className="coffee-grid">
        {coffeeOptions.slice(0, 5).map((option, optionIndex) => (
          <button
            onClick={() => {
              setSelectedCoffee(option.name);
              setShowCoffeeTypes(false);
            }}
            key={optionIndex}
            className={
              "button-card " +
              (option.name === selectedCoffee ? " coffee-button-selected" : "")
            }
          >
            <h4>{option.name}</h4>
            <p>{option.caffeine} mg</p>
          </button>
        ))}
        <button
          onClick={() => {
            setShowCoffeeTypes(true);
            setSelectedCoffee(null);
          }}
          className={
            "button-card " + (showCoffeeTypes ? " coffee-button-selected" : "")
          }
        >
          <h4>Other</h4>
          <p>n/a</p>
        </button>
      </div>

      {showCoffeeTypes && (
        <select
          onChange={(e) => {
            setSelectedCoffee(e.target.value);
          }}
          name="coffee-list"
          id="coffee-list"
        >
          <option value="">Select type</option>
          {coffeeOptions.map((option, optionIndex) => (
            <option value={option.name} key={optionIndex}>
              {option.name} ({option.caffeine}mg)
            </option>
          ))}
        </select>
      )}

      <h4>Add the cost ($)</h4>
      <input
        type="number"
        placeholder="4.50"
        className="w-full"
        value={coffeeCost}
        onChange={(e) => {
          setCoffeeCost(e.target.value);
        }}
      />

      <h4>Time since consumption</h4>
      <div className="time-entry">
        <div>
          <h6>Hours</h6>
          <select
            id="hours-select"
            onChange={(e) => {
              setHour(Number(e.target.value)); 
            }}
          >
            {[...Array(24).keys()].map((hour) => (
              <option key={hour} value={hour}>
                {hour}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h6>Mins</h6>
          <select
            id="mins-select"
            onChange={(e) => {
              setMin(Number(e.target.value)); 
            }}
          >
            {[0, 5, 10, 15, 30, 45].map((min) => (
              <option key={min} value={min}>
                {min}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button onClick={handleSubmitForm}>
        <p>Add Entry</p>
      </button>
    </>
  );
};

export default CoffeeForm;
