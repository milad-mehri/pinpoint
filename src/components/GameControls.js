import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShareAlt,
  faArrowRight,
  faDumbbell,
  faCalendarDay,
  faExclamationTriangle
} from "@fortawesome/free-solid-svg-icons";
import { STYLES, GAME_MODES } from "../constants/gameConstants";

const GameControls = ({ mode, onShare }) => {
  return (
    <div className="flex justify-center mt-6 gap-4">
      <button
        title="Share"
        onClick={onShare}
        className={STYLES.shareButton}
      >
        <FontAwesomeIcon icon={faShareAlt} className="text-xl" />
      </button>

      <button
        title="Feedback"
        onClick={() => (window.location.href = "/feedback")}
        className={STYLES.shareButton}
      >
        <FontAwesomeIcon icon={faExclamationTriangle} className="text-xl" />
      </button>

      {mode === GAME_MODES.PRACTICE && (
        <button
          title="Daily mode"
          onClick={() => (window.location.href = "/")}
          className={STYLES.shareButton}
        >
          <FontAwesomeIcon icon={faCalendarDay} className="text-xl" />
        </button>
      )}

      <button
        title="Practice mode"
        onClick={() => (window.location.href = "/practice")}
        className={STYLES.shareButton}
      >
        {mode === GAME_MODES.DAILY ? (
          <FontAwesomeIcon icon={faDumbbell} className="text-xl" />
        ) : (
          <FontAwesomeIcon icon={faArrowRight} className="text-xl" />
        )}
      </button>
    </div>
  );
};

export default GameControls; 