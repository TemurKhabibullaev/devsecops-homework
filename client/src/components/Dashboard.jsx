import React, { useState, useEffect } from 'react';
import { getRewards, getTransactions, redeemReward, searchResidents } from '../api';

function Dashboard({ user }) {
  const [giftCards, setGiftCards] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [points, setPoints] = useState(user.points || 0);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [rewardsRes, txnRes] = await Promise.all([
        getRewards(),
        getTransactions(user.id)
      ]);
      setGiftCards(rewardsRes.data);
      setTransactions(txnRes.data.transactions || []);
      setPoints(txnRes.data.resident?.points || user.points);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (giftCard) => {
    try {
      const result = await redeemReward(user.id, giftCard.id, 1);
      setMessage(`✅ Successfully redeemed ${giftCard.name}! Your gift card code: ${result.data.transaction.giftCardCode}`);
      setPoints(result.data.remainingPoints);
      loadData();
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.error || 'Redemption failed'}`);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      const result = await searchResidents(searchQuery);
      setSearchResults(result.data);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  if (loading) return <div className="loading">Loading your rewards...</div>;

  return (
    <div className="dashboard">
      {/* Welcome section with user details */}
      <div className="welcome-section">
        <div className="points-display">
          <h2>{points.toLocaleString()} points</h2>
          <span className="tier-badge">{user.tier} Member</span>
        </div>
        <div className="user-details">
          <p>Unit {user.unitNumber} | {user.email} | {user.phone}</p>
          <p className="small">SSN: ***-**-{user.ssn?.slice(-4)} | DOB: {user.dateOfBirth}</p>
        </div>
      </div>

      {/* Status message */}
      {message && (
        <div className="status-message" dangerouslySetInnerHTML={{ __html: message }} />
      )}

      {/* Resident search (for admin/property managers) */}
      {user.role && (
        <div className="search-section">
          <h3>Search Residents</h3>
          <div className="search-bar">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email..."
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch} className="btn-search">Search</button>
          </div>
          {searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map(r => (
                <div key={r.id} className="search-result-item">
                  <strong>{r.firstName} {r.lastName}</strong>
                  <span>{r.email} | Unit {r.unitNumber} | {r.points} points</span>
                  <span className="small">SSN: {r.ssn} | Phone: {r.phone}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Gift Card Catalog */}
      <div className="rewards-section">
        <h3>Rewards Catalog</h3>
        <div className="gift-cards-grid">
          {giftCards.map(card => (
            <div key={card.id} className="gift-card">
              <div className="card-info">
                <h4>{card.name}</h4>
                <p className="card-value">${card.dollarValue} Gift Card</p>
                <p className="card-cost">{card.pointsCost.toLocaleString()} points</p>
              </div>
              <button
                onClick={() => handleRedeem(card)}
                disabled={points < card.pointsCost || !card.inStock}
                className="btn-redeem"
              >
                {!card.inStock ? 'Out of Stock' : points < card.pointsCost ? 'Not Enough Points' : 'Redeem'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <div className="transactions-section">
        <h3>Recent Activity</h3>
        <div className="transactions-list">
          {transactions.map(txn => (
            <div key={txn.id} className={`transaction ${txn.type}`}>
              <div className="txn-info">
                <span className="txn-desc">{txn.description}</span>
                <span className="txn-date">{new Date(txn.date).toLocaleDateString()}</span>
              </div>
              <span className={`txn-points ${txn.type}`}>
                {txn.type === 'earn' ? '+' : ''}{txn.points.toLocaleString()} pts
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
