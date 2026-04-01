'use client';

import { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";

export default function Game1() {
    const holes = Array.from({ length: 9 });

    const [moleIndex, setMoleIndex] = useState<number | null>(null);
    const [score, setScore] = useState<number>(0);
    const [time, setTime] = useState<number>(30);
    const [gameActive, setGameActive] = useState<boolean>(false);
    const [highScore, setHighScore] = useState<number>(0);
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    const scoreRef = useRef(score);
    const highScoreRef = useRef(highScore);
    const isTimeUpShown = useRef(false);

    useEffect(() => {
        scoreRef.current = score;
        highScoreRef.current = highScore;
    }, [score, highScore]);

    useEffect(() => {
        const isLogin = localStorage.getItem("isLogin");

        if (!isLogin) {
            setIsAuthorized(false);
            router.replace("/auth/not-authorized");

            setTimeout(() => {
                router.replace("/auth/login");
            }, 2000);
        } else {
            setIsAuthorized(true);
        }
    }, [router]);

    useEffect(() => {
        const savedHighScore = localStorage.getItem("whack_highscore");
        if (savedHighScore) {
            setHighScore(Number(savedHighScore));
        }
    }, []);

    useEffect(() => {
        if (!gameActive) return;
        
        const moleTimer = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * holes.length);
            setMoleIndex(randomIndex);
        }, 700);

        return () => clearInterval(moleTimer);
    }, [gameActive]);
    
    useEffect(() => {
        if (!gameActive) return;

        const countdown = setInterval(() => {
            setTime((prev) => (prev <= 1) ? 0 : prev - 1);
        }, 1000);

        return () => clearInterval(countdown);
    }, [gameActive]);

    useEffect(() => {
        if (time <= 0 && gameActive) {
            setGameActive(false);

            if (!isTimeUpShown.current) {
                isTimeUpShown.current = true;

                toast.info("⏰ Waktu habis!", {
                    autoClose: 1500,
                });

                if (scoreRef.current > highScoreRef.current) {
                    localStorage.setItem("whack_highscore", scoreRef.current.toString());
                    setHighScore(scoreRef.current);
                    toast.success("🔥 New High Score!", {
                    autoClose: 1500,
                    });
                }
            }
        }        
    }, [time, gameActive]);

    const hitMole = (index: number) => {
        if (index === moleIndex && gameActive) {
            setScore((prev) => prev + 1);
            setMoleIndex(null);
        }
    };

    const startGame = () => {
        setScore(0);
        setTime(30);
        setGameActive(true);

        isTimeUpShown.current = false;

        toast.info("🎮 Waktu dimulai! Kamu punya 30 detik!", {
            autoClose: 1500,
        });
    };

    if (isAuthorized === null) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="bg-white p-8 rounded-2xl shadow-lg text-center w-[300px]">
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthorized) {
        return null;
    }

    return (
        <div className="game-container">
            <div className="game-panel">
                <h1 className="game-title">🎮 Tap the Mouse</h1>

                <div className="game-stats">
                    <div className="score">🏆 Score: {score}</div>
                    <div className="timer">⏱ Time: {time}</div>
                </div>

                <div className="highscore">
                    ⭐ High Score: {highScore}
                </div>

                {!gameActive && (
                <button className="start-btn" onClick={startGame}>
                    🚀 Start Game
                </button>
                )}
            </div>

            <div className="game-grid">
                {holes.map((_, index) => (
                    <div
                        key={index}
                        onClick={() => hitMole(index)}
                        className="hole"
                    >
                        {moleIndex === index && (
                            <div className="mole">🐹</div>
                        )}
                    </div>
                ))}
            </div>

            <ToastContainer
                position="top-center"
                autoClose={1500}
                limit={1}
                closeOnClick
                pauseOnHover
                draggable
                closeButton
            />
        </div>
    );
}