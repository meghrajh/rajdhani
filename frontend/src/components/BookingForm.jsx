import { useEffect, useMemo, useState } from "react";

const defaultForm = {
  roomId: "",
  checkInDate: "",
  checkOutDate: "",
  guests: 1,
};

function BookingForm({ rooms, onSubmit, initialValues, onCancel, submitLabel = "Save Booking", busy = false }) {
  const [formData, setFormData] = useState(defaultForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialValues) {
      setFormData({
        roomId: initialValues.roomId || "",
        checkInDate: initialValues.checkInDate || "",
        checkOutDate: initialValues.checkOutDate || "",
        guests: initialValues.guests || 1,
      });
      return;
    }

    setFormData({
      ...defaultForm,
      roomId: rooms[0]?._id || "",
    });
  }, [initialValues, rooms]);

  const selectedRoom = useMemo(
    () => rooms.find((room) => room._id === formData.roomId),
    [formData.roomId, rooms],
  );

  const totalEstimate = useMemo(() => {
    if (!selectedRoom || !formData.checkInDate || !formData.checkOutDate) {
      return 0;
    }

    const start = new Date(formData.checkInDate);
    const end = new Date(formData.checkOutDate);
    const difference = end.getTime() - start.getTime();
    const nights = Math.ceil(difference / (1000 * 60 * 60 * 24));

    if (nights <= 0) {
      return 0;
    }

    return nights * selectedRoom.price;
  }, [formData.checkInDate, formData.checkOutDate, selectedRoom]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: name === "guests" ? Number(value) : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (new Date(formData.checkInDate) >= new Date(formData.checkOutDate)) {
      setError("Check-out date must be after the check-in date.");
      return;
    }

    await onSubmit(formData, setError);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-[1.75rem] border border-maroon-100 bg-white p-6 shadow-card">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-maroon-500">Booking Form</p>
          <h3 className="mt-2 font-heading text-2xl text-maroon">{submitLabel}</h3>
        </div>
        {onCancel ? (
          <button type="button" onClick={onCancel} className="text-sm font-semibold text-ink/70 hover:text-maroon">
            Cancel
          </button>
        ) : null}
      </div>

      <label className="block text-sm font-semibold text-ink">
        Room
        <select
          name="roomId"
          value={formData.roomId}
          onChange={handleChange}
          className="mt-2 w-full rounded-2xl border border-maroon-100 bg-ivory px-4 py-3 outline-none focus:border-maroon"
          required
        >
          <option value="" disabled>
            Select a room
          </option>
          {rooms.map((room) => (
            <option key={room._id} value={room._id}>
              {room.roomType} - Rs. {room.price}/night
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-semibold text-ink">
          Check-In Date
          <input
            type="date"
            name="checkInDate"
            value={formData.checkInDate}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-maroon-100 bg-ivory px-4 py-3 outline-none focus:border-maroon"
            required
          />
        </label>
        <label className="block text-sm font-semibold text-ink">
          Check-Out Date
          <input
            type="date"
            name="checkOutDate"
            value={formData.checkOutDate}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-maroon-100 bg-ivory px-4 py-3 outline-none focus:border-maroon"
            required
          />
        </label>
      </div>

      <label className="block text-sm font-semibold text-ink">
        Guests
        <input
          type="number"
          min="1"
          max={selectedRoom?.capacity || 10}
          name="guests"
          value={formData.guests}
          onChange={handleChange}
          className="mt-2 w-full rounded-2xl border border-maroon-100 bg-ivory px-4 py-3 outline-none focus:border-maroon"
          required
        />
      </label>

      {selectedRoom ? (
        <div className="rounded-2xl bg-maroon-50 px-4 py-4 text-sm text-maroon-800">
          Estimated total: <span className="font-bold">Rs. {totalEstimate || selectedRoom.price}</span>
        </div>
      ) : null}

      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p> : null}

      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-full bg-maroon px-5 py-3 font-semibold text-white transition hover:bg-maroon-800 disabled:cursor-not-allowed disabled:bg-maroon-300"
      >
        {busy ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}

export default BookingForm;
