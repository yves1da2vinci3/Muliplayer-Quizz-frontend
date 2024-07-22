import { Avatar, Button } from "@mantine/core";
import React, { useEffect, useState } from "react";
import Clap from "../assets/clap.png";
import Cup from "../assets/winner.png";
import Gold from "../assets/medal.png";
import Silver from "../assets/silver-medal.png";
import Bronze from "../assets/bronze-medal.png";
import { useNavigate } from "react-router-dom";

function RankingScreen({ socket }) {
  const navigate = useNavigate();
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    socket.on("ranking", (data) => {
      if (data.roomId === localStorage.getItem("roomId")) {
        setRanking(data.rankings);
      }
    });

    return () => {
      socket.off("ranking");
    };
  }, [socket]);

  function closeCurrentTab() {
    window.close();
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 flex flex-col items-center justify-center">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-semibold mr-4 tracking-wider">Ranking</h1>
        <Avatar size={60} src={Cup} alt="Trophy" />
      </div>

      {/* Ranking List */}
      <div className="w-full max-w-md bg-white drop-shadow-lg shadow-md rounded-lg flex flex-col p-4">
        <ul className="flex-1 flex-col overflow-y-auto max-h-[60vh] flex gap-y-4 list-none">
          {ranking.map((rank, index) => (
            <li
              key={index}
              className="p-3 flex items-center border-b-2 last:border-b-0"
            >
              <span className="mr-3 font-bold text-lg w-6">{index + 1}</span>
              <Avatar size={40} />
              <div className="flex-1 ml-4">
                <p className="font-semibold truncate">
                  {rank.name === localStorage.getItem("name")
                    ? "You"
                    : rank.name}
                </p>
                <p className="text-sm text-gray-500">Score: {rank.points}</p>
              </div>
              <Avatar
                size={30}
                src={
                  index === 0
                    ? Gold
                    : index === 1
                    ? Silver
                    : index === 2
                    ? Bronze
                    : Clap
                }
                alt={`Rank ${index + 1}`}
              />
            </li>
          ))}
        </ul>

        {/* Close Game Button */}
        <Button
          className="bg-blue-500 h-[3rem] mt-6"
          onClick={closeCurrentTab}
          fullWidth
        >
          Close the game
        </Button>
      </div>
    </div>
  );
}

export default RankingScreen;
