'use strict'
var gMineIdxsM

function updateLives() {
    updateSmiley('😵')
    if (gGame.lives === 2) {
        document.querySelector('.heart2').style.display = 'none'
    } else if (gGame.lives === 1) {
        document.querySelector('.heart1').style.display = 'none'
    } else if (gGame.lives === 0) {
        document.querySelector('.heart0').style.display = 'none'
    }
}

function updateSmiley(smiley) {
    document.querySelector('.smiley span').innerText = smiley
    if (!gGame.isOn || gGame.lives === 0) return
    setTimeout(() => {
        document.querySelector('.smiley span').innerText = '🙂'
    }, 2000)
}

function revealHint(num) {
    if (!gGame.isOn) return
    const currHint = document.querySelector(`.hint${num}`)
    if (currHint.classList.contains('used')) return
    currHint.classList.add('used')
    currHint.style.textShadow = '0 0 20px #FC0, 0 0 30px #FC0, 0 0 40px #FC0, 0 0 50px #FC0'
    gGame.isHint = true
}

function hintReveal(pos) {
    var alreadyShown = []
    var alreadyMarked = []

    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= gLevel.size) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= gLevel.size) continue
            var currCell = gBoard[i][j]
            var elCell = document.querySelector(`.cell-${i}-${j}`)

            if (currCell.isShown) {
                alreadyShown.push(currCell)
                continue
            }
            if (currCell.isMarked) {
                alreadyMarked.push(currCell)
                currCell.isMarked = false
                elCell.classList.remove('marked')
                var text = (currCell.isMine) ? MINE : currCell.minesAroundCount
                if (text === 0) text = ''
                elCell.querySelector('button span').innerText = text
            }
            currCell.isShown = true
            elCell.classList.add('shown')
        }
    }
    setTimeout(() => {
        for (var i = pos.i - 1; i <= pos.i + 1; i++) {
            if (i < 0 || i >= gLevel.size) continue
            for (var j = pos.j - 1; j <= pos.j + 1; j++) {
                if (j < 0 || j >= gLevel.size) continue

                var currCell = gBoard[i][j]
                var elCell = document.querySelector(`.cell-${i}-${j}`)

                if (alreadyShown.includes(currCell)) continue
                if (alreadyMarked.includes(currCell)) {
                    currCell.isMarked = true
                    elCell.classList.add('marked')
                    elCell.querySelector('button span').innerText = MARK
                }
                currCell.isShown = false
                elCell.classList.remove('shown')
            }
        }
    }, 1000)
}

function safeClick(elBtn) {
    if (!gGame.isOn) return

    const emptyCells = []
    for (var i = 0; i < gLevel.size; i++) {
        for (var j = 0; j < gLevel.size; j++) {
            const cell = gBoard[i][j]
            if (!cell.isMine && !cell.isShown && !cell.isMarked) emptyCells.push({ i, j })
        }
    }
    if (emptyCells.length === 0) return
    elBtn.style.display = 'none'
    const chosenCell = emptyCells[getRandomInt(0, emptyCells.length)]
    const elCell = document.querySelector(`.cell-${chosenCell.i}-${chosenCell.j}`)
    elCell.style.transition = 'box-shadow 0.5s ease'
    elCell.style.boxShadow = '0 0 20px aquamarine, 0 0 30px aquamarine'
    setTimeout(() => {
        elCell.style.boxShadow = 'none'
    }, 2000)
}

function manualPositioning() {
    document.querySelector('.levelBtns .manual').classList.add('active')
    if (typeof gLevel !== 'undefined') buildBoardManual(gLevel.size, gLevel.mines)
    else buildBoardManual(8, 14)
    gGame.mineCount = gLevel.mines
    document.querySelector('.markCount span').innerText = gGame.mineCount
    gMineIdxsM = []
}

function buildBoardManual(size, mines) {
    gLevel = {
        size,
        mines
    }
    gBoard = []
    for (var i = 0; i < size; i++) {
        gBoard[i] = []
        for (var j = 0; j < size; j++) {
            gBoard[i][j] = {
                minesAroundCount: 0,
                isShown: true,
                isMine: false,
                isMarked: false
            }
        }
    }
    renderBoardManual()
}

