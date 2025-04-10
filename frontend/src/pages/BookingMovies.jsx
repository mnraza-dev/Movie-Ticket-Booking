import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BookingCalendar from "@/components/BookingCalendar";
import ShowtimeSlots from "@/components/ShowtimeSlots";
import { loadRazorpay } from "@/utils/loadRazorpay";
import verifyPayment from "@/utils/verifyPayment";

const BookingMovies = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyyMMdd")
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/movies/${id}`
        );
        setMovie(res.data);
        console.log("Fetched movie:", res.data);
      } catch (err) {
        console.error("Failed to fetch movie:", err);
      }
    };

    if (id) fetchMovie();
  }, [id]);

  const handleBooking = async () => {
    if (!selectedShowtime) {
      alert("Please select a showtime!");
      return;
    }

    setIsLoading(true);
    const bookingData = { showtimeId: selectedShowtime, numberOfTickets: 1 };

    try {
      // Make booking request
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/book`,
        bookingData,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log("✅ Booking initiated:", res.data);

      // Extract Razorpay order and booking ID
      const { razorpayOrder, bookingId } = res.data;

      // Load Razorpay
      const isRzpLoaded = await loadRazorpay();
      if (!isRzpLoaded) {
        alert("Razorpay SDK failed to load.");
        return;
      }

      // Razorpay Payment options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: "INR",
        name: "Hayya Alal Falah 🎬",
        description: `Movie Ticket for ${movie.title}`,
        order_id: razorpayOrder.id,
        handler: async (response) => {
          try {
            console.log("✅ Razorpay Success:", response);

            // Step 1: Call your verifyPayment function here
            const verificationResult = await verifyPayment(response, bookingId);
            if (verificationResult.success) {
              alert("🎉 Movie ticket has been booked successfully!");
              navigate(`/booking-success/${bookingId}`);
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (error) {
            console.error("❌ Payment verification error:", error);
            alert(
              "There was an issue confirming your payment. Please contact support."
            );
          } finally {
            setIsLoading(false);
          }
        },
        prefill: {
          name: "Movie Fan",
          email: "user@example.com",
          contact: "9999999999",
        },
        theme: { color: "#FFD700" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        alert(`Payment failed: ${response.error.description}`);
        setIsLoading(false);
      });
      rzp.open();
    } catch (err) {
      console.error("❌ Booking failed:", err);
      alert("Booking failed. Please check your login status or try again.");
      setIsLoading(false);
    }
  };

  if (!movie)
    return (
      <div className="text-center mt-10 text-muted-foreground">Loading...</div>
    );

  const filteredShowtimes = (movie?.showtimes ?? []).filter((showtime) => {
    const showtimeDate = format(new Date(showtime.startTime), "yyyyMMdd");
    return showtimeDate === selectedDate;
  });

  return (
    <div className="max-w-8xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {movie.title} - ({movie.language})
          </CardTitle>

          {movie.genre.map((g, index) => (
            <span
              key={index}
              className="text-muted-foreground border-2 border-gray-400 rounded-xl w-fit px-2"
            >
              {g}
            </span>
          ))}
        </CardHeader>

        <CardContent className="flex flex-col md:flex-col gap-6">
          <section className="w-full max-w-4xl">
            <BookingCalendar
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          </section>

          <section className="w-full max-w-4xl">
            <ShowtimeSlots
              selectedShowtime={selectedShowtime}
              setSelectedShowtime={setSelectedShowtime}
              showtimes={filteredShowtimes}
            />
          </section>

          <section className="w-full max-w-4xl">
            <Button
              onClick={handleBooking}
              disabled={isLoading || !selectedShowtime}
              className="bg-red-600 h-14 cursor-pointer w-[300px] hover:bg-red-700 text-white font-semibold"
            >
              {isLoading ? "Processing..." : "Confirm Booking"}
            </Button>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingMovies;
