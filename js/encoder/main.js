function Stable_encoder(str) {
    // Convert the string to UTF-8 bytes
    const utf8Bytes = new TextEncoder().encode(str);
    // Convert the bytes to a Base64-encoded string
    return btoa(String.fromCharCode.apply(null, utf8Bytes));
}

function Stable_decoder(str) {
    // Decode the Base64 string back to bytes
    const bytes = new Uint8Array(atob(str).split("").map(c => c.charCodeAt(0)));
    // Convert the bytes back to a UTF-8 string
    return new TextDecoder().decode(bytes);
}
