import { useState } from "react";
import type { ReactNode } from "react";
import { Heading, Box, Input, Text, Button } from "@kuma-ui/core";

function shiftUnicode(str: string, shiftAmount: number): string {
  return str
    .split("")
    .map((char) => String.fromCharCode(char.charCodeAt(0) + shiftAmount))
    .join("");
}

function Warp({ children }: { children: ReactNode }) {
  return (
    <Box
      display={"flex"}
      justify={"center"}
      alignItems={"center"}
      minHeight={"100vh"}
      flexDir={"column"}
    >
      {children}
    </Box>
  );
}

const Game: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  type Question = {
    original: string;
    shifted: string;
    shiftAmount: number;
  };

  type AnswerHistory = {
    question: Question;
    userAnswer: string;
    isCorrect: boolean;
  };

  const [answerHistory, setAnswerHistory] = useState<AnswerHistory[]>([]);

  const questions: Question[] = [
    {
      original: "Hello, World!",
      shifted: shiftUnicode("Hello, World!", 1),
      shiftAmount: 1,
    },
    {
      original: "吾輩は猫である吾輩は猫である",
      shifted: shiftUnicode("吾輩は猫である", 2),
      shiftAmount: 2,
    },
    {
      original: "スマホ中毒者",
      shifted: shiftUnicode("スマホ中毒者", 3),
      shiftAmount: 3,
    },
    {
      original: "人生は冒険や！",
      shifted: shiftUnicode("人生は冒険や！", 4),
      shiftAmount: 4,
    },
  ];

  function checkAnswer() {
    const isCorrect = userAnswer === questions[currentQuestion].original;

    if (isCorrect) {
      setScore(score + 1);
    }

    setAnswerHistory([
      ...answerHistory,
      {
        question: questions[currentQuestion],
        userAnswer,
        isCorrect,
      },
    ]);

    setUserAnswer("");
    setCurrentQuestion(currentQuestion + 1);
  }

  if (currentQuestion >= questions.length) {
    return (
      <Warp>
        <Heading as="h1" color="black" fontSize={50}>
          Final Score: {score}
        </Heading>
        <ul>
          {answerHistory.map((history, index) => (
            <li key={index}>
              <p>Question: {history.question.shifted}</p>
              <p>Your Answer: {history.userAnswer}</p>
              <p>Correct Answer: {history.question.original}</p>
              <p>{history.isCorrect ? "Correct" : "Incorrect"}</p>
            </li>
          ))}
        </ul>
      </Warp>
    );
  }

  if (!gameStarted) {
    return (
      <Warp>
        <Heading
          as="h1"
          textAlign={"center"}
          fontSize={[25, 50]}
          fontWeight={"bold"}
        >
          Unicodeシーザー暗号ゲームへようこそ！
        </Heading>
        <Text textAlign={"center"}>
          文字列をUnicode表から特定の数シフトし、元の文章を当てるシンプルなゲームです
        </Text>
        <Button
          px={10}
          py={8}
          bg="blue"
          fontSize={15}
          fontWeight={"bold"}
          color="white"
          borderRadius={6}
          border={"none"}
          onClick={() => setGameStarted(true)}
        >
          ゲームを開始
        </Button>
      </Warp>
    );
  }

  return (
    <Warp>
      <Heading as="h1" color="black" fontSize={[35, 50]}>
        {questions[currentQuestion].shifted}
      </Heading>
      <Box display={"flex"}>
        <Input
          value={userAnswer}
          fontSize={17}
          mr={15}
          px={10}
          py={5}
          borderRadius={15}
          borderWidth={1}
          borderColor={"#E6E6E6"}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="元の文字列を入力..."
        />
        <Button
          px={15}
          py={5}
          bg="blue"
          color="white"
          borderRadius={6}
          onClick={checkAnswer}
          border={"none"}
          fontWeight={"bold"}
          disabled={!userAnswer}
        >
          送信
        </Button>
      </Box>
      <Text>Score: {score}</Text>
      <Text>Shift Amount: {questions[currentQuestion].shiftAmount}</Text>
    </Warp>
  );
};

export default Game;
