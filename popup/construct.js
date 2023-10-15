var colourVariables;

const settings = {
    youtube: {
        status: document.querySelector("div#youtube .groupHeader > #status.switch"),
        short: document.querySelector("div#youtube #short > #status.switch"),
        adSkip: document.querySelector("div#youtube #adSkipper > #status.switch"),
    },
}

var resetButton = document.querySelector("div#reset.mainButton");

function setSwitchStatus() {
    console.log(`setSwitchStatus():`, provider.userData);
    setTimeout(() => {
        for (const type in settings.youtube) {
            let value;
            if (type == "status") {
                value = provider.userData.youtube.status;
            } else {
                value = provider.userData.youtube[type].status;
            }
            console.log(type, provider.userData.youtube[type])
            settings.youtube[type].classList.toggle("enabled", value);
        }
    }, 100);
}