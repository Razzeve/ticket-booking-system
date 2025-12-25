import { useEffect, useState } from "react";
import { fetchTickets } from "../api/tickets";
import type { Ticket } from "../api/tickets";
import TicketCard from "./TicketCard";
import Toast from "./Toast";

export default function TicketCatalog() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  async function loadTickets() {
    try {
      setLoading(true);
      const data = await fetchTickets();
      setTickets(data);
    } catch {
      setError("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTickets();
  }, []);

  if (loading) return <p className="container">Loading tickets...</p>;
  if (error) return <p className="container message-error">{error}</p>;

  return (
    <div className="container">
      <h2>Ticket Catalog</h2>
      <p>Buy all tickets here at an affordable price like never before.</p>
      <div className="ticket-grid">
        {tickets.map((ticket) => (
          <TicketCard
            key={ticket.tier}
            ticket={ticket}
            onBooked={loadTickets}
            onSuccess={() =>
              setToastMessage("Ticket payment successful 🎉")
            }
          />
        ))}
      </div>

      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage("")}
        />
      )}
    </div>
  );
}
