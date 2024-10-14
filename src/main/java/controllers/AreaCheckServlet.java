package controllers;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import com.google.gson.Gson;

import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import models.Point;
import utils.PointHitChecker;

@WebServlet("/areaCheck")
public class AreaCheckServlet extends HttpServlet {

    private static final Logger logger = Logger.getLogger(AreaCheckServlet.class.getName());

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        Point point = parseRequest(request);
        point.setHit(PointHitChecker.checkHit(point));

        logger.info(point.toString());

        ServletContext context = getServletContext();
        List<Point> points = (List<Point>) context.getAttribute("allPoints");

        if (points == null) {
            points = new ArrayList<>();
        }

        points.add(point);

        context.setAttribute("allPoints", points);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(new Gson().toJson(point));
    }

    private Point parseRequest(HttpServletRequest request) throws IOException {
        StringBuilder stringBuilder = new StringBuilder();
        String line;

        try (BufferedReader reader = request.getReader()) {
            while ((line = reader.readLine()) != null) {
                stringBuilder.append(line);
            }
        }

        String jsonBody = stringBuilder.toString();

        Gson gson = new Gson();

        return gson.fromJson(jsonBody, Point.class);
    }
}
