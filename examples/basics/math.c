#include <stdio.h>
#include <math.h>

int main() {
    printf("Math Functions Demo\n");
    printf("===================\n\n");

    double x = 2.0;
    double y = 3.0;

    printf("1. Power and Roots:\n");
    printf("   pow(%.1f, %.1f) = %.4f\n", x, y, pow(x, y));
    printf("   sqrt(16.0) = %.4f\n", sqrt(16.0));
    printf("   cbrt(27.0) = %.4f\n\n", cbrt(27.0));

    double angle = M_PI / 4;
    printf("2. Trigonometric (angle = PI/4 = 45 degrees):\n");
    printf("   sin(PI/4) = %.4f\n", sin(angle));
    printf("   cos(PI/4) = %.4f\n", cos(angle));
    printf("   tan(PI/4) = %.4f\n\n", tan(angle));

    printf("3. Logarithms:\n");
    printf("   log(e) = %.4f (natural log)\n", log(M_E));
    printf("   log10(100) = %.4f\n", log10(100));
    printf("   log2(8) = %.4f\n\n", log2(8));

    double val = 3.7;
    printf("4. Rounding (value = %.1f):\n", val);
    printf("   floor(%.1f) = %.1f\n", val, floor(val));
    printf("   ceil(%.1f) = %.1f\n", val, ceil(val));
    printf("   round(%.1f) = %.1f\n\n", val, round(val));

    printf("5. Absolute values:\n");
    printf("   fabs(-5.5) = %.1f\n\n", fabs(-5.5));

    printf("6. Math Constants:\n");
    printf("   PI = %.10f\n", M_PI);
    printf("   E  = %.10f\n", M_E);

    return 0;
}

