const keyStrokeSounds = [
  "/sounds/keystroke1.mp3",
  "/sounds/keystroke2.mp3",
  "/sounds/keystroke3.mp3",
  "/sounds/keystroke4.mp3",
];

const useKeyboardSound = () => {
  const playRandomKeyStrokeSound = () => {
    const randomSound =
      keyStrokeSounds[Math.floor(Math.random() * keyStrokeSounds.length)];

    const audio = new Audio(randomSound);

    audio.play().catch((error) => {
      console.error("Error playing sound:", error);
    });
  };

  return { playRandomKeyStrokeSound };
};

export default useKeyboardSound;
