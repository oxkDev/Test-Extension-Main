let currentLink = window.location.href

setInterval(() => {
    if (currentLink != window.location.href) dispatchEvent(new Event("load"));
    currentLink = window.location.href;
}, 500);


console.log("Provider load: ", extensionName)

window.addEventListener("load", () => {

    let ytAddon;
    let provider = new Provider(extensionName, () => {
        // youtube load check
        if (window.location.href.indexOf("www.youtube.com") + 1) {
            ytAddon = new YoutubeAddons(provider.userData.youtube);
            addEventListener("providerUpdate", () => {ytAddon.update(provider.userData.youtube)});
        }
    }, true);
}, {
    once: true
});
