// Function to get a specific cookie by name
function getCookie(name) {
    let cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        let [cookieName, cookieValue] = cookie.split('=');
        cookieName = cookieName.trim();
        if (cookieName === name) {
            return cookieValue ? decodeURIComponent(cookieValue) : null;
        }
    }
    return null;
}


function setCookie(name, jsonData) {
    const jsonString = JSON.stringify(jsonData);
    const expiresDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year from now
    const expireString = expiresDate.toUTCString();
    document.cookie = `${name}=${encodeURIComponent(jsonString)}; expires=${expireString}`;
  }
  