export function getPluginsName() {
    const error = new Error();
    const stackTrace = error.stack;
    const scriptPath = stackTrace?.match(/(?:http|https):\/\/[^\s]+\.js/g)?.[0];
    const match = scriptPath?.match(/\/([^/]+)\/index\.js$/);
    return match ? match[1] : null;
}

function addOverlay() {
    if (!document.body) {
        console.error("Document body not available yet.");
        return;
    }
    const overlay = document.createElement("div");
    overlay.id = "recruitOverlay"; // Assign a unique ID to the overlay
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
    overlay.style.zIndex = "9999";
    overlay.style.color = "#fff";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.flexDirection = "column";
    overlay.style.justifyContent = "center";
    overlay.style.fontSize = "24px";

    // Create her speech
    const speech = document.createElement("div");
    speech.innerText = "Sensei! You must pull a 3-star student before continuing! Hehe~";
    speech.id = "text"
    speech.style.marginTop = "40px"; // Move text down by 40px
    overlay.appendChild(speech);

    // Create result display area
    const resultShow = document.createElement("div");
    resultShow.style.marginTop = "40px"; // Move text down by 40px
    overlay.appendChild(resultShow);
    
    // Create the image element
    const img = document.createElement("img");
    img.alt = "arona";
    img.src = `//plugins/${getPluginsName()}/assets/images/arona.png`; // Replace with the URL of your desired image
    console.log(img.src); // Log the image URL to verify it's correct
    img.style.width = "500px"; // Set width (adjust as needed)
    img.style.marginTop = "auto"; // Add some spacing between text and image
    img.onclick = () => { simulateRates() }

    // Append the image to the overlay
    overlay.appendChild(img);

    // Add art credit at the bottom left
    const credit = document.createElement("div");
    credit.innerHTML = `Art credit: <a href="https://x.com/gogoco6" target="_blank" style="color: #fff; text-decoration: underline;">gogoko</a>`;
    credit.style.position = "absolute";
    credit.style.bottom = "10px";
    credit.style.left = "10px";
    credit.style.fontSize = "40px";
    credit.style.color = "#fff";
    overlay.appendChild(credit);


    document.body.appendChild(overlay);
    console.log("Overlay added");

    // Store resultShow in overlay for easy access in simulateRates
    overlay.resultShow = resultShow;
}

// Simulate pulls and display results
function simulateRates() {
    const overlay = document.getElementById("recruitOverlay"); // Target by ID now
    const resultShow = overlay.resultShow; // Access resultShow element
    console.log("simulateRates function called"); // Confirm function is being called
    const maxRate = 1000;
    let results = "";

    for (let i = 0; i < 10; i++) {
        const pulledRate = Math.random() * (maxRate - 1) + 1;
        console.log('Pulled rate: ' + pulledRate); // Log pulled rate to check randomness

        if (pulledRate <= 30) {
            console.log('3*'); // This should log if pulledRate <= 30
            results += "🟪";
        } else if (pulledRate <= 215) {
            console.log('2*'); // This should log if 30 < pulledRate <= 215
            results += "🟨";
        } else {
            console.log('1*'); // This should log if pulledRate > 215
            results += "🟦";
        }
    }

    console.log(results);
    resultShow.innerText = results; // Update result display with new results

    // Check if a purple square (🟪) was pulled
    if (results.includes("🟪")) {
        document.querySelector("#recruitOverlay > #text").innerText = "Congratulation!! Sensei!";
        setTimeout(() => {
            overlay.remove(); // Remove the overlay after 2 seconds
            console.log("Overlay removed");
        }, 2000);
    }
}

// Check if document body is ready, or wait for it to load
if (document.body) {
    addOverlay();
    simulateRates();
} else {
    document.addEventListener("DOMContentLoaded", addOverlay);
    document.addEventListener("DOMContentLoaded", simulateRates);
}