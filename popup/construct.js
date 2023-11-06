
const groups = {
    youtube: document.querySelector("div#youtube.group"), 
}

const settings = {
    youtube: {
        status: document.querySelector("div#youtube .groupHeader > #status.switch"),
        short: document.querySelector("div#youtube #short > #status.switch"),
        adSkip: document.querySelector("div#youtube #adSkipper > #status.switch"),
    },
}

const buttons = {
    reset: document.querySelector("div#reset.mainButton"),
    update: document.querySelector("div#update.mainButton"),
}

function setSwitchStatus() {
    console.log(`setSwitchStatus():`, provider.userData);
    // setTimeout(() => {
        for (const type in settings.youtube) {
            let value;
            if (type == "status") {
                value = provider.userData.youtube.status;
                groups.youtube.classList.toggle("disabled", !value)
            } else {
                value = provider.userData.youtube[type].status;
            }
            console.log(type, provider.userData.youtube[type])
            settings.youtube[type].classList.toggle("enabled", value);
        }
    // }, 100);
}