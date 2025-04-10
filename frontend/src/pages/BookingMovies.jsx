import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BookingCalendar from "@/components/BookingCalendar";
import ShowtimeSlots from "@/components/ShowtimeSlots";

const BookingMovies = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState("");

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

  const handleBooking = () => {
    if (!selectedShowtime) return alert("Please select a showtime!");
    console.log(`Booking confirmed for ${movie.title} at ${selectedShowtime}`);
    alert(
      `🎉 Booking confirmed for ${movie.title}!\nShowtime: ${selectedShowtime}`
    );
  };

  if (!movie)
    return (
      <div className="text-center mt-10 text-muted-foreground">Loading...</div>
    );

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
          <section className="w-full max-w-4xl ">
            <BookingCalendar />
          </section>
          <section className="w-full max-w-4xl ">
            <ShowtimeSlots
              selectedShowtime={selectedShowtime}
              setSelectedShowtime={setSelectedShowtime}
              showtimes={movie?.showtimes ?? []}
            />
          </section>
          <section className="w-full max-w-4xl ">
            <Button
              onClick={handleBooking}
              className="bg-red-600 h-14 cursor-pointer w-[300px] hover:bg-red-700 text-white font-semibold"
            >
              Confirm Booking
            </Button>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingMovies;
