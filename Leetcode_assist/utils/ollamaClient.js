export async function askOllama(problemTitle, userQuestion) {
  const prompt = `
You are an AI interviewer. Help the user solve the LeetCode problem titled "${problemTitle}".
Only give **interviewer-style help** like:
- Asking leading questions
- Giving hints
- Explaining time & space complexities
- Pointing out inefficient parts (once code is pasted)
- Suggesting test cases
Don't reveal full code unless the user has been stuck for 30 minutes.

User: ${userQuestion}
`;

  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama3", // or your preferred local model
      prompt,
      stream: false
    })
  });

  const data = await response.json();
  return data.response.trim();
}
