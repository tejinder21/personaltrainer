import { useEffect, useState } from "react";
import {Calendar,dateFnsLocalizer,Views,type View,} from "react-big-calendar";
import {format,parse,startOfWeek,getDay,} from "date-fns";
import { fi } from "date-fns/locale";

import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import { getTrainings, getCustomerName } from "../ptapi";
import type { Training } from "../types";
import type { CalendarEvent } from "../types";



const locales = {
  fi: fi,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});




function TrainingsCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [view, setView] = useState<View>(Views.WEEK); // oletusnäkymä = viikko

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getTrainings();
        const list: Training[] = data._embedded.trainings;

        const result: CalendarEvent[] = [];

        for (const training of list) {
          const start = new Date(training.date);

          // Loppuaika = alku + kesto minuutteina
          const end = new Date(start.getTime() + training.duration * 60000);

          // Haetaan asiakkaan nimi, jotta otsikko on tyyliä "Spinning / Mary Philips"
          let customerName = "";
          const customerUrl = training._links.customer?.href;
          if (customerUrl) {
            customerName = await getCustomerName(customerUrl);
          }

          result.push({
            title: `${training.activity} / ${customerName}`,
            start,
            end,
          });
        }

        setEvents(result);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <Paper sx={{ p: 2, mt: 2, height: "80vh" }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Trainings calendar
      </Typography>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}               
        defaultView={Views.WEEK}                 
        view={view}
        onView={setView}
        views={["month", "week", "day", "agenda"]} 
      />
    </Paper>
  );
}

export default TrainingsCalendar;
