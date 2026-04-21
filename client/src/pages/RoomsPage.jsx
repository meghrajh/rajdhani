import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RoomCard from "../components/RoomCard";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } = await api.get("/rooms");
        setRooms(data.rooms);
      } catch (fetchError) {
        setError(fetchError.response?.data?.message || "Unable to load rooms right now.");
      }
    };

    fetchRooms();
  }, []);

  const handleBook = () => {
    if (!user) {
      navigate("/login", { state: { redirectTo: "/dashboard" } });
      return;
    }

    navigate("/dashboard");
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-maroon-500">Rooms</p>
        <h1 className="mt-3 font-heading text-5xl text-maroon">Choose the right stay for your trip</h1>
        <p className="mt-5 text-lg leading-8 text-ink/75">
          Browse room categories, compare nightly pricing, and move into the booking dashboard when you are ready.
        </p>
      </div>

      {error ? <p className="mt-8 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p> : null}

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        {rooms.map((room) => (
          <RoomCard key={room._id} room={room} onBook={handleBook} compact />
        ))}
      </div>
    </section>
  );
}

export default RoomsPage;
