import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/movies/${id}`
        );
        setMovie(response.data);
      } catch (error) {
        console.error("Error fetching movie:", error);
      }
    };

    if (id) fetchMovie();
  }, [id]);

  if (!movie)
    return (
      <div className="text-center mt-10 text-muted-foreground">Loading...</div>
    );

  return (
    <div className="max-w-8xl mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full md:w-[300px] rounded-xl shadow-lg object-cover"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300x450?text=No+Image";
          }}
        />

        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold">{movie.title}</h1>

          <div className="flex flex-wrap gap-2">
            <Badge>{movie.genre}</Badge>
            <Badge>{movie.language}</Badge>
            <Badge>{movie.duration} min</Badge>
          </div>

          <p className="text-muted-foreground">{movie.description}</p>

          <div className="pt-2">
            <Button
              className="bg-red-600 h-14 cursor-pointer w-[300px] hover:bg-red-700 text-white font-semibold"
              onClick={() => navigate(`/book/${movie._id}`)}
            >
              Book Tickets
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
