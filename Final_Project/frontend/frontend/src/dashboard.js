import React, { useState, useEffect } from 'react';

function Dashboard({ loggedInUsername }) { // Pass logged-in username as a prop
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
      setUserData({ ...userData, amount: parseFloat(newAmount) }); // Update local state
    } catch (err) {
      console.error(err.message);
    }
  };

  // Update currency
  const handleCurrencyChange = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/user/${loggedInUsername}/update-currency`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currency: newCurrency }),
      });
      const data = await response.json();
      setMessage(data.message || 'Currency updated successfully');
      setUserData({
        ...userData,
        amount: data.new_amount,
        currency: newCurrency,
      }); // Update local state
    } catch (err) {
      console.error(err.message);
    }
  };

  if (!userData) return <p>Loading...</p>;

  return (
    <div className="App">
      <header className="App-header">
        <h1>Dashboard</h1>
        <p><strong>Username:</strong> {userData.username}</p>
        <p><strong>Amount:</strong> {userData.amount}</p>
        <p><strong>Currency:</strong> {userData.currency}</p>

        <form onSubmit={handleAmountChange}>
          <label>
            Update Amount:
            <input
              type="number"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              required
            />
          </label>
          <button type="submit">Update Amount</button>
        </form>

        <form onSubmit={handleCurrencyChange}>
          <label>
            Change Currency:
            <input
              type="text"
              value={newCurrency}
              onChange={(e) => setNewCurrency(e.target.value)}
              placeholder="e.g., USD, EUR"
              required
            />
          </label>
          <button type="submit">Change Currency</button>
        </form>

        {message && <p>{message}</p>}
      </header>
    </div>
  );
}

export default Dashboard;
