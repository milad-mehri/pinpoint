"use client";

const Keyboard = ({ onKeyPress }) => {
  const qwertyKeys = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M", "DEL", "ENTER"],
  ];

  return (
    <div className="mt-4 space-y-2 sm:hidden">
      {" "}
      {/* Hidden on larger screens */}
      {qwertyKeys.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1">
          {row.map((key) => (
            <button
              key={key}
              onClick={() => onKeyPress(key)}
              className="bg-[#62c5d6] py-4 px-3 text-white text-sm rounded hover:bg-[#62c5d6]"
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
