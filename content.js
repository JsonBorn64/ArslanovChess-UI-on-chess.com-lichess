const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="21" viewBox="0 0 47 64" fill="none">
<g clip-path="url(#clip0_357_20)"><path d="M47 19.5H0V3C0 1.61929 1.11929 0.5 2.5 0.5H10.5C11.8807 0.5 13 1.61929 13 3V6C13 7.38071 14.1193 8.5 15.5 8.5C16.8807 8.5 18 7.38071 18 6V3C18 1.61929 19.1193 0.5 20.5 0.5H26.5C27.8807 0.5 29 1.61929 29 3V6C29 7.38071 30.1193 8.5 31.5 8.5C32.8807 8.5 34 7.38071 34 6V3C34 1.61929 35.1193 0.5 36.5 0.5H44.5C45.8807 0.5 47 1.61929 47 3V19.5Z" fill="white"/><path d="M2.5 63.5C1.11929 63.5 0 62.3807 0 61V60.5H47V61C47 62.3807 45.8807 63.5 44.5 63.5H2.5Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M8 24.5H39.5L47 55.5H29.5C28.1193 55.5 27 54.3807 27 53V50C27 48.6193 25.8807 47.5 24.5 47.5H22.5C21.1193 47.5 20 48.6193 20 50V53C20 54.3807 18.8807 55.5 17.5 55.5H0L8 24.5ZM22.5 31.5C21.1193 31.5 20 32.6193 20 34V38C20 39.3807 21.1193 40.5 22.5 40.5H24.5C25.8807 40.5 27 39.3807 27 38V34C27 32.6193 25.8807 31.5 24.5 31.5H22.5Z" fill="white"/></g><defs><clipPath id="clip0_357_20"><rect width="47" height="63" fill="white" transform="translate(0 0.5)"/></clipPath></defs></svg>`

if (window.location.href.includes("chess.com") || window.location.href.includes("c4355.com")) {

    onElementAppear('.game-over-modal-buttons', () => {
        const targetElement = document.querySelector('.game-over-modal-buttons')
        if (targetElement) targetElement.appendChild(arslanovUI("chess.com"))
    })

    onElementAppear('.modal-game-over-buttons-component', () => {
        const targetElement = document.querySelector('.modal-game-over-buttons-component')
        if (targetElement) targetElement.appendChild(arslanovUI("chess.com"))
    })

    onElementAppear('.tab-review-action-buttons', () => {
        const targetElement = document.querySelector('.tab-review-action-buttons')
        if (targetElement) targetElement.appendChild(arslanovUI("chess.com"))
    })

}

if (window.location.href.includes("lichess.org")) {
    const url = window.location.href
    if (!url.includes("/tv") && !url.includes("/study")) {
        onElementAppear('section.status', () => {
            setTimeout(() => {
                const targetElement = document.querySelector('.analyse__round-training')
                if (targetElement) targetElement.appendChild(arslanovUI("lichess.org"))
            }, 100)
        })
        onElementAppear('section.status', () => {
            setTimeout(() => {
                const targetElement = document.querySelector('.round__side')
                if (targetElement) targetElement.appendChild(arslanovUI("lichess.org"))
            }, 100)
        })
    }
}

async function goToArslanovChess(site, color) {
    let pgn
    if (site == "chess.com") pgn = await getCurrentPgn_chessCom()
    else pgn = await getCurrentPgn_lichess()
    const encoded = encodeURIComponent(cleanPgn(pgn))
    window.open(`https://arslanovchess.com/games-analysis?autostart=true&color=${color}&pgn=${encoded}#title`)
    return pgn
}

