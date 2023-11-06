const extensionName = "test-extension";

class UserData {
    constructor(data) {
        this.needSet = false;

        this.youtube;

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
            }
        }

        if (data) this.update(data);
    }

    iterate(def, value) {
        if (value == undefined) {
            this.needSet = true;
            console.log("missing parameter: ", def, value);
            return def
        }

        if (typeof(def) == "object") {
            let obj = {};
            for (const k in def) {
                obj[k] = this.iterate(def[k], value[k]);
            } 
            return obj;
        }

        return value
    }

    update(data) {
        this.needSet = false;
        if (!data) {
            console.log("no data:", data);
            data = this.default;
            this.needSet = true;
        }

        for (const t in this.default) {
            this[t] = this.iterate(this.default[t], data[t]);
        }

        return this.needSet;
    }

    get(name) {
        let obj = {}
        for (const t in this.default) {
            obj[t] = this[t];
        }
        
        if (name) obj[name] = obj;
        
        return obj
    }
}

class Provider {
    constructor(name, load = function() {console.log("Loaded data: load unset")}, dataChange = true) {
        this.userData = new UserData(false);
        this.name = name;

        this.userStorage = chrome.storage;
        this.dataChange = dataChange

        this.getData(load);
        this.userStorage.sync.onChanged.addListener(() => {
            if (this.dataChange) this.getData(() => {console.log("providerUpdate: ", this.userData); dispatchEvent(new Event("providerUpdate"))});
            else console.log("Data changed: dataChange set to false");
        });
    }

    getData(func) {
        this.userStorage.sync.get(this.name, result => {
            console.log(`${this.name}: `, result);
            let resUserData = result[this.name];

            if (this.userData.update(resUserData)) this.setData();
            console.log("userData: ", resUserData, this.userData);
            
            if (func && typeof(func) == 'function') func();
        });
        return this.userData;
    }
    
    resetData(func) {
        this.userData.update();
        this.setData();
        if (func && typeof(func) == 'function') func();
    }
    
    setData() {
        this.userStorage.sync.set(this.userData.get(this.name));
    }
};
