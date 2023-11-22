import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Day } from "../interfaces";
import ErrorFallback from "./ErrorFallback";
import { CalendarDaysIcon } from "@heroicons/react/24/solid";

interface WeekData {
  title: string;
  daysData: Day[];
}

const ShareWeek: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [weekData, setWeekData] = useState<WeekData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      try {
        const decodedData = atob(id);
        const parsedData: WeekData = JSON.parse(decodedData);
        setWeekData(parsedData);
      } catch (e) {
        setError("Invalid week data. Please check your link.");
      }
    } else {
      setError("No week data provided.");
    }
  }, [id]);
  const formatHours = (hours: number): string => {
    const floorHours = Math.floor(Math.abs(hours));
    const minutes = Math.round((Math.abs(hours) % 1) * 60);
    return `${hours < 0 ? "-" : ""}${floorHours
      .toString()
      .padStart(2, "0")} H ${minutes.toString().padStart(2, "0")} m`;
  };

  const calculateDayHours = (day: Day): string => {
    if (day.start === "" || day.end === "") {
      return "0";
    }
    const startTime = new Date(`1970-01-01T${day.start}:00`);
    const endTime = new Date(`1970-01-01T${day.end}:00`);
    const hoursWorked = (endTime.getTime() - startTime.getTime()) / 3600000;
    const lunchBreak = parseInt(day.breakTime) / 60;
    const totalHours = parseFloat((hoursWorked - lunchBreak).toFixed(2));
    return totalHours.toFixed(2);
  };

  const calculateTotalHours = (): [number, number] => {
    let totalHours = 0;
    weekData?.daysData.forEach((day) => {
      totalHours += parseFloat(calculateDayHours(day));
    });
    const remainingHours = parseFloat((38.5 - totalHours).toFixed(2));
    return [totalHours, remainingHours]; // Return numbers directly
  };

  const [weekHours, remainingHours] = calculateTotalHours();

  if (error) {
    return <ErrorFallback message={error} />;
  }

  if (!weekData) {
    return <p>Loading...</p>;
  }
  return (
    <div
      className={`border p-4 my-2 w-full bg-bgsecondary rounded-lg shadow-2xl max-h-[1500px]`}
    >
      <div className="w-full h-fit accordion-inner">
        <div className="flex flex-col sm:flex-row mb-5">
          <CalendarDaysIcon className="h-6 w-6 text-primary" />
          <h5>{weekData.title}</h5>
        </div>
        {weekData.daysData.map((day, index) => (
          <div key={index} className="my-1">
            <hr className="mt-2" />
            <div className="flex space-x-1 justify-around md:justify-between items-center ">
              <div>
                <h3 className="font-bold text-primary w-10">{day.day} </h3>
              </div>
              <div className="flex flex-col md:flex-row">
                <span className="font-bold mr-1">Start:</span>

                <input
                  disabled
                  type="time"
                  value={day.start}
                  className="mr-2"
                />
                <span className="font-bold mr-1">End:</span>
                <input disabled type="time" value={day.end} className="mr-2" />
                <span className="font-bold">Lunch:</span>
                <select disabled value={day.breakTime}>
                  <option value="30">30m</option>
                  <option value="45">45m</option>
                  <option value="60">60m</option>
                  <option value="0">0m</option>
                </select>
                <span>
                  <span className="font-bold">Hours:</span>
                  {` ${Math.floor(parseFloat(calculateDayHours(day)))
                    .toString()
                    .padStart(2, "0")} H ${Math.round(
                    (parseFloat(calculateDayHours(day)) % 1) * 60
                  )
                    .toString()
                    .padStart(2, "0")} m`}
                </span>
              </div>
            </div>
          </div>
        ))}

        <div className="text-xl mt-5">
          <hr className="mt-2" />
          You worked <span className="font-bold">{formatHours(weekHours)}</span>
        </div>
        <div className="text-xl">
          <span className="font-bold">{formatHours(remainingHours)}</span> left
          to reach 38.5 hours
        </div>
      </div>
    </div>
  );
};

export default ShareWeek;
