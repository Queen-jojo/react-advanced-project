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
  Flex,
  SimpleGrid,
} from "@chakra-ui/react";
import { useLoaderData, NavLink } from "react-router-dom";
import EventFormHome from "../components/EventFormHome";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const loader = async () => {
  const response = await fetch("http://localhost:3000/events");
  const categories = await fetch("http://localhost:3000/categories");

  return {
    events: await response.json(),
    categories: await categories.json(),
  };
};

export const EventsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories] = useState([]);
  const { events, categories } = useLoaderData();
  const [isDeleting, setIsDeleting] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [eventIdToDelete, setEventIdToDelete] = useState(null);
  const [validEvents, setValidEvents] = useState(events);

  const handleSelectionChange = (e) => {
    if (e.target.value === "") {
      setFilteredEvents(events);
      return;
    }
    const selectedValues = Array.from(e.target.selectedOptions).map((option) =>
      parseInt(option.value, 10)
    );
    const filterDrop = events.filter((event) => {
      return event.categoryIds.some((categoryId) => {
        return selectedValues.includes(categoryId);
      });
    });

    setFilteredEvents(filterDrop);
  };

  useEffect(() => {
    const _filteredEvents = validEvents.filter((event) => {
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
    setFilteredEvents(_filteredEvents);
  }, [validEvents, searchQuery, selectedCategories]);

  const confirmDelete = async () => {
    console.log("eventIdToDelete", eventIdToDelete);
    try {
      const response = await fetch(
        `http://localhost:3000/events/${eventIdToDelete}`,
        {
          method: "DELETE",
        }
      );

      /* Modify the list of events being used in the useState
       This is the list of events used in line 164:

       {filteredEvents.map((event) => {

        Because at the beginning of the page load, we call the line below in line 66

        const filteredEvents = validEvents.filter((event) => {

       */
      setValidEvents(validEvents.filter((item) => item.id !== eventIdToDelete));

      if (response.ok) {
        toast.success("Event deleted succesfully", {
          position: "top-right",
        });
      } else {
        console.error("Error deleting event:", response.statusText);
        toast.error("Error deleting event. Please try again");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occured while deleting the event.");
    } finally {
      setIsDeleting(false);
    }
  };

  const deleteEvent = async (e, eventId) => {
    e.preventDefault();
    setIsDeleting(true);
    setEventIdToDelete(eventId);
  };

  const CategoryTitle = (categoryIds) => {
    console.log("categoryIds", categoryIds);
    const nameCategory = categoryIds.map(
      (categoryId) =>
        categories.find((category) => parseInt(category.id) === categoryId).name
    );
    const categoryInformation = nameCategory.join(", ");
    return categoryInformation;
  };

  return (
    <Flex direction="column" bgColor="pink.100" minH="100vh" overflowY="auto">
      <Box p={4} display="flex" alignItems="center" justifyContent="center">
        <Text fontSize="2xl" fontWeight="bold" mb={6}>
          Event List
        </Text>
      </Box>
      <Box p={4} display="flex" alignItems="center" justifyContent="center">
        <Input
          placeholder="Search Events"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>
      <Box p={4} display="flex" alignItems="center" justifyContent="center">
        <Select onChange={handleSelectionChange}>
          <option key="" value="">
            Categories
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </Box>

      <Box p={4} display="flex" alignItems="left" justifyContent="left">
        <EventFormHome
          categories={categories}
          validEvents={validEvents}
          setValidEvents={setValidEvents}
        />
      </Box>

      <Box flex="1" p={4}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }}>
          {filteredEvents.map((event) => {
            const eventInfo = CategoryTitle(event.categoryIds);

            return (
              <NavLink key={event.id} to={`/event/${event.id}`}>
                <Box
                  p={2}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Heading as="h3">{event.title}</Heading>
                </Box>
                <Box
                  p={2}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text>{event.description}</Text>
                </Box>

                <Box
                  p={2}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Image
                    src={event.image}
                    alt={event.title}
                    borderRadius="md"
                    mb={4}
                    width="200px"
                    height="150px"
                  />
                </Box>
                <Box
                  p={2}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text>Created By: {event.createdBy}</Text>
                </Box>

                <Box
                  p={2}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text>Location: {event.location}</Text>
                </Box>

                <Box
                  p={2}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text>Start Time: {event.startTime}</Text>
                </Box>
                <Box
                  p={2}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text>End Time: {event.endTime}</Text>
                </Box>
                <Box
                  p={2}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text>Categories: {eventInfo}</Text>
                </Box>
                <Box
                  p={2}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Button
                    colorScheme="red"
                    onClick={(e) => deleteEvent(e, event.id)}
                  >
                    Delete Event
                  </Button>
                </Box>
              </NavLink>
            );
          })}

          <Modal isOpen={isDeleting} onClose={() => setIsDeleting(false)}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Confirm removed Event</ModalHeader>
              <ModalBody>
                Are you sure you want to delete this event? This action cannot
                be undone.
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="red" mr={3} onClick={confirmDelete}>
                  Remove Event
                </Button>
                <Button onClick={() => setIsDeleting(false)}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </SimpleGrid>
      </Box>
      <ToastContainer />
    </Flex>
  );
};
