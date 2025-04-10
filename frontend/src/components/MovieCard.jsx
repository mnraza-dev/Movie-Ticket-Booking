import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBooking = (movieId) => {
    if (!user) {
      navigate("/login");
    } else {
      navigate(`/book/${movieId}`);
    }
  };

  const handleCardClick = (e) => {
    if (e.target.closest("button")) return;
    navigate(`/movies/${movie._id}`);
  };

  return (
    <Card
      onClick={handleCardClick}
      key={movie._id}
      className="cursor-pointer bg-gray-800 border-none overflow-hidden hover:shadow-lg transition-shadow hover:scale-105 hover:transition-all hover:ease-in-out hover:transform hover:duration-500"
    >
      <CardHeader className="p-0">
        <img
          src={movie.poster}
          alt={`${movie.title} poster`}
          className="w-full h-64 object-cover"
          onError={(e) =>
            (e.target.src = "https://via.placeholder.com/300x450?text=No+Image")
          }
        />
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg font-semibold text-white truncate">
          {movie.title}
        </CardTitle>
        <p className="text-sm text-gray-400">{movie.genre}</p>
        <p className="text-sm text-yellow-400 mt-1">{movie.rating}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={() => handleBooking(movie._id)}
          className="w-full bg-red-600 hover:bg-red-700 text-white cursor-pointer"
        >
          Book Tickets
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MovieCard;
