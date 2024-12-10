import React, { useState, useEffect } from "react";
import { Heading, Box, Text } from "@chakra-ui/react";

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
      {events.map((event) => (
        <Box key={event.id}>
          <Heading>{event.title}</Heading>
          <Text>{event.description}</Text>
        </Box>
      ))}
    </Box>
  );
};
