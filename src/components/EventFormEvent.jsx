import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  Box,
} from "@chakra-ui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EventFormEvent = ({ setValidEvent }) => {
  const { eventId } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isDeleting, setIsDeleting] = useState(false);
  const [event, setEvent] = useState(null);
  const [createdBy, setCreatedBy] = useState();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [categoryIds, setCategoryIds] = useState("");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const navigate = useNavigate();

  const fetchEvent = async () => {
    try {
      const response = await fetch(`http://localhost:3000/events/${eventId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch event");
      }
      const data = await response.json();
      setEvent(data);
    } catch (error) {
      console.error("Error fetching:", error);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  useEffect(() => {
    if (event) {
      setCreatedBy(event.createdBy);
      setTitle(event.title);
      setDescription(event.description);
      setImage(event.image);
      setCategoryIds(event.categoryIds);
      setLocation(event.location);
      setStartTime(event.startTime);
      setEndTime(event.endTime);
    }
  }, [event]);

  const handleSubmit = async () => {
    try {
      console.log("createdBy", createdBy);
      console.log("title", title);
      console.log("description", description);
      console.log("image", image);
      console.log("categoryIds", categoryIds);
      console.log("location", location);
      console.log("startTime", startTime);
      console.log("endTime", endTime);

      const dataEvent = {
        createdBy,
        title,
        description,
        image,
        categoryIds,
        location,
        startTime,
        endTime,
      };

      setValidEvent(dataEvent);

      const response = await fetch(`http://localhost:3000/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataEvent),
      });
      console.log("response", response);

      if (response.ok) {
        toast.success("Event changed succesfully", {
          position: "top-right",
        });
        console.log("Event edit successfully");
        onClose();
      } else {
        console.error("Error adding event:", await response.text());
        // Handle error, display error message to user
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle error, display error message to user
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
      } else {
        console.error("Error deleting event:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Box p={2} display="flex" alignItems="center" justifyContent="center">
        <Button colorScheme="blue" onClick={onOpen}>
          Edit Event
        </Button>
        <Button colorScheme="red" onClick={handleDelete}>
          Delete Event
        </Button>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Created By</FormLabel>
              <Input
                value={createdBy}
                onChange={(e) => setCreatedBy(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Image</FormLabel>
              <Input value={image} onChange={(e) => setImage(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>Location</FormLabel>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Start Time</FormLabel>
              <Input
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>End Time</FormLabel>
              <Input
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Save
            </Button>
            <Button colorScheme="red" mr={3} onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
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
      <ToastContainer />
    </>
  );
};

export default EventFormEvent;
