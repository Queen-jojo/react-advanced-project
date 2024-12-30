import React, { useState } from "react";
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
} from "@chakra-ui/react";

const EventForm = ({ categories }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [createdBy, setCreatedBy] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [categoryIds, setCategoryIds] = useState("");
  const [location, setLocation] = useState("Amsterdam");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleSelectionChange = (e) => {
    console.log(e.target.selectedOptions);
    const selectedValues = Array.from(e.target.selectedOptions).map((option) =>
      parseInt(option.value, 10)
    );
    console.log("selectedValues:", selectedValues);
    setCategoryIds(selectedValues);
  };

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

      const response = await fetch(" http://localhost:3000/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          createdBy,
          title,
          description,
          image,
          categoryIds,
          location,
          startTime,
          endTime,
        }),
      });

      // const CategoryInfo = (categories) => {
      //   // return categoryIds;
      // };

      if (response.ok) {
        console.log("Event added successfully");
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

  return (
    <>
      <Button colorScheme="purple" onClick={onOpen}>
        Add an Event
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a New Event</ModalHeader>
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
              <FormLabel>Categories</FormLabel>
              <select multiple onChange={handleSelectionChange}>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
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
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EventForm;
