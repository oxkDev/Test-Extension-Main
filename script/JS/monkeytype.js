
class MonkeytypeCheat {
    constructor(monkeytypeData) {
        this.status = false;
        this.wpm = 100;
        this.text = [];
        this.timer = {
            runner: 0,
            start: () => {this.timer.runner = new Date().getTime()},
            passed: () => (new Date().getTime() - this.timer.runner),
        };

        this.keyCombi = {
            key: "Enter",
            ctrl: true,
            shift: true,
        }

        this.timeout;

        this.selectors = {
            active: "#words .word.active",
            remaining: "#words .word.active ~ .word",
            all: "#words .word",
        }

        this.cheat = this.cheat.bind(this);
        this.stopCheat = this.stopCheat.bind(this);

        this.update(monkeytypeData);
    }

    update(data) {
        console.log("mtdata update: ", data)
        this.wpm = data.wpm;
        
        if (data.status != this.status) {
            this.status = data.status;

            if (this.status) {
                document.addEventListener("click", this.stopCheat);
                document.addEventListener("keydown", this.cheat);
            } else {
                this.stopCheat();
                document.removeEventListener("click", this.stopCheat);
                document.removeEventListener("keydown", this.cheat);

            }
        }
    }

    stopCheat() {
        clearTimeout(this.timeout);
    }

    cheat(e) {
        let i = 0;
        let word = document.querySelector(this.selectors.active);

        if (word || !this.timeout) {
            this.text = [word.textContent];

            console.log("detect: ", this.text, word);

            if (e.key == this.keyCombi.key && e.ctrlKey == this.keyCombi.ctrl && e.shiftKey == this.keyCombi.shift) {
                console.log("start: ", this.text.join(" "), this.text.join(" ").length / this.text.length, this.wpm);
                this.timeout = setTimeout(() => {
                    this.timer.start();
                    this.nextText(word.textContent + " ");
                }, 200);
            } else {
                this.stopCheat();
                console.log("stopped")
            }

        } else console.log("no word: ", word)
    }
    
    nextText(word, index = 0) {
        if (!this.status) return false;

        if (index >= word.length) {
            console.log("next", this.timer.passed());

            let i = 0;
            word = document.querySelector(this.selectors.active);

            index = 0;
            
            if (word) {
                this.text.push(word.textContent);
                word = word.textContent + " ";
            } else {
                console.log(`end: ${this.timer.passed()}ms, ${this.text.length} words, ${(this.text.length / this.timer.passed()) * 60000}`)
                return false;
            }
        }

        
        document.execCommand("insertText", false, word[index]);
        this.timeout = setTimeout(() => this.nextText(word, index+1), this.getInterval(word.length));
    }

    getInterval(wordLength) {
        let words = document.querySelectorAll(this.selectors.all);

        let interval = ((60000 / this.wpm) - (this.timer.passed() / this.text.length))*(this.text.length > 10); // matching up target seconds per word against ongoing seconds per word

        if (wordLength && words.length < 50) { // when total words is less tahn 50: exact interval for each letter
            if (wordLength < 4) wordLength = 5;
            interval += (60000 / this.wpm) / wordLength;
        } else {
            // when total words is 50 or more: general word length through summation of all words and their word lengths then finding average

            let charCount = 0;

            let remaining = document.querySelectorAll(this.selectors.remaining);
        
            if (remaining.length < 50) words = remaining; // Uses only remaining words for more accuracy if number of remaining words is less than 50
            
            for (let elm = 0; elm < words.length; elm++) {
                charCount += words[elm].textContent.length + 1;
            }
            
            interval += (words.length * 60000 / this.wpm / charCount);
        }

        return interval;
    }
}