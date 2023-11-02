import React from "react";
import { Day } from "../interfaces";

type Props = {
  day: Day;
  daysData: Day[];
  setDaysData: React.Dispatch<React.SetStateAction<Day[]>>;
  calculateDayHours: (index: number) => string;
  index: number;
};
const InputFields: React.FC<Props> = ({
  day,
  daysData,
  setDaysData,
  index,
  calculateDayHours,
}) => {
  const autoFillTime = () => {
    const updatedData = [...daysData];
    updatedData[index].start = "08:00";
    updatedData[index].end = "17:00";
    setDaysData(updatedData);
  };
  return (
    <>
      <div className="flex space-x-1 justify-around md:justify-between items-center ">
        <div>
          <h3 className="font-bold text-primary w-10">{day.day} </h3>
        </div>
        <div className="flex flex-col md:flex-row">
          <span className="font-bold mr-1">Start:</span>
          <input
            type="time"
            value={day.start}
            onChange={(e) => {
              const updatedData = [...daysData];
              updatedData[index].start = e.target.value;
              setDaysData(updatedData);
            }}
            className="mr-2"
          />
          <span className="font-bold mr-1">End:</span>
          <input
            type="time"
            value={day.end}
            onChange={(e) => {
              const updatedData = [...daysData];
              updatedData[index].end = e.target.value;
              setDaysData(updatedData);
            }}
            className="mr-2"
          />
          <span className="font-bold">Lunch:</span>
          <select
            onChange={(e) => {
              const updatedData = [...daysData];
              updatedData[index].breakTime = e.target.value;
              setDaysData(updatedData);
            }}
            value={day.breakTime}
          >
            <option value="30">30m</option>
            <option value="45">45m</option>
            <option value="60">60m</option>
            <option value="0">0m</option>
          </select>
          <span>
            <span className="font-bold">Hours:</span>
            {` ${Math.floor(parseFloat(calculateDayHours(index)))
              .toString()
              .padStart(2, "0")} H ${Math.round(
              (parseFloat(calculateDayHours(index)) % 1) * 60
            )
              .toString()
              .padStart(2, "0")} m`}
          </span>
          <span className="relative group">
            {" "}
            <button
              onClick={autoFillTime}
              className="ml-2 p-1 bg-primary text-white"
            >
              Fill
            </button>
            <span className="absolute scale-0 right-1 text-base -top-20 w-24 text-center rounded  bg-gray-800 p-3  text-white group-hover:scale-100">
              Autofill 8 hours
            </span>
          </span>
        </div>
      </div>
    </>
  );
};

export default InputFields;
