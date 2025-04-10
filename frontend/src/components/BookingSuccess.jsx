import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const BookingSuccess = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/bookings/${bookingId}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setBooking(response.data);
      } catch (err) {
        console.error("Failed to fetch booking:", err);
        setError("Unable to load your booking details. Please check your booking history.");
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  if (loading) {
    return <div className="text-center mt-10">Loading your booking details...</div>;
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-500 mb-4">{error}</div>
            <div className="flex justify-center">
              <Link to="/bookings">
                <Button variant="outline">View All Bookings</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="border-green-500 shadow-lg">
        <CardHeader className="bg-green-50">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center text-green-700">
            Booking Confirmed!
          </CardTitle>
          <p className="text-center text-gray-600">
            Your movie tickets have been booked successfully
          </p>
        </CardHeader>

        <CardContent className="space-y-4 pt-6">
          {booking && (
            <>
              <div className="border-b pb-3">
                <h3 className="font-semibold text-lg mb-2">Movie Details</h3>
                <p className="text-xl font-bold">{booking.showtime.movie.title}</p>
                <p className="text-gray-600">{booking.showtime.movie.language}</p>
              </div>

              <div className="border-b pb-3">
                <h3 className="font-semibold text-lg mb-2">Showtime</h3>
                <p className="text-lg">
                  {format(new Date(booking.showtime.startTime), "EEEE, MMMM d, yyyy")}
                </p>
                <p className="text-lg">
                  {format(new Date(booking.showtime.startTime), "h:mm a")}
                </p>
              </div>

              <div className="border-b pb-3">
                <h3 className="font-semibold text-lg mb-2">Booking Information</h3>
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-gray-600">Booking ID:</p>
                  <p>{booking._id}</p>
                  <p className="text-gray-600">Number of Tickets:</p>
                  <p>{booking.numberOfTickets}</p>
                  <p className="text-gray-600">Total Amount:</p>
                  <p>₹{booking.totalPrice.toFixed(2)}</p>
                </div>
              </div>

              <div className="pt-4 flex justify-center space-x-4">
                <Link to="/bookings">
                  <Button variant="outline">View All Bookings</Button>
                </Link>
                <Link to="/">
                  <Button>Back to Home</Button>
                </Link>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingSuccess;