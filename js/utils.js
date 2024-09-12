'use strict'

function showModal(type, msg) {
    const elModal = document.querySelector('.modal')
    if (type === 'status') {
        elModal.classList.add('status-modal')
        elModal.querySelector('span').innerText = msg
    } else {
        elModal.querySelector('span').innerHTML = msg
    }
    elModal.classList.remove('hide')
}

function hideModal() {
    const elModal = document.querySelector('.modal')
    if (elModal.classList.contains('status-modal')) elModal.classList.remove('status-modal')
    if (!elModal.classList.contains('hide')) elModal.classList.add('hide')
}

function darkMode() {
    var darkModeInput = document.getElementById('darkModeInput');
    darkModeInput.value = (darkModeInput.value === 'true') ? 'false' : 'true'

    document.documentElement.classList.toggle('dark-mode', darkModeInput.value === 'true')
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