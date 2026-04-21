import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import { useEffect, useState } from "react";
import RoomCard from "../components/RoomCard";
import api from "../utils/api";

function HomePage() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } = await api.get("/rooms");
        setRooms(data.rooms.slice(0, 3));
      } catch (error) {
        setRooms([]);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className="pb-8">
      <section className="bg-hero-pattern">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
          <div className="flex flex-col justify-center">
            <p className="inline-flex w-fit rounded-full border border-maroon-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.35em] text-maroon">
              Luxury stay and smart booking
            </p>
            <h1 className="mt-6 font-heading text-5xl leading-tight text-maroon sm:text-6xl lg:text-7xl">
              Hotel Rajdhani Palace
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/75">
              Discover elegant rooms, simplified online reservations, and a polished dashboard for both guests and hotel administrators.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link to="/rooms" className="inline-flex items-center justify-center gap-2 rounded-full bg-maroon px-7 py-4 font-semibold text-white transition hover:bg-maroon-800">
                Book Now <FaArrowRight />
              </Link>
              <Link to="/dashboard" className="inline-flex items-center justify-center rounded-full border border-maroon px-7 py-4 font-semibold text-maroon transition hover:bg-maroon hover:text-white">
                Open Dashboard
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-4 top-10 h-32 w-32 rounded-full bg-maroon/10 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-black/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] shadow-card">
              <img
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"
                alt="Hotel Rajdhani Palace suite"
                className="h-[420px] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <p className="text-sm uppercase tracking-[0.35em] text-white/75">Royal comfort</p>
                <p className="mt-2 font-heading text-3xl">Premium rooms with hospitality-first service.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-maroon-500">Available Rooms</p>
            <h2 className="mt-3 font-heading text-4xl text-maroon sm:text-5xl">Stay options guests love</h2>
          </div>
          <Link to="/rooms" className="text-sm font-semibold text-maroon hover:text-maroon-800">
            See all rooms
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {rooms.map((room) => (
            <RoomCard key={room._id} room={room} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
