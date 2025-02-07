"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export interface TestCase {
  id: number;
  input: string;
  output: string;
}

interface Question {
  id: number;
  question: string;
  testCaseId: TestCase[];
}

const Participant3 = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [timeLeft, setTimeLeft] = useState(3600);
  const [viewHiddenTestCases, setViewHiddenTestCases] = useState(false);
  const [question, setQuestion] = useState<Question | null>(null);

  useEffect(() => {
    if (!localStorage.getItem("participantid")) {
      localStorage.setItem("participantid", "3");
    }
    const storedParticipantId = localStorage.getItem("participantid");
    const currentParticipantId = pathname.replace("/participant", "");

    if (storedParticipantId !== currentParticipantId) {
      router.replace(`/participant${storedParticipantId}`);
      return;
    }
  }, [pathname, router]);

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
        const response = await axios.get(
          "https://coding-relay-be.onrender.com/leaderboard/getTimer"
        );

        const { start_time } = response.data;
        const eventStartTime = new Date(start_time).getTime();
        const eventEndTime = eventStartTime + 1.25 * 60 * 60 * 1000;
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

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(
        "https://coding-relay-be.onrender.com/questions/getQuestionsByDifficulty?difficulty=hard"
      );
      const questions = response.data;
      let selectedQuestionId = localStorage.getItem("questionid");
      if (!selectedQuestionId) {
        selectedQuestionId = (Math.floor(Math.random() * 5) + 11).toString();
        localStorage.setItem("questionid", selectedQuestionId);
      }

      const selectedQuestion = questions.find(
        (question: Question) => question.id === parseInt(selectedQuestionId)
      );

      setQuestion(selectedQuestion);
    } catch (error) {
      console.error("Failed to fetch questions", error);
    }
  };

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
    if (
      confirm(
        "Are you sure? 250 points will be deducted from your team's final score."
      )
    ) {
      setViewHiddenTestCases(true);
      localStorage.setItem("viewedHidden", "true");
    } else {
      setViewHiddenTestCases(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center w-fit mx-10">
      <div className="absolute left-0 top-0 rounded-2xl text-white text-[5rem] font-bold bg-black px-7 py-0 border-2 border-purple-500">
        {formatTime(timeLeft)}
      </div>
      <div className="text-white text-[5.5rem] absolute top-0 right-0">
        Question ID:{question?.id}
      </div>
      <div className="relative top-20 my-16 flex flex-col items-center justify-center w-full h-max gap-y-5">
        {question && (
          <>
            <div className="p-1 relative break-words w-[92.5vw] h-fit bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <div className="flex items-center justify-left bg-black w-full p-4 h-full rounded-lg text-[1.3rem] px-5">
                {question.question}
              </div>
            </div>
            <div className="w-full h-max flex flex-col items-center justify-center gap-y-5">
              {question?.testCaseId.slice(0, 3).map((testCase: TestCase) => (
                <div
                  key={testCase.id}
                  className="relative p-1 text-xl break-words w-full h-fit bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"
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
          {!viewHiddenTestCases && (
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
        {viewHiddenTestCases &&
          question?.testCaseId.slice(3).map((testCase: TestCase) => (
            <div
              key={testCase.id}
              className="relative p-1 text-xl break-words w-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"
            >
              <div className="flex gap-y-2 flex-col items-start justify-center bg-black w-full h-full p-4 rounded-lg text-xl px-5">
                <span>Input: {testCase.input}</span>
                <span>Output: {testCase.output}</span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Participant3;
