<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<!DOCTYPE html>
<html lang="ru">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Лабораторная №2</title>

    <style>
        @font-face {
            font-family: "Handjet";
            src: url("fonts/Handjet-VariableFont_ELGR,ELSH,wght.ttf") format("truetype");
        }

        * {
            font-family: Handjet, sans-serif;
            font-size: 20px;
        }

        body {
            padding: 1.75% 4%;
            background-color: #FFF8FA;
        }

        header {
            grid-column-start: 1;
            grid-column-end: 4;
            font-size: 32px;
            font-weight: 575;
            text-align: center;
            margin-bottom: 2%;
        }

        fieldset {
            border-color: #b57281;
            transition: .2s;
        }

        fieldset:hover {
            scale: 1.015;
            box-shadow: #e1d5d9 3px 3px 3px;
        }

        .wrapper {
            display: grid;
            gap: 1%;
        }

        .highlighted {
            font-weight: 600;
        }

        .error {
            color: #ca1515;
        }

        .x-input {
            grid-column-start: 1;
            grid-column-end: 2;
            grid-row-start: 2;
            grid-row-end: 4;
            align-content: center;
        }

        #x-error {
            margin-top: 10px;
            font-size: 23px;
        }

        .y-input {
            grid-column-start: 2;
            grid-column-end: 3;
            grid-row-start: 2;
            grid-row-end: 3;
            align-content: center;
        }

        #y-error {
            margin-left: 10px;
        }

        .r-input {
            grid-column-start: 2;
            grid-column-end: 3;
            grid-row-start: 3;
            grid-row-end: 4;
            align-content: center;
        }

        #r-selection {
            width: 20%;
        }

        #r-selection>option {
            font-size: 16px;
        }

        #r-error {
            margin-left: 10px;
        }

        #graph {
            grid-column-start: 3;
            grid-column-end: 4;
            grid-row-start: 2;
            grid-row-end: 5;
            align-content: end;
            text-align: center;
        }

        #submit-button {
            grid-column-start: 1;
            grid-column-end: 3;
            grid-row-start: 4;
            grid-row-end: 5;
            font-size: 20px;
            background-color: #FFCADC;
            border: rgba(223, 0, 76, 0.62) solid 1px;
            height: 50px;
            margin-top: 20px;
            transition: .25s;
        }

        #submit-button:hover {
            background-color: rgba(241, 177, 186, 0.89);
        }

        #result-wrapper {
            grid-column-start: 1;
            grid-column-end: 3;
            grid-row-start: 5;
            margin-top: 3%;
        }

        .axis {
            stroke-width: 2px;
            stroke: black;
        }

        table {
            width: 100%;
        }

        table,
        th,
        td {
            border: 1px solid black;
            border-collapse: collapse;
            padding: 12px;
        }

        td {
            text-align: center;
        }

        th {
            background-color: #eae6e6;
        }

        .hit-true {
            color: green;
        }

        .hit-false {
            color: red;
        }

        @media (max-width: 768px) {
            .wrapper {
                display: inline;
            }
        }
    </style>
</head>

<body>
    <div class="wrapper">
        <header>
            Нестеров Владислав Алексеевич P3210 488123
        </header>

        <div class="x-input">
            <fieldset>
                <legend class="highlighted">Выберите X:</legend>
                <input type="checkbox" value="-4" name="x-value" onclick="getValidatedX()"> -4 <br>
                <input type="checkbox" value="-3" name="x-value" onclick="getValidatedX()"> -3 <br>
                <input type="checkbox" value="-2" name="x-value" onclick="getValidatedX()"> -2 <br>
                <input type="checkbox" value="-1" name="x-value" onclick="getValidatedX()"> -1 <br>
                <input type="checkbox" value="0" name="x-value" onclick="getValidatedX()"> 0 <br>
                <input type="checkbox" value="1" name="x-value" onclick="getValidatedX()"> 1 <br>
                <input type="checkbox" value="2" name="x-value" onclick="getValidatedX()"> 2 <br>
                <input type="checkbox" value="3" name="x-value" onclick="getValidatedX()"> 3 <br>
                <input type="checkbox" value="4" name="x-value" onclick="getValidatedX()"> 4 <br>
                <span id="x-error" class="error"></span>
            </fieldset>
        </div>

        <div class="y-input">
            <fieldset>
                <legend class="highlighted">Введите Y:</legend>
                <input type="text" placeholder="[-5; 5]" id="y-value" name="y-value">
                <span id="y-error" class="error"></span>
            </fieldset>
        </div>

        <div class="r-input">
            <fieldset>
                <legend class="highlighted">Выберите R:</legend>
                <select id="r-selection" name="r-value">
                    <option value="1">1</option>
                    <option value="1.5">1.5</option>
                    <option value="2">2</option>
                    <option value="2.5">2.5</option>
                    <option value="3">3</option>
                </select>
                <span id="r-error" class="error"></span>
            </fieldset>
        </div>

        <button id="submit-button" class="highlighted">
            Проверить попадание
        </button>

        <div id="graph">
            <svg width="300" height="300">
                <rect x="50" y="50" width="100" height="100" fill="rgba(39, 147, 236, 0.85)" />
                <path d="M50,150 A 100 100, 270, 0, 0, 150 250 V150 H200" fill="rgba(39, 147, 236, 0.85)" />
                <polygon points="150,200 150,150 200,150" fill="rgba(39, 147, 236, 0.85)" />

                <line class="axis" x1="150" x2="155" y1="0" y2="10" />
                <line class="axis" x1="150" x2="145" y1="0" y2="10" />
                <line class="axis" x1="150" x2="150" y1="0" y2="300" />

                <line class="axis" x1="290" x2="300" y1="145" y2="150" />
                <line class="axis" x1="290" x2="300" y1="155" y2="150" />
                <line class="axis" x1="0" x2="300" y1="150" y2="150" />

                <line class="axis" x1="100" x2="100" y1="155" y2="145" />
                <line class="axis" x1="50" x2="50" y1="155" y2="145" />
                <line class="axis" x1="250" x2="250" y1="155" y2="145" />
                <line class="axis" x1="200" x2="200" y1="155" y2="145" />
                <line class="axis" x1="145" x2="155" y1="50" y2="50" />
                <line class="axis" x1="145" x2="155" y1="100" y2="100" />
                <line class="axis" x1="145" x2="155" y1="200" y2="200" />
                <line class="axis" x1="145" x2="155" y1="250" y2="250" />

                <text x="290" y="140" font-weight="bold">X</text>
                <text x="163" y="15" font-weight="bold">Y</text>

                <text x=45 y=140>-R</text>
                <text x="157" y="255">-R</text>
                <text x="157" y="55">R</text>
                <text x=245 y="140">R</text>
                <text x=90 y=140>-R/2</text>
                <text x=190 y="140">R/2</text>
                <text x="157" y="105">R/2</text>
                <text x="157" y="205">-R/2</text>
            </svg>
        </div>

        <div id="result-wrapper">
            <table id="data-table">
                <thead>
                    <tr>
                        <th>X</th>
                        <th>Y</th>
                        <th>R</th>
                        <th>Текущее время</th>
                        <th>Время выполнения скрипта</th>
                        <th>Попала ли точка</th>
                    </tr>
                </thead>

                <tbody>
                    <tr id="no-data">
                        <td colspan="6">Нет данных</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</body>

<script src="../scripts/validation.js"></script>

</html>