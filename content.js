const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="17" height="21" viewBox="0 0 17 21" fill="none"><path d="M16.2917 0.375H13.8125C13.6246 0.375 13.4445 0.447433 13.3116 0.576364C13.1788 0.705295 13.1042 0.880164 13.1042 1.0625V3.125H10.9792V1.0625C10.9792 0.880164 10.9045 0.705295 10.7717 0.576364C10.6389 0.447433 10.4587 0.375 10.2708 0.375H6.72917C6.5413 0.375 6.36114 0.447433 6.2283 0.576364C6.09546 0.705295 6.02083 0.880164 6.02083 1.0625V3.125H3.90026V1.0625C3.90026 0.880164 3.82563 0.705295 3.69279 0.576364C3.55996 0.447433 3.37979 0.375 3.19193 0.375H0.708333C0.520472 0.375 0.340304 0.447433 0.207466 0.576364C0.0746278 0.705295 0 0.880164 0 1.0625L0 8.625L2.83333 10C2.83333 12.0767 2.76516 14.082 2.24852 16.875H14.7515C14.2348 14.082 14.1667 12.0505 14.1667 10L17 8.625V1.0625C17 0.880164 16.9254 0.705295 16.7925 0.576364C16.6597 0.447433 16.4795 0.375 16.2917 0.375ZM9.91667 12.75H7.08333V10C7.08333 9.63533 7.23259 9.28559 7.49827 9.02773C7.76394 8.76987 8.12428 8.625 8.5 8.625C8.87572 8.625 9.23606 8.76987 9.50173 9.02773C9.76741 9.28559 9.91667 9.63533 9.91667 10V12.75ZM16.2917 18.25H0.708333C0.520472 18.25 0.340304 18.3224 0.207466 18.4514C0.0746278 18.5803 0 18.7552 0 18.9375L0 20.3125C0 20.4948 0.0746278 20.6697 0.207466 20.7986C0.340304 20.9276 0.520472 21 0.708333 21H16.2917C16.4795 21 16.6597 20.9276 16.7925 20.7986C16.9254 20.6697 17 20.4948 17 20.3125V18.9375C17 18.7552 16.9254 18.5803 16.7925 18.4514C16.6597 18.3224 16.4795 18.25 16.2917 18.25Z" fill="#C1C1C1"/></svg>`

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
    onElementAppear('.analyse__round-training', () => {
        const targetElement = document.querySelector('.analyse__round-training')
        if (targetElement) targetElement.appendChild(arslanovUI("lichess.org"))
    })
    onElementAppear('.round__side', () => {
        const targetElement = document.querySelector('.round__side')
        if (targetElement) targetElement.appendChild(arslanovUI("lichess.org"))
    })
}

async function goToArslanovChess(site, color) {
    let pgn
    if (site == "chess.com") pgn = await getCurrentPgn_chessCom()
    else pgn = await getCurrentPgn_lichess()
    pgn = encodeURIComponent(cleanPgn(pgn))
    window.open(`https://arslanovchess.com/games-analysis?autostart=true&color=${color}&pgn=${pgn}#title`)
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
    buttonW.onclick = () => goToArslanovChess(site, "w")

    const buttonB = document.createElement("button")
    buttonB.textContent = "За чёрных"
    buttonB.onclick = () => goToArslanovChess(site, "b")

    const buttonContainer = document.createElement("div")
    buttonContainer.classList.add("buttons")
    buttonContainer.appendChild(buttonW)
    buttonContainer.appendChild(buttonB)

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
        const gameId = parseInt(urlParts[urlParts.length - 1])
        const gameType = urlParts[urlParts.length - 2]

        if (gameType == "computer") {
            const json = await fetch(`https://www.chess.com/computer/callback/game/${gameId}`).then(res => res.json())
            return Promise.resolve(chessComJsonToPgn(json))
        } else {
            const json = await fetch(`https://www.chess.com/callback/${gameType}/game/${gameId}`).then(res => res.json())
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
