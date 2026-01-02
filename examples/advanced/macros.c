#include <stdio.h>
#include <stdlib.h>
#include <math.h>

// Simple macros
#define PI 3.14159265359
#define MAX(a, b) ((a) > (b) ? (a) : (b))
#define MIN(a, b) ((a) < (b) ? (a) : (b))
#define SQUARE(x) ((x) * (x))
#define ABS(x) ((x) < 0 ? -(x) : (x))

// Multi-line macro
#define PRINT_SUM(a, b) \
    do { \
        printf("Sum of %d and %d = %d\n", a, b, (a) + (b)); \
    } while(0)

// Conditional compilation
#define DEBUG 1

// Macro with stringification
#define PRINT_VAR(x) printf(#x " = %d\n", x)

// Macro with token pasting
#define CONCAT(a, b) a##b

int main() {
    printf("Preprocessor Macros Demo\n");
    printf("========================\n\n");
    
    printf("1. Constant Macros:\n");
    printf("   PI = %.5f\n", PI);
    printf("   PI * 2 = %.5f\n\n", PI * 2);
    
    printf("2. Function-like Macros:\n");
    int a = 15, b = 25;
    printf("   MAX(%d, %d) = %d\n", a, b, MAX(a, b));
    printf("   MIN(%d, %d) = %d\n", a, b, MIN(a, b));
    printf("   SQUARE(%d) = %d\n", a, SQUARE(a));
    printf("   ABS(-%d) = %d\n\n", a, ABS(-a));
    
    printf("3. Multi-line Macro:\n");
    PRINT_SUM(10, 20);
    printf("\n");
    
    printf("4. Stringification:\n");
    int value = 42;
    PRINT_VAR(value);
    printf("\n");
    
    printf("5. Conditional Compilation:\n");
    #ifdef DEBUG
        printf("   DEBUG mode is ON\n");
    #else
        printf("   DEBUG mode is OFF\n");
    #endif
    
    #if DEBUG == 1
        printf("   Debug level: 1\n");
    #endif
    printf("\n");
    
    printf("6. Token Pasting:\n");
    int CONCAT(var, 1) = 100;  // Creates var1
    int CONCAT(var, 2) = 200;  // Creates var2
    printf("   var1 = %d\n", CONCAT(var, 1));
    printf("   var2 = %d\n", CONCAT(var, 2));
    
    return 0;
}

