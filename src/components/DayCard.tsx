import React, { useState } from "react";

type Props = {
  title: string;
};

const DayCard: React.FC<Props> = ({ title }) => {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [breakTime, setBreakTime] = useState("30");
  const [totalHours, setTotalHours] = useState("");

  const calculateHours = () => {
    if (totalHours) return totalHours;

    const startTime = new Date(`1970-01-01T${start}:00`);
    const endTime = new Date(`1970-01-01T${end}:00`);
    let hours = (endTime.getTime() - startTime.getTime()) / 3600000;

    hours -= parseInt(breakTime) / 60;
    return hours.toFixed(2);
  };

  return (
    <div className="border p-4 my-2">
      <h2>{title}</h2>
      <div>
        <input
          type="time"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          placeholder="Start Time"
        />
        <input
          type="time"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          placeholder="End Time"
        />
        <select
          onChange={(e) => setBreakTime(e.target.value)}
          value={breakTime}
        >
          <option value="30">30 min</option>
          <option value="60">60 min</option>
        </select>
        <input
          type="text"
          value={totalHours}
          onChange={(e) => setTotalHours(e.target.value)}
          placeholder="Total Hours"
        />
      </div>
      <div>You worked {calculateHours()} hours today</div>
    </div>
  );
};

export default DayCard;
