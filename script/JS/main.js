let currentLink = window.location.href

setInterval(() => {
    if (currentLink != window.location.href) dispatchEvent(new Event("load"));
    currentLink = window.location.href;
}, 500);


console.log("Provider load: ", extensionName)

window.addEventListener("load", () => {

    let ytAddon, monkeytAddon;
    const href = window.location.href;
    let provider = new Provider(() => {
        // youtube load check
        if (href.indexOf("www.youtube.com") > -1) {
            ytAddon = new YoutubeAddons(provider.userData.youtube);
            addEventListener("providerUpdate", () => {ytAddon.update(provider.userData.youtube)});
        }
        
        // monkeytype load check
        if (href.indexOf("monkeytype.com") > -1) {
            monkeytAddon = new MonkeytypeCheat(provider.userData.monkeytype);
            addEventListener("providerUpdate", () => {monkeytAddon.update(provider.userData.monkeytype)});
        }
    });
}, {
    once: true
});
