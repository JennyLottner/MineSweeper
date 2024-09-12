'use strict'
var MINE = '💣'
var MARK = '🚩'

var gBoard
var gLevel
var gGame
var gTimerInterval
var gStartTime
var gMineIdxs

function onInit(size = null, mines = null) {
    if (size && mines) gLevel = {size, mines}

    gGame = {
        inOn: false,
        shownCount: 0,
        mineCount: mines ? mines : 0,
        secsPassed: 0,
        lives: 3,
        isHint: false,
        hints: 3,
        safeClick: 3
    }

    resetAll()

    if (gLevel) buildBoard(gLevel.size)
}

function buildBoard(size) {
    gBoard = []
    for (var i = 0; i < size; i++) {
        gBoard[i] = []
        for (var j = 0; j < size; j++) {
            gBoard[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    renderBoard()
}

function getMineIdxs(pos) {
    const mineIdxs = []
    outer:
    for (var idx = 0; idx < gLevel.mines; idx++) {
        const newIdx = { i: getRandomInt(0, gLevel.size), j: getRandomInt(0, gLevel.size) }
        if (newIdx.i === pos.i && newIdx.j === pos.j) {
            idx--
            continue outer
        }
        inner:
        for (var i = 0; i < mineIdxs.length; i++) {
            if (mineIdxs[i].i === newIdx.i && mineIdxs[i].j === newIdx.j) {
                idx--
                continue outer
            }
        }
        mineIdxs.push(newIdx)
    }
    return mineIdxs
}

function addMines(pos) {
    gMineIdxs = getMineIdxs(pos)

    for (var idx = 0; idx < gMineIdxs.length; idx++) {
        const mineIdx = gMineIdxs[idx]
        gBoard[mineIdx.i][mineIdx.j].isMine = true
    }
    setMinesNeighsCount(gMineIdxs)
    renderBoard()
}

function renderBoard() {
    var tableStr = ''
    for (var i = 0; i < gLevel.size; i++) {
        tableStr += `<tr>`
        for (var j = 0; j < gLevel.size; j++) {
            const cell = gBoard[i][j]

            var className = `cell-${i}-${j}`
            if (cell.isMine) className += ' mine'
            if (cell.isMarked) className += ' marked'
            if (cell.isShown) className += ' shown'
            var item = (cell.isMine) ? MINE : cell.minesAroundCount
            if (item === 0) item = ''

            tableStr += `<td><button onclick="onCellClicked(this, {i: ${i}, j: ${j}})" 
            oncontextmenu="onCellMarked(event, this, {i: ${i}, j: ${j}})" class="${className}">
            <span>${item}</span></button></td>`
        }
        tableStr += `</tr>`
    }
    const elTable = document.querySelector('tbody')
    elTable.innerHTML = tableStr
}

function setMinesNeighsCount(mineIdxs) {
    for (var idx = 0; idx < mineIdxs.length; idx++) {
        const mineIdx = mineIdxs[idx]
        for (var i = mineIdx.i - 1; i <= mineIdx.i + 1; i++) {
            if (i < 0 || i >= gLevel.size) continue
            for (var j = mineIdx.j - 1; j <= mineIdx.j + 1; j++) {
                if (j < 0 || j >= gLevel.size) continue
                if (i === mineIdx.i && j === mineIdx.j) continue
                var currCell = gBoard[i][j]
                if (!currCell.isMine) currCell.minesAroundCount++
            }
        }
    }
}

function onCellClicked(elCell, pos) {
    //beginning of the game
    if (gGame.shownCount === 0 && !gMineIdxsM) {
        addMines(pos)
    }
    if (gGame.shownCount === 0) {
        gGame.isOn = true
        gStartTime = Date.now()
        startTimer()
        elCell = document.querySelector(`.cell-${pos.i}-${pos.j}`)
    }
    const cell = gBoard[pos.i][pos.j]
    // extras
    if (gGame.isHint) {
        gGame.isHint = false
        hintReveal(pos)
        return
    }
    //continuation
    if (cell.isShown || cell.isMarked || !gGame.isOn) return
    if (cell.isMine) {
        gGame.lives--
        gGame.mineCount--
        updateLives()
        cell.isShown = true
        elCell.classList.add('shown')
        document.querySelector('.markCount span').innerText = gGame.mineCount
    }
    if (cell.minesAroundCount > 0) {
        cell.isShown = true
        gGame.shownCount++
        elCell.classList.add('shown')
    } else if (cell.minesAroundCount === 0 && !cell.isMine) expandShown(pos)
    checkGameOver()
}

function expandShown(pos) {
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= gLevel.size) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= gLevel.size) continue
            var cell = gBoard[i][j]

            if (!cell.isShown && !cell.isMarked) {
                cell.isShown = true
                gGame.shownCount++

                var elCell = document.querySelector(`.cell-${i}-${j}`)
                elCell.classList.add('shown')

                if (cell.minesAroundCount === 0) expandShown({ i, j })
            }
        }
    }
}

function onCellMarked(event, elCell, pos) {
    event.preventDefault()
    if (!gGame.isOn) return
    const cell = gBoard[pos.i][pos.j]

    if (!cell.isMarked && !cell.isShown) {
        cell.isMarked = true
        gGame.mineCount--
        elCell.classList.add('marked')
        elCell.querySelector('button span').innerText = MARK
    } else if (!cell.isMarked) {
        return
    } else {
        gGame.mineCount++
        cell.isMarked = false
        elCell.classList.remove('marked')
        var replacement = (cell.isMine) ? MINE : cell.minesAroundCount
        if (replacement === 0) replacement = ''
        elCell.querySelector('button span').innerText = replacement
    }
    document.querySelector('.markCount span').innerText = gGame.mineCount
}

function checkGameOver() {
    if (gGame.lives > 0 && (gGame.shownCount !== (gLevel.size ** 2 - gLevel.mines))) return
    gGame.isOn = false
    clearInterval(gTimerInterval)
    const msg = (gGame.lives) ? 'You Win!' : 'Game Over'
    showModal('status', msg)
    var smiley = (gGame.lives) ? '😁' : '💀'
    updateSmiley(smiley)
    if (!gGame.lives) {
        for (var i = 0; i < gMineIdxs.length; i++) {
            const currMine = gMineIdxs[i]
            gBoard[currMine.i][currMine.j].isShown = true
            document.querySelector(`.cell-${currMine.i}-${currMine.j}`).classList.add('shown')
        }
    }
}