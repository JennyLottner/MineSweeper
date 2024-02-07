'use strict'

function showModal(msg) {
    const elModal = document.querySelector('.modal')
    elModal.querySelector('span').innerText = msg
    elModal.classList.remove('hide')
}

function hideModal() {
    const elModal = document.querySelector('.modal')
    elModal.classList.add('hide')
}

function getRandomInt(min, max) {
    if (Math.ceil(min) > Math.floor(max)) {
        console.log('Next time try a bigger range')
        return NaN
    }                                           // add '+ 1'        HERE      to make it inclusive of max
    return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min)) + Math.ceil(min))
}

function renderCell(location, value) {
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}

function startTimer() {
    if (gTimerInterval) clearInterval(gTimerInterval)

    gTimerInterval = setInterval(() => {
        const timeDiff = Date.now() - gStartTime
        gGame.secsPassed = (Math.floor(timeDiff / 1000) + '').padStart(3, '0')

        document.querySelector('.stopwatch span').innerText = gGame.secsPassed
    }, 1000)
}