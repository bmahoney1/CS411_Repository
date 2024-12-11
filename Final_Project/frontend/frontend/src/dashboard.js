import React, { useState, useEffect } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';

function Dashboard({ loggedInUsername, onLogout }) {
  const [userData, setUserData] = useState(null);
  const [newAmount, setNewAmount] = useState('');
  const [newCurrency, setNewCurrency] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // States for new features
  const [supportedCurrencies, setSupportedCurrencies] = useState([]);
  const [historicalRates, setHistoricalRates] = useState(null);
  const [apiQuota, setApiQuota] = useState(null);
  const [enrichedData, setEnrichedData] = useState(null);
  const [historicalDate, setHistoricalDate] = useState({ year: '', month: '', day: '' });
  const [baseCurrency, setBaseCurrency] = useState('');
  const [targetCurrency, setTargetCurrency] = useState('');

  // Fetch user data on load
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/user/${loggedInUsername}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUserData(data);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchUserData();
  }, [loggedInUsername]);

  // Update amount
  const handleAmountChange = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/user/${loggedInUsername}/update-amount`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: parseFloat(newAmount) }),
      });
      const data = await response.json();
      setMessage(data.message || 'Amount updated successfully');
      setUserData({ ...userData, amount: parseFloat(newAmount) });
    } catch (err) {
      console.error(err.message);
    }
  };

  const validCurrencies = new Set([
    "AED", "AFN", "ALL", "AMD", "ANG", "AOA", "ARS", "AUD", "AWG", "AZN", "BAM", "BBD", "BDT", "BGN", "BHD", "BIF",
    "BMD", "BND", "BOB", "BRL", "BSD", "BTN", "BWP", "BYN", "BZD", "CAD", "CDF", "CHF", "CLP", "CNY", "COP", "CRC",
    "CUP", "CVE", "CZK", "DJF", "DKK", "DOP", "DZD", "EGP", "ERN", "ETB", "EUR", "FJD", "FKP", "FOK", "GBP", "GEL",
    "GGP", "GHS", "GIP", "GMD", "GNF", "GTQ", "GYD", "HKD", "HNL", "HRK", "HTG", "HUF", "IDR", "ILS", "IMP", "INR",
    "IQD", "IRR", "ISK", "JEP", "JMD", "JOD", "JPY", "KES", "KGS", "KHR", "KID", "KMF", "KRW", "KWD", "KYD", "KZT",
    "LAK", "LBP", "LKR", "LRD", "LSL", "LYD", "MAD", "MDL", "MGA", "MKD", "MMK", "MNT", "MOP", "MRU", "MUR", "MVR",
    "MWK", "MXN", "MYR", "MZN", "NAD", "NGN", "NIO", "NOK", "NPR", "NZD", "OMR", "PAB", "PEN", "PGK", "PHP", "PKR",
    "PLN", "PYG", "QAR", "RON", "RSD", "RUB", "RWF", "SAR", "SBD", "SCR", "SDG", "SEK", "SGD", "SHP", "SLE", "SOS",
    "SRD", "SSP", "STN", "SYP", "SZL", "THB", "TJS", "TMT", "TND", "TOP", "TRY", "TTD", "TVD", "TWD", "TZS", "UAH",
    "UGX", "USD", "UYU", "UZS", "VES", "VND", "VUV", "WST", "XAF", "XCD", "XDR", "XOF", "XPF", "YER", "ZAR", "ZMW",
    "ZWL"
  ]);

  // Fetch supported currencies
  const handleFetchSupportedCurrencies = async () => {
    try {
      const response = await fetch('http://localhost:8080/currencies');
      const data = await response.json();
      if (response.ok) {
        setSupportedCurrencies(Object.entries(data).map(([code, name]) => `${code}: ${name}`));
      } else {
        setMessage("Failed to fetch supported currencies.");
      }
    } catch (err) {
      console.error(err.message);
      setMessage("An error occurred while fetching supported currencies.");
    }
  };

  // Fetch API quota
  const handleFetchApiQuota = async () => {
    try {
      const response = await fetch('http://localhost:8080/quota');
      const data = await response.json();
      if (response.ok) {
        setApiQuota(data);
      } else {
        setMessage("Failed to fetch API quota.");
      }
    } catch (err) {
      console.error(err.message);
      setMessage("An error occurred while fetching API quota.");
    }
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("New password and confirmation do not match.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/user/${loggedInUsername}/update-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message || "Password updated successfully");
      } else {
        setMessage(data.message || "Failed to update password");
      }
    } catch (err) {
      console.error(err.message);
      setMessage("An error occurred while updating the password.");
    }
  };

  const handleLogout = () => {
    // Clear session or token
    localStorage.removeItem('authToken');
    navigate('/login') // Parent function to handle logout
  };

  const handleCurrencyChange = async (e) => {
    e.preventDefault();
    if (!validCurrencies.has(newCurrency)) {
      setMessage("Invalid currency code. Please use a valid 3-letter currency code.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/user/${loggedInUsername}/update-currency`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currency: newCurrency }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Currency updated successfully");
        setUserData({
          ...userData,
          amount: data.new_amount,
          currency: newCurrency,
        });
      } else {
        setMessage(data.message || "Failed to update currency");
      }
    } catch (err) {
      console.error(err.message);
      setMessage("An error occurred while updating the currency.");
    }
  };

  // Handle delete account
  const handleDeleteAccount = async () => {
    try {
      const response = await fetch(`http://localhost:8080/user/${loggedInUsername}/delete`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message || "Account deleted successfully");
        localStorage.removeItem('authToken');
        navigate('/login');
      } else {
        setMessage(data.message || "Failed to delete account");
      }
    } catch (err) {
      console.error(err.message);
      setMessage("An error occurred while deleting the account.");
    }
  };

  return (
    <div className="dashboard">
      <h1>Welcome, {loggedInUsername}!</h1>
      <p>Current Amount: {userData?.amount}</p>
      <p>Current Currency: {userData?.currency}</p>

      {/* Update Amount */}
      <form onSubmit={handleAmountChange} className="amount-form">
        <input 
          type="number" 
          value={newAmount} 
          onChange={(e) => setNewAmount(e.target.value)} 
          placeholder="Enter new amount"
        />
        <button type="submit">Update Amount</button>
      </form>

      {/* Currency update form */}
      <form onSubmit={handleCurrencyChange} className="currency-form">
        <input 
          type="text" 
          value={newCurrency} 
          onChange={(e) => setNewCurrency(e.target.value.toUpperCase())} 
          placeholder="Enter new currency code (e.g., USD)"
        />
        <button type="submit">Update Currency</button>
      </form>

      {/* Fetch Supported Currencies */}
      <button onClick={handleFetchSupportedCurrencies} className="fetch-btn">Fetch Supported Currencies</button>
      <div>{supportedCurrencies.length > 0 && supportedCurrencies.join(", ")}</div>

      {/* Fetch API Quota */}
      <button onClick={handleFetchApiQuota} className="fetch-btn">Fetch API Quota</button>
      <div>{apiQuota && JSON.stringify(apiQuota)}</div>

      {/* Password change form */}
      <form onSubmit={handlePasswordChange} className="password-form">
        <input 
          type="password" 
          value={currentPassword} 
          onChange={(e) => setCurrentPassword(e.target.value)} 
          placeholder="Enter current password"
        />
        <input 
          type="password" 
          value={newPassword} 
          onChange={(e) => setNewPassword(e.target.value)} 
          placeholder="Enter new password"
        />
        <input 
          type="password" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
          placeholder="Confirm new password"
        />
        <button type="submit">Change Password</button>
      </form>

      <div>
        <button onClick={handleLogout}>Logout</button>
        <button onClick={handleDeleteAccount}>Delete Account</button>
      </div>
      <div>{message}</div>
    </div>
  );
}

export default Dashboard;
