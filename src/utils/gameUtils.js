export const getPSTDate = () => {
  const now = new Date();
  return new Date(
    now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" })
  );
};

export const getDayOfYear = () => {
  const pstDate = getPSTDate();
  const startOfYear = new Date(pstDate.getFullYear(), 0, 0);
  const diff = pstDate - startOfYear;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

export const saveResult = (success, revealedWords, guesses) => {
  const dayOfYear = getDayOfYear();
  const key = "dailyResults";
  const results = JSON.parse(localStorage.getItem(key)) || {};

  results[`day_${dayOfYear}`] = {
    success,
    revealedWords,
    guesses,
  };

  localStorage.setItem(key, JSON.stringify(results));
};

export const checkDailyCompletion = () => {
  const dayOfYear = getDayOfYear();
  const key = "dailyResults";
  const results = JSON.parse(localStorage.getItem(key)) || {};
  return results[`day_${dayOfYear}`];
};

export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    return fallbackCopyText(text);
  } catch (err) {
    return fallbackCopyText(text);
  }
};

const fallbackCopyText = (text) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  textArea.style.top = "0";
  document.body.appendChild(textArea);

  try {
    textArea.focus();
    textArea.select();
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    document.body.removeChild(textArea);
    return false;
  }
}; 