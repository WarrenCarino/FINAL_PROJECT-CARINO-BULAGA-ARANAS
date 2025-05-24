import React, { useState, useEffect } from "react";
import "./App.css";

const users = [
  { id: 1, name: "Alice Admin", role: "Admin", department: "IT" },
  { id: 2, name: "Bob Supervisor", role: "Supervisor", department: "HR" },
  { id: 3, name: "Charlie Officer", role: "Officer", department: "Finance" },
];

const initialTickets = [
  { id: 101, title: "Setup new PC", status: "Open", department: "IT", assignedTo: null },
  { id: 102, title: "Payroll error", status: "Pending Approval", department: "Finance", assignedTo: "Charlie Officer" },
  { id: 103, title: "Update employee handbook", status: "Open", department: "HR", assignedTo: null },
];

function App() {
  const [userId, setUserId] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState(initialTickets);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const user = users.find((u) => u.id.toString() === userId);
      if (user) setLoggedInUser(user);
      setLoading(false);
    }, 1500);
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setUserId("");
  };

  const assignTicket = (ticketId) => {
    const assignee = prompt("Enter officer name to assign:");
    if (!assignee) return;
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId ? { ...t, assignedTo: assignee, status: "Assigned" } : t
      )
    );
  };

  const approveTicket = (ticketId) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId ? { ...t, status: "Approved" } : t
      )
    );
  };

  const rejectTicket = (ticketId) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId ? { ...t, status: "Rejected" } : t
      )
    );
  };

  const resolveTicket = (ticketId) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId ? { ...t, status: "Resolved" } : t
      )
    );
  };

  if (!loggedInUser) {
    return (
      <div className="app-container">
        <h1>Helpdesk Ticket Servicing System</h1>
        <form onSubmit={handleLogin} className="login-form">
          <label htmlFor="user-select">Select User (Role/Department)</label>
          <select
            id="user-select"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            disabled={loading}
          >
            <option value="">-- Choose a user --</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.role} - {u.department})
              </option>
            ))}
          </select>
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        {loading && <p className="loading-text">Please wait, logging you in...</p>}
      </div>
    );
  }

  const deptTickets = tickets.filter(
    (t) => t.department === loggedInUser.department
  );

  return (
    <div className="app-container">
      <header className="user-header">
        <h2>Welcome, {loggedInUser.name}</h2>
        <p className="role-badge">Role: {loggedInUser.role}</p>
        <p className="dept-badge">Department: {loggedInUser.department}</p>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>

      <div className="info-banner">
        {loggedInUser.role === "Admin" && <p>You can assign tickets in your department.</p>}
        {loggedInUser.role === "Supervisor" && <p>You can approve or reject tickets in your department.</p>}
        {loggedInUser.role === "Officer" && <p>You can mark tickets as resolved that are assigned to you.</p>}
      </div>

      <h3>{loggedInUser.department} Department Tickets</h3>
      {deptTickets.length === 0 && <p>No tickets in your department.</p>}

      <ul className="ticket-list">
        {deptTickets.map((ticket) => (
          <li key={ticket.id} className="ticket-item">
            <strong>{ticket.title}</strong> - <em>Status: {ticket.status}</em><br />
            Assigned to: {ticket.assignedTo || "Unassigned"}<br />

            {loggedInUser.role === "Admin" && ticket.status === "Open" && (
              <button onClick={() => assignTicket(ticket.id)}>Assign Ticket</button>
            )}
            {loggedInUser.role === "Supervisor" && ticket.status === "Pending Approval" && (
              <>
                <button onClick={() => approveTicket(ticket.id)}>Approve</button>
                <button onClick={() => rejectTicket(ticket.id)}>Reject</button>
              </>
            )}
            {loggedInUser.role === "Officer" && ticket.status === "Assigned" && ticket.assignedTo === loggedInUser.name && (
              <button onClick={() => resolveTicket(ticket.id)}>Mark Resolved</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;