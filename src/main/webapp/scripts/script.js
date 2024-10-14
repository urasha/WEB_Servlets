const MESSAGES = {
    X_ERROR: "Выберите только один X!",
    Y_ERROR: "Введите Y в заданных пределах [-5; 5]",
    R_ERROR: "Выберите из предложенных R!",

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
        .then(response => console.log(response))
        .catch(error => console.error("Fetch error: ", error));
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
    let r = parseInt(rInput.value);

    let validationResult = !isNaN(r) && possibleRValues.includes(r);
    document.querySelector("#r-error").textContent = validationResult ? "" : MESSAGES.R_ERROR;

    return validationResult ? r : null;
}

function handleImageClicking(event) {
    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();
    const svgWidth = rect.width;
    const svgHeight = rect.height;

    const r = parseFloat(document.getElementById("r-selection").value);

    const x = event.clientX - rect.left - svgWidth / 2;
    const y = svgHeight / 2 - (event.clientY - rect.top);

    const scaledX = ((x / (svgWidth / 2)) * r * 1.5).toFixed(2);
    const scaledY = ((y / (svgHeight / 2)) * r * 1.5).toFixed(2);

    console.log(`Clicked coordinates: x = ${scaledX}, y = ${scaledY}`);

    sendCoordinates(scaledX, scaledY, r);
}

const submitButton = document.querySelector("#submit-button");
submitButton.addEventListener("click", (event) => validateInput(event));
