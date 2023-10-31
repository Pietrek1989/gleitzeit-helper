// MainPage.tsx
import React, { useState, useEffect } from "react";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { Week } from "../interfaces";
import WeekCard from "./WeekCard";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";

const MainPage: React.FC = () => {
  const [allWeeks, setAllWeeks] = useState<Week[]>([]);
  const [activeWeeks, setActiveWeeks] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [isDataLoaded, setDataLoaded] = useState(false);

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
    const offset = allWeeks.length;
    const newWeekTitle = generateWeekTitle(offset);

    setAllWeeks([
      ...allWeeks,
      { weekTitle: newWeekTitle, id: new Date().getTime() },
    ]);
    toast.success("Week added");
  };

  const deleteWeek = (id: number) => {
    const filteredWeeks = allWeeks.filter((week) => week.id !== id);
    setAllWeeks(filteredWeeks);
    toast.error("Week has been deleted");
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
                  title={week.weekTitle}
                  isActive={activeWeeks[week.id]}
                  setActiveWeek={() => toggleActiveWeek(week.id)}
                  deleteWeek={() => deleteWeek(week.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default MainPage;
