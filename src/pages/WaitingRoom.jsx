import {
  ActionIcon,
  Avatar,
  Button,
  CopyButton,
  Modal,
  Text,
  Tooltip,
} from "@mantine/core";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom/dist/umd/react-router-dom.development";
import { QuizzContext } from "../context/QuizzContext";
import { IoCopyOutline } from "react-icons/io5";
import Lottie from "react-lottie";
import animationData from "../assets/animation.json";

// Lottie config
const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

function WaitingRoom({ socket }) {
  const navigate = useNavigate();
  const { setRoom } = useContext(QuizzContext);
  const [room, setRoomState] = useState({ participants: [] });
  const [modalOpened, setModalOpened] = useState(true);

  useEffect(() => {
    // Joining waiting room
    socket.emit("joinWaitingRoom", {
      roomId: localStorage.getItem("roomId"),
    });

    // Feedback room
    socket.on("feedbackWaiting", (data) => {
      if (data.roomId === localStorage.getItem("roomId")) {
        setRoom(data.room);
        setRoomState(data.room);
        localStorage.setItem("room", JSON.stringify(data.room));
      }
    });

    // Listening to room updates
    socket.on("updateWaitingRoom", (data) => {
      if (data.roomId === localStorage.getItem("roomId")) {
        setRoom(data.room);
        setRoomState(data.room);
        localStorage.setItem("room", JSON.stringify(data.room));
      }
    });

    // Game Start
    socket.on("gameStart", (data) => {
      if (data.roomId === localStorage.getItem("roomId")) {
        navigate("/quizz");
      }
    });

    return () => {
      socket.off("feedbackWaiting");
      socket.off("updateWaitingRoom");
      socket.off("gameStart");
    };
  }, [socket, setRoom, navigate]);

  // Launch The Game
  const LaunchGame = () => {
    socket.emit("gameStart", {
      roomId: localStorage.getItem("roomId"),
    });
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col items-center justify-center gap-y-4 p-4">
      <div className="flex flex-col items-center">
        <div className="flex flex-row items-center gap-x-3">
          <h1 className="font-semibold tracking-wider">Waiting Room:</h1>
          <CopyButton
            value={`${localStorage.getItem("roomId")}`}
            timeout={2000}
          >
            {({ copied, copy }) => (
              <>
                <h1 className="text-blue-500 font-bold">
                  {localStorage.getItem("roomId")}
                </h1>
                <Tooltip
                  label={copied ? "Copied" : "Copy"}
                  withArrow
                  position="right"
                >
                  <ActionIcon color={copied ? "teal" : "gray"} onClick={copy}>
                    <IoCopyOutline className="cursor-pointer" />
                  </ActionIcon>
                </Tooltip>
              </>
            )}
          </CopyButton>
        </div>
        <p className="text-center mb-3">Share the room ID with your friends</p>
      </div>

      <div className="h-[40rem] w-full max-w-md bg-white drop-shadow-lg shadow-md rounded-lg flex flex-col p-4">
        <h2 className="text-lg font-semibold mb-4">Participants</h2>
        <ul className="flex-1 overflow-y-scroll flex flex-col gap-y-4">
          {room?.participants.map((participant, index) => (
            <li
              key={index.toString()}
              className="h-[4rem] p-2 flex items-center border-b-2"
            >
              <Avatar size={30} />
              <div className="flex-1 flex flex-col ml-4">
                <p className="font-semibold">{participant.name}</p>
              </div>
            </li>
          ))}
        </ul>
        {room && room.adminName === localStorage.getItem("name") && (
          <Button className="bg-blue-500 h-[3rem] mt-4" onClick={LaunchGame}>
            Launch the game
          </Button>
        )}
      </div>

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        size="lg"
        centered
        p={28}
      >
        <Lottie options={defaultOptions} height={200} width={200} />
        <Text mt={10} fw={'bold'} ta={"center"}>The Quizz is being generated by the AI..</Text>
      </Modal>
    </div>
  );
}

export default WaitingRoom;
