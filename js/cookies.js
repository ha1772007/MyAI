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


// Set the cookie with the JSON string
function setCookie(name, jsonData){
const jsonString = JSON.stringify(jsonData);
document.cookie = `${name}=${encodeURIComponent(jsonString)}`;
}