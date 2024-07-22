import { useContext, useEffect, useRef, useState } from "react";
import { Avatar, Badge, Button } from "@mantine/core";
import Timer from "../assets/chronometer.png";
import { useNavigate } from "react-router-dom/dist/umd/react-router-dom.development";
import { QuizzContext } from "../context/QuizzContext";

function QuizzRoom({ socket }) {
  const [userAnswer, setUserAnswer] = useState(null);
  const [usersAnswered, setUsersAnswered] = useState([]);
  const navigate = useNavigate();

  // Function to handle user's answer selection
  const handleAnswerSelection = (answer) => {
    setUserAnswer(answer);
    // You can emit the user's answer to the server using the socket here
    socket.emit("userAnswer", {
      roomId: localStorage.getItem("roomId"),
      answer: answer,
      name: localStorage.getItem("name"),
    });
  };

  const [Question, setQuestion] = useState({ options: [] });
  const [timer, setTimer] = useState(20);
  const Room = JSON.parse(localStorage.getItem("room"));

  // Ref to hold the interval ID for the timer
  const timerIntervalRef = useRef(null);

  useEffect(() => {
    socket.on("nextQuestion", (data) => {
      if (data.roomId === localStorage.getItem("roomId")) {
        clearInterval(timerIntervalRef.current); // Clear the previous timer interval
        setQuestion(data.question);
        setUsersAnswered([]);
        setUserAnswer("");
        setTimer(20); // Reset timer to 20 seconds
        startTimer();
      }
    });

    socket.on("userAnswered", (data) => {
      if (data.roomId === localStorage.getItem("roomId")) {
        setUsersAnswered((userAnd) => [...userAnd, data.name]);
      }
    });

    socket.on("gameEnd", (data) => {
      if (data.roomId === localStorage.getItem("roomId")) {
        navigate("/ranking");
      }
    });

    // Clean up the timer interval when the component unmounts
    return () => {
      clearInterval(timerIntervalRef.current);
    };
  }, []);

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
      setTimer(20); // Reset timer to 20 seconds
    }
  }, [timer]);

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Participants section */}
      <div className="lg:w-1/4 grid grid-cols-2 lg:grid-cols-1 gap-2 p-2">
        {Room.participants.map((user, index) => (
          <div
            key={index}
            className="relative bg-white border-2 rounded-lg p-2 flex flex-col items-center"
          >
            <div className="absolute top-1 right-1">
              <Badge
                color={usersAnswered.includes(user.name) ? "green" : "yellow"}
                size="sm"
              >
                {usersAnswered.includes(user.name) ? "repondu" : "en cours"}
              </Badge>
            </div>
            <Avatar size="md" className="mb-2" />
            <p className="font-medium text-sm">
              {user.name === localStorage.getItem("name") ? "You" : user.name}
            </p>
          </div>
        ))}
      </div>

      {/* Question and answer section */}
      <div className="flex-1 bg-slate-50 p-2 flex flex-col">
        <div className="flex items-center justify-center mb-4">
          <Avatar size="md" src={Timer} />
          <h1 className="font-semibold ml-2 tracking-wider italic text-lg">{`00:${
            timer.toString().length > 1
              ? timer.toString()
              : "0" + timer.toString()
          }`}</h1>
        </div>

        {/* Question card */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4 flex-grow flex flex-col justify-between">
          <h2 className="font-semibold text-center text-xl mb-4">
            {Question?.question}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Question?.options.map((answer, index) => (
              <p key={index} className="text-gray-500 font-medium text-sm">
                {`${String.fromCharCode(65 + index)}) ${answer}`}
              </p>
            ))}
          </div>
        </div>

        {/* Answer selection */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <p className="text-center mb-2">votre reponse</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Question?.options.map((_, index) => (
              <Button
                key={index}
                className={`w-full ${
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
