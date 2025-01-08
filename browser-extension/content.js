document.addEventListener('DOMContentLoaded', () => {
    logEvent('content loaded')
    const refreshButton = document.createElement('button');
    refreshButton.classList.add('G-Ni');
    refreshButton.classList.add('J-J5-Ji');
    logEvent('container')
    console.log(document.getElementsByClassName('G-tF')[0])
    document.getElementsByClassName('G-tF')[0].append(refreshButton)
})

function logEvent(event) {
    console.log(`=== ${event.toUpperCase()} ===`)
}
