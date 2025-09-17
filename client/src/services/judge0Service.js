// judge0Service.js
// Service to interact with Judge0 API for code execution

const JUDGE0_API_URL = "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true";
const JUDGE0_API_KEY = "YOUR_RAPIDAPI_KEY"; // Replace with your RapidAPI key

export async function runCodeWithJudge0({ source_code, language_id, stdin = "" }) {
  const response = await fetch(JUDGE0_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-RapidAPI-Key": JUDGE0_API_KEY,
      "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
    },
    body: JSON.stringify({
      source_code,
      language_id,
      stdin
    })
  });
  if (!response.ok) {
    throw new Error("Failed to execute code");
  }
  return response.json();
}
