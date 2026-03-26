import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot, setDoc, updateDoc, getDoc } from 'firebase/firestore';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
    const [sessionId, setSessionId] = useState(localStorage.getItem('isardlab_sessionId') || null);
    const [playerId, setPlayerId] = useState(localStorage.getItem('isardlab_playerId') || null);
    const [sessionData, setSessionData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Listen to Firestore document changes
    useEffect(() => {
        if (!sessionId) {
            setLoading(false);
            return;
        }

        const docRef = doc(db, 'sessions', sessionId);
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                setSessionData(docSnap.data());
            } else {
                // Session was deleted or doesn't exist
                setSessionId(null);
                setPlayerId(null);
                localStorage.removeItem('isardlab_sessionId');
                localStorage.removeItem('isardlab_playerId');
            }
            setLoading(false);
        }, (error) => {
            console.error("Error listening to session:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [sessionId]);

    const joinSession = async (sid, pid) => {
        setLoading(true);
        const docRef = doc(db, 'sessions', sid);

        // Attempt to set it locally
        setSessionId(sid);
        setPlayerId(pid);
        localStorage.setItem('isardlab_sessionId', sid);
        localStorage.setItem('isardlab_playerId', pid);

        try {
            // Create session if it doesn't exist (basic implementation, in prod use transactions)
            // Since it's a cooperative game, we simplify by upserting role
            const initialData = {
                phase: 1,
                startTime: Date.now(),
                teamName: 'Unknown Team',
                players: {
                    1: { active: false, taskCompleted: false, clue: 'IS' },
                    2: { active: false, taskCompleted: false, clue: 'ARD' },
                    3: { active: false, taskCompleted: false, clue: 'LAB' }
                },
                finalInputs: {
                    1: false,
                    2: false,
                    3: false
                }
            };

            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) {
                await setDoc(docRef, initialData);
            }

            await updateDoc(docRef, {
                [`players.${pid}.active`]: true
            });

            // If we are creating it fresh, we might need a separate create function
            // But merge:true covers us initializing existing fields.
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    const createSession = async (sid, teamName) => {
        const docRef = doc(db, 'sessions', sid);
        await setDoc(docRef, {
            phase: 1,
            startTime: Date.now(),
            teamName: teamName || 'Unknown Team',
            players: {
                1: { active: false, taskCompleted: false, clue: 'IS' },
                2: { active: false, taskCompleted: false, clue: 'ARD' },
                3: { active: false, taskCompleted: false, clue: 'LAB' }
            },
            finalInputs: {
                1: false,
                2: false,
                3: false
            }
        });
    };

    const completePhase1 = async () => {
        if (!sessionId || !playerId) return;
        const docRef = doc(db, 'sessions', sessionId);

        await updateDoc(docRef, {
            [`players.${playerId}.taskCompleted`]: true
        });

        // We don't change phase here directly. A cloud function or a 
        // client listener handles changing phase to 2 if all are true.
        // For simplicity, we'll let components check if all are true.
    };

    const submitFinalCode = async (isCorrect) => {
        if (!sessionId || !playerId) return;
        const docRef = doc(db, 'sessions', sessionId);

        const updateObj = {
            [`finalInputs.${playerId}`]: isCorrect
        };

        const currentInputs = sessionData.finalInputs;
        let willComplete = true;
        [1, 2, 3].forEach(id => {
            if (id !== Number(playerId) && !currentInputs[id]) willComplete = false;
        });

        if (willComplete && isCorrect && !sessionData.endTime) {
            const now = Date.now();
            updateObj.endTime = now;

            try {
                const elapsed = now - sessionData.startTime;
                if (elapsed > 0) {
                    await setDoc(doc(db, 'rankings', sessionId), {
                        teamName: sessionData.teamName || 'Unknown Team',
                        timeTaken: elapsed,
                        createdAt: now
                    });
                } else {
                    console.warn("Clock skew detected: Elapsed time is negative. Not saving to rankings.");
                }
            } catch (err) {
                console.error("Failed to save ranking", err);
            }
        }

        await updateDoc(docRef, updateObj);
    };

    const resetGame = async () => {
        if (!sessionId) return;
        const docRef = doc(db, 'sessions', sessionId);
        await setDoc(docRef, {
            phase: 1,
            startTime: Date.now(),
            teamName: sessionData?.teamName || 'Unknown Team',
            players: {
                1: { active: false, taskCompleted: false, clue: 'IS' },
                2: { active: false, taskCompleted: false, clue: 'ARD' },
                3: { active: false, taskCompleted: false, clue: 'LAB' }
            },
            finalInputs: {
                1: false,
                2: false,
                3: false
            }
        });
    };

    const leaveSession = () => {
        // Basic cleanup
        if (sessionId && playerId) {
            const docRef = doc(db, 'sessions', sessionId);
            updateDoc(docRef, {
                [`players.${playerId}.active`]: false
            }).catch(e => console.log(e));
        }
        setSessionId(null);
        setPlayerId(null);
        setSessionData(null);
        localStorage.removeItem('isardlab_sessionId');
        localStorage.removeItem('isardlab_playerId');
    };

    const value = {
        sessionId,
        playerId,
        sessionData,
        loading,
        joinSession,
        createSession,
        completePhase1,
        submitFinalCode,
        resetGame,
        leaveSession
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
};
