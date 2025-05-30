import React from 'react';
import './App.css'; // Ensure App.css is imported for styling

const TicketList = ({ tickets, user, approveTicket, rejectTicket, resolveTicket }) => {
  return (
    <div className="ticket-list-container">
      <table className="ticket-table">
        <thead>
          <tr>
            <th>Ticket #</th>
            <th>Subject</th>
            <th>Status</th>
            <th>Department</th>
            <th>Assigned To</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => {
            const isAssignedToUser = ticket.assignedTo === user.id;

            return (
              <tr key={ticket.ticketNumber}>
                <td>{ticket.ticketNumber}</td>
                <td>{ticket.subject}</td>
                <td>{ticket.status}</td>
                <td>{ticket.department}</td>
                <td>{ticket.assignedTo || 'Unassigned'}</td>
                <td>
                  {user.role === 'DepartmentManager' && ticket.status === 'Open' && (
                    <>
                      <button className="approve" onClick={() => approveTicket(ticket.ticketNumber)}>
                        Approve
                      </button>
                      <button className="reject" onClick={() => rejectTicket(ticket.ticketNumber)}>
                        Reject
                      </button>
                    </>
                  )}
                  {user.role === 'SupportAgent' && isAssignedToUser && ticket.status === 'In Progress' && (
                    <button className="resolve" onClick={() => resolveTicket(ticket.ticketNumber)}>
                      Resolve
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TicketList;
