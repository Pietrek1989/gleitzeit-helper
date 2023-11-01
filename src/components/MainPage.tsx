import React, { useState, useEffect } from "react";
import { PlusCircleIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Week } from "../interfaces";
import WeekCard from "./WeekCard";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";
import Modal from "react-modal";

const MainPage: React.FC = () => {
  const [allWeeks, setAllWeeks] = useState<Week[]>([]);
  const [activeWeeks, setActiveWeeks] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [isDataLoaded, setDataLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleActiveWeek = (id: number) => {
    setActiveWeeks((prevActiveWeeks) => ({
      ...prevActiveWeeks,
      [id]: !prevActiveWeeks[id],
    }));
  };

  const generateWeekTitle = (offset: number = 0) => {
    const today = new Date();
    const currentDay = today.getDay();
    const daysUntilMonday = currentDay === 0 ? -6 : 1 - currentDay;
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + daysUntilMonday + 7 * offset);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 4); // End on Friday

    const formatDate = (date: Date) => {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  const addWeek = () => {
    let offset = 0; // Default offset for the first week

    if (allWeeks.length > 0) {
      // Fetch the last (furthest in the future) week
      const lastWeek = allWeeks[allWeeks.length - 1];
      const lastWeekEnd = lastWeek.weekTitle?.split(" - ")[1];
      const [day, month, year] = lastWeekEnd?.split("/").map(Number) || [];

      // Calculate the end date of the last week
      const lastWeekEndDate = new Date(year || 0, (month || 1) - 1, day || 0);

      // Calculate the date for the next Monday after the last week
      const nextMondayDate = new Date(lastWeekEndDate);
      nextMondayDate.setDate(lastWeekEndDate.getDate() + 3); // +3 to get to the next Monday

      // Calculate the offset based on the next Monday
      const today = new Date();
      offset = Math.ceil(
        (nextMondayDate.getTime() - today.getTime()) / (7 * 24 * 60 * 60 * 1000)
      );
    }

    // Generate the new week title
    const newWeekTitle = generateWeekTitle(offset);

    // Add the new week to the existing weeks
    setAllWeeks([
      ...allWeeks,
      { weekTitle: newWeekTitle, id: new Date().getTime() },
    ]);

    // Show a toast notification
    toast.success("Week added");
  };

  const deleteWeek = (id: number) => {
    const filteredWeeks = allWeeks.filter((week) => week.id !== id);
    setAllWeeks(filteredWeeks);
    toast.error("Week has been deleted");
  };

  const clearAllWeeks = () => {
    setIsModalOpen(true);
  };

  const confirmClearAllWeeks = () => {
    localStorage.removeItem("allWeeks"); // Clear 'allWeeks' from local storage
    allWeeks.forEach((week) => {
      if (week.weekTitle) {
        localStorage.removeItem(week.weekTitle);
      }
    });
    setAllWeeks([]); // Reset state
    toast.error("All weeks have been cleared");
    setIsModalOpen(false);
  };

  useEffect(() => {
    // Load weeks from local storage

    const savedWeeks = localStorage.getItem("allWeeks");
    if (savedWeeks) {
      setAllWeeks(JSON.parse(savedWeeks));
    }
    setDataLoaded(true);
  }, []);

  useEffect(() => {
    // Save weeks to local storage whenever it changes
    if (isDataLoaded) {
      localStorage.setItem("allWeeks", JSON.stringify(allWeeks));
    }
  }, [allWeeks, isDataLoaded]);

  return (
    <section>
      <Toaster richColors closeButton />
      <img
        src="/gleitzeit-helper-high-resolution-logo-transparent.png"
        alt="logo of gleitzeit helper"
        className="w-40 mt-2 ml-3"
      />
      <div className="flex  items-center  flex-wrap  justify-center">
        <div className="w-full mx-10">
          <PlusCircleIcon
            className="h-14 w-14 m-auto flex w-full text-primary cursor-pointer ml-5"
            onClick={addWeek}
          />
          <AnimatePresence>
            {[...allWeeks].reverse().map((week: Week) => (
              <motion.div
                key={week.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
              >
                <WeekCard
                  title={week.weekTitle || "Default Title"}
                  isActive={activeWeeks[week.id]}
                  setActiveWeek={() => toggleActiveWeek(week.id)}
                  deleteWeek={() => deleteWeek(week.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      {/* <button
 
        >
        </button> */}

      <div className="group justify-center">
        <button
          onClick={clearAllWeeks}
          className="text-red-500 hover:text-red-700 fixed bottom-2 right-7 clear-data-button w-4 flex justify-center "
        >
          {" "}
          <span>
            <TrashIcon className="w-5 h-5" />
          </span>
        </button>
        <span className="absolute bottom-14 right-1 scale-0 rounded bg-gray-800 p-3 text-xs text-white group-hover:scale-100">
          Clear all data?
        </span>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Confirmation Modal"
        className="bg-white rounded p-4 fixed top-1/2 "
      >
        <h1 className="text-xl mb-4">
          Are you sure you want to clear all data?
        </h1>
        <button
          onClick={confirmClearAllWeeks}
          className="bg-red-500 text-white px-4 py-1 rounded mr-2"
        >
          Yes
        </button>
        <button
          onClick={() => setIsModalOpen(false)}
          className="bg-gray-300 text-black px-4 py-1 rounded ml-2"
        >
          No
        </button>
      </Modal>
    </section>
  );
};

export default MainPage;
