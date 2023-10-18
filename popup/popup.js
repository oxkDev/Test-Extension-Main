let provider;
function initialiseAll() {
    // getting local storage data
    provider = new Provider(extensionName, () => {
        eventListeners();
        setSwitchStatus();
    });
}

function eventListeners() {
    console.log(settings)

    for (const type in settings.youtube) {
        settings.youtube[type].addEventListener("click", () => {
            console.log(type)
            if (type == "status") {
                provider.userData.youtube.status = !provider.userData.youtube.status;
                console.log(type, provider.userData.youtube.status);
            } else {
                provider.userData.youtube[type].status = !provider.userData.youtube[type].status;
            }

            setSwitchStatus();
            provider.setData();
        });
    }

    buttons.reset.addEventListener("click", function(event){
        provider.resetData(setSwitchStatus);
        console.log("resetting");
        // initialiseAll();
    });

    buttons.updates.addEventListener("click", () => window.open("https://github.com/oxkDev/Test-Extension-Main", "_blank"))
}
// user.clear();
initialiseAll();