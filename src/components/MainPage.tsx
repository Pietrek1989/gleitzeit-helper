import React, { useState } from "react";
import "../index.css";
import DayCard from "./DayCard";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { Day } from "../interfaces";

const MainPage: React.FC = () => {
  const [allDays, setAllDays] = useState<Day[]>([
    { weekTitle: "This Week", id: 0 },
  ]);

  const addDay = () => {
    setAllDays([...allDays, { id: new Date().getTime() }]);
  };

  return (
    <div>
      <h1 className="text-5xl font-bold underline">Hello world!</h1>
      {allDays.map((day, index) => (
        <DayCard key={day.id} title={day.weekTitle || `Day ${index + 1}`} />
      ))}
      <PlusCircleIcon
        className="h-6 w-6 text-blue-500 cursor-pointer"
        onClick={addDay}
      />
    </div>
  );
};

export default MainPage;
