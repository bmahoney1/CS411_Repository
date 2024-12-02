// import React, { useState, useEffect } from 'react';

// function Dashboard({ loggedInUsername }) { // Pass logged-in username as a prop
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
//       setUserData({ ...userData, amount: parseFloat(newAmount) }); // Update local state
//     } catch (err) {
//       console.error(err.message);
//     }
//   };

//   // Update currency
//   const handleCurrencyChange = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(`http://localhost:8080/user/${loggedInUsername}/update-currency`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ currency: newCurrency }),
//       });
//       const data = await response.json();
//       setMessage(data.message || 'Currency updated successfully');
//       setUserData({
//         ...userData,
//         amount: data.new_amount,
//         currency: newCurrency,
//       }); // Update local state
//     } catch (err) {
//       console.error(err.message);
//     }
//   };

//   if (!userData) return <p>Loading...</p>;

//   return (
//     <div className="App">
//       <header className="App-header">
//         <h1>Dashboard</h1>
//         <p><strong>Username:</strong> {userData.username}</p>
//         <p><strong>Amount:</strong> {userData.amount}</p>
//         <p><strong>Currency:</strong> {userData.currency}</p>

//         <form onSubmit={handleAmountChange}>
//           <label>
//             Update Amount:
//             <input
//               type="number"
//               value={newAmount}
//               onChange={(e) => setNewAmount(e.target.value)}
//               required
//             />
//           </label>
//           <button type="submit">Update Amount</button>
//         </form>

//         <form onSubmit={handleCurrencyChange}>
//           <label>
//             Change Currency:
//             <input
//               type="text"
//               value={newCurrency}
//               onChange={(e) => setNewCurrency(e.target.value)}
//               placeholder="e.g., USD, EUR"
//               required
//             />
//           </label>
//           <button type="submit">Change Currency</button>
//         </form>

//         {message && <p>{message}</p>}
//       </header>
//     </div>
//   );
// }

// export default Dashboard;

import React, { useState, useEffect } from 'react';
import './App.css';

function Dashboard({ loggedInUsername }) {
  const [userData, setUserData] = useState(null);
  const [newAmount, setNewAmount] = useState('');
  const [newCurrency, setNewCurrency] = useState('');
  const [message, setMessage] = useState('');

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
  

  if (!userData) return <p>Loading...</p>;

  return (
    <div className="dashboard-container">
      <header className="App-header">
        <h1>Welcome, {userData.username}!</h1>
        <div className="user-details">
          <p><strong>Amount:</strong> {userData.amount}</p>
          <p><strong>Currency:</strong> {userData.currency}</p>
        </div>

        <form onSubmit={handleAmountChange} className="form-section">
          <label htmlFor="newAmount" className="form-label">
            Update Amount:
          </label>
          <input
            type="number"
            id="newAmount"
            className="form-input"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            placeholder="Enter new amount"
            required
          />
          <button type="submit" className="dashboard-button">Update Amount</button>
        </form>

        <form onSubmit={handleCurrencyChange} className="form-section">
          <label htmlFor="newCurrency" className="form-label">
            Change Currency:
          </label>
          <input
            type="text"
            id="newCurrency"
            className="form-input"
            value={newCurrency}
            onChange={(e) => setNewCurrency(e.target.value.toUpperCase()
            )}
            placeholder="e.g., USD, EUR"
            required
          />
          <button type="submit" className="dashboard-button">Change Currency</button>
        </form>

        {message && <p className="message">{message}</p>}
      </header>
    </div>
  );
}

export default Dashboard;

// import React, { useState, useEffect } from 'react';
// // import './dashboard.css';
// import './App.css';

// function Dashboard({ loggedInUsername }) {
//   const [userData, setUserData] = useState(null);
//   const [newAmount, setNewAmount] = useState('');
//   const [newCurrency, setNewCurrency] = useState('');
//   const [message, setMessage] = useState('');

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

//   const handleAmountChange = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(`http://localhost:8080/user/${loggedInUsername}/update-amount`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ amount: parseFloat(newAmount) }),
//       });
//       const data = await response.json();
//       setMessage(data.message || 'Amount updated successfully');
//       setUserData({ ...userData, amount: parseFloat(newAmount) });
//     } catch (err) {
//       console.error(err.message);
//     }
//   };

//   const handleCurrencyChange = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(`http://localhost:8080/user/${loggedInUsername}/update-currency`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ currency: newCurrency }),
//       });
//       const data = await response.json();
//       setMessage(data.message || 'Currency updated successfully');
//       setUserData({
//         ...userData,
//         amount: data.new_amount,
//         currency: newCurrency,
//       });
//     } catch (err) {
//       console.error(err.message);
//     }
//   };

//   if (!userData) return <p>Loading...</p>;

//   return (
//     <div className="dashboard-container">
//       <header className="dashboard-header">
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
//             onChange={(e) => setNewCurrency(e.target.value)}
//             placeholder="e.g., USD, EUR"
//             required
//           />
//           <button type="submit" className="dashboard-button">Change Currency</button>
//         </form>

//         {message && <p className="dashboard-message">{message}</p>}
//       </header>
//     </div>
//   );
// }

// export default Dashboard;
