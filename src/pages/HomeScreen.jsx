import React, { useEffect, useRef, useState } from "react";
import CodeImg from "../assets/QuizzImg.png";
import Coding from "../assets/coding.png";
import Math from "../assets/calculator.png";
import Sport from "../assets/sport.png";
import Story from "../assets/napoleon.png";
import Anime from "../assets/otaku.png";
import Mode from "../assets/dress.png";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button, TextInput, LoadingOverlay } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import generateKey from "../utils/generateKey";
import { useNavigate } from "react-router-dom";

export const Types = [
  { id: 1, name: "Programming", img: Coding },
  { id: 2, name: "Mathematics", img: Math },
  { id: 3, name: "Sports", img: Sport },
  { id: 4, name: "Anime", img: Anime },
  { id: 5, name: "History", img: Story },
  { id: 6, name: "Fashion", img: Mode },
];

function HomeScreen({ socket }) {
  const inputRef = useRef(null);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);
  const [nameModalOpened, { open: openNameModal, close: closeNameModal }] =
    useDisclosure(true);

  useEffect(() => {
    openNameModal();
  }, [openNameModal]);

  const handleNameModalClose = () => {
    if (!name) {
      notifications.show({
        title: "Name Input Feedback",
        color: "red",
        message: "Please enter a name",
      });
    } else {
      closeNameModal();
    }
  };

  const handleRoomCreation = (type) => {
    setVisible(true);
    const RoomId = generateKey();
    socket.emit("createRoom", { name, roomId: RoomId, type });
    socket.on("feedbackCreatingRoom", (data) => {
      if (data.status === "success") {
        notifications.show({
          title: "Room Creation Feedback",
          color: "green",
          message: "Your room has been created",
        });
        localStorage.setItem("roomId", RoomId);
        localStorage.setItem("name", name);
        localStorage.setItem("roomType", type);
        navigate("/waiting");
      }
      setVisible(false);
    });
  };

  const handleRoomJoin = () => {
    socket.emit("joinRoom", { roomId: inputRef.current.value, name });
    socket.on("feedbackJoiningRoom", (data) => {
      if (data.status === "success") {
        localStorage.setItem("roomId", inputRef.current.value);
        localStorage.setItem("name", name);
        navigate("/waiting");
      } else {
        notifications.show({
          title: "Room Joining Feedback",
          color: "red",
          message: data.message,
        });
      }
    });
  };

  return (
    <div className="min-h-screen font-[poppins] p-4 flex flex-col lg:grid lg:grid-cols-2 gap-8">
      {/* Name Modal */}
      <Modal
        size="lg"
        title="Enter Your Name"
        opened={nameModalOpened}
        centered
        onClose={closeNameModal}
      >
        <div className="flex flex-col p-4 space-y-4">
          <TextInput
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
          <Button
            className="bg-blue-400 h-10 w-full sm:w-auto"
            onClick={handleNameModalClose}
          >
            Save
          </Button>
        </div>
      </Modal>

      {/* Quiz Category Modal */}
      <Modal
        size="lg"
        opened={opened}
        centered
        onClose={close}
        title="Choose the Quiz Category"
      >
        <LoadingOverlay visible={visible} overlayBlur={2} />
        <div className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Types.map((type) => (
              <div
                key={type.id}
                onClick={() => handleRoomCreation(type.id)}
                className="cursor-pointer rounded-lg hover:bg-blue-300 drop-shadow-md h-32 sm:h-40 flex flex-col items-center justify-center p-2 bg-white transition-all duration-300 transform hover:scale-105"
              >
                <img
                  src={type.img}
                  className="h-16 sm:h-20 mb-2"
                  alt={type.name}
                />
                <p className="text-center font-bold text-sm sm:text-base">
                  {type.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      <div className="flex flex-col justify-center space-y-6 lg:pr-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold">
          Welcome to your{" "}
          <span className="text-blue-500">online Quiz multiplayer game</span>
        </h1>
        <p className="text-gray-500 tracking-tighter text-sm sm:text-base">
          Online Quiz Multiplayer Game is an exciting and interactive game that
          allows players to compete with each other in real-time. The game
          consists of a series of questions that test the players' knowledge in
          various categories such as history, science, pop culture, and more.
          Each player has a limited amount of time to answer each question,
          adding a sense of urgency to the game. The game is designed to be
          played with multiple players, allowing friends and strangers from all
          around the world to compete against each other. The leaderboard keeps
          track of each player's score, creating a competitive and engaging
          environment. The game is accessible through any device with an
          internet connection, making it easy for anyone to participate. The
          questions are randomly generated, ensuring that the game is always
          fresh and exciting. The game can be played for fun or with real
          prizes, adding another level of excitement for players. Overall,
          Online Quiz Multiplayer Game is an entertaining and educational
          experience that combines competition and knowledge in a fun and
          engaging way.
        </p>
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button className="bg-blue-500 h-12 w-full sm:w-auto" onClick={open}>
            Create a session
          </Button>
          <h1 className="text-center sm:text-left">Or</h1>
          <div className="flex flex-col sm:flex-row items-center w-full sm:w-auto space-y-4 sm:space-y-0 sm:space-x-4">
            <input
              ref={inputRef}
              className="border-b-2 border-green-400 bg-gray-50 outline-none px-2 h-12 w-full sm:w-48"
              placeholder="Room ID"
            />
            <Button
              className="bg-blue-500 h-12 w-full sm:w-auto"
              onClick={handleRoomJoin}
            >
              Join a session
            </Button>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center mt-8 lg:mt-0">
        <img
          src={CodeImg}
          className="max-w-full h-auto"
          alt="Quiz illustration"
        />
      </div>
    </div>
  );
}

export default HomeScreen;
