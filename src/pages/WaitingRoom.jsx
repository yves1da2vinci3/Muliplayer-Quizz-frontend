import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ActionIcon,
  Avatar,
  Button,
  CopyButton,
  Drawer,
  Group,
  Modal,
  Select,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { IoCopyOutline } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import { HiOutlineSaveAs } from "react-icons/hi";
import Lottie from "react-lottie";
import { notifications } from "@mantine/notifications";
import animationData from "../assets/animation.json";
import { Types } from "./HomeScreen";

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
  const [room, setRoom] = useState({ participants: [] });
  const [modalOpened, setModalOpened] = useState(false);
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [questionsNumber, setQuestionsNumber] = useState(5);
  const [roomType, setRoomType] = useState(
    +localStorage.getItem("roomType") || 1
  );

  const updateRoom = useCallback((data) => {
    if (data.roomId === localStorage.getItem("roomId")) {
      setRoom(data.room);
      localStorage.setItem("room", JSON.stringify(data.room));
    }
  }, []);

  useEffect(() => {
    const roomId = localStorage.getItem("roomId");

    socket.emit("joinWaitingRoom", { roomId });

    const eventHandlers = {
      feedbackWaiting: updateRoom,
      updateWaitingRoom: updateRoom,
      gameStart: (data) => {
        if (data.roomId === roomId) {
          setModalOpened(false);
          navigate("/quizz");
        }
      },
      gameStarting: (data) => {
        if (data.roomId === roomId) {
          setModalOpened(true);
        }
      },
      disconnect: () => navigate("/"),
      error: (error) => console.error("Error:", error),
    };

    Object.entries(eventHandlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    return () => {
      Object.keys(eventHandlers).forEach((event) => {
        socket.off(event);
      });
    };
  }, [socket, navigate, updateRoom]);

  const launchGame = () => {
    setModalOpened(true);
    socket.emit("gameStart", {
      roomId: localStorage.getItem("roomId"),
    });
  };

  const modifyRoomSettings = () => {
    socket.emit("updateRoomSettings", {
      roomId: localStorage.getItem("roomId"),
      questionsNumber,
      roomType,
    });

    socket.once("updateRoomSettings", (data) => {
      if (
        data.roomId === localStorage.getItem("roomId") &&
        room.adminName === localStorage.getItem("name")
      ) {
        notifications.show({
          title: "Room settings Feedback",
          color: "green",
          message: "Your room settings have been updated",
        });
      }
    });

    setDrawerOpened(false);
  };

  const isAdmin = room.adminName === localStorage.getItem("name");

  return (
    <div className="h-screen bg-slate-50 flex flex-col items-center justify-center gap-y-4 p-4">
      <div className="flex flex-row w-full justify-between items-center gap-x-3">
        <div />
        <RoomInfo roomId={localStorage.getItem("roomId")} />
        {isAdmin ? (
          <Tooltip label="Room settings" withArrow position="right">
            <ActionIcon onClick={() => setDrawerOpened(true)}>
              <IoMdSettings size={40} className="cursor-pointer" />
            </ActionIcon>
          </Tooltip>
        ) : (
          <div />
        )}
      </div>

      <ParticipantList participants={room.participants} />

      {isAdmin && (
        <Button className="bg-blue-500 h-[3rem] mt-4" onClick={launchGame}>
          Launch the game
        </Button>
      )}

      <LoadingModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
      />

      <SettingsDrawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        roomType={roomType}
        setRoomType={setRoomType}
        questionsNumber={questionsNumber}
        setQuestionsNumber={setQuestionsNumber}
        onSave={modifyRoomSettings}
      />
    </div>
  );
}

function RoomInfo({ roomId }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row items-center gap-x-3">
        <h1 className="font-semibold tracking-wider">Waiting Room:</h1>
        <CopyButton value={roomId} timeout={2000}>
          {({ copied, copy }) => (
            <div className="flex-row flex items-center">
              <h1 className="text-blue-500 font-bold">{roomId}</h1>
              <Tooltip
                label={copied ? "Copied" : "Copy"}
                withArrow
                position="right"
              >
                <ActionIcon color={copied ? "teal" : "gray"} onClick={copy}>
                  <IoCopyOutline className="cursor-pointer" />
                </ActionIcon>
              </Tooltip>
            </div>
          )}
        </CopyButton>
      </div>
      <p className="text-center mb-3">Share the room ID with your friends</p>
    </div>
  );
}

function ParticipantList({ participants }) {
  return (
    <div className="h-[40rem] w-full max-w-md bg-white drop-shadow-lg shadow-md rounded-lg flex flex-col p-4">
      <h2 className="text-lg font-semibold mb-4">Participants</h2>
      <ul className="flex-1 overflow-y-auto flex flex-col gap-y-4">
        {participants.map((participant, index) => (
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
    </div>
  );
}

function LoadingModal({ opened, onClose }) {
  return (
    <Modal opened={opened} onClose={onClose} size="lg" centered p={28}>
      <Lottie options={defaultOptions} height={200} width={200} />
      <Text mt={10} fw="bold" ta="center">
        The Quiz is being generated by the AI...
      </Text>
    </Modal>
  );
}

function SettingsDrawer({
  opened,
  onClose,
  roomType,
  setRoomType,
  questionsNumber,
  setQuestionsNumber,
  onSave,
}) {
  return (
    <Drawer
      position="right"
      opened={opened}
      onClose={onClose}
      title="Room Settings"
    >
      <Select
        label="Select the Quiz Category"
        placeholder={`Current category: ${Types[roomType - 1]?.name}`}
        onChange={(value) => setRoomType(+value)}
        data={Types.map((type) => ({ value: type.id, label: type.name }))}
      />
      <TextInput
        type="number"
        label="Enter the number of questions"
        value={questionsNumber}
        onChange={(event) => setQuestionsNumber(event.currentTarget.value)}
        placeholder="Default is 5"
      />
      <Button
        onClick={onSave}
        className="bg-blue-500"
        fullWidth
        leftIcon={<HiOutlineSaveAs />}
        mt={20}
      >
        Update
      </Button>
    </Drawer>
  );
}

export default WaitingRoom;
