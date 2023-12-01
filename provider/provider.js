const extensionName = "test-extension", extensionVersion = "0.1";

class UserData {
    constructor(version) {
        this.needSet = false;

        this.version = version;
        this.allDefaults;

        this.default = {
            youtube: {
                status: true,
                short: {
                    status: true,
                    interval: 5,
                },
                adSkip: {
                    status: true,
                    auto: true
                }
            },
            monkeytype: {
                status: true,
                wpm: 120,
            }
        }

        this.youtube = this.default.youtube;
        this.monkeytype = this.default.monkeytype;
    }

    async init(data) {
        this.allDefaults = await fetch(chrome.runtime.getURL("provider/versions.json")).then(r => r.json());
        
        console.log(this.allDefaults);
        if (data) this.update(data);
    }

    getDefault(version = this.version) {
        function iterator(obj) {

            if (Array.isArray(obj)) return obj[1];
            
            if (typeof(obj) == "object") {
                let subObj = {};
                for (const k in obj) subObj[k] = iterator(obj[k]);
                
                return subObj;
            }
            
            return obj;
        }
        
        return version == this.version ? this.default : iterator(this.allDefaults[version]);
    }

    update(data) {
        let iterator = (def, value) => {
            if (value == undefined) {
                this.needSet = true;
                console.log("missing parameter: ", def, value);
                return def
            }
    
            if (typeof(def) == "object") {
                let obj = {};
                for (const k in def) {
                    obj[k] = iterator(def[k], value[k]);
                } 
                return obj;
            }
    
            return value
        }
        
        this.needSet = false;
        if (!data) {
            console.log("no data:", data);
            data = this.default;
            this.needSet = true;
        }

        for (const t in this.default) {
            this[t] = iterator(this.default[t], data[t]);
        }

        return this.needSet;
    }

    getByPath(path = []) {
        return path.reduce((v, p) => v[p], this.get());
    }

    setByPath(path = [], value) {
        let data = this;
        let i;
        for (i = 0; i < path.length - 1; i++) data = data[path[i]];

        if (!value && typeof(data[path[i]]) == "boolean") data[path[i]] = !data[path[i]];
        else data[path[i]] = value;
    }

    get(name, version = this.version) {
        const obj = {}
        for (const t in this.default) {
            obj[t] = this[t];
        }
        
        if (name) {
            const returnObj = {}
            returnObj[name] = {...obj};
            returnObj["version"] = version;
            return returnObj;
        }

        return obj;
    }
}

class Provider {
    constructor(load = function(data) {console.log("Loaded data: load unset")}, dataChange = true, initialise = true, version = extensionVersion) {
        this.name = "test-extension";
        this.version = version;
        this.userData = new UserData(this.version);

        this.userStorage = chrome.storage;
        this.dataChange = dataChange;

        if (initialise) this.init(load);
    }
    
    async init(handler) {
        await this.userData.init();
        this.getData(handler);

        this.userStorage.sync.onChanged.addListener((e) => {
            if (this.dataChange) this.getData(() => {console.log("providerUpdate: ", e); dispatchEvent(new CustomEvent("providerUpdate", {detail: {e: e}}))});
            else console.log("Data changed: dataChange set to false");
        });
    }

    async getData(handler = data => {}) {
        let result = await this.userStorage.sync.get(this.name)
        let resUserData = result[this.name];
        // console.log(`${this.name}: `, result);

        if (this.userData.update(resUserData)) this.setData();
        console.log("getData: ", resUserData, this.userData);
        
        if (handler && typeof(handler) == 'function') handler(this.userData.get());

        return this.userData.get();
    }
    
    resetData(handler = () => {}) {
        this.userData.update();
        console.log("resetData: ", this.userData)
        this.setData();
        if (handler && typeof(handler) == 'function') handler();
    }
    
    setData(data = this.userData.get(this.name)) {
        console.log("setData: ", data)
        this.userStorage.sync.set(data);
    }
};