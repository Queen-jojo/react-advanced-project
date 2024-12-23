import React, { useState, useEffect } from "react";
import {
  Heading,
  Box,
  Text,
  Image,
  Input,
  Select,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { useLoaderData, NavLink } from "react-router-dom";
import EventForm from "../components/EventForm";
import { useNavigate } from "react-router-dom";
// import events from "./backend_data/events.json";

export const loader = async () => {
  const response = await fetch("http://localhost:3000/events");

  return {
    events: await response.json(),
  };
};

export const EventsPage = () => {
  // const [events, setEvents] = useState([]);
  // const { eventId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const { events } = useLoaderData();
  console.log("events", events);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [eventIdToDelete, setEventIdToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const filteredEvents = events.filter((event) => {
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
    setFilteredEvents(filteredEvents);
  }, [events, searchQuery, selectedCategories]);

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/events/${eventIdToDelete}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // navigate("/events");
        // toast.success("Event deleted succesfully");
      } else {
        console.error("Error deleting event:", response.statusText);
        // toast.error("Error deleting event. Please try again");
      }
    } catch (error) {
      console.error("Error:", error);
      // toast.error("An error occured while deleting the event.");
    } finally {
      setIsDeleting(false);
      navigate(0);
    }
  };

  // const confirmDelete = () => {
  //   if (eventIdToDelete) {
  //     filteredEvents.filter((event) => {
  //       if (event.id === eventIdToDelete) {
  //         const newFilteredEvents = filteredEvents.filter(
  //           (event) => event.id !== eventIdToDelete
  //         );
  //         console.log("newFilteredEvents", newFilteredEvents);
  //         setIsDeleting(false);
  //         setFilteredEvents(newFilteredEvents);
  //       }
  //     });
  //   }
  // };

  const deleteEvent = (e, eventId) => {
    console.log("eventId", eventId);
    e.preventDefault();
    setIsDeleting(true);
    setEventIdToDelete(eventId);
  };

  const CategoryTitle = (categoryIds) => {
    console.log("categoryIds", categoryIds);
    return categoryIds;
  };

  const uniqueCategories = [
    ...new Set(events.flatMap((event) => event.categoryIds)),
  ];
  console.log("unique", uniqueCategories);

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
          <NavLink key={event.id} to={`/event/${event.id}`}>
            <Heading as="h3">{event.title}</Heading>
            <Text>{event.description}</Text>
            <Image src={event.image} alt={event.title} />
            <Text>Start Time: {event.startTime}</Text>
            <Text>End Time: {event.endTime}</Text>
            <Text>Categories: {eventInfo}</Text>
            <Button colorScheme="red" onClick={(e) => deleteEvent(e, event.id)}>
              Delete Event
            </Button>
          </NavLink>
        );
      })}
      ;
      <Modal isOpen={isDeleting} onClose={() => setIsDeleting(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm removed Event</ModalHeader>
          <ModalBody>
            Are you sure you want to delete this event? This action cannot be
            undone.
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={confirmDelete}>
              Remove Event
            </Button>
            <Button onClick={() => setIsDeleting(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
