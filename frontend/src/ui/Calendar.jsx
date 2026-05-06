import { DayPicker } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "react-day-picker/style.css";

export const Calendar = ({ selected, onSelect }) => {
  return (
    <div className="border rounded-xl p-4 bg-white w-fit mx-auto">

      <DayPicker
        mode="single"
        selected={selected}
        onSelect={onSelect}
        showOutsideDays
        disabled={(date) => date < new Date()}

        className="text-sm"

        classNames={{
          caption: "flex justify-center items-center relative mb-2",
          caption_label: "text-sm font-medium",

          nav: "flex items-center gap-1",
          nav_button:
            "h-7 w-7 flex items-center justify-center rounded-md hover:bg-gray-100",

          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",

          head_cell:
            "text-xs text-gray-400 font-normal text-center",

          day:
            "h-9 w-9 flex items-center justify-center rounded-md hover:bg-gray-100 cursor-pointer",

          day_selected:
            "bg-black text-white hover:bg-black",

          day_today:
            "border border-black",

          day_outside:
            "text-gray-300",

          day_disabled:
            "text-gray-300 cursor-not-allowed",
        }}

        components={{
          IconLeft: () => <ChevronLeft className="w-4 h-4" />,
          IconRight: () => <ChevronRight className="w-4 h-4" />
        }}
      />

    </div>
  );
};