import utils from "./_utils.js"
import lang from 'https://unpkg.com/elainav3-data@latest/data/configs/Language.js'
import QueueID from "https://unpkg.com/elainav3-data@latest/data/configs/QueueID.js"
import "./main.css"

if (!DataStore.has("Auto-Find-Queue")) {
	DataStore.set("Auto-Find-Queue", false)
}
if (!DataStore.has("Create-Delay")) {
	DataStore.set("Create-Delay", 20000)
}
if (!DataStore.has("Find-Delay")) {
	DataStore.set("Find-Delay", 3000)
}
if (!DataStore.has("Gamemode")) {
	DataStore.set("Gamemode", 450)
}

let AutoQueue = (node) => {
    let pagename = node.getAttribute("data-screen-name")

	if (pagename == "rcp-fe-lol-home-main") {
		window.setTimeout(async () => {
			if (DataStore.get("Auto-Find-Queue") && !DataStore.get("aram-only")) {
				await fetch('/lol-lobby/v2/lobby', {
					method: 'POST',
					body: JSON.stringify({ queueId: DataStore.get("Gamemode") }),
					headers: {
					'Content-Type': 'application/json'
					}
				})
				window.setTimeout(async () => {
					await fetch('/lol-lobby/v2/lobby/matchmaking/search', {
						method: 'POST'
					})
				},DataStore.get("Find-Delay"))
			}
			else if (DataStore.get("Auto-Find-Queue") && DataStore.get("aram-only")) {
				await fetch('/lol-lobby/v2/lobby', {
					method: 'POST',
					body: JSON.stringify({ queueId: 450 }),
					headers: {
					'Content-Type': 'application/json'
					}
				})
				window.setTimeout(async () => {
					await fetch('/lol-lobby/v2/lobby/matchmaking/search', {
						method: 'POST'
					})
				},DataStore.get("Find-Delay"))
			}
		},DataStore.get("Create-Delay"))
	}
}

const UI = {
   Row: (id, childs) => {
      const row = document.createElement('div')
      row.classList.add('lol-settings-general-row')
      row.id = id
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
   Button: (text, cls, onClk) => {
      const btn = document.createElement('lol-uikit-flat-button-secondary')
      btn.innerText = text
      btn.onclick = onClk
      btn.style.display = 'flex'
      btn.setAttribute('class', cls)
      return btn
   },
   Input: (target) => {
      const origIn = document.createElement('lol-uikit-flat-input')
      const searchbox = document.createElement('input')

      origIn.classList.add(target)
      origIn.style.marginBottom = '12px'

      searchbox.type = 'url'
      searchbox.placeholder = DataStore.get(target)
      searchbox.style.width = '190px'
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
   Slider: (text, value, target, setValue) => {
      const div        = document.createElement("div")
      const title      = document.createElement("div")
      const row        = document.createElement('div')
      const origin     = document.createElement("lol-uikit-slider")
      const slider     = document.createElement("div")
      const sliderbase = document.createElement("div")

      let audio = document.getElementById(`${target}`)

      row.setAttribute("class", "lol-settings-sound-row-slider")
      title.setAttribute("class", "lol-settings-sound-title")

      origin.setAttribute("class", "lol-settings-slider")
      origin.setAttribute("value", `${value}`* 100)
      origin.setAttribute("percentage", "")
      origin.addEventListener("change", ()=>{
         audio.volume = origin.value / 100;
         DataStore.set(`${setValue}`, origin.value / 100)
         title.innerHTML = `${text}: ${origin.value}`
      })

      title.innerHTML = `${text}: ${value * 100}`

      slider.setAttribute("class", "lol-uikit-slider-wrapper horizontal")
      sliderbase.setAttribute("class", "lol-uikit-slider-base")

      div.appendChild(title)
      div.appendChild(row)
      row.appendChild(origin)
      origin.appendChild(slider)
      slider.appendChild(sliderbase)

      return div
   },
   Dropdown: (list,target,text,name,id) => {
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
			el.innerText = opt[name]
			el.id = opt[id]
			el.onclick = () => {
				DataStore.set(target, opt[id])
			}
			if (DataStore.get(target) == opt[id]) {
				el.setAttribute("selected", "true")
			}
			dropdown.appendChild(el)
		}
      return origin
   },
}

const injectSettings = (panel) => {
   	const langCode = document.querySelector("html").lang;
   	const langMap = lang.langlist
   	const selectedLang = lang[langMap[langCode] || "EN"];

    panel.prepend(
      	UI.Row("",[
			UI.CheckBox(
				`${selectedLang["auto-find-queue"]}`,'autoq','autoqbox',
				()=>{
				let autoqel = document.getElementById("autoq")
				let autoqbox = document.getElementById("autoqbox")

				if (DataStore.get("Auto-Find-Queue")) {
					autoqbox.checked = false
					DataStore.set("Auto-Find-Queue", false)
					autoqel.removeAttribute("class")
				}
				else {
					autoqbox.checked = true
					DataStore.set("Auto-Find-Queue", true)
					autoqel.setAttribute("class", "checked")
				}
				}
			),
			UI.Row("Q-Delay",[
				UI.Row("Create-Delay",[
				UI.Label(`${selectedLang["Create-Delay"]}`, "Create-Delay-Text"),
				UI.Input("Create-Delay"),
				]),
				UI.Row("Find-Delay",[
				UI.Label(`${selectedLang["Find-Delay"]}`, "Find-Delay-Text"),
				UI.Input("Find-Delay")
				])
			]),
			UI.Dropdown(QueueID, "Gamemode", `${selectedLang["Gamemode"]}`, "description", "queueId"),
			document.createElement('br'),
			document.createElement('br')
		])
    )
}

window.addEventListener('load', async () => {
   function tickcheck (Data, el, box) {
      if (Data && el.getAttribute("class") == "") {
         box.checked = true
      }
   }
   const interval = setInterval(() => {
      const manager = document.getElementById(
         'lol-uikit-layer-manager-wrapper'
      )
      if (manager) {
         clearInterval(interval)
         new MutationObserver((mutations) => {
            const panel = document.querySelector('div.lol-settings-options > lol-uikit-scrollable')
            if (panel && mutations.some((record) => Array.from(record.addedNodes).includes(panel))) {
               injectSettings(panel)
               const check = setInterval (()=>{
                  let autoqel  = document.getElementById("autoq")
                  let autoqbox = document.getElementById("autoqbox");

                  if (document.getElementById("autoq")) {
                     clearInterval(check)
                     tickcheck(DataStore.get("Auto-Find-Queue"), autoqel, autoqbox)
                  }
               },100)
            }
         }).observe(manager, {childList: true, subtree: true}
		)
      }
   },500)
})

window.addEventListener('load', ()=> {
   utils.mutationObserverAddCallback(AutoQueue, ["screen-root"])
})