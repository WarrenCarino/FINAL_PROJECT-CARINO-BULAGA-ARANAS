import React, { useState, useEffect } from 'react';

const USERS = [
  { id: 1, name: 'Alice Admin', role: 'Admin', department: 'IT' },
  { id: 2, name: 'Bob Support', role: 'SupportAgent', department: 'IT' },
  { id: 3, name: 'Carol Manager', role: 'DepartmentManager', department: 'HR' },
  { id: 4, name: 'Dave Requester', role: 'Requester', department: 'HR' },
];

const TICKETS = [
  { ticketNumber: 'T001', subject: 'Cannot login', status: 'Open', department: 'IT', assignedTo: 2, requestedBy: 4 },
  { ticketNumber: 'T002', subject: 'Email not working', status: 'In Progress', department: 'IT', assignedTo: 2, requestedBy: 4 },
  { ticketNumber: 'T003', subject: 'Payroll issue', status: 'Closed', department: 'HR', assignedTo: null, requestedBy: 4 },
  { ticketNumber: 'T004', subject: 'Computer slow', status: 'Open', department: 'IT', assignedTo: null, requestedBy: 4 },
];

const styles = {
  container: {
    maxWidth: 900,
    margin: '20px auto',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '10px 18px',
    margin: '5px',
    borderRadius: 4,
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background-color 0.3s',
  },
  buttonLogout: {
    backgroundColor: '#dc3545',
    float: 'right',
    marginBottom: 20,
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  th: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: 12,
    textAlign: 'left',
    fontWeight: '700',
  },
  td: {
    padding: 12,
    borderBottom: '1px solid #ddd',
  },
  rowHover: {
    backgroundColor: '#f1f1f1',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  noTicketsText: {
    textAlign: 'center',
    fontSize: 16,
    fontStyle: 'italic',
    color: '#666',
  },
};

function Dashboard() {
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = (userId) => {
    const selectedUser = USERS.find(u => u.id === userId);
    setUser(selectedUser);
  };

  useEffect(() => {
    if (!user) return;
    setLoading(true);

    setTimeout(() => {
      let filteredTickets = [];

      switch(user.role) {
        case 'Admin':
          filteredTickets = TICKETS;
          break;
        case 'SupportAgent':
          filteredTickets = TICKETS.filter(t => t.assignedTo === user.id);
          break;
        case 'DepartmentManager':
          filteredTickets = TICKETS.filter(t => t.department === user.department);
          break;
        case 'Requester':
          filteredTickets = TICKETS.filter(t => t.requestedBy === user.id);
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
      <div style={styles.container}>
        <h2 style={styles.header}>Helpdesk Ticket Servicing System - Login</h2>
        <div style={{ textAlign: 'center' }}>
          {USERS.map(u => (
            <button
              key={u.id}
              onClick={() => handleLogin(u.id)}
              style={styles.button}
              onMouseOver={e => (e.currentTarget.style.backgroundColor = '#0056b3')}
              onMouseOut={e => (e.currentTarget.style.backgroundColor = '#007bff')}
            >
              Login as {u.name} ({u.role})
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Welcome, {user.name} ({user.role})</h1>
      <button
        onClick={() => setUser(null)}
        style={{ ...styles.button, ...styles.buttonLogout }}
        onMouseOver={e => (e.currentTarget.style.backgroundColor = '#b52a37')}
        onMouseOut={e => (e.currentTarget.style.backgroundColor = '#dc3545')}
      >
        Logout
      </button>

      {loading ? (
        <p style={styles.loadingText}>Loading tickets...</p>
      ) : (
        <>
          <h2>Your Tickets</h2>
          {tickets.length === 0 ? (
            <p style={styles.noTicketsText}>No tickets found.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Ticket #</th>
                  <th style={styles.th}>Subject</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Department</th>
                  <th style={styles.th}>Assigned To</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map(t => {
                  const assignedUser = USERS.find(u => u.id === t.assignedTo);
                  return (
                    <tr
                      key={t.ticketNumber}
                      style={{ cursor: 'default' }}
                      onMouseOver={e => (e.currentTarget.style.backgroundColor = '#f1f1f1')}
                      onMouseOut={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <td style={styles.td}>{t.ticketNumber}</td>
                      <td style={styles.td}>{t.subject}</td>
                      <td style={styles.td}>{t.status}</td>
                      <td style={styles.td}>{t.department}</td>
                      <td style={styles.td}>{assignedUser ? assignedUser.name : 'Unassigned'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}

export default Dashboard;
