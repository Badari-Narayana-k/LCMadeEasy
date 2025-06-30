document.addEventListener("DOMContentLoaded", () => {
  const sendBtn = document.getElementById("send-btn");
  const userInput = document.getElementById("user-input");
  const messagesDiv = document.getElementById("messages");

  sendBtn.addEventListener("click", async () => {
    const input = userInput.value.trim();
    if (!input) return;

    addMessage("You", input, "user");
    userInput.value = "";

    // Add animated thinking placeholder
    const thinkingEl = addMessage("Interviewer", "Thinking", "ai", true);

    try {
      const url = await getCurrentTabURL();
      const problem = extractProblemFromURL(url);
      const response = await askOllama(problem, input);
      messagesDiv.removeChild(thinkingEl);
      addMessage("Interviewer", response, "ai");
    } catch (err) {
      messagesDiv.removeChild(thinkingEl);
      addMessage("Error", "AI failed: " + err.message, "ai");
    }
  });

  function formatText(text) {
  // Convert Markdown-style code blocks ``` into <pre><code>
  const codeBlockPattern = /```(.*?)```/gs;
  text = text.replace(codeBlockPattern, (_, code) => {
    return `<pre><code>${escapeHtml(code.trim())}</code></pre>`;
  });

  // Convert inline code with `backticks`
  text = text.replace(/`([^`]+)`/g, (_, code) => {
    return `<code>${escapeHtml(code)}</code>`;
  });

  return text;
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (char) => {
    return ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[char];
  });
}


  function addMessage(sender, rawText, role = "ai", isThinking = false) {
  const wrapper = document.createElement("div");
  wrapper.className = `message ${role}`;

  const bubble = document.createElement("div");
  bubble.className = `bubble ${role}`;

  if (role === "error") bubble.className = "bubble error";

  if (isThinking) {
    bubble.classList.add("thinking");
    bubble.textContent = `${sender}: Thinking...`;
    animateDots(bubble, sender);
  } else {
    // Format message text: handle markdown/code blocks
    const formatted = formatText(`${sender}: ${rawText}`);
    bubble.innerHTML = formatted;
  }

  wrapper.appendChild(bubble);
  messagesDiv.appendChild(wrapper);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
  return wrapper;
}


function animateDots(el, sender) {
  let dots = 0;
  const interval = setInterval(() => {
    if (!el.isConnected) {
      clearInterval(interval);
      return;
    }
    dots = (dots + 1) % 4;
    el.textContent = `${sender}: Thinking${'.'.repeat(dots)}`;
  }, 500);
}


  function animateDots(el) {
    let dots = 0;
    const interval = setInterval(() => {
      if (!el.isConnected) {
        clearInterval(interval);
        return;
      }
      dots = (dots + 1) % 4;
      el.textContent = "Interviewer: Thinking" + ".".repeat(dots);
    }, 500);
  }

  async function getCurrentTabURL() {
    return new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        resolve(tabs[0].url);
      });
    });
  }

  function extractProblemFromURL(url) {
    const parts = url.split("/problems/");
    return parts.length > 1 ? parts[1].split("/")[0] : "Unknown Problem";
  }

  async function askOllama(problemTitle, userQuestion) {
    const prompt = `
You are an AI interviewer helping a candidate solve the LeetCode problem titled "${problemTitle}".
Ask questions, provide hints, never give full code unless asked after many tries.

User: ${userQuestion}
    `;

    const res = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3",
        prompt,
        stream: false
      })
    });

    if (!res.ok) throw new Error("HTTP error from Ollama: " + res.status);

    const raw = await res.text();
    try {
      const data = JSON.parse(raw);
      return data.response.trim();
    } catch (err) {
      console.error("Failed to parse Ollama response:", raw);
      throw new Error("Invalid JSON from AI");
    }
  }
});
