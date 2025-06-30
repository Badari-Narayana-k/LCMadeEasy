(async function () {
  if (document.getElementById("ai-container")) return;

  const container = document.createElement("div");
  container.id = "ai-container";
  container.innerHTML = `
    <div id="ai-header">🤖 Interviewer <button id="toggle-btn">−</button></div>
    <div id="ai-messages"></div>
    <div id="ai-input">
      <textarea id="ai-text" rows="2" placeholder="Ask a hint or question..."></textarea>
      <button id="ai-send">Send</button>
    </div>
  `;
  document.body.appendChild(container);

  const messages = document.getElementById("ai-messages");
  const input = document.getElementById("ai-text");
  const sendBtn = document.getElementById("ai-send");
  const toggleBtn = document.getElementById("toggle-btn");
  const inputBox = document.getElementById("ai-input");

  const problemSlug = window.location.pathname.split("/")[2];
  const problemTitle = problemSlug.replace(/-/g, " ");

  const saved = localStorage.getItem(`chat_${problemSlug}`);
  if (saved) messages.innerHTML = saved;

  toggleBtn.onclick = () => {
    const hidden = messages.style.display === "none";
    messages.style.display = hidden ? "flex" : "none";
    inputBox.style.display = hidden ? "flex" : "none";
    toggleBtn.textContent = hidden ? "−" : "+";
  };

  sendBtn.onclick = async () => {
    const msg = input.value.trim();
    if (!msg) return;
    input.value = "";
    sendBtn.disabled = true;

    const user = addMessage(msg, "user-message");
    const aiBubble = addMessage("...", "ai-message");

    let prompt = "";
    if (msg.startsWith("/")) {
      const base = msg.slice(1).split(" ")[0].toLowerCase();
      const code = msg.split("\n").slice(1).join("\n").trim();

      const commands = {
        hint: `Give me a useful hint for solving "${problemTitle}" without revealing the solution.`,
        complexity: `Explain the time and space complexity of the optimal solution for "${problemTitle}".`,
        optimize: `How can I optimize my approach to the problem "${problemTitle}"?`,
        "edge-cases": `List important edge cases that should be tested for the problem "${problemTitle}".`,
        "dry-run": `Do a dry run of the logic for "${problemTitle}" with an example input.`,
        examples: `Give some sample input/output examples for the problem "${problemTitle}".`,
        similar: `List problems similar to "${problemTitle}" that I can practice next.`,
        "explain-this-code": `Explain what the following code does and if it's optimal:\n\n${code}`,
        analyze: `Analyze the following code for the LeetCode problem "${problemTitle}". Give feedback on logic, efficiency, edge cases, and improvements:\n\n${code}`
      };

      prompt = commands[base] || msg;
    } else {
      prompt = `You are helping a student with the LeetCode problem "${problemTitle}".\nUser: ${msg}`;
    }

    try {
      const reply = await callAI(prompt);
      typeText(aiBubble, reply);
    } catch {
      aiBubble.textContent = "❌ Error contacting local AI.";
    } finally {
      sendBtn.disabled = false;
      saveChat();
    }
  };

  function addMessage(text, cls) {
    const el = document.createElement("div");
    el.className = cls;

    if (text.includes("```")) {
      const codeMatch = text.match(/```(.*?)\\n?([\\s\\S]*?)```/);
      if (codeMatch) {
        const lang = codeMatch[1] || "";
        const code = codeMatch[2];
        el.innerHTML = `${text.split("```")[0]}<pre><code>${code}</code></pre>`;
        const copy = document.createElement("button");
        copy.className = "copy-btn";
        copy.textContent = "📋";
        copy.onclick = () => {
          navigator.clipboard.writeText(code);
          copy.textContent = "✅";
          setTimeout(() => copy.textContent = "📋", 1000);
        };
        el.appendChild(copy);
      } else {
        el.textContent = text;
      }
    } else {
      el.textContent = text;
    }

    messages.appendChild(el);
    messages.scrollTop = messages.scrollHeight;
    return el;
  }

  function typeText(el, text, i = 0) {
    el.textContent = "";
    const typing = () => {
      if (i < text.length) {
        el.textContent += text[i++];
        messages.scrollTop = messages.scrollHeight;
        setTimeout(typing, 8);
      } else {
        saveChat();
      }
    };
    typing();
  }

  async function callAI(prompt) {
    const res = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "llama3", prompt, stream: false })
    });
    const data = await res.json();
    return data.response;
  }

  function saveChat() {
    localStorage.setItem(`chat_${problemSlug}`, messages.innerHTML);
  }

  // 📊 Analyze Button (Auto-inserts code)
  const analyzeBtn = document.createElement("button");
  analyzeBtn.textContent = "📊 Analyze My Code";
  analyzeBtn.style.cssText = "position:fixed;bottom:10px;left:10px;z-index:9999;background:#198754;color:white;border:none;padding:8px;border-radius:6px;cursor:pointer";
  document.body.appendChild(analyzeBtn);

  analyzeBtn.onclick = async () => {
    const editor = document.querySelector(".view-lines");
    const code = editor?.innerText || "No code found.";
    input.value = `/analyze\n${code}`;
    sendBtn.click();
  };

  // 🖱️ Drag support
  const header = document.getElementById("ai-header");
  header.onmousedown = function (e) {
    e.preventDefault();
    let shiftX = e.clientX - container.getBoundingClientRect().left;
    let shiftY = e.clientY - container.getBoundingClientRect().top;
    function moveAt(pageX, pageY) {
      container.style.left = pageX - shiftX + "px";
      container.style.top = pageY - shiftY + "px";
    }
    function onMouseMove(e) {
      moveAt(e.pageX, e.pageY);
    }
    document.addEventListener("mousemove", onMouseMove);
    header.onmouseup = () => {
      document.removeEventListener("mousemove", onMouseMove);
      header.onmouseup = null;
    };
  };
})();
