// import React, { useState, useEffect } from 'react';
// import './App.css';

// function Dashboard({ loggedInUsername }) {
//   const [userData, setUserData] = useState(null);
//   const [newAmount, setNewAmount] = useState('');
//   const [newCurrency, setNewCurrency] = useState('');
//   const [message, setMessage] = useState('');

//   // Fetch user data on load
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await fetch(`http://localhost:8080/user/${loggedInUsername}`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch user data');
//         }
//         const data = await response.json();
//         setUserData(data);
//       } catch (err) {
//         console.error(err.message);
//       }
//     };

//     fetchUserData();
//   }, [loggedInUsername]);

//   // Update amount
//   const handleAmountChange = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(`http://localhost:8080/user/${loggedInUsername}/update-amount`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ amount: parseFloat(newAmount) }),
//       });
//       const data = await response.json();
//       setMessage(data.message || 'Amount updated successfully');
//       setUserData({ ...userData, amount: parseFloat(newAmount) });
//     } catch (err) {
//       console.error(err.message);
//     }
//   };

//   const validCurrencies = new Set([
//     "AED", "AFN", "ALL", "AMD", "ANG", "AOA", "ARS", "AUD", "AWG", "AZN", "BAM", "BBD", "BDT", "BGN", "BHD", "BIF",
//     "BMD", "BND", "BOB", "BRL", "BSD", "BTN", "BWP", "BYN", "BZD", "CAD", "CDF", "CHF", "CLP", "CNY", "COP", "CRC",
//     "CUP", "CVE", "CZK", "DJF", "DKK", "DOP", "DZD", "EGP", "ERN", "ETB", "EUR", "FJD", "FKP", "FOK", "GBP", "GEL",
//     "GGP", "GHS", "GIP", "GMD", "GNF", "GTQ", "GYD", "HKD", "HNL", "HRK", "HTG", "HUF", "IDR", "ILS", "IMP", "INR",
//     "IQD", "IRR", "ISK", "JEP", "JMD", "JOD", "JPY", "KES", "KGS", "KHR", "KID", "KMF", "KRW", "KWD", "KYD", "KZT",
//     "LAK", "LBP", "LKR", "LRD", "LSL", "LYD", "MAD", "MDL", "MGA", "MKD", "MMK", "MNT", "MOP", "MRU", "MUR", "MVR",
//     "MWK", "MXN", "MYR", "MZN", "NAD", "NGN", "NIO", "NOK", "NPR", "NZD", "OMR", "PAB", "PEN", "PGK", "PHP", "PKR",
//     "PLN", "PYG", "QAR", "RON", "RSD", "RUB", "RWF", "SAR", "SBD", "SCR", "SDG", "SEK", "SGD", "SHP", "SLE", "SOS",
//     "SRD", "SSP", "STN", "SYP", "SZL", "THB", "TJS", "TMT", "TND", "TOP", "TRY", "TTD", "TVD", "TWD", "TZS", "UAH",
//     "UGX", "USD", "UYU", "UZS", "VES", "VND", "VUV", "WST", "XAF", "XCD", "XDR", "XOF", "XPF", "YER", "ZAR", "ZMW",
//     "ZWL"
//   ]);
  
//   const handleCurrencyChange = async (e) => {
//     e.preventDefault();
//     if (!validCurrencies.has(newCurrency)) {
//       setMessage("Invalid currency code. Please use a valid 3-letter currency code.");
//       return;
//     }
  
//     try {
//       const response = await fetch(`http://localhost:8080/user/${loggedInUsername}/update-currency`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ currency: newCurrency }),
//       });
  
//       const data = await response.json();
  
//       if (response.ok) {
//         setMessage(data.message || "Currency updated successfully");
//         setUserData({
//           ...userData,
//           amount: data.new_amount,
//           currency: newCurrency,
//         });
//       } else {
//         setMessage(data.message || "Failed to update currency");
//       }
//     } catch (err) {
//       console.error(err.message);
//       setMessage("An error occurred while updating the currency.");
//     }
//   };
  

//   if (!userData) return <p>Loading...</p>;

//   return (
//     <div className="dashboard-container">
//       <header className="App-header">
//         <h1>Welcome, {userData.username}!</h1>
//         <div className="user-details">
//           <p><strong>Amount:</strong> {userData.amount}</p>
//           <p><strong>Currency:</strong> {userData.currency}</p>
//         </div>

//         <form onSubmit={handleAmountChange} className="form-section">
//           <label htmlFor="newAmount" className="form-label">
//             Update Amount:
//           </label>
//           <input
//             type="number"
//             id="newAmount"
//             className="form-input"
//             value={newAmount}
//             onChange={(e) => setNewAmount(e.target.value)}
//             placeholder="Enter new amount"
//             required
//           />
//           <button type="submit" className="dashboard-button">Update Amount</button>
//         </form>

//         <form onSubmit={handleCurrencyChange} className="form-section">
//           <label htmlFor="newCurrency" className="form-label">
//             Change Currency:
//           </label>
//           <input
//             type="text"
//             id="newCurrency"
//             className="form-input"
//             value={newCurrency}
//             onChange={(e) => setNewCurrency(e.target.value.toUpperCase()
//             )}
//             placeholder="e.g., USD, EUR"
//             required
//           />
//           <button type="submit" className="dashboard-button">Change Currency</button>
//         </form>

//         {message && <p className="message">{message}</p>}
//       </header>
//     </div>
//   );
// }

// export default Dashboard;

// import React, { useState, useEffect } from 'react';
// import './App.css';
// import { useNavigate } from 'react-router-dom';


// function Dashboard({ loggedInUsername, onLogout }) {
//   const [userData, setUserData] = useState(null);
//   const [newAmount, setNewAmount] = useState('');
//   const [newCurrency, setNewCurrency] = useState('');
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();

  
//   // Password change states
//   const [currentPassword, setCurrentPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');

//   // Fetch user data on load
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await fetch(`http://localhost:8080/user/${loggedInUsername}`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch user data');
//         }
//         const data = await response.json();
//         setUserData(data);
//       } catch (err) {
//         console.error(err.message);
//       }
//     };

//     fetchUserData();
//   }, [loggedInUsername]);

//   // Update amount
//   const handleAmountChange = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(`http://localhost:8080/user/${loggedInUsername}/update-amount`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ amount: parseFloat(newAmount) }),
//       });
//       const data = await response.json();
//       setMessage(data.message || 'Amount updated successfully');
//       setUserData({ ...userData, amount: parseFloat(newAmount) });
//     } catch (err) {
//       console.error(err.message);
//     }
//   };

//   const validCurrencies = new Set([
//     "AED", "AFN", "ALL", "AMD", "ANG", "AOA", "ARS", "AUD", "AWG", "AZN", "BAM", "BBD", "BDT", "BGN", "BHD", "BIF",
//     "BMD", "BND", "BOB", "BRL", "BSD", "BTN", "BWP", "BYN", "BZD", "CAD", "CDF", "CHF", "CLP", "CNY", "COP", "CRC",
//     "CUP", "CVE", "CZK", "DJF", "DKK", "DOP", "DZD", "EGP", "ERN", "ETB", "EUR", "FJD", "FKP", "FOK", "GBP", "GEL",
//     "GGP", "GHS", "GIP", "GMD", "GNF", "GTQ", "GYD", "HKD", "HNL", "HRK", "HTG", "HUF", "IDR", "ILS", "IMP", "INR",
//     "IQD", "IRR", "ISK", "JEP", "JMD", "JOD", "JPY", "KES", "KGS", "KHR", "KID", "KMF", "KRW", "KWD", "KYD", "KZT",
//     "LAK", "LBP", "LKR", "LRD", "LSL", "LYD", "MAD", "MDL", "MGA", "MKD", "MMK", "MNT", "MOP", "MRU", "MUR", "MVR",
//     "MWK", "MXN", "MYR", "MZN", "NAD", "NGN", "NIO", "NOK", "NPR", "NZD", "OMR", "PAB", "PEN", "PGK", "PHP", "PKR",
//     "PLN", "PYG", "QAR", "RON", "RSD", "RUB", "RWF", "SAR", "SBD", "SCR", "SDG", "SEK", "SGD", "SHP", "SLE", "SOS",
//     "SRD", "SSP", "STN", "SYP", "SZL", "THB", "TJS", "TMT", "TND", "TOP", "TRY", "TTD", "TVD", "TWD", "TZS", "UAH",
//     "UGX", "USD", "UYU", "UZS", "VES", "VND", "VUV", "WST", "XAF", "XCD", "XDR", "XOF", "XPF", "YER", "ZAR", "ZMW",
//     "ZWL"
//   ]);

//   const handleCurrencyChange = async (e) => {
//     e.preventDefault();
//     if (!validCurrencies.has(newCurrency)) {
//       setMessage("Invalid currency code. Please use a valid 3-letter currency code.");
//       return;
//     }

//     try {
//       const response = await fetch(`http://localhost:8080/user/${loggedInUsername}/update-currency`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ currency: newCurrency }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setMessage(data.message || "Currency updated successfully");
//         setUserData({
//           ...userData,
//           amount: data.new_amount,
//           currency: newCurrency,
//         });
//       } else {
//         setMessage(data.message || "Failed to update currency");
//       }
//     } catch (err) {
//       console.error(err.message);
//       setMessage("An error occurred while updating the currency.");
//     }
//   };

//   // Handle password change
//   const handlePasswordChange = async (e) => {
//     e.preventDefault();
//     if (newPassword !== confirmPassword) {
//       setMessage("New password and confirmation do not match.");
//       return;
//     }

//     try {
//       const response = await fetch(`http://localhost:8080/user/${loggedInUsername}/update-password`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         setMessage(data.message || "Password updated successfully");
//       } else {
//         setMessage(data.message || "Failed to update password");
//       }
//     } catch (err) {
//       console.error(err.message);
//       setMessage("An error occurred while updating the password.");
//     }
//   };

//   // Logout function
//   const handleLogout = () => {
//     // Clear session or token
//     localStorage.removeItem('authToken');
//     navigate('/login') // Parent function to handle logout
//   };

//   if (!userData) return <p>Loading...</p>;

//   return (
//     <div className="dashboard-container">
//       <header className="App-header">
//         <h1>Welcome, {userData.username}!</h1>
//         <div className="user-details">
//           <p><strong>Amount:</strong> {userData.amount}</p>
//           <p><strong>Currency:</strong> {userData.currency}</p>
//         </div>

//         <form onSubmit={handleAmountChange} className="form-section">
//           <label htmlFor="newAmount" className="form-label">Update Amount:</label>
//           <input
//             type="number"
//             id="newAmount"
//             className="form-input"
//             value={newAmount}
//             onChange={(e) => setNewAmount(e.target.value)}
//             placeholder="Enter new amount"
//             required
//           />
//           <button type="submit" className="dashboard-button">Update Amount</button>
//         </form>

//         <form onSubmit={handleCurrencyChange} className="form-section">
//           <label htmlFor="newCurrency" className="form-label">Change Currency:</label>
//           <input
//             type="text"
//             id="newCurrency"
//             className="form-input"
//             value={newCurrency}
//             onChange={(e) => setNewCurrency(e.target.value.toUpperCase())}
//             placeholder="e.g., USD, EUR"
//             required
//           />
//           <button type="submit" className="dashboard-button">Change Currency</button>
//         </form>

//         <form onSubmit={handlePasswordChange} className="form-section">
//           <label htmlFor="currentPassword" className="form-label">Current Password:</label>
//           <input
//             type="password"
//             id="currentPassword"
//             className="form-input"
//             value={currentPassword}
//             onChange={(e) => setCurrentPassword(e.target.value)}
//             placeholder="Enter current password"
//             required
//           />
//           <label htmlFor="newPassword" className="form-label">New Password:</label>
//           <input
//             type="password"
//             id="newPassword"
//             className="form-input"
//             value={newPassword}
//             onChange={(e) => setNewPassword(e.target.value)}
//             placeholder="Enter new password"
//             required
//           />
//           <label htmlFor="confirmPassword" className="form-label">Confirm New Password:</label>
//           <input
//             type="password"
//             id="confirmPassword"
//             className="form-input"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             placeholder="Confirm new password"
//             required
//           />
//           <button type="submit" className="dashboard-button">Update Password</button>
//         </form>

//         {message && <p className="message">{message}</p>}

//         <button onClick={handleLogout} className="dashboard-button logout-button">Logout</button>
//       </header>
//     </div>
//   );
// }

// export default Dashboard;

// import React, { useState, useEffect } from 'react';
// import './App.css';

// function Dashboard({ loggedInUsername, onLogout }) {
//   const [userData, setUserData] = useState(null);
//   const [newAmount, setNewAmount] = useState('');
//   const [newCurrency, setNewCurrency] = useState('');
//   const [message, setMessage] = useState('');
  
//   // Password change states
//   const [currentPassword, setCurrentPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');

//   // States for new features
//   const [supportedCurrencies, setSupportedCurrencies] = useState([]);
//   const [historicalRates, setHistoricalRates] = useState(null);
//   const [apiQuota, setApiQuota] = useState(null);
//   const [enrichedData, setEnrichedData] = useState(null);
//   const [historicalDate, setHistoricalDate] = useState({ year: '', month: '', day: '' });
//   const [baseCurrency, setBaseCurrency] = useState('');
//   const [targetCurrency, setTargetCurrency] = useState('');

//   // Fetch user data on load
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await fetch(`http://localhost:8080/user/${loggedInUsername}`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch user data');
//         }
//         const data = await response.json();
//         setUserData(data);
//       } catch (err) {
//         console.error(err.message);
//       }
//     };

//     fetchUserData();
//   }, [loggedInUsername]);

//   // Update amount
//   const handleAmountChange = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(`http://localhost:8080/user/${loggedInUsername}/update-amount`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ amount: parseFloat(newAmount) }),
//       });
//       const data = await response.json();
//       setMessage(data.message || 'Amount updated successfully');
//       setUserData({ ...userData, amount: parseFloat(newAmount) });
//     } catch (err) {
//       console.error(err.message);
//     }
//   };

//   const validCurrencies = new Set([
//     "AED", "AFN", "ALL", "AMD", "ANG", "AOA", "ARS", "AUD", "AWG", "AZN", "BAM", "BBD", "BDT", "BGN", "BHD", "BIF",
//     "BMD", "BND", "BOB", "BRL", "BSD", "BTN", "BWP", "BYN", "BZD", "CAD", "CDF", "CHF", "CLP", "CNY", "COP", "CRC",
//     "CUP", "CVE", "CZK", "DJF", "DKK", "DOP", "DZD", "EGP", "ERN", "ETB", "EUR", "FJD", "FKP", "FOK", "GBP", "GEL",
//     "GGP", "GHS", "GIP", "GMD", "GNF", "GTQ", "GYD", "HKD", "HNL", "HRK", "HTG", "HUF", "IDR", "ILS", "IMP", "INR",
//     "IQD", "IRR", "ISK", "JEP", "JMD", "JOD", "JPY", "KES", "KGS", "KHR", "KID", "KMF", "KRW", "KWD", "KYD", "KZT",
//     "LAK", "LBP", "LKR", "LRD", "LSL", "LYD", "MAD", "MDL", "MGA", "MKD", "MMK", "MNT", "MOP", "MRU", "MUR", "MVR",
//     "MWK", "MXN", "MYR", "MZN", "NAD", "NGN", "NIO", "NOK", "NPR", "NZD", "OMR", "PAB", "PEN", "PGK", "PHP", "PKR",
//     "PLN", "PYG", "QAR", "RON", "RSD", "RUB", "RWF", "SAR", "SBD", "SCR", "SDG", "SEK", "SGD", "SHP", "SLE", "SOS",
//     "SRD", "SSP", "STN", "SYP", "SZL", "THB", "TJS", "TMT", "TND", "TOP", "TRY", "TTD", "TVD", "TWD", "TZS", "UAH",
//     "UGX", "USD", "UYU", "UZS", "VES", "VND", "VUV", "WST", "XAF", "XCD", "XDR", "XOF", "XPF", "YER", "ZAR", "ZMW",
//     "ZWL"
//   ]);

//   const handleCurrencyChange = async (e) => {
//     e.preventDefault();
//     if (!validCurrencies.has(newCurrency)) {
//       setMessage("Invalid currency code. Please use a valid 3-letter currency code.");
//       return;
//     }

//     try {
//       const response = await fetch(`http://localhost:8080/user/${loggedInUsername}/update-currency`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ currency: newCurrency }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setMessage(data.message || "Currency updated successfully");
//         setUserData({
//           ...userData,
//           amount: data.new_amount,
//           currency: newCurrency,
//         });
//       } else {
//         setMessage(data.message || "Failed to update currency");
//       }
//     } catch (err) {
//       console.error(err.message);
//       setMessage("An error occurred while updating the currency.");
//     }
//   };

//   // Fetch supported currencies
//   const handleFetchSupportedCurrencies = async () => {
//     try {
//       const response = await fetch('http://localhost:8080/currencies');
//       const data = await response.json();
//       if (response.ok) {
//         setSupportedCurrencies(Object.entries(data).map(([code, name]) => `${code}: ${name}`));
//       } else {
//         setMessage("Failed to fetch supported currencies.");
//       }
//     } catch (err) {
//       console.error(err.message);
//       setMessage("An error occurred while fetching supported currencies.");
//     }
//   };

//   // Fetch historical rates
//   const handleFetchHistoricalRates = async () => {
//     if (!historicalDate.year || !historicalDate.month || !historicalDate.day) {
//       setMessage("Please provide a valid date (year, month, day).");
//       return;
//     }

//     try {
//       const response = await fetch(
//         `http://localhost:8080/history?year=${historicalDate.year}&month=${historicalDate.month}&day=${historicalDate.day}`
//       );
//       const data = await response.json();
//       if (response.ok) {
//         setHistoricalRates(data);
//       } else {
//         setMessage("Failed to fetch historical rates.");
//       }
//     } catch (err) {
//       console.error(err.message);
//       setMessage("An error occurred while fetching historical rates.");
//     }
//   };

//   // Fetch API quota
//   const handleFetchApiQuota = async () => {
//     try {
//       const response = await fetch('http://localhost:8080/quota');
//       const data = await response.json();
//       if (response.ok) {
//         setApiQuota(data);
//       } else {
//         setMessage("Failed to fetch API quota.");
//       }
//     } catch (err) {
//       console.error(err.message);
//       setMessage("An error occurred while fetching API quota.");
//     }
//   };

//   // Fetch enriched data for a currency pair
//   const handleFetchEnrichedData = async () => {
//     if (!baseCurrency || !targetCurrency) {
//       setMessage("Please provide both base and target currency.");
//       return;
//     }

//     try {
//       const response = await fetch(
//         `http://localhost:8080/enriched?base_code=${baseCurrency}&target_code=${targetCurrency}`
//       );
//       const data = await response.json();
//       if (response.ok) {
//         setEnrichedData(data);
//       } else {
//         setMessage("Failed to fetch enriched data.");
//       }
//     } catch (err) {
//       console.error(err.message);
//       setMessage("An error occurred while fetching enriched data.");
//     }
//   };

//   // Handle password change
//   const handlePasswordChange = async (e) => {
//     e.preventDefault();
//     if (newPassword !== confirmPassword) {
//       setMessage("Passwords do not match.");
//       return;
//     }

//     try {
//       const response = await fetch(`http://localhost:8080/user/${loggedInUsername}/change-password`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ currentPassword, newPassword }),
//       });
//       const data = await response.json();
//       setMessage(data.message || 'Password changed successfully');
//     } catch (err) {
//       console.error(err.message);
//       setMessage('An error occurred while changing the password.');
//     }
//   };

//   return (
//     <div className="dashboard">
//       <h1>Welcome, {loggedInUsername}!</h1>
//       <p>Current Amount: {userData?.amount}</p>
//       <p>Current Currency: {userData?.currency}</p>

//       {/* Currency update form */}
//       <form onSubmit={handleCurrencyChange}>
//         <input 
//           type="text" 
//           value={newCurrency} 
//           onChange={(e) => setNewCurrency(e.target.value)} 
//           placeholder="Enter new currency code (e.g., USD)"
//         />
//         <button type="submit">Update Currency</button>
//       </form>

//       {/* Fetch Supported Currencies */}
//       <button onClick={handleFetchSupportedCurrencies}>Fetch Supported Currencies</button>
//       <div>{supportedCurrencies.length > 0 && supportedCurrencies.join(", ")}</div>

//       {/* Fetch Historical Rates */}
//       <form onSubmit={handleFetchHistoricalRates}>
//         <input 
//           type="text" 
//           value={historicalDate.year} 
//           onChange={(e) => setHistoricalDate({ ...historicalDate, year: e.target.value })}
//           placeholder="Enter year"
//         />
//         <input 
//           type="text" 
//           value={historicalDate.month} 
//           onChange={(e) => setHistoricalDate({ ...historicalDate, month: e.target.value })}
//           placeholder="Enter month"
//         />
//         <input 
//           type="text" 
//           value={historicalDate.day} 
//           onChange={(e) => setHistoricalDate({ ...historicalDate, day: e.target.value })}
//           placeholder="Enter day"
//         />
//         <button type="submit">Fetch Historical Rates</button>
//       </form>
//       <div>{historicalRates && JSON.stringify(historicalRates)}</div>

//       {/* Fetch API Quota */}
//       <button onClick={handleFetchApiQuota}>Fetch API Quota</button>
//       <div>{apiQuota && JSON.stringify(apiQuota)}</div>

//       {/* Fetch Enriched Data */}
//       <form onSubmit={handleFetchEnrichedData}>
//         <input 
//           type="text" 
//           value={baseCurrency} 
//           onChange={(e) => setBaseCurrency(e.target.value)} 
//           placeholder="Enter base currency (e.g., USD)"
//         />
//         <input 
//           type="text" 
//           value={targetCurrency} 
//           onChange={(e) => setTargetCurrency(e.target.value)} 
//           placeholder="Enter target currency (e.g., EUR)"
//         />
//         <button type="submit">Fetch Enriched Data</button>
//       </form>
//       <div>{enrichedData && JSON.stringify(enrichedData)}</div>

//       {/* Password change form */}
//       <form onSubmit={handlePasswordChange}>
//         <input 
//           type="password" 
//           value={currentPassword} 
//           onChange={(e) => setCurrentPassword(e.target.value)} 
//           placeholder="Enter current password"
//         />
//         <input 
//           type="password" 
//           value={newPassword} 
//           onChange={(e) => setNewPassword(e.target.value)} 
//           placeholder="Enter new password"
//         />
//         <input 
//           type="password" 
//           value={confirmPassword} 
//           onChange={(e) => setConfirmPassword(e.target.value)} 
//           placeholder="Confirm new password"
//         />
//         <button type="submit">Change Password</button>
//       </form>

//       <button onClick={onLogout}>Logout</button>
//       <div>{message}</div>
//     </div>
//   );
// }

// export default Dashboard;

// import React, { useState, useEffect } from 'react';
// import './App.css';
// import {useNavigate} from 'react-router-dom';

// function Dashboard({ loggedInUsername, onLogout }) {
//   const [userData, setUserData] = useState(null);
//   const [newAmount, setNewAmount] = useState('');
//   const [newCurrency, setNewCurrency] = useState('');
//   const [message, setMessage] = useState('');
//     const navigate = useNavigate();


//   // Password change states
//   const [currentPassword, setCurrentPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');

//   // States for new features
//   const [supportedCurrencies, setSupportedCurrencies] = useState([]);
//   const [historicalRates, setHistoricalRates] = useState(null);
//   const [apiQuota, setApiQuota] = useState(null);
//   const [enrichedData, setEnrichedData] = useState(null);
//   const [historicalDate, setHistoricalDate] = useState({ year: '', month: '', day: '' });
//   const [baseCurrency, setBaseCurrency] = useState('');
//   const [targetCurrency, setTargetCurrency] = useState('');

//   // Fetch user data on load
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await fetch(`http://localhost:8080/user/${loggedInUsername}`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch user data');
//         }
//         const data = await response.json();
//         setUserData(data);
//       } catch (err) {
//         console.error(err.message);
//       }
//     };

//     fetchUserData();
//   }, [loggedInUsername]);

//   // Update amount
//   const handleAmountChange = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(`http://localhost:8080/user/${loggedInUsername}/update-amount`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ amount: parseFloat(newAmount) }),
//       });
//       const data = await response.json();
//       setMessage(data.message || 'Amount updated successfully');
//       setUserData({ ...userData, amount: parseFloat(newAmount) });
//     } catch (err) {
//       console.error(err.message);
//     }
//   };
//   const validCurrencies = new Set([
//     "AED", "AFN", "ALL", "AMD", "ANG", "AOA", "ARS", "AUD", "AWG", "AZN", "BAM", "BBD", "BDT", "BGN", "BHD", "BIF",
//     "BMD", "BND", "BOB", "BRL", "BSD", "BTN", "BWP", "BYN", "BZD", "CAD", "CDF", "CHF", "CLP", "CNY", "COP", "CRC",
//     "CUP", "CVE", "CZK", "DJF", "DKK", "DOP", "DZD", "EGP", "ERN", "ETB", "EUR", "FJD", "FKP", "FOK", "GBP", "GEL",
//     "GGP", "GHS", "GIP", "GMD", "GNF", "GTQ", "GYD", "HKD", "HNL", "HRK", "HTG", "HUF", "IDR", "ILS", "IMP", "INR",
//     "IQD", "IRR", "ISK", "JEP", "JMD", "JOD", "JPY", "KES", "KGS", "KHR", "KID", "KMF", "KRW", "KWD", "KYD", "KZT",
//     "LAK", "LBP", "LKR", "LRD", "LSL", "LYD", "MAD", "MDL", "MGA", "MKD", "MMK", "MNT", "MOP", "MRU", "MUR", "MVR",
//     "MWK", "MXN", "MYR", "MZN", "NAD", "NGN", "NIO", "NOK", "NPR", "NZD", "OMR", "PAB", "PEN", "PGK", "PHP", "PKR",
//     "PLN", "PYG", "QAR", "RON", "RSD", "RUB", "RWF", "SAR", "SBD", "SCR", "SDG", "SEK", "SGD", "SHP", "SLE", "SOS",
//     "SRD", "SSP", "STN", "SYP", "SZL", "THB", "TJS", "TMT", "TND", "TOP", "TRY", "TTD", "TVD", "TWD", "TZS", "UAH",
//     "UGX", "USD", "UYU", "UZS", "VES", "VND", "VUV", "WST", "XAF", "XCD", "XDR", "XOF", "XPF", "YER", "ZAR", "ZMW",
//     "ZWL"
//   ]);
//   // Fetch supported currencies
//   const handleFetchSupportedCurrencies = async () => {
//     try {
//       const response = await fetch('http://localhost:8080/currencies');
//       const data = await response.json();
//       if (response.ok) {
//         setSupportedCurrencies(Object.entries(data).map(([code, name]) => `${code}: ${name}`));
//       } else {
//         setMessage("Failed to fetch supported currencies.");
//       }
//     } catch (err) {
//       console.error(err.message);
//       setMessage("An error occurred while fetching supported currencies.");
//     }
//   };

//   // Fetch API quota
//   const handleFetchApiQuota = async () => {
//     try {
//       const response = await fetch('http://localhost:8080/quota');
//       const data = await response.json();
//       if (response.ok) {
//         setApiQuota(data);
//       } else {
//         setMessage("Failed to fetch API quota.");
//       }
//     } catch (err) {
//       console.error(err.message);
//       setMessage("An error occurred while fetching API quota.");
//     }
//   };

//   // Handle password change
//     const handlePasswordChange = async (e) => {
//     e.preventDefault();
//     if (newPassword !== confirmPassword) {
//       setMessage("New password and confirmation do not match.");
//       return;
//     }

//     try {
//       const response = await fetch(`http://localhost:8080/user/${loggedInUsername}/update-password`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         setMessage(data.message || "Password updated successfully");
//       } else {
//         setMessage(data.message || "Failed to update password");
//       }
//     } catch (err) {
//       console.error(err.message);
//       setMessage("An error occurred while updating the password.");
//     }
//   };

//   const handleLogout = () => {
//         // Clear session or token
//         localStorage.removeItem('authToken');
//         navigate('/login') // Parent function to handle logout
//       };

//   const handleCurrencyChange = async (e) => {
//         e.preventDefault();
//         if (!validCurrencies.has(newCurrency)) {
//           setMessage("Invalid currency code. Please use a valid 3-letter currency code.");
//           return;
//         }
      
//         try {
//           const response = await fetch(`http://localhost:8080/user/${loggedInUsername}/update-currency`, {
//             method: "PUT",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ currency: newCurrency }),
//           });
      
//           const data = await response.json();
      
//           if (response.ok) {
//             setMessage(data.message || "Currency updated successfully");
//             setUserData({
//               ...userData,
//               amount: data.new_amount,
//               currency: newCurrency,
//             });
//           } else {
//             setMessage(data.message || "Failed to update currency");
//           }
//         } catch (err) {
//           console.error(err.message);
//           setMessage("An error occurred while updating the currency.");
//         }
//       };

//   return (
//     <div className="dashboard">
//       <h1>Welcome, {loggedInUsername}!</h1>
//       <p>Current Amount: {userData?.amount}</p>
//       <p>Current Currency: {userData?.currency}</p>

//       {/* Update Amount */}
//       <form onSubmit={handleAmountChange} className="amount-form">
//         <input 
//           type="number" 
//           value={newAmount} 
//           onChange={(e) => setNewAmount(e.target.value)} 
//           placeholder="Enter new amount"
//         />
//         <button type="submit">Update Amount</button>
//       </form>

//       {/* Currency update form */}
//       <form onSubmit={handleCurrencyChange} className="currency-form">
//         <input 
//           type="text" 
//           value={newCurrency} 
//           onChange={(e) => setNewCurrency(e.target.value.toUpperCase()
//                          )} 
//           placeholder="Enter new currency code (e.g., USD)"
//         />
//         <button type="submit">Update Currency</button>
//       </form>

//       {/* Fetch Supported Currencies */}
//       <button onClick={handleFetchSupportedCurrencies} className="fetch-btn">Fetch Supported Currencies</button>
//       <div>{supportedCurrencies.length > 0 && supportedCurrencies.join(", ")}</div>

//       {/* Fetch API Quota */}
//       <button onClick={handleFetchApiQuota} className="fetch-btn">Fetch API Quota</button>
//       <div>{apiQuota && JSON.stringify(apiQuota)}</div>

//       {/* Password change form */}
//       <form onSubmit={handlePasswordChange} className="password-form">
//         <input 
//           type="password" 
//           value={currentPassword} 
//           onChange={(e) => setCurrentPassword(e.target.value)} 
//           placeholder="Enter current password"
//         />
//         <input 
//           type="password" 
//           value={newPassword} 
//           onChange={(e) => setNewPassword(e.target.value)} 
//           placeholder="Enter new password"
//         />
//         <input 
//           type="password" 
//           value={confirmPassword} 
//           onChange={(e) => setConfirmPassword(e.target.value)} 
//           placeholder="Confirm new password"
//         />
//         <button type="submit">Change Password</button>
//       </form>

//       <button onClick={handleLogout}>Logout</button>
//       <div>{message}</div>
//     </div>
//   );
// }

// export default Dashboard;

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
