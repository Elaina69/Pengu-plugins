import data from './config.json'
if (data["Custom-Status"]) {
    const statusMessage = Object.values(data["Lines"])
    .filter((value, index) => index >= 1 && index <= 25)
    .join("\\n");
    await fetch(
        "/lol-chat/v1/me",
        {headers:{
            "content-type":"application/json"
        },
        body:`{"statusMessage":"${statusMessage}"}`,method:"PUT"}
    )
}