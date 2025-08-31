 /**
 * @name Auto_Honor
 * @author Elaina Da Catto
 * @description Auto honor plugins for Pengu Loader
 * @link https://github.com/Elaina69
 * @Nyan Meow~~~
 */

import "https://unpkg.com/elaina-theme-data@latest/data/Languages/Languages.js"
import * as observer from "https://unpkg.com/elaina-theme-data@latest/data/Utilities/_observer.js"
import { settingsUtils } from "https://unpkg.com/blank-settings-utils@latest/Settings-Utils.js"

let eConsole = "%c Elaina Da Catto - Auto Honor "
let eCss = "color: #ffffff; background-color: #f77fbe"

const list = {
    "Honor-mode": ["Random","Friends","Special player"],
}

async function fetchData(lcu) {
    let data = (await fetch(lcu)).json()
    return data
}

async function autoHonor() {
    // get player list inside your team
    let lobby = await fetchData("/lol-lobby/v2/comms/members") 
    // get your summonerID
    let currentSummoner = await fetchData("/lol-summoner/v1/current-summoner") 
    // get specific player ID
    let specialPlayerID = await fetchData(`/lol-summoner/v1/summoners?name=${DataStore.get("Special-honor-player-name")}%23${DataStore.get("Special-honor-player-tag")}`) // Set your specific player

    let lobbyArray = []
    let i,honorID,honorName

    // Set specific player to datastore
    DataStore.set("Special-honor-player", specialPlayerID["summonerId"])
    
    // get player list inside your team (not include you)
    for (let [key, value] of Object.entries(lobby["players"])) {
        if (lobby["players"][`${key}`]["summonerId"] != currentSummoner["summonerId"]){
            lobbyArray.push(lobby["players"][`${key}`])
        }
    }

    // get available honor list when end of game
    let honorList = await fetchData('/lol-honor-v2/v1/ballot')

    async function random() {
        i = Math.floor(Math.random() * honorList["eligibleAllies"].length)
        honorID = honorList["eligibleAllies"][i]["summonerId"]

        let a = await (await fetchData(`/lol-summoner/v1/summoners/${honorID}`))
        honorName = a["gameName"]
        console.log("random")
    }

    function friends() {
        i = Math.floor(Math.random() * lobbyArray.length)
        honorID = lobbyArray[i]["summonerId"]
        honorName = lobbyArray[i]["gameName"]
    }

    function specialPlayer(Name) {
        honorID = DataStore.get("Special-honor-player")
        honorName = Name
    }

    // Honor option
    if (lobbyArray.length != 0) {
        if (DataStore.get("Honor-mode") == "Friends") {
            console.log(eConsole+`%c Honoring your friend teammate`,eCss,"")
            friends()
        }
        else if (DataStore.get("Honor-mode") == "Special player") {
            let foundSpecificPlayer = false
            let Name
            for (let ii = 0; ii < lobbyArray.length; ii++) {
                if (lobbyArray[ii]["summonerId"] == DataStore.get("Special-honor-player")) {
                    foundSpecificPlayer = true
                    Name = lobbyArray[ii]["gameName"]
                }
            }

            if (foundSpecificPlayer) {
                console.log(eConsole+`%c Found specific player, ready to honor them.`,eCss,"")
                specialPlayer(Name)
            }
            else {
                console.log(eConsole+`%c Can't find specific player, honor friend teammate instead`,eCss,"")
                friends()
            }
        }
    }
    else {
        console.log(eConsole+`%c Honoring random player`,eCss,"")
        random()
    }

    // Honor them
    await fetch('/lol-honor-v2/v1/honor-player', {
        method: 'POST',
        body: JSON.stringify({
            "gameId": honorList["gameId"],
            "honorType": "HEART",
            "summonerId": honorID
        }),
        headers: {'Content-Type': 'application/json'}
    })
    window.setTimeout(()=>{
        Toast.success(`Honored player: ${honorName}`)
        console.log(eConsole+`%c PlayerID: %c${honorID}`,eCss,"","color: #0070ff")
        console.log(eConsole+`%c Honored player: %c${honorName}`,eCss,"","color: #0070ff")
    },1000)
}


// Set default data for plugins
function setDefaultData(defaults) {
    Object.entries(defaults).forEach(([key, value]) => {
        if (!DataStore.has(key)) {
            DataStore.set(key, value);
        }
    });
}

setDefaultData({
    "Special-honor-player-name" : "Elaina Da Catto",
    "Special-honor-player-tag"  : "6969",
    "Auto-Honor"                : true,
    "Honor-mode"                : "Friends",
})

