class CreateBoard{
    constructor() {
        this.gameBoard = document.querySelector('.game-board')
        this.createBoard()
    }
    createRow = (row) =>{
        const div = document.createElement('div')
        div.style.display = 'flex'
        div.className = `row${row}`
        return div
    }
    createBox = (box) => {
        const div = document.createElement('div');
        div.className = `game-box-${box}`; // Unique class name to avoid conflicts
        div.style.width = '50px';
        div.style.height = '50px';
        div.style.margin = '10px';
        div.style.border = '2px solid black'; // More visible color for testing
        div.style.boxSizing = 'border-box'; // Ensure consistent sizing
        const input = document.createElement('input');
        input.disabled = true
        input.className = `input-${box}`
        input.style.width = '100%'; // Fit input to div
        input.style.height = '100%';
        input.style.padding = '0';
        input.style.border = 'none'; // Remove default input border
        input.style.boxSizing = 'border-box';
        input.setAttribute('maxlength', '1');
        input.style.textAlign = 'center'
        input.style.fontSize = '32px'
        input.style.textTransform = 'uppercase'
        div.appendChild(input);
        return div;
    }
    createBoard = ()=>{
        for(let i = 0; i < 6; i++){
            const row = this.createRow(i)
            for(let j=0; j < 5; j++){
                const box = this.createBox(j)
                row.appendChild(box)
            }
            this.gameBoard.appendChild(row)
        }
    }

}

export default CreateBoard






