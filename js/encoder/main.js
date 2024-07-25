function Stable_encoder(str) {
    return encodeURIComponent(btoa(unescape(encodeURIComponent(str))));
}
function Stable_decoder(str) {
    return decodeURIComponent(escape(window.atob(decodeURIComponent(str))));
}
