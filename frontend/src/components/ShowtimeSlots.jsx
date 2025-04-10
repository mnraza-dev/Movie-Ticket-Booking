import React from "react";
import { format } from "date-fns"; 
const ShowtimeSlots = ({ showtimes, selectedShowtime, setSelectedShowtime }) => {
  if (!showtimes || showtimes.length === 0) {
    return <div className="text-muted-foreground p-4">No showtimes available.</div>;
  }

  return (
    <div className="flex gap-3 flex-wrap p-4">
      {showtimes.map((showtime, index) => {
        const formattedTime = format(new Date(showtime.startTime), "hh:mm a");

        return (
          <div
            key={showtime._id}
            onClick={() => setSelectedShowtime(showtime._id)}
            // onClick={() => setSelectedShowtime(formattedTime)}
            className={`rounded-lg border cursor-pointer transition-colors ${
              selectedShowtime === formattedTime
                ? "border-red-600 bg-red-100"
                : "border-gray-300 hover:border-red-500"
            }`}
          >
            <div className="bg-white px-6 py-4 rounded-lg">
              <div className="text-sm font-medium text-green-600">
                {formattedTime}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ShowtimeSlots;