export function init(context) {
    //Auto honor
    if (DataStore.get("Auto-Honor")) {
        let honored = false
        context.socket.observe('/lol-gameflow/v1/gameflow-phase',async (data) => {
            console.log(data)
            if (data["data"]=="PreEndOfGame") {
                autoHonor()
                honored = true
            }
            else honored = false
        })

        //in case context.socket can't find preEndOFGame
        observer.subscribeToElementCreation(".prompted-voting-player-container", (element) => {
            window.setTimeout(() => {
                if (element && !honored) {
                    autoHonor()
                    console.log(eConsole+`%c Can't find preEndOfGame`,eCss,"")
                }
            },1500)
        })
    }

    //Create settings tab
    let data = [
        {
            "groupName": 'Auto_honor',
            "titleKey": 'el_ah',
            "titleName": 'Auto honor',
            "capitalTitleKey": 'el_ah_capital',
            "capitalTitleName": 'AUTO HONOR',
            "element": [
                {
                    "name": "el-ah-settings",
                    "title": "el_ah-settings",
                    "titleName": "SETTINGS",
                    "class": "auto_honor_settings",
                    "id": "ElainaAutoHonorSettings",
                },
            ],
        },
    ]
    settingsUtils(context, data)
    

    //Add settings tab's contents
    const UI = {
        Row: (id, childs, css) => {
            const row = document.createElement('div')
            row.classList.add('lol-settings-general-row')
            row.id = id
            row.style.cssText = css
            if (Array.isArray(childs)) childs.forEach((el) => row.appendChild(el))
            return row
        },
        Label: (text, id) => {
            const label = document.createElement('p')
            label.classList.add('lol-settings-window-size-text')
            label.innerText = text
            label.id = id
            return label
        },
        Link: (text, href, onClick) => {
            const link = document.createElement('p')
            link.classList.add('lol-settings-code-of-conduct-link')
            link.classList.add('lol-settings-window-size-text')

            const a = document.createElement('a')
            a.innerText = text
            a.target = '_blank'
            a.href = href
            a.onclick = onClick || null

            link.append(a)
            return link
        },
        Button: (text, cls, onClk, styles) => {
            const btn = document.createElement('lol-uikit-flat-button-secondary')
            btn.innerText = text
            btn.onclick = onClk
            btn.style.cssText = styles
            btn.setAttribute('class', cls)
            return btn
        },
        Input: (target,styles) => {
            const origIn = document.createElement('lol-uikit-flat-input')
            const searchbox = document.createElement('input')

            origIn.classList.add(target)
            origIn.style.marginBottom = '12px'

            searchbox.type = 'url'
            searchbox.placeholder = DataStore.get(target)
            searchbox.style.cssText = styles
            searchbox.name = 'name'
            searchbox.oninput = ()=>{
                let input = {
                    get value() {
                    return searchbox.value
                    },
                }
                DataStore.set(target, input.value)
            }
            origIn.appendChild(searchbox)
            return origIn
        },
        CheckBox: (text, ID, boxID, check) => {
            const origin = document.createElement("lol-uikit-flat-checkbox")
            const checkbox = document.createElement("input")
            const label = document.createElement("label")

            origin.setAttribute("class",'')
            origin.id = ID

            checkbox.type = "checkbox"
            checkbox.id = boxID
            checkbox.onclick = check
            checkbox.setAttribute("slot", "input")

            label.innerHTML = text
            label.setAttribute("slot", "label")

            origin.appendChild(checkbox)
            origin.appendChild(label)

            return origin
        },
        Dropdown: (list,target,text) => {
            const origin = document.createElement("div")
            const title  = document.createElement("div")
            const dropdown = document.createElement("lol-uikit-framed-dropdown")

            origin.classList.add("Dropdown-div")
            title.classList.add("lol-settings-window-size-text")
            title.innerHTML = text
            dropdown.classList.add("lol-settings-general-dropdown")
            origin.append(title,dropdown)
            for (let i = 0; i < list[target].length; i++) {
                    const opt = list[target][i]
                    const el = document.createElement("lol-uikit-dropdown-option")
                    el.setAttribute("slot", "lol-uikit-dropdown-option")
                    el.innerText = opt
                    el.id = opt
                    el.onclick = () => {
                        DataStore.set(target, opt)
                    }
                    if (DataStore.get(target) == opt) {
                        el.setAttribute("selected", "true")
                    }
                    dropdown.appendChild(el)
                }
            return origin
        },
    }

    const injectSettings = async (panel) => {
        let interval = window.setInterval(()=> {
            try {
                let a = document.getElementById("Special-honor-div")
                let b = document.getElementById("valid-name-checked")
                if (DataStore.get("Honor-mode") != "Special player") {
                    a.style.visibility = "hidden"
                    b.hidden = true
                }
                else {
                    a.style.visibility = "visible"
                    b.hidden = false
                }
                document.querySelector(".lol-settings-footer.ember-view > lol-uikit-flat-button-group > lol-uikit-flat-button").addEventListener("click", ()=>{
                    window.clearInterval(interval)
                })
            }
            catch{}
        },500)

        panel.prepend(
            UI.Row("",[
                UI.Row("Info",[
                    UI.Row("Info-div",[
                        UI.Link(
                            `Auto Honor - Elaina Da Catto`,
                            'https://github.com/Elaina69/Auto-honor'
                        ),
                    ]),
                ]),
                UI.CheckBox(
                    `${await getString("Auto-Honor")}`,'autoHonor','autoHonorbox',
                    ()=>{
                        let autoHonorel = document.getElementById("autoHonor")
                        let autoHonorbox = document.getElementById("autoHonorbox")
                    
                        if (DataStore.get("Auto-Honor")) {
                            autoHonorel.removeAttribute("class")
                            autoHonorbox.checked = false
                            DataStore.set("Auto-Honor", false)
                        }
                        else {
                            autoHonorel.setAttribute("class", "checked")
                            autoHonorbox.checked = true
                            DataStore.set("Auto-Honor", true)
                        }
                    },true
                ),
                document.createElement('br'),
                UI.Dropdown(list, "Honor-mode", `${await getString("Honor-mode")}`),
                document.createElement('br'),
                UI.Row("Special-honor-div",[
                    UI.Row("Special-honor-name-div",[
                        UI.Label(`${await getString("Username")}`),
                        UI.Input("Special-honor-player-name","width: 190px; margin-right: 15px;")
                    ]),
                    UI.Row("Special-honor-tagline-div",[
                        UI.Label(`${await getString("Tagline")}`),
                        UI.Input("Special-honor-player-tag","width: 80px; margin-right: 15px")
                    ]),
                    UI.Button(`${await getString("Check")}`,"check-valid-name",
                    async ()=> {
                        let id = await fetchData(`/lol-summoner/v1/summoners?name=${DataStore.get("Special-honor-player-name")}%23${DataStore.get("Special-honor-player-tag")}`)
                        let current = await fetchData("/lol-summoner/v1/current-summoner")
                        
                        let info = document.getElementById("valid-name-checked")

                        function getValidName(text,colors) {
                            info.textContent = text
                            console.log(eConsole+`%c ${text}`,eCss,colors)
                            info.style.cssText = colors
                        }

                        if (id["summonerId"]!=current["summonerId"]) {
                            getValidName(await getString("Valid-username"),"color: green;")
                        }
                        else if (id["summonerId"]==current["summonerId"]) {
                            let i = Math.floor(Math.random() * 2 + 1)
                            getValidName(await getString(`Honor-self-${i}`),"color: red;")
                        }
                        else {
                            getValidName(await getString("Invalid-username"),"color: red;")
                        }
                    },"display: flex; width: 75px; height: 30px; margin-top: 34px;")
                ],"display: flex"),
                UI.Label("","valid-name-checked")
            ])
        )
    }

    window.addEventListener('load', async () => {
        function tickcheck (Data, el, checkbox) {
            let element = document.getElementById(el)
            let box = document.getElementById(checkbox)
            if (Data && element.getAttribute("class") == "") {
                box.checked = true
            }
        }
        const interval = setInterval(() => {
            const manager = document.getElementById('lol-uikit-layer-manager-wrapper')
            if (manager) {
                clearInterval(interval)
                new MutationObserver((mutations) => {
                    const panel = document.querySelector('div.lol-settings-options > lol-uikit-scrollable.auto_honor_settings')
                    if (panel && mutations.some((record) => Array.from(record.addedNodes).includes(panel))) {
                        injectSettings(panel)
                        const check = setInterval (()=>{
                            if (document.getElementById("Info")) {
                                clearInterval(check)
                                tickcheck(DataStore.get("Auto-Honor"), "autoHonor", "autoHonorbox")
                            }
                        },100)
                    }
                }).observe(manager, {
                    childList: true,
                    subtree: true
                })
            }
        },500)
    })
}