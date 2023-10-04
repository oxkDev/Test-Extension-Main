var userData;

var extensionName = "test-extension"

console.log("Provider load: ", extensionName)

class UserData {
    constructor(data) {
        try {
            this.youtube = {
                status: data.youtube.status != undefined ? data.youtube.status : true,
                interval: data.youtube.interval || 5,
            }
        } catch(e) {
            console.log(e)

            this.youtube = {
                status: true,
                interval: 5,
            }
        }
    }
}

class Provider {
    constructor(name, load) {
        this.userData;
        this.name = name;

        this.userStorage = chrome.storage;
        this.dataChange = () => console.log("dataChange Unset");

        this.getData(load);
        this.userStorage.sync.onChanged.addListener(() => this.getData(this.dataChange))
    }

    getData(func) {
        this.userStorage.sync.get(this.name, result => {
            console.log("test-extension: ", result);
            this.userData = result[this.name];
            if (this.userData){
                this.userData = new UserData(this.userData)
                if (func) func();
                console.log("userData: ", this.userData);
            } else {
                this.userData = new UserData()
                this.setData();
                if (func) func();
                console.log("new userData: ", this.userData);
            }
        });
        return this.userData;
    }
    
    resetData(func) {
        this.userData = new UserData();
        this.setData();
        if (func) func();
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
