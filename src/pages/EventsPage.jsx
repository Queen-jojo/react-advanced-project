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
  useToast,
  Flex,
  SimpleGrid,
} from "@chakra-ui/react";
import { useLoaderData, NavLink } from "react-router-dom";
import EventFormHome from "../components/EventFormHome";
import { useNavigate } from "react-router-dom";
// import events from "./backend_data/events.json";

export const loader = async () => {
  const response = await fetch("http://localhost:3000/events");
  const categories = await fetch("http://localhost:3000/categories");

  return {
    events: await response.json(),
    categories: await categories.json(),
  };
};

export const EventsPage = () => {
  // const [events, setEvents] = useState([]);
  // const { eventId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories] = useState([]);
  const { events, categories } = useLoaderData();
  console.log("events", events);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [eventIdToDelete, setEventIdToDelete] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();

  const handleSelectionChange = (e) => {
    console.log(e.target.selectedOptions);
    const selectedValues = Array.from(e.target.selectedOptions).map((option) =>
      parseInt(option.value, 10)
    );
    console.log("selectedValues:", selectedValues);
    console.log("filteredEvents", filteredEvents);
    // setCategoryIds(selectedValues);
    // selectedCategories.length === 0 ||
    const filterDrop = filteredEvents.filter((dropDown) => {
      // tijdelijk.categoryIds.some
      return dropDown.categoryIds.some((dropList) => {
        return selectedValues.includes(dropList);
      });

      // return matchesSearch && matchesCategories;
    });

    console.log("filterDrop", filterDrop);
    setFilteredEvents(filterDrop);
  };

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
        toast.success("Event deleted succesfully");
      } else {
        console.error("Error deleting event:", response.statusText);
        toast.error("Error deleting event. Please try again");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occured while deleting the event.");
    } finally {
      setIsDeleting(false);
      navigate(0);
    }
  };

  const deleteEvent = (e, eventId) => {
    console.log("eventId", eventId);
    e.preventDefault();
    setIsDeleting(true);
    setEventIdToDelete(eventId);
  };

  const CategoryTitle = (categoryIds) => {
    console.log("categoryIds", categoryIds);
    console.log("categories", categories);
    const nameCategory = categoryIds.map(
      (categoryId) =>
        categories.find((category) => category.id === categoryId).name
    );
    const categoryInformation = nameCategory.join(", ");
    return categoryInformation;
  };

  const uniqueCategories = [
    ...new Set(events.flatMap((event) => event.categoryIds)),
  ];
  console.log("unique", uniqueCategories);

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
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </Box>

      <Box p={4} display="flex" alignItems="left" justifyContent="left">
        <EventFormHome categories={categories} />
      </Box>

      <Box flex="1" p={4}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }}>
          {filteredEvents.map((event) => {
            console.log("event/hello:", event);
            const eventInfo = CategoryTitle(event.categoryIds);
            console.log("eventInfo:", eventInfo);

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
    </Flex>
  );
};
