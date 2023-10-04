var colourVariables;

const settings = {
    youtube: {
        "status": document.querySelector("div#youtube #status.switch"),
    },
}

var resetButton = document.querySelector("div#reset.mainButton");

provider = new Provider(extensionName, e => console.log("data change: ", e))

function setSwitchStatus() {
    console.log(`setSwitchStatus():`, provider.userData);
    setTimeout(() => {
        settings.youtube["status"].classList.toggle("enabled", provider.userData.youtube.status);
    }, 100);
}