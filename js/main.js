'use strict'
var MINE = '💣'

var gBoard
var gLevel
var gGame
var gTimerInterval
var gStartTime

function onInit() {
    if (gTimerInterval) clearInterval(gTimerInterval)
    gGame = {
        inOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        lives: 3
    }
}

function buildBoard(size, mines) {
    onInit()
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
            if (cell.isMine) {
                tableStr += `<td><button onclick="onCellClicked(this, {i: ${i}, j: ${j}})" class="${className}">
            <span>${MINE}</span></button></td>`
            } else {
                tableStr += `<td><button onclick="onCellClicked(this, {i: ${i}, j: ${j}})" class="${className}">
                <span>${cell.minesAroundCount}</span></button></td>`
            }
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
    console.log('mineIdxs:', mineIdxs)
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
        updateLivesDisplay()
        console.log('gGame.lives:', gGame.lives)
    }
    if (cell.minesAroundCount > 0) {
        cell.isShown = true
        gGame.shownCount++
        elCell.classList.add('shown')
    } else if (cell.minesAroundCount === 0) expandShown(pos)
    renderBoard()
    checkGameOver()
}

function expandShown(pos) {
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= gLevel.size) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= gLevel.size) continue
            var cell = gBoard[i][j]
            cell.isShown = true
            gGame.shownCount++

            var elCell = document.querySelector(`.cell-${i}-${j}`)
            elCell.classList.add('shown')
        }
    }
}

function onCellMarked(elCell) {
}

function checkGameOver() {
    if (gGame.lives > 0 && (gGame.shownCount !== (gLevel.size ** 2 - gLevel.mines))) return
    const msg = (gGame.lives) ? 'You Win!' : 'Game Over'
    clearInterval(gTimerInterval)
    showModal(msg)
    gGame.isOn = false
}
////////////////////////////////////////////////////////
function otherStuff() {
    document.querySelector('.popup').hidden = true
    //or
    const hearts = document.querySelectorAll('.heart');
    for (var i = 0; i < hearts.length; i++) {
        if (i < gGame.lives) {
            hearts[i].style.display = 'block'
        } else {
            hearts[i].style.display = 'none'
        }
    }
}