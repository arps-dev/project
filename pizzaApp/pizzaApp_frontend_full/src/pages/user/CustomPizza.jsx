import React, { useState } from "react";
import axios from "axios";

const CustomPizza = () => {
  const [selectedBase, setSelectedBase] = useState(null);
  const [selectedSauce, setSelectedSauce] = useState(null);
  const [selectedCheese, setSelectedCheese] = useState(null);
  const [selectedVeggies, setSelectedVeggies] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
  const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY;

  const bases = [
    { name: "Thin Crust", price: 120 },
    { name: "Cheese Burst", price: 150 },
    { name: "Whole Wheat", price: 130 },
    { name: "Stuffed Crust", price: 160 },
    { name: "Gluten Free", price: 140 },
  ];

  const sauces = [
    { name: "Tomato Basil", price: 30 },
    { name: "Pesto", price: 40 },
    { name: "Barbecue", price: 50 },
    { name: "Alfredo", price: 45 },
    { name: "Spicy Chipotle", price: 35 },
  ];

  const cheeses = [
    { name: "Mozzarella", price: 50 },
    { name: "Cheddar", price: 60 },
    { name: "Parmesan", price: 70 },
  ];

  const veggies = [
    { name: "Onion", price: 20 },
    { name: "Capsicum", price: 25 },
    { name: "Olives", price: 30 },
    { name: "Corn", price: 25 },
    { name: "Mushroom", price: 35 },
  ];

  const calculateTotal = (base, sauce, cheese, veggies) => {
    let sum = 0;
    if (base) sum += base.price;
    if (sauce) sum += sauce.price;
    if (cheese) sum += cheese.price;
    if (veggies.length > 0) sum += veggies.reduce((acc, v) => acc + v.price, 0);
    setTotal(sum);
  };

  const handleBase = (base) => {
    setSelectedBase(base);
    calculateTotal(base, selectedSauce, selectedCheese, selectedVeggies);
  };

  const handleSauce = (sauce) => {
    setSelectedSauce(sauce);
    calculateTotal(selectedBase, sauce, selectedCheese, selectedVeggies);
  };

  const handleCheese = (cheese) => {
    setSelectedCheese(cheese);
    calculateTotal(selectedBase, selectedSauce, cheese, selectedVeggies);
  };

  const handleVeggie = (veg) => {
    let updated;
    if (selectedVeggies.includes(veg)) {
      updated = selectedVeggies.filter((v) => v !== veg);
    } else {
      updated = [...selectedVeggies, veg];
    }
    setSelectedVeggies(updated);
    calculateTotal(selectedBase, selectedSauce, selectedCheese, updated);
  };

  const handleCheckout = async () => {
    if (!selectedBase || !selectedSauce || !selectedCheese) {
      alert("Please complete your pizza selection!");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Create Razorpay order on backend
      const { data } = await axios.post(`${API_BASE}/orders/create-order`, {
        items: {
          base: selectedBase.name,
          sauce: selectedSauce.name,
          cheese: selectedCheese.name,
          veggies: selectedVeggies.map((v) => v.name),
        },
        total,
      });

      const order = data.order;

      // 2️⃣ Open Razorpay payment window
      const options = {
        key: RAZORPAY_KEY,
        amount: order.amount,
        currency: "INR",
        name: "Custom Pizza Builder",
        description: "Delicious Custom Pizza Order",
        order_id: order.id,
        handler: async function (response) {
          alert("Payment Successful! 🎉");
          console.log("Payment Response:", response);
        },
        prefill: {
          name: "Pizza Lover",
          email: "test@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#38a169",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong while creating the order!");
    } finally {
      setLoading(false);
    }
  };

  const renderOptions = (title, options, selected, handler, multi = false) => (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {options.map((item) => (
          <button
            key={item.name}
            onClick={() => handler(item)}
            className={`p-3 rounded-lg border ${
              (multi ? selected.includes(item) : selected?.name === item.name)
                ? "bg-green-500 text-white border-green-600"
                : "bg-white text-gray-400 hover:bg-gray-100"
            }`}
          >
            {item.name} – ₹{item.price}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto py-10 px-5">
      <h1 className="text-3xl font-bold text-center mb-8">
        🍕 Build Your Custom Pizza
      </h1>

      {renderOptions("Choose Base", bases, selectedBase, handleBase)}
      {renderOptions("Choose Sauce", sauces, selectedSauce, handleSauce)}
      {renderOptions("Choose Cheese", cheeses, selectedCheese, handleCheese)}
      {renderOptions(
        "Select Veggies",
        veggies,
        selectedVeggies,
        handleVeggie,
        true
      )}

      <div className="text-center mt-8">
        <h2 className="text-2xl font-bold mb-4">Total: ₹{total}</h2>
        <button
          onClick={handleCheckout}
          disabled={loading}
          className={`px-6 py-3 rounded-lg text-white ${
            loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Processing..." : "Proceed to Payment"}
        </button>
      </div>
    </div>
  );
};

export default CustomPizza;
