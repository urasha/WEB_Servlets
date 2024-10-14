const MESSAGES = {
    X_ERROR: "Выберите только один X!",
    Y_ERROR: "Введите Y в заданных пределах [-5; 5]",
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

    sendCoordinates(xResult, yResult, rResult);
}

function sendCoordinates(x, y, r) {
    const request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            x: x,
            y: y,
            r: r
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
            console.log(data);
            if (data) {
                addDataRow(data["x"], data["y"], data["r"], data["isHit"]);
            }
        })
        .catch(error => console.error("Fetch error: ", error));
}

function addDataRow(x, y, r, hit, time) {
    let tableBody = document.querySelector("#data-table tbody");
    let noDataRow = document.getElementById("no-data");

    if (noDataRow) {
        noDataRow.remove();
    }

    let newRow = document.createElement("tr");

    newRow.innerHTML = `
        <td>${x.toFixed(1)}</td>
        <td>${y.toFixed(1)}</td>
        <td>${r.toFixed(1)}</td>
        <td>${MESSAGES.HIT_RESULT[hit]}</td>
    `;

    tableBody.appendChild(newRow);
}

function getValidatedX() {
    const possibleXValues = [-4, -3, -2, -1, 0, 1, 2, 3, 4];

    const xInput = document.querySelectorAll('input[name="x-value"]:checked');
    let x = (xInput == null || xInput.length !== 1)
        ? NaN
        : parseInt(xInput[0].value);

    let validationResult = !isNaN(x) && possibleXValues.includes(x);
    document.querySelector("#x-error").textContent = validationResult ? "" : MESSAGES.X_ERROR;

    return validationResult ? x : null;
}

function getValidatedY() {
    const yInput = document.querySelector('#y-value');
    let y = parseFloat(yInput.value);

    let validationResult = !isNaN(y) && y <= 5 && y >= -5;
    document.querySelector("#y-error").textContent = validationResult ? "" : MESSAGES.Y_ERROR;

    return validationResult ? y : null;
}

function getValidatedR() {
    const possibleRValues = [1, 1.5, 2, 2.5, 3];

    const rInput = document.querySelector('#r-selection');
    let r = parseFloat(rInput.value);

    let validationResult = !isNaN(r) && possibleRValues.includes(r);
    document.querySelector("#r-error").textContent = validationResult ? "" : MESSAGES.R_ERROR;

    return validationResult ? r : null;
}

// transform svg coordinates to normal and send request with them
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

    const scaledX = ((x / (svgWidth / 2)) * r * 1.5).toFixed(3);
    const scaledY = ((y / (svgHeight / 2)) * r * 1.5).toFixed(3);

    console.log(`Clicked coordinates: x = ${scaledX}, y = ${scaledY}`);

    sendCoordinates(scaledX, scaledY, r);
}

const submitButton = document.querySelector("#submit-button");
submitButton.addEventListener("click", (event) => validateInput(event));
