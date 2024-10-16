function copyTextToClipboard(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        console.log("Text copied to clipboard");
      }).catch(err => {
        console.error("Error copying text to clipboard:", err);
      });
    } else {
      console.error("Clipboard API not supported in this browser");
    }
  }
  
  // Example usage:
  copyTextToClipboard("Hello, World!");