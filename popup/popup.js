document.addEventListener('DOMContentLoaded', function () {
    const depthInput = document.getElementById('depth')
    const depthValueDisplay = document.querySelector('.depth-value')

    const storage = (typeof browser !== 'undefined') ? browser.storage : chrome.storage

    storage.local.get(['depth'], function (result) {
        const savedDepth = result.depth || 8
        depthInput.value = savedDepth
        depthValueDisplay.textContent = savedDepth
    })

    depthInput.addEventListener('input', function () {
        const currentDepth = depthInput.value
        depthValueDisplay.textContent = currentDepth

        storage.local.set({ depth: currentDepth })
    })
})