function arslanovUI(site) {
    const svgContainer = document.createElement("div")
    svgContainer.classList.add("svg-container")
    svgContainer.innerHTML = svg

    const title = document.createElement("div")
    title.textContent = "Анализ на ArslanovChess"
    title.classList.add("title")
    title.appendChild(svgContainer)

    const buttonW = document.createElement("button")
    buttonW.textContent = "За белых"

    const buttonB = document.createElement("button")
    buttonB.textContent = "За чёрных"

    const buttonContainer = document.createElement("div")
    buttonContainer.classList.add("buttons")
    buttonContainer.appendChild(buttonW)
    buttonContainer.appendChild(buttonB)

    // Use a handler that swaps buttons with a loader while PGN is fetched
    buttonW.addEventListener('click', () => handleAnalyzeClick(site, 'w', buttonContainer))
    buttonB.addEventListener('click', () => handleAnalyzeClick(site, 'b', buttonContainer))

    const container = document.createElement("div")
    container.id = site == "chess.com" ? "ArslanovChessComUI" : "ArslanovLichessUI"
    container.appendChild(title)
    container.appendChild(buttonContainer)

    return container
}

function onElementAppear(selector, callback) {
    const targetNode = document.body
    const config = { childList: true, subtree: true }

    const observer = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const elements = document.querySelectorAll(selector)
                if (elements.length > 0) {
                    callback(elements)
                    observer.disconnect()
                    break
                }
            }
        }
    })

    observer.observe(targetNode, config)
}

function chessComJsonToPgn(json) {
    const initialFen = json.game.initialSetup || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    const moveList = json.game.moveList
    var T = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?{~}(^)[_]@#$,./&-*++=";
    function decodeMoves(e) {
        var c, a, g = e.length, f = []
        for (c = 0; c < g; c += 2) {
            var d = {}, b = T.indexOf(e[c])
            63 < (a = T.indexOf(e[c + 1])) && (d.promotion = "qnrbkp"[Math.floor((a - 64) / 3)], a = b + (16 > b ? -8 : 8) + (a - 1) % 3 - 1)
            75 < b ? d.drop = "qnrbkp"[b - 79] : d.from = T[b % 8] + (Math.floor(b / 8) + 1)
            d.to = T[a % 8] + (Math.floor(a / 8) + 1)
            f.push(d)
        }
        return f
    }
    const chess = new Chess(initialFen)

    chess.header("White", json.game.pgnHeaders.White)
    chess.header("Black", json.game.pgnHeaders.Black)
    chess.header("WhiteElo", json.game.pgnHeaders.WhiteElo.toString())
    chess.header("BlackElo", json.game.pgnHeaders.BlackElo.toString())

    decodeMoves(moveList).forEach(move => {
        // fix castling
        if (chess.get(move.from).type == 'k' && (move.from == 'e1' || move.from == 'e8')) {
            if (move.to == 'h1') move.to = 'g1'
            if (move.to == 'a1') move.to = 'c1'
            if (move.to == 'h8') move.to = 'g8'
            if (move.to == 'a8') move.to = 'c8'
        }
        chess.move(move)
    })
    console.log(chess.pgn())
    return chess.pgn()
}

async function getCurrentPgn_chessCom() {
    debuglog("getCurrentPgn_chessCom")
    // try to get pgn by id
    try {
        const urlParts = window.location.href.split("/")

        // Find gameId and gameType dynamically
        const gameId = urlParts.find(part => !isNaN(parseInt(part)))
        const gameTypeIndex = urlParts.indexOf(gameId) - 1
        let gameType = gameTypeIndex >= 0 ? urlParts[gameTypeIndex] : null

        if (gameType === "computer") {
            const json = await fetch(`https://${urlParts[2]}/computer/callback/game/${gameId}`).then(res => res.json())
            return Promise.resolve(chessComJsonToPgn(json))
        } else if (gameType) {
            if (gameType === "game") gameType = "live"
            const json = await fetch(`https://${urlParts[2]}/callback/${gameType}/game/${gameId}`).then(res => res.json())
            return Promise.resolve(chessComJsonToPgn(json))
        }

    } catch (error) {
        console.log(error)
    }

    let pgn = await openShareDialog()
        .then(openPgnTab)
        .then(copyPgn)
        .finally(closeShareDialog)
    if (pgn) {
        // The termination field confuses the PDF converter so the result
        // is often output as a draw. This replaces the content with "Normal"
        // which seems to work correctly.
        if (pgn.indexOf(" won on time") !== -1) {
            pgn = pgn.replace(/Termination "([^"]+)"/g, 'Termination "Time forfeit"')
        } else {
            pgn = pgn.replace(/Termination "([^"]+)"/g, 'Termination "Normal"')
        }
        return Promise.resolve(pgn)
    }
    return Promise.reject()
}

