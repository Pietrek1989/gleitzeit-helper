import React, { useState, useEffect } from "react";
import { Day } from "../interfaces";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import InputFields from "./InputFields";
import { CalendarDaysIcon } from "@heroicons/react/24/solid";
import { ChevronDoubleDownIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

type Props = {
  title: string;
  isActive: boolean;
  setActiveWeek: () => void;
  deleteWeek: () => void;
};

const WeekCard: React.FC<Props> = ({
  title,
  isActive,
  setActiveWeek,
  deleteWeek,
}) => {
  const [isDataLoaded, setDataLoaded] = useState(false);

  const [daysData, setDaysData] = useState<Day[]>([
    {
      day: "Monday",
      start: "",
      end: "",
      breakTime: "60",
      id: 1,
    },
    {
      day: "Tuesday",
      start: "",
      end: "",
      breakTime: "60",
      id: 2,
    },
    {
      day: "Wednesday",
      start: "",
      end: "",
      breakTime: "60",
      id: 3,
    },
    {
      day: "Thursday",
      start: "",
      end: "",
      breakTime: "60",
      id: 4,
    },
    {
      day: "Friday",
      start: "",
      end: "",
      breakTime: "60",
      id: 5,
    },
  ]);

  const [weekHours, setWeekHours] = useState(0);
  const [remainingHours, setRemainingHours] = useState(38.5);

  const parseDateString = (dateString: string) => {
    const [day, month, year] = dateString.split("/").map(Number);
    return new Date(year, month - 1, day);
  };

  const startDateInit = parseDateString(title.split(" - ")[0]);
  const endDateInit = parseDateString(title.split(" - ")[1]);
  const [startDate, setStartDate] = useState(startDateInit);
  const [endDate, setEndDate] = useState(endDateInit);

  const calculateDayHours = (dayIndex: number) => {
    const day = daysData[dayIndex];
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

  const formatHours = (hours: number) => {
    const floorHours = Math.floor(Math.abs(hours));
    const minutes = Math.round((Math.abs(hours) % 1) * 60);
    return `${hours < 0 ? "-" : ""}${floorHours
      .toString()
      .padStart(2, "0")} H ${minutes.toString().padStart(2, "0")} m`;
  };
  // const generateShareableLink = () => {
  //   const weekData = {
  //     title,
  //     daysData,
  //   };
  //   const encodedData = btoa(JSON.stringify(weekData));
  //   const link = `${window.location.origin}/shared/${encodedData}`;
  //   navigator.clipboard.writeText(link);
  //   alert("Link copied to clipboard!🧐");
  // };

  const generateShareableLink = async () => {
    const weekData = {
      title,
      daysData,
    };
    const encodedData = btoa(JSON.stringify(weekData));
    const originalLink = `${window.location.origin}/shared/${encodedData}`;

    try {
      const response = await fetch(`https://api.tinyurl.com/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer GeecBkdri4F68P5Ys8HiXGp8E478KJuUweIuXsrYAq8rZX8A5AmYMEmOcbMN`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: originalLink }),
      });

      if (response.ok) {
        const urlData = await response.json();
        navigator.clipboard.writeText(urlData.data.tiny_url);
        console.log(urlData, "urldata");
        alert("Link copied to clipboard!🧐");
      } else {
        // Fallback if URL shortening fails
        navigator.clipboard.writeText(originalLink);
        alert("Original link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error shortening URL:", error);
      // Fallback in case of an error
      navigator.clipboard.writeText(originalLink);
      alert("Original link copied to clipboard!");
    }
  };
  // GeecBkdri4F68P5Ys8HiXGp8E478KJuUweIuXsrYAq8rZX8A5AmYMEmOcbMN

  useEffect(() => {
    let totalHours = 0;

    for (const day of daysData) {
      totalHours += parseFloat(calculateDayHours(daysData.indexOf(day)));
    }

    setWeekHours(totalHours);

    setRemainingHours(parseFloat((38.5 - totalHours).toFixed(2)));
  }, [daysData]);

  useEffect(() => {
    const savedDaysData = localStorage.getItem(title);
    if (savedDaysData) {
      setDaysData(JSON.parse(savedDaysData));
    }
    setDataLoaded(true);
  }, [title]);

  useEffect(() => {
    if (isDataLoaded) {
      localStorage.setItem(title, JSON.stringify(daysData));
    }
  }, [daysData, title, isDataLoaded]);
  return (
    <motion.div
      initial={{ maxHeight: isActive ? "1500px" : "4rem" }}
      animate={{ maxHeight: isActive ? "1500px" : "4rem" }}
      exit={{ maxHeight: "4rem" }}
      transition={{ duration: 0.7 }}
      className={`border p-4 my-2 w-full bg-bgsecondary rounded-lg shadow-2xl`}
    >
      {isActive ? (
        <div className="w-full h-fit accordion-inner">
          <div
            className="flex justify-end hover:cursor-pointer "
            onClick={() => setActiveWeek()}
          >
            <ChevronDoubleDownIcon className="h-6 w-6  text-primary" />
          </div>
          <div className="flex flex-col sm:flex-row mb-5">
            <CalendarDaysIcon className="h-6 w-6 text-primary" />
            <DatePicker
              selected={startDate}
              onChange={(date: Date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholderText="Select a date..."
              dateFormat="dd/MM/yyyy"
            />
            <DatePicker
              selected={endDate}
              onChange={(date: Date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              placeholderText="Select a date..."
              dateFormat="dd/MM/yyyy"
            />
          </div>
          {daysData.map((day, index) => (
            <div key={index} className="my-1">
              <hr className="mt-2" />

              <InputFields
                day={day}
                daysData={daysData}
                setDaysData={setDaysData}
                index={index}
                calculateDayHours={calculateDayHours}
              />
            </div>
          ))}

          <div className="text-xl mt-5">
            <hr className="mt-2" />
            You worked{" "}
            <span className="font-bold">{formatHours(weekHours)}</span>
          </div>
          <div className="text-xl">
            <span className="font-bold">{formatHours(remainingHours)}</span>{" "}
            left to reach 38.5 hours
          </div>
          <div className="flex ml-auto gap-2 justify-end">
            <button
              onClick={generateShareableLink}
              className=" bg-primary text-white hover:scale-105"
            >
              Share
            </button>

            <button
              onClick={deleteWeek}
              className="text-red-300 bg-primary  hover:scale-105"
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <div
          className="w-full hover:cursor-pointer"
          onClick={() => setActiveWeek()}
        >
          <div className="flex space-x-1 justify-between font-bold text-primary">
            {title}{" "}
            <span>
              <ChevronDoubleDownIcon className="h-6 w-6 hover:cursor-pointer text-primary" />
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default WeekCard;
