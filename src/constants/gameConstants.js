export const STORAGE_KEYS = {
  DAILY_RESULTS: 'dailyResults',
};

export const GAME_MODES = {
  DAILY: 'daily',
  PRACTICE: 'practice',
};

export const SHARE_MESSAGES = {
  SUCCESS: {
    PRACTICE: '🎉 I solved Pinpoint Practice #{gameId} in {tries} {tryText}, beating {difficulty}% of players! Think you can? Try it here: {url}',
    DAILY: '🎉 I just completed Pinpoint Daily in {tries} {tryText}! This one has a {difficulty}% success rate. Think you can? Try it here: {url}'
  },
  FAILURE: {
    PRACTICE: '❌ I failed Pinpoint Practice #{gameId} after {tries} {tryText}. Only {difficulty}% of players solved it! Think you can do better? Try it here: {url}',
    DAILY: '❌ Pinpoint Daily stumped me after {tries} {tryText}! This one has a {difficulty}% success rate. Think you can? Try it here: {url}'
  }
};

export const STYLES = {
  container: "bg-white shadow-lg rounded-lg w-full sm:w-4/5 lg:w-2/3 max-w-lg mx-auto p-6 flex flex-col justify-between",
  wordSection: "space-y-0",
  input: "w-full border border-gray-300 rounded-md px-4 py-2 text-lg focus:ring-2 focus:ring-blue-500 outline-none",
  shareButton: "bg-gray-100 hover:bg-gray-200 text-gray-500 w-14 h-9 rounded-full flex items-center justify-center shadow-md transition"
}; 