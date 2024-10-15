<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.util.List" %>
<%@ page import="models.Point" %>
<%@ page import="java.text.SimpleDateFormat" %>
<%@ page import="java.util.Date" %>
<%@ page import="java.util.Locale" %>

<html>
<head>
    <title>Результаты проверки</title>
    <style>
        #result-wrapper {
            margin-top: 50px;
            width: 35%;
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
    </style>
</head>
<body>
    <div id="result-wrapper">
        <table id="data-table">
            <thead>
                <tr>
                    <th>X</th>
                    <th>Y</th>
                    <th>R</th>
                    <th>Попала ли точка</th>
                </tr>
            </thead>
            <tbody>
                <%
                    List<Point> points = (List<Point>) request.getServletContext().getAttribute("allPoints");
                    if (points == null || points.isEmpty()) {
                %>
                    <tr id="no-data">
                        <td colspan="6">Нет данных</td>
                    </tr>
                <%
                    } else {
                        for (Point point : points) {
                %>
                    <tr>
                        <td><%= String.format(Locale.US, "%.2f", point.getX()) %></td>
                        <td><%= String.format(Locale.US, "%.2f", point.getY()) %></td>
                        <td><%= String.format(Locale.US, "%.2f", point.getR()) %></td>
                        <td><%= point.isHit() ? "Да" : "Нет" %></td>
                    </tr>
                <%
                        }
                    }
                %>
            </tbody>
        </table>
    </div>
</body>
</html>
