import React, { useState } from "react";
import "./App.css";

function App() {
  const users = [
    { id: 1, name: "Bob Supervisor", role: "Supervisor", department: "HR" },
    { id: 2, name: "Charlie Officer", role: "Officer", department: "Finance" },
    { id: 3, name: "Alice Supervisor", role: "Supervisor", department: "Finance" },
    { id: 4, name: "David Officer", role: "Officer", department: "IT" },
  ];

  const initialTickets = [
    { id: 101, title: "Setup new PC", status: "Open", department: "IT", assignedTo: null },
    { id: 102, title: "Payroll error", status: "Pending Approval", department: "Finance", assignedTo: "Charlie Officer" },
    { id: 103, title: "Update employee handbook", status: "Open", department: "HR", assignedTo: null },
    { id: 104, title: "Fix network issue", status: "Assigned", department: "IT", assignedTo: "David Officer" },
  ];

  const [userId, setUserId] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState(initialTickets);
  const [newTicketTitle, setNewTicketTitle] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const user = users.find((u) => u.id.toString() === userId);
      if (user) setLoggedInUser(user);
      else alert("User not found!");
      setLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setUserId("");
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

  const addTicket = () => {
    if (newTicketTitle.trim() === "") {
      alert("Ticket title cannot be empty.");
      return;
    }
    const newTicket = {
      id: Math.max(...tickets.map((t) => t.id)) + 1,
      title: newTicketTitle,
      status: "Open",
      department: loggedInUser.department,
      assignedTo: null,
    };
    setTickets((prev) => [...prev, newTicket]);
    setNewTicketTitle("");
  };

  if (!loggedInUser) {
    return (
      <div className="app-container">
        <h1>Helpdesk Ticket Servicing System</h1>
        <form onSubmit={handleLogin} className="login-form">
          <label htmlFor="user-select">Select User</label>
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
        {loading && <p className="loading-text">Logging you in...</p>}
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
        {loggedInUser.role === "Supervisor" && (
          <p>You can approve, reject tickets, and add new tickets in your department.</p>
        )}
        {loggedInUser.role === "Officer" && (
          <p>You can mark tickets as resolved that are assigned to you.</p>
        )}
      </div>

      <h3>{loggedInUser.department} Department Tickets</h3>
      {deptTickets.length === 0 && <p>No tickets in your department.</p>}

      <ul className="ticket-list">
        {deptTickets.map((ticket) => (
          <li key={ticket.id} className="ticket-item">
            <strong>{ticket.title}</strong> - <em>Status: {ticket.status}</em>
            <br />
            Assigned to: {ticket.assignedTo || "Unassigned"}
            <br />
            {loggedInUser.role === "Supervisor" &&
              ticket.status === "Pending Approval" && (
                <>
                  <button onClick={() => approveTicket(ticket.id)}>Approve</button>
                  <button onClick={() => rejectTicket(ticket.id)}>Reject</button>
                </>
              )}
            {loggedInUser.role === "Officer" &&
              ticket.status === "Assigned" &&
              ticket.assignedTo === loggedInUser.name && (
                <button onClick={() => resolveTicket(ticket.id)}>Resolve</button>
              )}
          </li>
        ))}
      </ul>

      {loggedInUser.role === "Supervisor" && (
        <div className="add-ticket">
          <h3>Add a New Ticket</h3>
          <input
            type="text"
            value={newTicketTitle}
            onChange={(e) => setNewTicketTitle(e.target.value)}
            placeholder="Enter ticket title"
          />
          <button onClick={addTicket}>Add Ticket</button>
        </div>
      )}
    </div>
  );
}

export default App;
