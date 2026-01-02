#include <stdio.h>

// Recursive factorial
unsigned long long factorial_recursive(int n) {
    if (n <= 1) return 1;
    return n * factorial_recursive(n - 1);
}

// Iterative factorial
unsigned long long factorial_iterative(int n) {
    unsigned long long result = 1;
    for (int i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

int main() {
    printf("Factorial Calculator\n");
    printf("====================\n\n");

    for (int i = 0; i <= 20; i++) {
        printf("%2d! = %llu\n", i, factorial_iterative(i));
    }

    printf("\nNote: Values overflow after 20! for 64-bit integers\n");

    return 0;
}

