import { useEffect, useState } from "react";

type Ticket = {
  tier: string;
  price: number;
  available: number;
};

function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch("http://localhost:3001/tickets");

        if (!res.ok) {
          throw new Error("Failed to fetch tickets");
        }

        const data = await res.json();
        setTickets(data);
      } catch (err) {
        setError("Something went wrong while loading tickets");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) {
    return <p>Loading tickets...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Concert Tickets</h1>

      {tickets.map((ticket) => (
        <div
          key={ticket.tier}
          style={{
            border: "1px solid #ccc",
            padding: "12px",
            marginBottom: "10px",
            borderRadius: "6px",
          }}
        >
          <h3>{ticket.tier}</h3>
          <p>Price: ${ticket.price}</p>
          <p>Available: {ticket.available}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
