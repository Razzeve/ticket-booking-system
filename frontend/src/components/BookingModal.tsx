import { useState } from "react";
import type { Ticket } from "../api/tickets";
import { bookTickets } from "../api/tickets";
import { createPortal } from "react-dom";
import { TIER_CONFIG } from "../config/ticketTiers";

type Props = {
  ticket: Ticket;
  onClose: () => void;
  onBooked: () => void;
  onSuccess: () => void;
};

export default function BookingModal({
  ticket,
  onClose,
  onBooked,
  onSuccess,
}: Props) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const tierInfo = TIER_CONFIG[ticket.tier as keyof typeof TIER_CONFIG];

  async function handlePaymentAndBooking() {
    setLoading(true);
    setError("");

    // simulate payment delay
    await new Promise((res) => setTimeout(res, 1200));

    try {
      await bookTickets(ticket.tier, quantity);
      setLoading(false);
      onBooked();
      onSuccess();
      onClose();
    } catch (err: any) {
      setLoading(false);
      setError(err.message);
    }
  }

return createPortal(
  <div className="modal-overlay">
    <div className="modal">
      <h2>{tierInfo?.label ?? ticket.tier}</h2>

      <p>Price: ${ticket.price} USD</p>
      <p>Available: {ticket.available}</p>

      <div className="quantity-control">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          disabled={loading}
        >
          −
        </button>

        <span>{quantity}</span>

        <button
          onClick={() =>
            setQuantity((q) => Math.min(ticket.available, q + 1))
          }
          disabled={loading}
        >
          +
        </button>
      </div>

      {error && <p className="message-error">{error}</p>}

      <div className="modal-actions">
        <button onClick={onClose} disabled={loading}>
          Cancel
        </button>

        <button onClick={handlePaymentAndBooking} disabled={loading}>
          {loading ? "Processing..." : "Pay & Book"}
        </button>
      </div>
    </div>
  </div>,
  document.getElementById("modal-root")!
);
}
