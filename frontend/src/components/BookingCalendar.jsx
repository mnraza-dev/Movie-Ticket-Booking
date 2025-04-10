import { format, addDays } from "date-fns";

const BookingCalendar = ({ selectedDate, onDateChange }) => {
  const today = new Date();
  const next7Days = Array.from({ length: 7 }, (_, i) => addDays(today, i));

  return (
    <div className="flex gap-4 overflow-x-auto p-4">
      {next7Days.map((date, index) => {
        const id = format(date, "yyyyMMdd");
        const dayName = format(date, "EEE").toUpperCase();
        const dayNumber = format(date, "dd");
        const monthName = format(date, "MMM").toUpperCase();
        const isSelected = selectedDate === id;

        return (
          <div
            key={index}
            id={id}
            onClick={() => onDateChange(id)}
            className={`cursor-pointer flex flex-col items-center justify-center px-6 py-4 rounded-xl transition-colors ${
              isSelected
                ? "bg-red-600 text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <div className="text-sm font-medium">{dayName}</div>
            <div className="text-lg font-bold">{dayNumber}</div>
            <div className="text-sm font-medium">{monthName}</div>
          </div>
        );
      })}
    </div>
  );
};
export default BookingCalendar;
