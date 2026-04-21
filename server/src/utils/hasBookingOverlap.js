import Booking from "../models/Booking.js";

const hasBookingOverlap = async ({ roomId, checkInDate, checkOutDate, excludeBookingId }) => {
  const query = {
    roomId,
    status: { $ne: "cancelled" },
    checkInDate: { $lt: new Date(checkOutDate) },
    checkOutDate: { $gt: new Date(checkInDate) },
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const existingBooking = await Booking.findOne(query);
  return Boolean(existingBooking);
};

export default hasBookingOverlap;
