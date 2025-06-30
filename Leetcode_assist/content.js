(function () {
    const url = window.location.href;
    if (url.includes("/contest/")) {
      console.log("[Assistant] Contest detected. Disabled.");
      return;
    }
  
    const match = url.match(/problems\/([a-zA-Z0-9-]+)/);
    if (match) {
      console.log("[Assistant] Problem detected:", match[1]);
    }
  })();
  