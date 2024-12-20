import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Image,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
// import { ToastContainer, useToast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const EventPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  // const [creator, setCreator] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  // const toast = useToast();
  const navigate = useNavigate();

  // const CategoryTitle = (categoryIds) => {
  //   console.log("categoryIds", categoryIds);
  //   return categoryIds;
  // };

  useEffect(() => {
    const fetchEvent = async () => {
      const response = await fetch(`http://localhost:3000/events/${eventId}`);
      console.log("responseId", eventId);
      const data = await response.json();
      setEvent(data);
    };

    fetchEvent();
  }, [eventId]);

  // useEffect(() => {
  //   const fetchCreator = async () => {
  //     const response = await fetch(
  //       `http://localhost:3000/users/${event.createdBy}`
  //     );
  //     const data = await response.json();
  //     setCreator(data);
  //   };

  //   if (event || event.createdBy) {
  //     console.log("eventRegel49:", event);
  //     fetchCreator();
  //   }
  // }, [event]);

  if (!event) {
    return <Box>Loading...</Box>;
  }

  // const CategoryTitle = (categoryIds) => {
  //   console.log("categoryIds", categoryIds);
  //   return categoryIds;
  // };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();

    const updatedEventData = {
      title: e.target.title.value,
      description: e.target.description.value,
      categories: e.target.categories.value,
    };

    const response = await fetch(`http://localhost:3000/events/${eventId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedEventData),
    });
    if (response.ok) {
      const updatedEvent = await response.json();
      setEvent(updatedEvent);
      setIsEditing(false);
      // toast.success("Event updated succesfully!");
    } else {
      console.error("Error updating event:", response.statusText);
      // toast.error("Error updating event. Please try again.");
    }
  };

  const handleDelete = () => {
    setIsDeleting(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/events/${eventId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        navigate("/");
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
    }
  };

  // const eventInfo = CategoryTitle(event.categoryIds);
  // console.log("eventInfo:", eventInfo);

  // const eventInfo = CategoryTitle(event.categoryIds);
  // console.log("eventInfo:", eventInfo);

  // console.log("event.creator", event.creator);

  return (
    <Box>
      <Heading>{event.title}</Heading>
      <Image src={event.image} alt={event.title} />
      <Text>{event.description}</Text>
      <Text>Start Time: {event.startTime}</Text>
      <Text>End Time: {event.endTime}</Text>
      <Text>Categories: {event.categoryIds}</Text>
      {/* <Text>creator: {creator.name}</Text> */}
      {/* <Text>Created by: {event.creator.name}</Text> */}
      {/* <Image src={event.image} alt={event.name} /> */}
      <Button onClick={handleEdit}>Edit</Button>
      <Button colorScheme="red" onClick={handleDelete}>
        Delete
      </Button>

      {isEditing && (
        <Modal isOpen={isEditing} onClose={() => setIsEditing(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Event</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <form onSubmit={handleSaveEdit}>
                <FormControl>
                  <FormLabel htmlFor="title">Title</FormLabel>
                  <Input id="title" name="title" defaultValue={event.title} />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel htmlFor="description">Description</FormLabel>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={event.description}
                  />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel htmlFor="categories">Categories</FormLabel>
                  <Textarea
                    id="categories"
                    name="categories"
                    defaultValue={event.categories}
                  />
                </FormControl>
              </form>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} type="submit">
                Save
              </Button>
              <Button onClick={() => setIsEditing(false)}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {isDeleting && (
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
      )}
      {/* <ToastContainer /> */}
    </Box>
  );
};
