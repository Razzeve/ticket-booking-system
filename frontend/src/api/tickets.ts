const API_BASE_URL = "http://localhost:3001";

export type Ticket = {
  tier: string;
  price: number;
  available: number;
};

export async function fetchTickets(): Promise<Ticket[]> {
  const res = await fetch(`${API_BASE_URL}/tickets`);
  if (!res.ok) {
    throw new Error("Failed to fetch tickets");
  }
  return res.json();
}

export async function bookTickets(
  tier: string,
  quantity: number
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/book`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tier, quantity }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Booking failed");
  }
}
