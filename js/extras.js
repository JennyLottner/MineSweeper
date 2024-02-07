'use strict'
function updateLives() {
    updateSmiley('😵')
    if (gGame.lives === 2) {
        document.querySelector('.heart2').style.display = 'none'
    } else if (gGame.lives === 1) {
        document.querySelector('.heart1').style.display = 'none'
    } else if (gGame.lives === 0){
        document.querySelector('.heart0').style.display = 'none'
    } else {
        document.querySelector('.heart2').style.display = 'block'
        document.querySelector('.heart1').style.display = 'block'
        document.querySelector('.heart0').style.display = 'block'
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