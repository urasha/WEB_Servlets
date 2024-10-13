package controllers;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import models.Point;

@WebServlet("/areaCheck")
public class AreaCheckServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        double x = Double.parseDouble(request.getParameter("x"));
        double y = Double.parseDouble(request.getParameter("y"));
        double radius = Double.parseDouble(request.getParameter("r"));

        boolean isHit = checkPoint(x, y, radius);

        Point point = new Point(x, y, radius, isHit);

        HttpSession session = request.getSession();
        List<Point> points = (List<Point>) session.getAttribute("points");
        if (points == null) {
            points = new ArrayList<>();
        }
        points.add(point);
        session.setAttribute("points", points);

        request.getRequestDispatcher("/result.jsp").forward(request, response);
    }

    private boolean checkPoint(double x, double y, double radius) {
        // Пример логики проверки попадания в область
        return (x >= 0 && y >= 0 && x * x + y * y <= radius * radius);
    }
}

