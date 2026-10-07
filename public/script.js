
const scanButton =
    document.getElementById("scanButton");

const urlInput =
    document.getElementById("urlInput");


scanButton.addEventListener("click", scanWebsite);


async function scanWebsite() {

    let websiteName =
        urlInput.value.trim();


    if (!websiteName) {

        alert(
            "Please enter a website address."
        );

        return;
    }


    const url =
        "https://" + websiteName;


    scanButton.textContent =
        "Scanning...";

    scanButton.disabled =
        true;


    try {

        const response =
            await fetch(
                "/scan",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            url: url
                        })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "The scan failed."
            );

        }


        sessionStorage.setItem(
            "webguardReport",
            JSON.stringify(data)
        );


        window.location.href =
            "/report.html";


    } catch (error) {

        console.error(
            "WebGuard scan error:",
            error
        );


        alert(
            error.message ||
            "Something went wrong while scanning."
        );


        scanButton.textContent =
            "Scan Website";

        scanButton.disabled =
            false;

    }

}
