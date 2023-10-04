function initialiseAll(){
    // getting local storage data
    provider.getData(setSwitchStatus);
}

function eventListeners(){
    console.log(settings)
    settings.youtube["status"].addEventListener("click", function(event){
            provider.userData.youtube.status = !provider.userData.youtube.status;
            console.log(provider.userData.youtube.status)
            setSwitchStatus();
            provider.setData();
    });
    // themeButton.addEventListener("click", function(event){
    //     themeButtons[userData.styles.utilData.themeNumber].setAttribute("active", 0);
    //     if (userData.styles.utilData.themeNumber >= themes.length - 1) userData.styles.utilData.themeNumber = 0;
    //     else userData.styles.utilData.themeNumber += 1;
    //     themeButtons[userData.styles.utilData.themeNumber].setAttribute("active", 1);
    //     setColours();
    //     provider.setData();
    //     console.log("change theme: ", userData.styles.utilData.themeNumber);
    // });
    resetButton.addEventListener("click", function(event){
        provider.resetData(setSwitchStatus);
        console.log("resetting");
        // initialiseAll();
    });
}
// user.clear();
initialiseAll();
eventListeners();