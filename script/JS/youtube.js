

class YoutubeAddons {
    constructor(ytData) {
        this.status = ytData.status
        this.interval = ytData.interval

        this.sortsSelectors = ["#shorts-player > div.html5-video-container > video"]
        this.enable(this.status)
        console.log("init yt addons")
    }

    
    events = {
        "ArrowRight": function() {
            shortVid.currentTime += change
        },
        "ArrowLeft": function() {
            shortVid.currentTime -= change
        }
    }

    keydown(e) {
        let i = 0
        var shortVid
        console.log()
        while (!shortVid && i < this.sortsSelectors.length) {
            shortVid = document.querySelector(this.sortsSelectors[i])
            i += 1
        }
        
        let events = {"ArrowLeft": -1, "ArrowRight": 1}

        if (shortVid && e.key in events) {
            let interval = this.interval
            if (e.shiftKey) {
                shortVid.pause();
                interval = 1/30;
            }
            
            shortVid.currentTime += events[e.key] * interval
        }
    }

    enable(enable = true) {
        this.status = enable

        if (this.status) {
            document.addEventListener("keydown", e => this.keydown(e))
        } else {
            document.removeEventListener("keydown", e => this.keydown(e))
        }
    }

    dataChange(ytData) {
        this.enable(ytData.status)
        this.interval = ytData.interval

    }
}

window.onload = () => {

    var addon
    var provider = new Provider(extensionName, () => {addon = new YoutubeAddons(provider.userData.youtube)})
    
    
    provider.dataChange = function(e) {
        addon.dataChange(provider.userData.youtube)
    }
}