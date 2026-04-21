import { FaBed, FaUsers, FaIndianRupeeSign } from "react-icons/fa6";

function RoomCard({ room, onBook, compact = false }) {
  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-maroon-100 bg-white shadow-card">
      <img src={room.image} alt={room.roomType} className={compact ? "h-56 w-full object-cover" : "h-64 w-full object-cover"} />
      <div className="space-y-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-maroon-500">Room Type</p>
            <h3 className="mt-2 font-heading text-3xl text-maroon">{room.roomType}</h3>
          </div>
          <span className={`rounded-full px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] ${room.isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {room.isAvailable ? "Available" : "Unavailable"}
          </span>
        </div>

        <p className="text-sm leading-7 text-ink/75">{room.description}</p>

        <div className="grid gap-3 text-sm text-ink/80 sm:grid-cols-3">
          <div className="flex items-center gap-2 rounded-2xl bg-ivory px-3 py-3">
            <FaBed className="text-maroon" />
            <span>{room.roomType}</span>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-ivory px-3 py-3">
            <FaUsers className="text-maroon" />
            <span>{room.capacity} Guests</span>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-ivory px-3 py-3">
            <FaIndianRupeeSign className="text-maroon" />
            <span>{room.price}/night</span>
          </div>
        </div>

        {onBook ? (
          <button
            type="button"
            onClick={() => onBook(room)}
            disabled={!room.isAvailable}
            className="w-full rounded-full bg-maroon px-5 py-3 font-semibold text-white transition hover:bg-maroon-800 disabled:cursor-not-allowed disabled:bg-maroon-200"
          >
            Book This Room
          </button>
        ) : null}
      </div>
    </article>
  );
}

export default RoomCard;
