'use strict'
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
    if (smiley === '😵') {
        setTimeout(() => {
            document.querySelector('.smiley span').innerText = '🙂'
        }, 2000)
    }
    document.querySelector('.smiley span').innerText = smiley
}

function revealHint(num) {
    document.querySelector(`.hint${num}`).style.textShadow = '0 0 20px #FC0, 0 0 30px #FC0, 0 0 40px #FC0, 0 0 50px #FC0'

    const emptyCells = []
    for (var i = 0; i < gLevel.size; i++) {
        for (var j = 0; j < gLevel.size; j++) {
            const cell = gBoard[i][j]
            if (!cell.isMine && !cell.isShown && !cell.isMarked) emptyCells.push({ i, j })
        }
    }
    const chosenCell = emptyCells[getRandomInt(0, emptyCells.length)]
    const elCell = document.querySelector(`.cell-${chosenCell.i}-${chosenCell.j}`)
    elCell.style.transition = 'box-shadow 0.5s ease'
    elCell.style.boxShadow = '0 0 20px aquamarine, 0 0 30px aquamarine'
    setTimeout(() => {
        elCell.style.boxShadow = 'none'
    }, 2000)

}

function safeClick(elBtn) {
    elBtn.style.display = 'none'
}

function resetAll() {
    document.querySelector('.heart0').style.display = 'block'
    document.querySelector('.heart1').style.display = 'block'
    document.querySelector('.heart2').style.display = 'block'
    document.querySelector('.hint1').style.textShadow = 'none'
    document.querySelector('.hint2').style.textShadow = 'none'
    document.querySelector('.hint3').style.textShadow = 'none'
    document.querySelector('.click1').style.display = 'block'
    document.querySelector('.click2').style.display = 'block'
    document.querySelector('.click3').style.display = 'block'
}