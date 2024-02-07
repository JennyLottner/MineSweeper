'use strict'
var MINE = '💣'

var gBoard
var gLevel
var gGame
var gTimerInterval
var gStartTime

function onInit() {
    if (gTimerInterval) clearInterval(gTimerInterval)
    if (gBoard) var gBoard
    if (!document.querySelector('.modal').classList.contains('hide')) hideModal()
    gGame = {
        inOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        lives: 3,
        hints: 3,
        safeClick: 3
    }
    resetAll()
    if (gLevel) buildBoard(gLevel.size, gLevel.mines)
    
}

function buildBoard(size, mines) {
    gLevel = {
        size,
        mines
    }
    var mineIdxs = getMineIdxs()

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
            for (var idx = 0; idx < mineIdxs.length; idx++) {
                const mineIdx = mineIdxs[idx]
                if (mineIdx.i === i && mineIdx.j === j) {
                    gBoard[i][j].isMine = true
                }
            }
        }
    }
    setMinesNeighsCount(mineIdxs)
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

            tableStr += `<td><button onclick="onCellClicked(this, {i: ${i}, j: ${j}})" 
            oncontextmenu="onCellMarked(event, this, {i: ${i}, j: ${j}})" class="${className}">
            <span>${item}</span></button></td>`
        }
        tableStr += `</tr>`
    }
    const elTable = document.querySelector('tbody')
    elTable.innerHTML = tableStr
}

function getMineIdxs() {
    const mineIdxs = []
    outer:
    for (var idx = 0; idx < gLevel.mines; idx++) {
        const newIdx = { i: getRandomInt(0, gLevel.size), j: getRandomInt(0, gLevel.size) }
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
    const cell = gBoard[pos.i][pos.j]
    //beginning of the game
    if (gGame.shownCount === 0 && cell.isMine) {
        buildBoard(gLevel.size, gLevel.mines)
        onCellClicked(elCell, pos)
        return
    }
    if (gGame.shownCount === 0) {
        gGame.isOn = true
        gStartTime = Date.now()
        startTimer()
    }
    //continuation
    if (cell.isShown || cell.isMarked) return
    if (cell.isMine) {
        gGame.lives--
        updateLives()
        cell.isShown = true
        elCell.classList.add('shown')
    }
    if (cell.minesAroundCount > 0) {
        cell.isShown = true
        gGame.shownCount++
        elCell.classList.add('shown')
    } else if (cell.minesAroundCount === 0 && !cell.isMine) expandShown(pos)
    // renderBoard()
    checkGameOver()
}

function expandShown(pos) {
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= gLevel.size) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= gLevel.size) continue
            var cell = gBoard[i][j]

            if (!cell.isShown) {
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
    const cell = gBoard[pos.i][pos.j]

    if (!cell.isMarked && !cell.isShown) {
        cell.isMarked = true
        elCell.classList.add('marked')
        elCell.querySelector('button span').innerText = '🚩'
    } else if (!cell.isMarked) {
        return
    } else {
        cell.isMarked = false
        elCell.classList.remove('marked')
        elCell.querySelector('button span').innerText = cell.minesAroundCount
    }
}

function checkGameOver() {
    if (gGame.lives > 0 && (gGame.shownCount !== (gLevel.size ** 2 - gLevel.mines))) return
    const msg = (gGame.lives) ? 'You Win!' : 'Game Over'
    var smiley = (gGame.lives) ? '😁' : '💀'
    updateSmiley(smiley)
    clearInterval(gTimerInterval)
    showModal(msg)
    gGame.isOn = false
}