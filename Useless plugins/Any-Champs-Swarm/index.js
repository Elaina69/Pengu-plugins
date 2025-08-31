import * as observer from "./_observer.js"
let champsList

async function getChampsList() {
    let sleep = ms => new Promise(r => setTimeout(r, ms))
    let response = await fetch ("/lol-champions/v1/owned-champions-minimal")
    let responseData = await response.json()
    while (!response.ok) {
        responseData = await response.json()
        await sleep(1000)
    }
    champsList = responseData.sort((a, b) => a.name.localeCompare(b.name))
}

async function pickChamps(id) {
    await fetch('/lol-lobby/v1/lobby/members/localMember/player-slots', {
        method: 'PUT',
        body: JSON.stringify([{"championId":id,"positionPreference":"UNSELECTED","spell1":1}]),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    document.querySelector(".strawberry-lobby-root-main-content .strawberry-party-hub > .strawberry-party-hub").style.backgroundImage = `url(${DataStore.get("any-champs-swarm-bg")})`
}

observer.subscribeToElementCreation(".strawberry-party-hub",async (element) => {
    if (document.querySelector(".strawberry-party-hub") && !document.getElementById("champsDropdown")) {
        await getChampsList()
        let swarmMode = document.querySelector(".strawberry-party-hub > .left-column > .left-top-spacer")
        const dropdown = document.createElement("lol-uikit-framed-dropdown")
        dropdown.classList.add("lol-settings-general-dropdown")
        dropdown.style.marginTop = "100px"
        dropdown.id = "champsDropdown"
        for (let i = 0; i < champsList.length; i++) {
            const opt = champsList[i]
            const el = document.createElement("lol-uikit-dropdown-option")
            el.setAttribute("slot", "lol-uikit-dropdown-option")
            el.innerText = opt["alias"]
            el.id = opt["id"]
            el.onclick = async () => {
                DataStore.set("any-champs-swarm", opt["id"])
                DataStore.set("any-champs-swarm-bg", opt["baseSplashPath"])
                await pickChamps(opt["id"])
                console.log("pick ",opt["alias"])
            }
            if (DataStore.get("any-champs-swarm") == opt["id"]) {
                el.setAttribute("selected", "true")
            }
            dropdown.appendChild(el)
        }
        swarmMode.append(dropdown)
        if (DataStore.has("any-champs-swarm")) await pickChamps(DataStore.get("any-champs-swarm"))
    }
    
    let a = document.querySelectorAll("#champsDropdown")
    if (a.length > 1) {
        for (let i = 1; i < a.length; i++) {
            a[i].remove()
        }
    }
})