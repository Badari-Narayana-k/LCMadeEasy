# 🧐 LeetCode AI Interview Assistant – Chrome Extension

This is a Chrome Extension that transforms your LeetCode solving environment into a dynamic, interactive mock interview experience.

Built with the goal of **learning by doing**, this assistant helps users by offering **step-by-step guidance**, **code analysis**, **performance tips**, and **hints**, all without immediately giving away the solution — just like a real-life technical interviewer would.

---

## 🚀 Features

* 💬 **Floating Interview Assistant UI** beside the LeetCode editor
* ✍️ **Smart slash command system** for quick help:

  * `/hint`, `/complexity`, `/optimize`, `/analyze`, and more
* 📊 **One-click code analysis**: auto-fetches your solution from the editor
* 🌟 **Typing animation** and **chat-like bubbles** for clean conversation
* 🧠 **Local LLM-powered**: works entirely offline using [Ollama](https://ollama.com/)
* 🌙 **Dark mode UI**, draggable window, and collapsible popup
* 📋 **Code blocks with copy buttons** for convenience

---

## 🧠 Slash Commands

You can use the following commands directly in the chat input:

```
/hint                - Get a strategic nudge
/complexity          - Analyze time and space complexity
/optimize            - Discover optimization tips
/edge-cases          - Get edge test cases to consider
/dry-run             - Ask for a walkthrough with sample input
/examples            - Request sample input-output
/similar             - See similar problems
/analyze             - Full code analysis
/explain-this-code   - Explain a code snippet you paste
```

---

## ⚙️ How It Works

* When you're on a LeetCode problem page, a floating assistant pops up.
* You can chat like you would with a mentor: ask questions, request hints, or analyze code.
* The assistant communicates with `llama3` running **locally via Ollama** for privacy and speed.
* You can drag, minimize, or expand the chat at any time.

---

## 🔧 Installation & Setup

> Prerequisites:
>
> * Install [Ollama](https://ollama.com/)
> * Run the LLM: `ollama run llama3`

1. Clone this repository:

   ```bash
   git clone https://github.com/your-username/leetcode-ai-assistant.git
   ```

2. Open Chrome and go to:

   ```
   chrome://extensions/
   ```

3. Enable **Developer Mode** (top right).

4. Click **"Load unpacked"**, and select the folder you cloned.

5. Ensure Ollama is running with the model:

   ```bash
   ollama run llama3
   ```

6. Open any LeetCode problem — the assistant appears automatically!

---

## 💻 Tech Stack

* JavaScript (Vanilla)
* Chrome Extension APIs
* Ollama (running llama3 locally)
* HTML & Custom CSS (Bootstrap-inspired dark UI)

---

## ✨ Example Use

**User:**

```
/analyze
function twoSum(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
}
```

**AI:**

> This solution works but has a time complexity of O(n²)...
> You can improve it using a hashmap...
> Here's the optimized idea (without code): ...

---

## 📄 License

This project is licensed under the **MIT License**. Feel free to use and modify it.

---

## 🙌 Contribute

Want to improve this project or add new commands? PRs are welcome!
Have ideas for enhancements like voice assistant mode, visual graphs, or real-time test case visualization? Let’s build it!

---

## 📬 Feedback

If this helped you in your coding journey or interview prep, a ⭐ star on GitHub would mean a lot.
Have suggestions? Feel free to open an issue or reach out on LinkedIn!
