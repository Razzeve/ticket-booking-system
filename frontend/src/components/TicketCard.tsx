import { useState } from "react";
import type { Ticket } from "../api/tickets";
import BookingModal from "./BookingModal";
import { TIER_CONFIG } from "../config/ticketTiers";

type Props = {
  ticket: Ticket;
  onBooked: () => void;
  onSuccess: () => void;
};

export default function TicketCard({
  ticket,
  onBooked,
  onSuccess,
}: Props) {
  const [showModal, setShowModal] = useState(false);
const tierInfo = TIER_CONFIG[ticket.tier as keyof typeof TIER_CONFIG];

  return (
    <>
      <div className="ticket-card">
        <div className="ticket-info">
          <div className="ticket-tier"> {tierInfo?.label ?? ticket.tier}</div>
          <div className="ticket-price">$ {ticket.price}</div>
        </div>
        <div className="ticket-description">
          <ul>
            {tierInfo?.description.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="ticket-availability">
          Available: {ticket.available}
        </div>
        <div className="ticket-action">
          <button
            disabled={ticket.available === 0}
            onClick={() => setShowModal(true)}
          >
            {ticket.available === 0 ? "Sold Out" : "Book"}
          </button>
        </div>
      </div>

      {showModal && (
        <BookingModal
          ticket={ticket}
          onBooked={onBooked}
          onSuccess={onSuccess}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
