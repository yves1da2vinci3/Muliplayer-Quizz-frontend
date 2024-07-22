import { useContext, useEffect, useRef, useState } from "react";
import { Avatar, Badge, Button, Text } from "@mantine/core";
import Timer from "../assets/chronometer.png";
import { useNavigate } from "react-router-dom";
import { QuizzContext } from "../context/QuizzContext";

function QuizzRoom({ socket }) {
  const [userAnswer, setUserAnswer] = useState(null);
  const [usersAnswered, setUsersAnswered] = useState([]);
  const navigate = useNavigate();
  const [question, setQuestion] = useState({ options: [] });
  const [timer, setTimer] = useState(20);
  const room = JSON.parse(localStorage.getItem("room"));
  const timerIntervalRef = useRef(null);

  const handleAnswerSelection = (answer) => {
    setUserAnswer(answer);
    socket.emit("userAnswer", {
      roomId: localStorage.getItem("roomId"),
      answer: answer,
      name: localStorage.getItem("name"),
    });
  };

  useEffect(() => {
    const handleNextQuestion = (data) => {
      if (data.roomId === localStorage.getItem("roomId")) {
        clearInterval(timerIntervalRef.current);
        setQuestion(data.question);
        setUsersAnswered([]);
        setUserAnswer(null);
        setTimer(20);
        startTimer();
      }
    };

    const handleUserAnswered = (data) => {
      if (data.roomId === localStorage.getItem("roomId")) {
        setUsersAnswered((prevUsers) => [...prevUsers, data.name]);
      }
    };

    const handleGameEnd = (data) => {
      if (data.roomId === localStorage.getItem("roomId")) {
        navigate("/ranking");
      }
    };

    socket.on("nextQuestion", handleNextQuestion);
    socket.on("userAnswered", handleUserAnswered);
    socket.on("gameEnd", handleGameEnd);

    return () => {
      clearInterval(timerIntervalRef.current);
      socket.off("nextQuestion", handleNextQuestion);
      socket.off("userAnswered", handleUserAnswered);
      socket.off("gameEnd", handleGameEnd);
    };
  }, [socket, navigate]);

  const startTimer = () => {
    timerIntervalRef.current = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);
  };

  useEffect(() => {
    if (timer <= 0) {
      clearInterval(timerIntervalRef.current);
      socket.emit("nextQuestion", {
        roomId: localStorage.getItem("roomId"),
      });
    }
  }, [timer, socket]);

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Participants section - hidden on mobile */}
      <div className="hidden lg:block lg:w-1/4 p-4 overflow-y-auto">
        <Text size={"lg"} fw={"bold"} my={2}>
          Participants
        </Text>
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
          {room.participants.map((user, index) => (
            <div
              key={index}
              className="relative bg-white border rounded-lg p-3 flex flex-col items-center justify-center"
            >
              <Badge
                color={usersAnswered.includes(user.name) ? "green" : "yellow"}
                className="absolute z-20 top-1 right-1"
                size="sm"
              >
                {usersAnswered.includes(user.name) ? "Answered" : "Thinking"}
              </Badge>
              <Avatar size="md" className="mb-2" />
              <p className="font-medium text-sm text-center truncate w-full">
                {user.name === localStorage.getItem("name") ? "You" : user.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Question and answer section */}
      <div className="flex-1 bg-slate-50 p-4 lg:p-8 flex flex-col">
        <div className="flex items-center justify-center mb-6">
          <Avatar size="md" src={Timer} />
          <h1 className="font-semibold ml-2 tracking-wider italic text-xl">
            {`00:${timer.toString().padStart(2, "0")}`}
          </h1>
        </div>

        {/* Question card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 flex-grow flex flex-col justify-center items-center gap-6">
          <h2 className="font-semibold text-center text-2xl mb-3 md:mb-24">
            {question?.question}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {question?.options.map((answer, index) => (
              <p key={index} className="text-gray-700 font-medium text-lg">
                {`${String.fromCharCode(65 + index)}) ${answer}`}
              </p>
            ))}
          </div>
        </div>

        {/* Answer selection */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-center mb-4 text-lg font-medium">Your Answer</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {question?.options.map((_, index) => (
              <Button
                key={index}
                className={`w-full py-3 text-lg ${
                  userAnswer === index ? "bg-blue-600" : "bg-gray-300"
                }`}
                onClick={() => handleAnswerSelection(index)}
              >
                {String.fromCharCode(65 + index)}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizzRoom;
