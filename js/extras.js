'use strict'
var gMineCountM = 0
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

function darkMode() {
    var darkModeInput = document.getElementById('darkModeInput');
    darkModeInput.value = (darkModeInput.value === 'true') ? 'false' : 'true'

    document.documentElement.classList.toggle('dark-mode', darkModeInput.value === 'true')
}

function manualPositioning() {
    document.querySelector('.levelBtns .manual').classList.add('active')
    gMineCountM = 0
    gMineIdxsM = []
    if (typeof gLevel !== 'undefined') buildBoardManual(gLevel.size, gLevel.mines)
    else buildBoardManual(8, 14)
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
    if (gBoard[pos.i][pos.j].isMine) return
    gMineIdxsM.push(pos)
    gBoard[pos.i][pos.j].isMine = true
    elCell.classList.add('mine')
    gMineCountM++
    renderCell(pos, MINE)

    if (gMineCountM >= gLevel.mines) {
        for (var i = 0; i < gLevel.size; i++) {
            for (var j = 0; j < gLevel.size; j++) {
                gBoard[i][j].isShown = false
            }
        }
        document.querySelector('.levelBtns .manual').classList.remove('active')
        setMinesNeighsCount(gMineIdxsM)
        renderBoard()
    }
}

function resetAll() {
    if (gTimerInterval) clearInterval(gTimerInterval)
    if (!document.querySelector('.modal').classList.contains('hide')) hideModal()
    if (document.querySelector('.levelBtns .manual').classList.contains('active')) {
        document.querySelector('.levelBtns .manual').classList.remove('active')
    }
    document.querySelector('.markCount span').innerText = gGame.markedCount
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
    gMineCountM = 0
}