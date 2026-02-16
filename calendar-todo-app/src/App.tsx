import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  completed: boolean;
}

function App() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [eventTitle, setEventTitle] = useState("");

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("calendarEvents");
    if (saved) setEvents(JSON.parse(saved));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  }, [events]);

  const handleDateClick = (arg: any) => {
    setSelectedDate(arg.dateStr);
  };

  const addEvent = () => {
    if (!eventTitle.trim() || !selectedDate) return;

    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title: eventTitle,
      date: selectedDate,
      completed: false
    };

    setEvents((prev) => [...prev, newEvent]);
    setEventTitle("");
    setSelectedDate(null);
  };

  const toggleComplete = (id: string) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === id
          ? { ...event, completed: !event.completed }
          : event
      )
    );
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  };

  return (
    <div className="calendar-container">
      <h1>📅 Task Calendar</h1>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
        height="80vh"
        events={events}
        eventContent={(eventInfo) => {
          const event = eventInfo.event.extendedProps as any;

          return (
            <div className="custom-event">
              <input
                type="checkbox"
                checked={event.completed}
                onChange={() => toggleComplete(eventInfo.event.id)}
              />

              <span
                className={
                  event.completed ? "completed-text" : ""
                }
              >
                {eventInfo.event.title}
              </span>

              <button
                className="delete-btn"
                onClick={() => deleteEvent(eventInfo.event.id)}
              >
                ❌
              </button>
            </div>
          );
        }}
      />

      {selectedDate && (
        <div className="modal-overlay" onClick={() => setSelectedDate(null)}>
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{selectedDate}</h3>

            <input
              type="text"
              placeholder="Enter task"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              autoFocus
            />

            <div className="modal-buttons">
              <button className="save-btn" onClick={addEvent}>
                Save
              </button>
              <button
                className="cancel-btn"
                onClick={() => setSelectedDate(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
