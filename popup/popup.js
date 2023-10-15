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
        // let type = s;
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

    resetButton.addEventListener("click", function(event){
        provider.resetData(setSwitchStatus);
        console.log("resetting");
        // initialiseAll();
    });
}
// user.clear();
initialiseAll();