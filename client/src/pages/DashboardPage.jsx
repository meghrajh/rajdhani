import { useEffect, useMemo, useState } from "react";
import BookingForm from "../components/BookingForm";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

function DashboardPage() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);
  const [roomForm, setRoomForm] = useState({ roomType: "", price: "", capacity: "", description: "", image: "", isAvailable: true });
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isAdmin = user?.role === "admin";

  const fetchDashboardData = async () => {
    try {
      const roomRequest = api.get("/rooms");
      const myBookingsRequest = api.get("/bookings/my");
      const requests = [roomRequest, myBookingsRequest];

      if (isAdmin) {
        requests.push(api.get("/bookings/all"));
      }

      const [roomResponse, myBookingsResponse, allBookingsResponse] = await Promise.all(requests);
      setRooms(roomResponse.data.rooms);
      setBookings(myBookingsResponse.data.bookings);
      setAllBookings(allBookingsResponse?.data?.bookings || []);
    } catch (fetchError) {
      setError(fetchError.response?.data?.message || "Unable to load dashboard data.");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [isAdmin]);

  const resetAlerts = () => {
    setError("");
    setMessage("");
  };

  const roomOptions = useMemo(() => rooms.filter((room) => room.isAvailable || room._id === editingBooking?.roomId), [editingBooking?.roomId, rooms]);

  const handleBookingSubmit = async (formData, setFormError) => {
    resetAlerts();
    setBusy(true);

    try {
      if (editingBooking) {
        await api.put(`/bookings/${editingBooking._id}`, formData);
        setMessage("Booking updated successfully.");
        setEditingBooking(null);
      } else {
        await api.post("/bookings", formData);
        setMessage("Booking created successfully.");
      }
      await fetchDashboardData();
    } catch (submitError) {
      setFormError(submitError.response?.data?.message || "Unable to save booking.");
    } finally {
      setBusy(false);
    }
  };

  const handleBookingDelete = async (bookingId) => {
    resetAlerts();
    try {
      await api.delete(`/bookings/${bookingId}`);
      setMessage("Booking removed successfully.");
      if (editingBooking?._id === bookingId) {
        setEditingBooking(null);
      }
      await fetchDashboardData();
    } catch (deleteError) {
      setError(deleteError.response?.data?.message || "Unable to delete booking.");
    }
  };

  const startEditBooking = (booking) => {
    setEditingBooking({
      _id: booking._id,
      roomId: booking.roomId?._id || booking.roomId,
      checkInDate: booking.checkInDate.slice(0, 10),
      checkOutDate: booking.checkOutDate.slice(0, 10),
      guests: booking.guests,
    });
  };

  const handleRoomChange = (event) => {
    const { name, value, type, checked } = event.target;
    setRoomForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const resetRoomForm = () => {
    setRoomForm({ roomType: "", price: "", capacity: "", description: "", image: "", isAvailable: true });
    setEditingRoomId(null);
  };

  const handleRoomSubmit = async (event) => {
    event.preventDefault();
    resetAlerts();

    try {
      const payload = {
        ...roomForm,
        price: Number(roomForm.price),
        capacity: Number(roomForm.capacity),
      };

      if (editingRoomId) {
        await api.put(`/rooms/${editingRoomId}`, payload);
        setMessage("Room updated successfully.");
      } else {
        await api.post("/rooms", payload);
        setMessage("Room created successfully.");
      }

      resetRoomForm();
      await fetchDashboardData();
    } catch (roomError) {
      setError(roomError.response?.data?.message || "Unable to save room.");
    }
  };

  const handleRoomEdit = (room) => {
    setEditingRoomId(room._id);
    setRoomForm({
      roomType: room.roomType,
      price: room.price,
      capacity: room.capacity,
      description: room.description,
      image: room.image,
      isAvailable: room.isAvailable,
    });
  };

  const handleRoomDelete = async (roomId) => {
    resetAlerts();
    try {
      await api.delete(`/rooms/${roomId}`);
      setMessage("Room deleted successfully.");
      if (editingRoomId === roomId) {
        resetRoomForm();
      }
      await fetchDashboardData();
    } catch (roomDeleteError) {
      setError(roomDeleteError.response?.data?.message || "Unable to delete room.");
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    resetAlerts();
    try {
      await api.put(`/bookings/${bookingId}`, { status });
      setMessage(`Booking marked as ${status}.`);
      await fetchDashboardData();
    } catch (statusError) {
      setError(statusError.response?.data?.message || "Unable to update booking status.");
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-maroon-500">Dashboard</p>
          <h1 className="mt-3 font-heading text-5xl text-maroon">{isAdmin ? "Admin control center" : "My booking dashboard"}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-ink/75">
            {isAdmin
              ? "Review every reservation, manage room inventory, and keep hotel operations organized."
              : "Create new bookings, edit upcoming stays, and cancel reservations you no longer need."}
          </p>
        </div>
      </div>

      {message ? <p className="mt-8 rounded-2xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">{message}</p> : null}
      {error ? <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p> : null}

      <div className="mt-10 grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
        <BookingForm
          rooms={roomOptions}
          onSubmit={handleBookingSubmit}
          initialValues={editingBooking}
          onCancel={editingBooking ? () => setEditingBooking(null) : null}
          submitLabel={editingBooking ? "Update Booking" : "New Booking"}
          busy={busy}
        />

        <div className="rounded-[1.75rem] border border-maroon-100 bg-white p-6 shadow-card">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-maroon-500">My Bookings</p>
              <h2 className="mt-2 font-heading text-3xl text-maroon">Guest reservations</h2>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-maroon-100 text-ink/70">
                <tr>
                  <th className="py-3 pr-4">Room</th>
                  <th className="py-3 pr-4">Dates</th>
                  <th className="py-3 pr-4">Guests</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id} className="border-b border-maroon-50 align-top last:border-b-0">
                    <td className="py-4 pr-4 font-semibold text-maroon">{booking.roomId?.roomType}</td>
                    <td className="py-4 pr-4 text-ink/75">{booking.checkInDate.slice(0, 10)} to {booking.checkOutDate.slice(0, 10)}</td>
                    <td className="py-4 pr-4">{booking.guests}</td>
                    <td className="py-4 pr-4 capitalize">{booking.status}</td>
                    <td className="py-4">
                      <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => startEditBooking(booking)} className="rounded-full border border-maroon px-3 py-1.5 font-semibold text-maroon">
                          Edit
                        </button>
                        <button type="button" onClick={() => handleBookingDelete(booking._id)} className="rounded-full bg-ink px-3 py-1.5 font-semibold text-white">
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-ink/60">No bookings yet. Use the form to create your first reservation.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isAdmin ? (
        <div className="mt-10 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[1.75rem] border border-maroon-100 bg-white p-6 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-maroon-500">All Bookings</p>
            <h2 className="mt-2 font-heading text-3xl text-maroon">Hotel-wide reservations</h2>
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-maroon-100 text-ink/70">
                  <tr>
                    <th className="py-3 pr-4">Guest</th>
                    <th className="py-3 pr-4">Room</th>
                    <th className="py-3 pr-4">Dates</th>
                    <th className="py-3 pr-4">Status</th>
                    <th className="py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allBookings.map((booking) => (
                    <tr key={booking._id} className="border-b border-maroon-50 align-top last:border-b-0">
                      <td className="py-4 pr-4">
                        <p className="font-semibold text-maroon">{booking.userId?.name}</p>
                        <p className="text-ink/60">{booking.userId?.email}</p>
                      </td>
                      <td className="py-4 pr-4">{booking.roomId?.roomType}</td>
                      <td className="py-4 pr-4 text-ink/75">{booking.checkInDate.slice(0, 10)} to {booking.checkOutDate.slice(0, 10)}</td>
                      <td className="py-4 pr-4 capitalize">{booking.status}</td>
                      <td className="py-4">
                        <div className="flex flex-wrap gap-2">
                          <button type="button" onClick={() => updateBookingStatus(booking._id, "confirmed")} className="rounded-full border border-green-600 px-3 py-1.5 font-semibold text-green-700">
                            Confirm
                          </button>
                          <button type="button" onClick={() => updateBookingStatus(booking._id, "cancelled")} className="rounded-full border border-red-500 px-3 py-1.5 font-semibold text-red-600">
                            Cancel
                          </button>
                          <button type="button" onClick={() => handleBookingDelete(booking._id)} className="rounded-full bg-ink px-3 py-1.5 font-semibold text-white">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {allBookings.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-6 text-center text-ink/60">No bookings have been created yet.</td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-maroon-100 bg-white p-6 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-maroon-500">Manage Rooms</p>
            <h2 className="mt-2 font-heading text-3xl text-maroon">Room inventory</h2>
            <form className="mt-6 space-y-4" onSubmit={handleRoomSubmit}>
              <input name="roomType" value={roomForm.roomType} onChange={handleRoomChange} placeholder="Room type" className="w-full rounded-2xl border border-maroon-100 bg-ivory px-4 py-3 outline-none focus:border-maroon" required />
              <div className="grid gap-4 sm:grid-cols-2">
                <input name="price" type="number" min="0" value={roomForm.price} onChange={handleRoomChange} placeholder="Price per night" className="w-full rounded-2xl border border-maroon-100 bg-ivory px-4 py-3 outline-none focus:border-maroon" required />
                <input name="capacity" type="number" min="1" value={roomForm.capacity} onChange={handleRoomChange} placeholder="Capacity" className="w-full rounded-2xl border border-maroon-100 bg-ivory px-4 py-3 outline-none focus:border-maroon" required />
              </div>
              <input name="image" value={roomForm.image} onChange={handleRoomChange} placeholder="Image URL" className="w-full rounded-2xl border border-maroon-100 bg-ivory px-4 py-3 outline-none focus:border-maroon" required />
              <textarea name="description" value={roomForm.description} onChange={handleRoomChange} placeholder="Description" rows="4" className="w-full rounded-2xl border border-maroon-100 bg-ivory px-4 py-3 outline-none focus:border-maroon" required />
              <label className="flex items-center gap-3 text-sm font-semibold text-ink">
                <input type="checkbox" name="isAvailable" checked={roomForm.isAvailable} onChange={handleRoomChange} className="h-4 w-4 accent-maroon" />
                Mark room as available
              </label>
              <div className="flex flex-wrap gap-3">
                <button type="submit" className="rounded-full bg-maroon px-5 py-3 font-semibold text-white">
                  {editingRoomId ? "Update Room" : "Add Room"}
                </button>
                {editingRoomId ? (
                  <button type="button" onClick={resetRoomForm} className="rounded-full border border-maroon px-5 py-3 font-semibold text-maroon">
                    Cancel Edit
                  </button>
                ) : null}
              </div>
            </form>

            <div className="mt-8 space-y-4">
              {rooms.map((room) => (
                <div key={room._id} className="rounded-2xl border border-maroon-100 px-4 py-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-semibold text-maroon">{room.roomType}</p>
                      <p className="text-sm text-ink/70">Rs. {room.price} per night | Capacity {room.capacity}</p>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => handleRoomEdit(room)} className="rounded-full border border-maroon px-3 py-1.5 text-sm font-semibold text-maroon">Edit</button>
                      <button type="button" onClick={() => handleRoomDelete(room._id)} className="rounded-full bg-ink px-3 py-1.5 text-sm font-semibold text-white">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default DashboardPage;
