import React from "react";
import EventFormEvent from "../components/EventFormEvent";
import { useLoaderData } from "react-router-dom";
import { Box, Heading, Text, Image, Flex, SimpleGrid } from "@chakra-ui/react";
// import { ToastContainer, useToast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const loader = async ({ params }) => {
  console.log("params", params.eventId);
  const response = await fetch(
    `http://localhost:3000/events/${params.eventId}`
  );
  const categories = await fetch("http://localhost:3000/categories");

  return {
    event: await response.json(),
    categories: await categories.json(),
  };
};

export const EventPage = () => {
  const { event, categories } = useLoaderData();
  console.log("event", event);

  // const CategoryTitle = (categoryIds) => {
  //   console.log("categoryIds", categoryIds);
  //   return categoryIds;
  // };

  // useEffect(() => {
  //   const fetchEvent = async () => {
  //     const response = await fetch(`http://localhost:3000/events/${eventId}`);
  //     console.log("responseId", eventId);
  //     const data = await response.json();
  //     setEvent(data);
  //   };

  //   fetchEvent();
  // }, [eventId]);

  if (!event) {
    return <Box>Loading...</Box>;
  }

  // const CategoryTitle = (categoryIds) => {
  //   console.log("categoryIds", categoryIds);
  //   return categoryIds;
  // };

  // const eventInfo = CategoryTitle(event.categoryIds);
  // console.log("eventInfo:", eventInfo);

  // const eventInfo = CategoryTitle(event.categoryIds);
  // console.log("eventInfo:", eventInfo);

  // console.log("event.creator", event.creator);

  const CategoryTitle = (categoryIds) => {
    console.log("categoryIds", categoryIds);
    console.log("categories", categories);
    const CategoryName = categoryIds.map(
      (categoryId) =>
        categories.find((category) => category.id === categoryId).name
    );
    console.log("appel", CategoryName);
    const CategoryInfo = CategoryName.join(", ");
    return CategoryInfo;
  };

  const eventInfo = CategoryTitle(event.categoryIds);
  console.log("eventInfo:", eventInfo);

  const uniqueCategories = [
    // ...new Set(event.flatMap((event) => event.categoryIds)),
  ];
  console.log("unique", uniqueCategories);

  return (
    <Flex direction="column" bgColor="pink.100" minH="100vh" overflowY="auto">
      <Box p={4} display="flex" alignItems="center" justifyContent="center">
        <SimpleGrid>
          <Box p={2} display="flex" alignItems="center" justifyContent="center">
            <Heading as="h3">{event.title}</Heading>
          </Box>
          <Box p={2} display="flex" alignItems="center" justifyContent="center">
            <Text>{event.description}</Text>
          </Box>
          <Box p={2} display="flex" alignItems="center" justifyContent="center">
            <Image
              src={event.image}
              alt={event.title}
              borderRadius="md"
              mb={4}
              width="700px"
              height="550px"
            />
          </Box>
          <Box p={2} display="flex" alignItems="center" justifyContent="center">
            <Text>Created By: {event.createdBy}</Text>
          </Box>
          <Box p={2} display="flex" alignItems="center" justifyContent="center">
            <Text>Location: {event.location}</Text>
          </Box>

          <Box p={2} display="flex" alignItems="center" justifyContent="center">
            <Text>Start Time: {event.startTime}</Text>
          </Box>
          <Box p={2} display="flex" alignItems="center" justifyContent="center">
            <Text>End Time: {event.endTime}</Text>
          </Box>
          <Box p={2} display="flex" alignItems="center" justifyContent="center">
            <Text>Categories: {eventInfo}</Text>
          </Box>

          <Box p={4} display="flex" alignItems="center" justifyContent="center">
            <EventFormEvent />
          </Box>
        </SimpleGrid>
      </Box>
    </Flex>
  );
};
