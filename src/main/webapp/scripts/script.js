const MESSAGES = {
    X_ERROR: "Введите X в заданных пределах [-5; 5]",
    Y_ERROR: "Выберите из предложенных Y!",
    R_ERROR: "Выберите из предложенных R!",
    HIT_RESULT: {
        true: "Да",
        false: "Нет"
    },
    API_URL: "/web2/controller"
};

function validateInput() {
    const xResult = getValidatedX();
    const yResult = getValidatedY();
    const rResult = getValidatedR();

    if (xResult == null || yResult == null || rResult == null) {
        return;
    }

    sendRequestAndHandleResponse(xResult, yResult, rResult);
}

/**
 *  Send request to server to check point's hit and handle response:
 *  
 *  1) Send POST request with the coordinates and radius.
 *  2) Handle the response:
 *     a) If the response is OK, add the data to the table.
 *     b) If there is an error, log it in the console.
 *     c) (Optional) If a pointData object is passed, draw the point on the SVG.
 */
function sendRequestAndHandleResponse(x, y, r, pointData = null) {
    const request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            x: parseFloat(x.toFixed(2)),
            y: parseFloat(y.toFixed(2)),
            r: parseFloat(r.toFixed(2))
        })
    };

    fetch(MESSAGES.API_URL, request)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.error('Send error: ', response.statusText);
            }
        })
        .then(data => {
            if (data) {
                console.log(data);
                addDataRow(data["x"], data["y"], data["r"], data["isHit"]);

                if (pointData) {
                    drawPointOnSvg(pointData.svg, pointData.x, pointData.y);
                }
            }
        })
        .catch(error => console.error("Fetch error: ", error));
}

/**
 *  Handle SVG clicking
 * 
 *  1) Transform window coordinates to graph type
 *  2) Send POST request with them and handle it
 */
function handleImageClicking(event) {
    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();
    const svgWidth = rect.width;
    const svgHeight = rect.height;

    const r = getValidatedR();

    if (r == null) {
        return;
    }

    const x = event.clientX - rect.left - svgWidth / 2;
    const y = svgHeight / 2 - (event.clientY - rect.top);

    const scaledX = ((x / (svgWidth / 2)) * r * 1.5);
    const scaledY = ((y / (svgHeight / 2)) * r * 1.5);

    console.log(`Clicked coordinates: x = ${scaledX}, y = ${scaledY}`);

    const pointData = {
        svg: svg,
        x: x,
        y: y,
    };

    sendRequestAndHandleResponse(scaledX, scaledY, r, pointData);
}

function addDataRow(x, y, r, hit) {
    let tableBody = document.querySelector("#data-table tbody");
    let noDataRow = document.getElementById("no-data");

    if (noDataRow) {
        noDataRow.remove();
    }

    let newRow = document.createElement("tr");

    newRow.innerHTML = `
        <td>${x.toFixed(2)}</td>
        <td>${y.toFixed(2)}</td>
        <td>${r.toFixed(2)}</td>
        <td>${MESSAGES.HIT_RESULT[hit]}</td>
    `;

    tableBody.appendChild(newRow);
}

function getValidatedX() {
    const xInput = document.querySelector('#x-value');
    let x = parseFloat(xInput.value);

    let validationResult = !isNaN(x) && x <= 5 && x >= -5;
    document.querySelector("#x-error").textContent = validationResult ? "" : MESSAGES.X_ERROR;

    return validationResult ? x : null;
}

function getValidatedY() {
    const possibleValues = [-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2];

    const yInput = document.querySelector('input[name="y-value"]:checked');
    let y = (yInput == null)
        ? NaN
        : parseInt(yInput.value);

    let validationResult = !isNaN(y) && possibleValues.includes(y);
    document.querySelector("#y-error").textContent = validationResult ? "" : MESSAGES.Y_ERROR;

    return validationResult ? y : null;
}

function getValidatedR() {
    const possibleValues = [1, 2, 3, 4, 5];

    const rInput = document.querySelector('input[name="r-value"]:checked');
    let r = (rInput == null)
        ? NaN
        : parseInt(rInput.value);

    let validationResult = !isNaN(r) && possibleValues.includes(r);
    document.querySelector("#r-error").textContent = validationResult ? "" : MESSAGES.R_ERROR;

    return validationResult ? r : null;
}

function drawPointOnSvg(svg, x, y) {
    const point = document.createElementNS("http://www.w3.org/2000/svg", "circle");

    point.setAttribute("cx", svg.getBoundingClientRect().width / 2 + x);
    point.setAttribute("cy", svg.getBoundingClientRect().height / 2 - y);
    point.setAttribute("r", 3);
    point.setAttribute("fill", "red");

    svg.appendChild(point);
}

document.querySelector("#submit-button")
    .addEventListener("click", (event) => validateInput(event));

document.querySelector("svg")
    .addEventListener("click", (event) => handleImageClicking(event));