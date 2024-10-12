package models;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class Point {
    private double x;
    private int y;
    private int r;
    private boolean isHit;
}
