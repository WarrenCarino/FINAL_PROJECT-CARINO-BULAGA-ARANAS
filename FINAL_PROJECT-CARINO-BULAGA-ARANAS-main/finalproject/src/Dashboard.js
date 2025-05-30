import React, { useState, useEffect } from 'react';
import TicketList from './TicketList'; // Import the TicketList component

const Dashboard = () => {
  const USERS = [
    { id: 1, name: 'Alice Admin', role: 'Admin', department: 'IT' },
    { id: 2, name: 'Bob Support', role: 'SupportAgent', department: 'IT' },
    { id: 3, name: 'Carol Manager', role: 'DepartmentManager', department: 'HR' },
    { id: 4, name: 'Dave Requester', role: 'Requester', department: 'HR' },
  ];

  const TICKETS = [
    { ticketNumber: 'T001', subject: 'Cannot login', status: 'Open', department: 'IT', assignedTo: 2 },
    { ticketNumber: 'T002', subject: 'Email not working', status: 'In Progress', department: 'IT', assignedTo: 2 },
    { ticketNumber: 'T003', subject: 'Payroll issue', status: 'Closed', department: 'HR', assignedTo: null },
    { ticketNumber: 'T004', subject: 'Computer slow', status: 'Open', department: 'IT', assignedTo: null },
  ];

  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = (userId) => {
    const selectedUser = USERS.find((u) => u.id === userId);
    setUser(selectedUser);
  };

  const approveTicket = (ticketNumber) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.ticketNumber === ticketNumber ? { ...t, status: 'Approved' } : t
      )
    );
  };

  const rejectTicket = (ticketNumber) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.ticketNumber === ticketNumber ? { ...t, status: 'Rejected' } : t
      )
    );
  };

  const resolveTicket = (ticketNumber) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.ticketNumber === ticketNumber ? { ...t, status: 'Resolved' } : t
      )
    );
  };

  useEffect(() => {
    if (!user) return;
    setLoading(true);

    setTimeout(() => {
      let filteredTickets = [];

      switch (user.role) {
        case 'Admin':
          filteredTickets = TICKETS;
          break;
        case 'SupportAgent':
          filteredTickets = TICKETS.filter((t) => t.assignedTo === user.id);
          break;
        case 'DepartmentManager':
          filteredTickets = TICKETS.filter((t) => t.department === user.department);
          break;
        case 'Requester':
          filteredTickets = TICKETS.filter((t) => t.requestedBy === user.id);
          break;
        default:
          filteredTickets = [];
      }

      setTickets(filteredTickets);
      setLoading(false);
    }, 1000);
  }, [user]);

  if (!user) {
    return (
      <div>
        <h1>Login</h1>
        {USERS.map((u) => (
          <button key={u.id} onClick={() => handleLogin(u.id)}>
            Login as {u.name}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome, {user.name} ({user.role})</h1>
      <button onClick={() => setUser(null)}>Logout</button>
      {loading ? (
        <p>Loading tickets...</p>
      ) : (
        <TicketList
          tickets={tickets}
          user={user}
          approveTicket={approveTicket}
          rejectTicket={rejectTicket}
          resolveTicket={resolveTicket}
        />
      )}
    </div>
  );
};

export default Dashboard;
