import { useEffect, useState } from "react";

export default function AdminDashboard({ user }) {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("casaperks_token");

        if (!token) {
          setError("Unauthorized");
          return;
        }

        const res = await fetch("http://localhost:3001/api/admin/stats", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error("Unauthorized or failed request");
        }

        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchStats();
  }, []);

  if (user && user.role !== "admin" && user.role !== "super_admin") {
    return (
      <div style={{ padding: 20 }}>
        <h2>Admin Dashboard</h2>
        <p style={{ color: "red" }}>Forbidden</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Admin Dashboard</h2>
        <p style={{ color: "red" }}>Error: {error}</p>
      </div>
    );
  }

  if (!stats) {
    return <p style={{ padding: 20 }}>Loading system stats...</p>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Dashboard</h2>

      <div style={{ marginTop: 20 }}>
        <p><strong>Total Residents:</strong> {stats.totalResidents}</p>
        <p><strong>Total Points Outstanding:</strong> {stats.totalPointsOutstanding}</p>
        <p><strong>Total Redemptions:</strong> {stats.totalRedemptions}</p>
        <p><strong>Active Gift Cards:</strong> {stats.activeGiftCards}</p>
      </div>
    </div>
  );
}