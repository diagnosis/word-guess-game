import CreateBoard from "./CreateBoard.js";

class ApiCalls{
    constructor(){

    }
    async getWord(){
        const response = await fetch('https://words.dev-apis.com/word-of-the-day')
        const json  = await response.json()
        return json.word;
    }
    async validateIfRealWord(val){
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                word: `${val}`
            })

        }
        const response = await fetch('https://words.dev-apis.com/validate-word',requestOptions)
        const data = await response.json()
        return data.validWord;
    }

}



class UserInput {

    constructor() {
        this.gameBoard = document.querySelector('.game-board')
        this.apicalls = new ApiCalls()
        this.board = new CreateBoard()
        this.currentRow = null
        this.round = 0
        this.currentInput = null
        this.currentVal = null
        this.word = new Array(5).fill(null)
        this.enableCurrentRow()
        this.gameBoard.addEventListener('keyup', (e) => {
            if (e.key === 'Backspace') {
                this.handleBackspace(e)
                return
            }
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') this.handleArrowKey(e)
            if (e.key === 'Enter') this.handleEnter(e)

        })
        this.gameBoard.addEventListener('input', this.handleInput.bind(this))

    }

    enableCurrentRow() {
        this.currentRow = document.querySelector(`.row${this.round}`)
        Array.from(this.currentRow.children).forEach(child => child.firstChild.disabled = false)
    }

    disableCurrentRow() {
        this.currentRow = document.querySelector(`.row${this.round}`)
        Array.from(this.currentRow.children).forEach(child => child.firstChild.disabled = true)
    }


    handleInput(e) {
        this.currentInput = e.target
        this.currentVal = this.currentInput.value
        if (!this.isLetter(this.currentVal)) {
            this.handleNotLetter()
        } else {
            this.handleLetter()
            this.getNext()
        }
    }

    handleLetter() {
        const className = this.currentInput.className
        const index = Number.parseInt(className.split('-')[1])
        this.word[index] = this.currentVal

    }

    handleBackspace(e) {
        this.currentInput = e.target
        const className = this.currentInput.className
        const index = Number.parseInt(className.split('-')[1])
        if (this.currentInput.value === null || this.currentInput.value === '') {
            this.word[index] = null
        }

        console.log(this.word)
        this.getPrev()
    }

    handleArrowKey(e) {
        this.currentInput = e.target
        if (e.key === 'ArrowRight') {
            this.getNext()
        } else {
            this.getPrev()
        }
    }


    handleNotLetter() {
        this.currentInput.value = ''
    }

    async handleEnter() {
        if (new Set(this.word).has(null)) return;
        this.currentInput.blur()
        const userInput = this.word.join('').toLowerCase()

        const isValid = await this.apicalls.validateIfRealWord(userInput)
        if (!isValid) this.getBorderAnimation()
        else {
            this.disableCurrentRow()
            await this.validateWordMatch(await this.apicalls.getWord())
            this.round++
            if(this.round>5){
                alert('You Lost')
                return;
            }
            this.enableCurrentRow()

        }

    }

    async validateWordMatch(correctWord) {
        console.log(correctWord)
        if (this.word.join('').toLowerCase() === correctWord) {
            alert('you win')
            document.querySelector('h1').animate(
                [
                    { color: 'red' },
                    { color: 'blue' },
                    { color: 'grey' },
                    { color: 'green' },
                    { color: 'purple' },
                    { color: 'orange' },
                    { color: 'red' }
                ],
                {
                    duration: 2000,
                    iterations: 10
                }
            );
        }
        const correctArray = correctWord.split('')
        const row = Array.from(this.currentRow.children)
        const correctObj = {}
        for (let el of correctArray) {
            correctObj[el] = (correctObj[el] || 0) + 1
        }

        const colors = Array(this.word.length).fill('grey');


        for (let i = 0; i < this.word.length; i++) {
            if (this.word[i] === correctArray[i]) {
                colors[i] = 'green';
                correctObj[this.word[i]] = (correctObj[this.word[i]] || 1) - 1;
            }
        }

        for (let i = 0; i < this.word.length; i++) {
            if (colors[i] === 'grey' && correctObj[this.word[i]] > 0) {
                colors[i] = 'yellow';
                correctObj[this.word[i]]--;
            }
        }
        for(let i = 0; i < colors.length; i++){
            row[i].style.backgroundColor = colors[i]
        }


    }


    getNext(){
        const nextDiv = this.currentInput.closest('div').nextSibling
        if(!nextDiv) return;
        this.currentInput  = nextDiv.firstChild
        this.currentInput.focus()


    }
    getPrev(){
        const nextDiv = this.currentInput.closest('div').previousSibling
        if(!nextDiv) return;
        this.currentInput  = nextDiv.firstChild
        this.currentInput.focus()
    }
    isLetter(letter) {
        return /^[a-zA-Z]$/.test(letter);
    }
    getBorderAnimation(){
        Array.from(this.currentRow.children).forEach( child =>{
            child.animate(
                {border:['2px solid black','5px solid red','2px solid black']},
                {
                    duration:2000,
                    iterations:1
                }
            )
        })
    }

}

new UserInput()














