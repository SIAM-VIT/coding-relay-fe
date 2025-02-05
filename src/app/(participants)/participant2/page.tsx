"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface TestCase {
  id: number;
  input: string;
  output: string;
}

interface Question {
  id: number;
  question: string;
  testCaseId: TestCase[];
}

const Participant2 = () => {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(3600);
  const [viewHiddenTestCases, setViewHiddenTestCases] = useState(false);
  const [question, setQuestion] = useState<Question | null>(null);

  // Fetching event status and updating time left
  useEffect(() => {
    const hiddenTestCasesViewed =
      localStorage.getItem("viewedHidden") === "true";
    setViewHiddenTestCases(hiddenTestCasesViewed);

    const checkEventStatus = async () => {
      if (localStorage.getItem("end") === "true") {
        router.replace("/end");
        return;
      }

      try {
        // Fetching the timer status
        const response = await axios.get(
          "https://coding-relay-be.onrender.com/leaderboard/getTimer"
        );

        const { start_time } = response.data;
        const eventStartTime = new Date(start_time).getTime();
        const eventEndTime = eventStartTime + 3 * 60 * 60 * 1000; // 1 hour
        const currentTime = new Date().getTime();

        const remainingTime = Math.max(
          Math.floor((eventEndTime - currentTime) / 1000),
          0
        );

        if (remainingTime === 0) {
          localStorage.setItem("end", "true");
          router.replace("/end");
        } else {
          setTimeLeft(remainingTime);
        }
      } catch (error) {
        console.error("Failed to fetch event status", error);
      }
    };

    checkEventStatus();

    // Polling timer update every second
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          localStorage.setItem("end", "true");
          router.replace("/end");
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [router]);

  // Fetching the questions based on difficulty level
  const fetchQuestions = async () => {
    try {
      const response = await axios.get(
        "https://coding-relay-be.onrender.com/questions/getQuestionsByDifficulty?difficulty=medium"
      );
      const questions = response.data;

      // Check if questionid exists in localStorage
      let selectedQuestionId = localStorage.getItem("questionid");

      if (!selectedQuestionId) {
        // If no questionid in localStorage, pick a random question
        selectedQuestionId = (
          Math.floor(Math.random() * questions.length) + 1
        ).toString();
        localStorage.setItem("questionid", selectedQuestionId);
      }

      // Find the question with the selected ID
      const selectedQuestion = questions.find(
        (question: Question) => question.id === parseInt(selectedQuestionId)
      );

      setQuestion(selectedQuestion);
    } catch (error) {
      console.error("Failed to fetch questions", error);
    }
  };

  // Trigger fetch when component mounts
  useEffect(() => {
    fetchQuestions();
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${secs}`;
  };

  const handleClick = () => {
    if (confirm("Are you sure you want to view hidden test cases?")) {
      setViewHiddenTestCases(true);
      localStorage.setItem("viewedHidden", "true");
    } else {
      setViewHiddenTestCases(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center gap-y-10 w-fit h-fit mx-10">
      <div className="absolute left-0 top-0 rounded-2xl text-white text-[5rem] font-bold bg-black px-7 py-0 border-2 border-purple-500">
        {formatTime(timeLeft)}
      </div>
      <div className="text-white text-[5.5rem] absolute top-0 right-0">
        Question ID:{question?.id}
      </div>
      <div className="-mt-20 mb-16 flex flex-col items-center justify-center w-full h-max gap-y-10">
        {question && (
          <>
            <div className="p-1 relative break-words w-[92.5vw] h-fit bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <div className="flex items-center justify-left bg-black w-full p-4 h-full rounded-lg text-[1.3rem] px-5">
                {question.question}
              </div>
            </div>

            <div className="w-full h-max flex items-center justify-start gap-x-5">
              {question.testCaseId.map((testCase: TestCase) => (
                <div
                  key={testCase.id}
                  className="relative p-1 text-xl break-words w-1/3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"
                >
                  <div className="flex gap-y-2 flex-col items-start justify-center bg-black w-full h-full p-4 rounded-lg text-xl px-5">
                    <span>Input: {testCase.input}</span>
                    <span>Output: {testCase.output}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        <div>
          {viewHiddenTestCases ? (
            <Button
              onClick={handleClick}
              disabled
              className="relative w-fit h-20 p-1 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 group"
            >
              <div className="flex items-center justify-center w-full h-full px-6 py-4 text-[1.6rem] text-white bg-black rounded-lg transition-all duration-500 group-hover:shadow-lg group-hover:shadow-[#4b52f2] group-hover:bg-transparent group-hover:text-[2rem]">
                Hidden test cases viewed
              </div>
            </Button>
          ) : (
            <Button
              onClick={handleClick}
              className="relative w-fit h-20 p-1 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 group"
            >
              <div className="flex items-center justify-center w-full h-full px-6 py-4 text-[1.6rem] text-white bg-black rounded-lg transition-all duration-500 group-hover:shadow-lg group-hover:shadow-[#4b52f2] group-hover:bg-transparent group-hover:text-[1.8rem]">
                View hidden test cases?
              </div>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Participant2;
