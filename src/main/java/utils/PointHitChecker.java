package utils;

import java.util.logging.Logger;

import models.Point;

public class PointHitChecker {

    public static boolean checkHit(Point point) {
        double x = point.getX();
        double y = point.getY();
        double r = point.getR();

        boolean hitRect = checkRectangle(r, x, y);
        boolean hitCircle = checkCircle(r, x, y);
        boolean hitTriangle = checkTriangle(r, x, y);

        return hitRect || hitTriangle || hitCircle;
    }

    private static boolean checkRectangle(double r, double x, double y) {
        return (x >= -r && x <= 0) && (y <= r && y >= 0);
    }

    private static boolean checkCircle(double r, double x, double y) {
        return ((x * x + y * y) <= r * r) && (x >= 0 && y >= 0);
    }

    private static boolean checkTriangle(double r, double x, double y) {
        boolean withinXBounds = (0 <= x) && (x <= r); 
        boolean withinYBounds = (y >= -r / 2) && (y <= 0); 
        boolean aboveHypotenuse = (y >= 0.5 * x - r / 2); 

        return withinXBounds && withinYBounds && aboveHypotenuse;
    }
}