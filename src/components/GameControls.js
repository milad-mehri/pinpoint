import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShareAlt,
  faArrowRight,
  faDumbbell,
  faCalendarDay,
  faExclamationTriangle
} from "@fortawesome/free-solid-svg-icons";

const GameControls = ({ mode, onShare }) => {
  const buttonClass = "bg-gray-100 hover:bg-gray-200 text-gray-500 w-14 h-9 rounded-full flex items-center justify-center shadow-md transition";

  return (
    <div className="flex justify-center mt-6 gap-4">
      <button
        title="Share"
        onClick={onShare}
        className={buttonClass}
      >
        <FontAwesomeIcon icon={faShareAlt} className="text-xl" />
      </button>

      <button
        title="Feedback"
        onClick={() => (window.location.href = "/feedback")}
        className={buttonClass}
      >
        <FontAwesomeIcon icon={faExclamationTriangle} className="text-xl" />
      </button>

      {mode === "practice" && (
        <button
          title="Daily mode"
          onClick={() => (window.location.href = "/")}
          className={buttonClass}
        >
          <FontAwesomeIcon icon={faCalendarDay} className="text-xl" />
        </button>
      )}

      <button
        title="Practice mode"
        onClick={() => (window.location.href = "/practice")}
        className={buttonClass}
      >
        {mode === "daily" ? (
          <FontAwesomeIcon icon={faDumbbell} className="text-xl" />
        ) : (
          <FontAwesomeIcon icon={faArrowRight} className="text-xl" />
        )}
      </button>
    </div>
  );
};

export default GameControls; 