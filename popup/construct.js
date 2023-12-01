
class Construct {
    constructor() {
        this.provider;
        this.switches = {};
        this.buttons = {
            reset: document.querySelector("div#reset.mainButton"),
            update: document.querySelector("div#update.mainButton"),
        };

        this.wpm = document.querySelector("input#wpm");

        this.provider = new Provider((data) => this.init(data));
    }

    iterator(data, func = (path, value) => console.log(path, value), path = []) {
        if (typeof(data) == "object") {
            for (const k in data) {
                this.iterator(data[k], func, [...path, k]);
            }
        } else func(path, data);
    }

    async init(refData) {
        // --------------------------------------------------------------------------- set buttons
        this.buttons.reset.addEventListener("click", () => {
            console.log("resetting");
            this.provider.resetData();
        });

        this.buttons.update.addEventListener("click", () => window.open("https://github.com/oxkDev/Test-Extension-Main/releases", "_blank"));

        // --------------------------------------------------------------------------- get switches
        this.iterator(refData, (path, val) => {
            if (typeof(val) == "boolean") {
                let selector = document.querySelector(`#${path.join(" #")}.switch`)
                if (selector) {
                    this.switches[path.join(".")] = selector;
                    
                    selector.addEventListener("click", () => {
                        this.provider.userData.setByPath(path);

                        this.provider.setData();
                    });
                } else console.log("missing switch", selector, `#${path.join(" #")}`);
            }
        });

        this.setSwitchStatus(true);

        // --------------------------------------------------------------------------- get wpm
        this.wpm.addEventListener("paste", e => e.preventDefault());
        this.wpm.addEventListener("keypress", e => {
            let isInt = str => "0123456789".indexOf(str) != -1;
            if (!isInt(e.key)) {
                e.preventDefault();
                return;
            }
        });
        this.wpm.addEventListener("input", e => {
            console.log(this.wpm.value)
            if (this.wpm.value.length > 3) this.wpm.value = this.wpm.value.slice(this.wpm.value.length-3);
        });
        this.wpm.addEventListener("focusout", e => {
            let value = parseInt(this.wpm.value);
            if (value > 350) value = 350;
            if (value < 1) value = 1;
            this.wpm.value = value;

            this.provider.userData.monkeytype.wpm = value;

            this.provider.setData();
            this.wpm.style
        });

        this.wpm.value = this.provider.userData.monkeytype.wpm;

        // --------------------------------------------------------------------------- set provider update

        addEventListener("providerUpdate", e => {
            console.log(e);
            this.setSwitchStatus();
            this.wpm.value = this.provider.userData.monkeytype.wpm;
        });
    }

    setSwitchStatus(gradual = false) {
        const setSwitch = (path) => this.switches[path].classList.toggle("enabled", this.provider.userData.getByPath(path.split(".")));

        if (gradual) {
            let i = 0;
            for (const path in this.switches) setTimeout(() => setSwitch(path), i++ * 50);
        } else for (const path in this.switches) setSwitch(path);
    }
}

// const groups = {
//     youtube: document.querySelector("div#youtube.group"), 
// }

// const settings = {
//     youtube: {
//         status: document.querySelector("div#youtube .groupHeader > #status.switch"),
//         short: document.querySelector("div#youtube #short > #status.switch"),
//         adSkip: document.querySelector("div#youtube #adSkipper > #status.switch"),
//     },
// }

// function setSwitchStatus() {
//     console.log(`setSwitchStatus():`, provider.userData);
//     // setTimeout(() => {
//         for (const type in settings.youtube) {
//             let value;
//             if (type == "status") {
//                 value = provider.userData.youtube.status;
//                 groups.youtube.classList.toggle("disabled", !value)
//             } else {
//                 value = provider.userData.youtube[type].status;
//             }
//             console.log(type, provider.userData.youtube[type])
//             settings.youtube[type].classList.toggle("enabled", value);
//         }
//     // }, 100);
// }