function renderBoardManual() {
    var tableStr = ''
    for (var i = 0; i < gLevel.size; i++) {
        tableStr += `<tr>`
        for (var j = 0; j < gLevel.size; j++) {

            tableStr += `<td><button onclick="placeMine(this, {i: ${i}, j: ${j}})" 
            class="cell-${i}-${j} shown"><span></span></button></td>`
        }
        tableStr += `</tr>`
    }
    const elTable = document.querySelector('tbody')
    elTable.innerHTML = tableStr
}

function placeMine(elCell, pos) {
    if (gBoard[pos.i][pos.j].isMine) {
        const idx = gMineIdxsM.findIndex(position => (position.i === pos.i) && (position.j === pos.j))
        gMineIdxsM.splice(idx, 1)
        gBoard[pos.i][pos.j].isMine = false
        elCell.classList.remove('mine')
        gGame.mineCount++
        document.querySelector('.markCount span').innerText = gGame.mineCount
        renderCell(pos, null)
    } else {
        gMineIdxsM.push(pos)
        gBoard[pos.i][pos.j].isMine = true
        elCell.classList.add('mine')
        gGame.mineCount--
        document.querySelector('.markCount span').innerText = gGame.mineCount
        renderCell(pos, MINE)

    }

    if (gGame.mineCount <= 0) {
        for (var i = 0; i < gLevel.size; i++) {
            for (var j = 0; j < gLevel.size; j++) {
                gBoard[i][j].isShown = false
            }
        }
        document.querySelector('.levelBtns .manual').classList.remove('active')
        gMineIdxs = gMineIdxsM
        setMinesNeighsCount(gMineIdxs)
        renderBoard()

        gGame.mineCount = gLevel.mines
        document.querySelector('.markCount span').innerText = gGame.mineCount
    }
}

function resetAll() {
    if (gTimerInterval) clearInterval(gTimerInterval)
    if (!document.querySelector('.modal').classList.contains('hide')) hideModal()
    if (document.querySelector('.levelBtns .manual').classList.contains('active')) {
        document.querySelector('.levelBtns .manual').classList.remove('active')
    }
    document.querySelector('.markCount span').innerText = gGame.mineCount
    document.querySelector('.stopwatch span').innerText = gGame.secsPassed
    if (gBoard) var gBoard
    document.querySelector('.smiley span').innerText = '🙂'

    document.querySelector('.heart0').style.display = 'block'
    document.querySelector('.heart1').style.display = 'block'
    document.querySelector('.heart2').style.display = 'block'

    for (var i = 1; i < 4; i++) {
        const currHint = document.querySelector(`.hint${i}`)
        if (currHint.classList.contains('used')) {
            currHint.classList.remove('used')
            currHint.style.textShadow = 'none'
        }
    }

    document.querySelector('.click1').style.display = 'block'
    document.querySelector('.click2').style.display = 'block'
    document.querySelector('.click3').style.display = 'block'
}

function showInstructions() {
    const msg = `
    <h1>Instructions</h1>
    <div>
        <p>Minesweeper is a game where mines are hidden in a grid of squares. Safe squares have numbers telling you how many mines touch the square. You can use the number clues to solve the game by opening all of the safe squares. If you click on 3 mines you lose the game!</p>
        <p>You open squares with the left mouse button and put flags on mines with the right mouse button.</p>
        <p>A counter shows the number of mines without flags, and a clock shows your time in seconds.</p>
        <p>The game ends when all safe squares have been opened.</p>
    </div>

    <div>
        <h2>Hints</h2>
        <p>When a hint is activated, the cell clicked next and its neighbors are revealed for a second before disappearing.</p>
    </div>

    <div>
        <h2>Safe Clicks</h2>
        <p>When clicking a Safe-Click button, a random hidden cell that is safe to click will glow momentarily.</p>
    </div>

    <div>
        <h2>Manual positioning</h2>
        <p>The user first positions the mines (by clicking cells) and then plays on the board he built.</p>
    </div>
        `
    showModal(null, msg)
}