import React, { useState, useEffect } from "react";
import {
  Heading,
  Box,
  Text,
  Image,
  Link,
  Input,
  Select,
} from "@chakra-ui/react";
import EventForm from "./EventForm";

export const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await fetch("http://localhost:3000/events");
      const data = await response.json();
      setEvents(data);
    };

    fetchEvents();
  }, []);

  const uniqueCategories = [
    ...new Set(events.flatMap((event) => event.categories)),
  ];

  const filteredEvents = events.filter((event) => {
    const lowerCaseTitle = event.title.toLowerCase();
    const lowerCaseDescription = event.description.toLowerCase();
    const lowerCaseSearchQuery = searchQuery.toLowerCase();

    const matchesSearch =
      lowerCaseTitle.includes(lowerCaseSearchQuery) ||
      lowerCaseDescription.includes(lowerCaseSearchQuery);

    const matchesCategories =
      selectedCategories.lenght === 0 ||
      event.categories.some((category) =>
        selectedCategories.includes(category)
      );

    return matchesSearch && matchesCategories;
  });

  return (
    <Box>
      <Heading>Event List</Heading>;
      <Input
        placeholder="Search Events"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Select
        multiplevalue={selectedCategories}
        onChange={(selectedOptions) => setSelectedCategories(selectedOptions)}
        options={uniqueCategories.map((category) => ({
          value: category,
          label: category,
        }))}
        placeholder="Filtered by Category"
      />
      <EventForm />
      {filteredEvents.map((event) => (
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
