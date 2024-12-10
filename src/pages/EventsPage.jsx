import React, { useState, useEffect } from "react";
import { Heading, Box, Text, Image, Link } from "@chakra-ui/react";
import EventForm from "./EventForm";

export const EventsPage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await fetch("http://localhost:3000/events");
      const data = await response.json();
      setEvents(data);
    };

    fetchEvents();
  }, []);

  return (
    <Box>
      <Heading>Event List</Heading>;
      <EventForm />
      {events.map((event) => (
        <Box key={event.id}>
          <Link to={`/event/${event.id}`}>
            <Heading as="h3">{event.title}</Heading>
            <Text>{event.description}</Text>
            <Image src={event.image} alt={event.title} />
            <Text>Start Time: {event.startTime}</Text>
            <Text>End Time: {event.endTime}</Text>
            <Text>Categories: {event.categories.join(", ")}</Text>
          </Link>
        </Box>
      ))}
    </Box>
  );
};
