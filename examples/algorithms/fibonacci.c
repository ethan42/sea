#include <stdio.h>

// Recursive Fibonacci
long fib_recursive(int n) {
    if (n <= 1) return n;
    return fib_recursive(n - 1) + fib_recursive(n - 2);
}

// Iterative Fibonacci (more efficient)
long fib_iterative(int n) {
    if (n <= 1) return n;
    long prev = 0, curr = 1;
    for (int i = 2; i <= n; i++) {
        long next = prev + curr;
        prev = curr;
        curr = next;
    }
    return curr;
}

int main() {
    printf("Fibonacci Sequence\n");
    printf("==================\n\n");

    printf("First 20 Fibonacci numbers (iterative):\n");
    for (int i = 0; i < 20; i++) {
        printf("F(%d) = %ld\n", i, fib_iterative(i));
    }

    printf("\nRecursive calculation for F(10): %ld\n", fib_recursive(10));

    return 0;
}

