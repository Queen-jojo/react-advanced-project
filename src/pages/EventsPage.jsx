import React, { useState } from "react";
import {
  Heading,
  Box,
  Text,
  Image,
  Link,
  Input,
  Select,
} from "@chakra-ui/react";
import { useLoaderData } from "react-router-dom";
import EventForm from "../components/EventForm";

export const loader = async () => {
  const response = await fetch("http://localhost:3000/events");
  console.log("response", response);
  return {
    events: await response.json(),
  };
};

export const EventsPage = () => {
  // const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  const { events } = useLoaderData();

  // useEffect(() => {
  //   const fetchEvents = async () => {
  //     const response = await fetch("http://localhost:3000/events");
  //     const data = await response.json();
  //     setEvents(data);
  //   };

  //   fetchEvents();
  // }, []);

  const CategoryTitle = (categoryIds) => {
    console.log("categoryIds", categoryIds);
    return categoryIds;
  };

  const uniqueCategories = [
    ...new Set(events.flatMap((event) => event.categories)),
  ];
  console.log("events", events);

  const filteredEvents = events.filter((event) => {
    console.log("event", event);
    const lowerCaseTitle = event.title.toLowerCase();
    const lowerCaseDescription = event.description.toLowerCase();
    const lowerCaseSearchQuery = searchQuery.toLowerCase();

    const matchesSearch =
      lowerCaseTitle.includes(lowerCaseSearchQuery) ||
      lowerCaseDescription.includes(lowerCaseSearchQuery);

    const matchesCategories =
      selectedCategories.length === 0 ||
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
      {/* {filteredEvents.map((event) => (
        <Box key={event.id}>
          <Link to={`/event/${event.id}`}>
            <Heading as="h3">{event.title}</Heading>
            <Text>{event.description}</Text>
            <Image src={event.image} alt={event.title} />
            <Text>Start Time: {event.startTime}</Text>
            <Text>End Time: {event.endTime}</Text>
            <Text>Categories: {event.categories.join(", ")}</Text>
            return
          </Link>
        </Box>
      ))} */}
      {filteredEvents.map((event) => {
        console.log("event/hello:", event);
        const eventInfo = CategoryTitle(event.categoryIds);
        console.log("eventInfo:", eventInfo);

        return (
          <Link key={event.id} to={`/event/${event.id}`}>
            <Heading as="h3">{event.title}</Heading>
            <Text>{event.description}</Text>
            <Image src={event.image} alt={event.title} />
            <Text>Start Time: {event.startTime}</Text>
            <Text>End Time: {event.endTime}</Text>
            <Text>Categories: {eventInfo}</Text>
          </Link>
        );
      })}
      ;
    </Box>
  );
};
