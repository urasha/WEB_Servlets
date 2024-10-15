package controllers;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
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
    @SuppressWarnings("unchecked")
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        Point point = null;

        try {
            point = parseRequest(request);

            if(!validatePointValues(point)) {
                throw new NumberFormatException();
            }
        } catch (NumberFormatException e) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid input data");
            return;
        }

        point.setHit(PointHitChecker.checkHit(point));

        logger.info(point.toString());

        ServletContext context = getServletContext();
        List<Point> allPoints = (List<Point>) context.getAttribute("allPoints");

        if (allPoints == null) {
            allPoints = new ArrayList<>();
        }

        allPoints.add(point);

        context.setAttribute("allPoints", allPoints);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(new Gson().toJson(point));
    }

    private Point parseRequest(HttpServletRequest request)
            throws IOException, NumberFormatException {
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

    private boolean validatePointValues(Point point) {
        int[] validRValues = {1, 2, 3, 4, 5};
        if (Arrays.stream(validRValues).noneMatch(v -> v == point.getR())) {
            return false;
        }

        double k = point.getR() == 1 ? 0.5 : point.getR() * 1.5;

        if (point.getX() < -5 || point.getX() > 5) {
            return false;
        }

        if (point.getY() < -2 || point.getY() > 2) {
            return false;
        }

        

        return true;
    }
}