function getCurrentPgn_lichess() {
    debuglog("getCurrentPgn_lichess")
    // get game id
    const urlParts = window.location.href.split("/")
    const index = urlParts.indexOf("lichess.org") + 1
    const gameId = urlParts[index].slice(0, 8)
    // get game pgn
    return new Promise((resolve, reject) => {
        fetch(`https://lichess.org/game/export/${gameId}?evals=false&clocks=false&opening=false`)
            .then(response => response.text())
            .then(data => {
                resolve(data)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

async function openPgnTab() {
    debuglog("openPgnTab")
    const pgnDiv = document.querySelector('div.share-menu-tab-selector-component > div:nth-child(1)') ||
        document.querySelector('div.alt-share-menu-tab.alt-share-menu-tab-image-component')

    if (pgnDiv) {
        return new Promise((resolve, reject) => {
            pgnDiv.click()
            setTimeout(resolve, 500)
        })
    }
    let pgnTab = document.querySelector("#live_ShareMenuGlobalDialogDownloadButton") ||
        document.querySelector(".icon-font-chess.download.icon-font-primary") ||
        document.querySelector(".icon-download")
    if (!pgnTab) {
        const headerElements = document.querySelectorAll(
            ".share-menu-dialog-component header *") || document
        pgnTab = Array.from(headerElements).filter(
            (x) => x.textContent == "PGN")[0]
    }
    if (pgnTab) {
        return new Promise((resolve, reject) => {
            pgnTab.click()
            setTimeout(resolve, 500)
        })
    } else {
        return Promise.reject()
    }
}

async function openShareDialog() {
    debuglog("openShareDialog")
    const shareButton =
        document.querySelector('span.secondary-controls-icon.download') ||
        document.querySelector('button.share-button-component.icon-share') ||
        document.querySelector('button.share-button-component.icon-share') ||
        document.querySelector('button.icon-font-chess.share.live-game-buttons-button') ||
        document.querySelector('button.share-button-component.share') ||
        document.querySelector("button[data-test='download']") ||
        document.querySelector("#shareMenuButton") ||
        document.querySelector(".icon-font-chess.share.icon-font-primary") ||
        document.querySelector(".icon-font-chess.share") ||
        document.querySelector(".icon-share")
    if (shareButton) {
        return new Promise((resolve, reject) => {
            shareButton.click()
            setTimeout(resolve, 1000)
        })
    } else {
        debuglog("failed openShareDialog")
        return Promise.reject()
    }
}

function closeShareDialog() {
    debuglog("closeShareDialog")
    const closeButton =
        document.querySelector("#live_ShareMenuGlobalDialogCloseButton") ||
        document.querySelector("button.ui_outside-close-component") ||
        document.querySelector(".icon-font-chess.x.icon-font-primary") ||
        document.querySelector(".icon-font-chess.x.icon-font-secondary") ||
        document.querySelector(".icon-font-chess.x.ui_outside-close-icon") ||
        document.querySelector("#chessboard_ShareMenuGlobalDialogCloseButton")
    if (closeButton) {
        closeButton.click()
    } else {
        debuglog("failed closeShareDialog")
    }
}

async function copyPgn() {
    debuglog("copyPgn")

    let pgnDiv = document.querySelector('div.alt-share-menu-tab.alt-share-menu-tab-gif-component') ||
        document.querySelector('div.alt-share-menu-tab.alt-share-menu-tab-image-component')

    if (pgnDiv) {
        pgnAttr = pgnDiv.attributes["pgn"]
        if (pgnAttr) {
            return Promise.resolve(pgnAttr.value)
        }
    }

    // PGN with embedded analysis is not parsed correctly by lichess, so disable it.
    // Note: both radio buttons match this selector (there's nothing unique in the markup).
    // We're relying on the "Annotation" button being the first one, which is what querySelector gives us.
    const disableAnalysisRadioButton =
        document.querySelector('.share-menu-tab-pgn-toggle input[type=radio]')
    if (disableAnalysisRadioButton) {
        debuglog("found disable analysis radio button")
        await new Promise((resolve, reject) => {
            disableAnalysisRadioButton.click()
            setTimeout(resolve, 500)
            debuglog("analysis disabled")
        })
    } else {
        debuglog("could not find disable analysis radio button!")
    }

    const textarea =
        document.querySelector("#live_ShareMenuPgnContentTextareaId") ||
        document.querySelector("textarea[name=pgn]") ||
        document.querySelector(".form-textarea-component.pgn-download-textarea") ||
        document.querySelector("#chessboard_ShareMenuPgnContentTextareaId")

    if (textarea) {
        debuglog(textarea.value)
    } else {
        debuglog("textarea failed")
        Promise.reject()
    }
    return Promise.resolve(textarea.value)
}

function cleanPgn(pgn) {
    pgn = pgn.trim()

    const header_regex = /^\s*\[.*\]\s*$/gm
    const comments_regex = /\{[^}]*\}|\;[^\r\n]*/g
    const variations_regex = /(\([^()]+\))+?/g
    const annotation_glyphs_regex = /\$\d+/g

    const tags = pgn.match(header_regex) || []
    const filteredTags = tags.filter((tag) => {
        const legalTagNames = ["Event ", "White ", "Black ", "WhiteElo ", "BlackElo ", "FEN "]
        return legalTagNames.some((tagName) => tag.includes(tagName))
    })

    const moves = pgn
        .replace(header_regex, '')
        .replace(comments_regex, '')
        .replace(variations_regex, '')
        .replace(annotation_glyphs_regex, '')
        .replace(/\s+/g, ' ')

    const result = filteredTags.join('\n') + '\n\n' + moves
    return result.trim()
}

function debuglog(message) {
    const logDebugMessages = false
    if (logDebugMessages) console.log(message)
}

// Loader and error UI helpers
function createLoader() {
    const wrapper = document.createElement('div')
    wrapper.className = 'arslanov-loader'
    const spinner = document.createElement('div')
    spinner.className = 'arslanov-spinner'
    const text = document.createElement('span')
    text.className = 'arslanov-loader-text'
    text.textContent = 'Загрузка PGN...'
    wrapper.appendChild(spinner)
    wrapper.appendChild(text)
    return wrapper
}

function showError(container, message) {
    container.innerHTML = ''
    const errorDiv = document.createElement('div')
    errorDiv.className = 'arslanov-error'
    errorDiv.innerHTML = message
    container.appendChild(errorDiv)
}

function handleAnalyzeClick(site, color, buttonContainer) {
    if (buttonContainer.dataset.loading === 'true') return
    const originalButtons = Array.from(buttonContainer.children).map(n => n.cloneNode(true))
    buttonContainer.dataset.loading = 'true'
    buttonContainer.innerHTML = ''
    buttonContainer.appendChild(createLoader())

    goToArslanovChess(site, color)
        .then(() => {
            // success: restore original buttons
            buttonContainer.innerHTML = ''
            originalButtons.forEach(btn => buttonContainer.appendChild(btn))
            // re-wire events after clone
            const [btnW, btnB] = buttonContainer.children
            if (btnW) btnW.addEventListener('click', () => handleAnalyzeClick(site, 'w', buttonContainer))
            if (btnB) btnB.addEventListener('click', () => handleAnalyzeClick(site, 'b', buttonContainer))
        })
        .catch(err => {
            console.error('Ошибка получения PGN', err)
            showError(buttonContainer, 'Ошибка получения PGN. <br> Попробуйте через архив партий.')
            setTimeout(() => {
                buttonContainer.innerHTML = ''
                originalButtons.forEach(btn => buttonContainer.appendChild(btn))
                const [btnW, btnB] = buttonContainer.children
                if (btnW) btnW.addEventListener('click', () => handleAnalyzeClick(site, 'w', buttonContainer))
                if (btnB) btnB.addEventListener('click', () => handleAnalyzeClick(site, 'b', buttonContainer))
            }, 5000)
        })
        .finally(() => {
            delete buttonContainer.dataset.loading
        })
}
