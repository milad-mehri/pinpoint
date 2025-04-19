import { motion } from "framer-motion";

const WordDisplay = ({ word, index, isRevealed, isVisible, totalWords, gameOver }) => {
  return (
    <div
      className={`py-4 px-4 text-lg font-semibold text-center border-none ${
        index === 0 ? "rounded-t-lg" : ""
      } ${index === totalWords - 1 ? "rounded-b-lg" : ""}`}
      style={{
        backgroundColor: `rgba(173, 216, 230, ${0.2 + index * 0.2})`,
      }}
    >
      <div className="relative flex items-center justify-center">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{
            opacity: isRevealed ? 1 : 0,
          }}
          transition={{ duration: 0.5 }}
          className={
            isRevealed
              ? "text-black"
              : gameOver
              ? "text-gray-500"
              : "text-black"
          }
        >
          {isRevealed ? word : `Word ${index + 1}`}
        </motion.span>

        {!isVisible && gameOver && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="right-[15px] absolute ml-2 text-sm text-slate-100 bg-blue-300 rounded px-2 py-1"
          >
            Not Used
          </motion.span>
        )}
      </div>
    </div>
  );
};

export default WordDisplay; 