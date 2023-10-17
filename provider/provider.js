const extensionName = "test-extension";

class UserData {
    constructor(data) {
        try {
            this.youtube = {
                status: data.youtube.status != undefined ? data.youtube.status : true,
                short: {
                    status: data.youtube.short.status != undefined ? data.youtube.short.status : true,
                    interval: data.youtube.short.interval != undefined ? data.youtube.short.interval : 5,
                },
                adSkip: {
                    status: data.youtube.adSkip.status != undefined ? data.youtube.adSkip.status : true,
                    auto: data.youtube.adSkip.status != undefined ? data.youtube.adSkip.status : true,
                }
            }
        } catch(e) {
            console.log("data missing: reset data")

            this.youtube = {
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
    }
}

class Provider {
    constructor(name, load = function() {console.log("Loaded data: load unset")}, dataChange = false) {
        this.userData;
        this.name = name;

        this.userStorage = chrome.storage;
        this.dataChangeEvent = new Event("providerUpdate");
        this.dataChange = dataChange

        this.getData(load);
        this.userStorage.sync.onChanged.addListener(() => {
            if (this.dataChange) this.getData(() => dispatchEvent(this.dataChangeEvent));
            else console.log("Data changed: dataChange set to false");
        });
    }

    getData(func) {
        this.userStorage.sync.get(this.name, result => {
            console.log("test-extension: ", result);
            let resUserData = result[this.name];
            if (resUserData){
                this.userData = new UserData(resUserData);
                console.log("userData: ", resUserData, this.userData);
            } else {
                this.userData = new UserData()
                this.setData();
                console.log("new userData: ", this.userData);
            }
            if (func && typeof(func) == 'function') func();
        });
        return this.userData;
    }
    
    resetData(func) {
        this.userData = new UserData();
        this.setData();
        if (func && typeof(func) == 'function') func();
    }
    
    setData() {
        var obj = {}
        obj[this.name] = this.userData;
        this.userStorage.sync.set(obj);
    }
};

// init
// provider.getData();
// function init(){
//   // getting local storage data
//   this.userStorage.sync.get("utilities", function (result) {
//       utilities = result.utilities;
//       console.log(`present?: ${utilities}`);
//       if (!utilities){
//           // this.userStorage.sync.clear;
//           this.userStorage.sync.set({"utilities": DefaultData});
//           utilities = DefaultData;
//           console.log(`create: ${utilities}`);
//       }
//       console.log("instalation finished!");
//   });
// }
