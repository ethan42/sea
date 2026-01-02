#include <stdio.h>
#include <stdbool.h>
#include <stdlib.h>
#include <math.h>

bool is_prime(int n) {
    if (n < 2) return false;
    if (n == 2) return true;
    if (n % 2 == 0) return false;
    
    int limit = (int)sqrt(n);
    for (int i = 3; i <= limit; i += 2) {
        if (n % i == 0) {
            return false;
        }
    }
    return true;
}

void sieve_of_eratosthenes(int n) {
    bool* is_prime_arr = (bool*)malloc((n + 1) * sizeof(bool));
    
    // Initialize all as prime
    for (int i = 0; i <= n; i++) {
        is_prime_arr[i] = true;
    }
    
    is_prime_arr[0] = false;
    is_prime_arr[1] = false;
    
    // Sieve
    for (int i = 2; i * i <= n; i++) {
        if (is_prime_arr[i]) {
            for (int j = i * i; j <= n; j += i) {
                is_prime_arr[j] = false;
            }
        }
    }
    
    // Print primes
    printf("Primes up to %d: ", n);
    int count = 0;
    for (int i = 2; i <= n; i++) {
        if (is_prime_arr[i]) {
            printf("%d ", i);
            count++;
        }
    }
    printf("\nTotal: %d primes\n", count);
    
    free(is_prime_arr);
}

int main() {
    printf("Prime Numbers Demo\n");
    printf("==================\n\n");
    
    printf("1. Checking individual numbers:\n");
    int test_numbers[] = {2, 3, 4, 17, 25, 29, 97, 100};
    int num_tests = sizeof(test_numbers) / sizeof(test_numbers[0]);
    
    for (int i = 0; i < num_tests; i++) {
        int num = test_numbers[i];
        printf("   %d is %s\n", num, is_prime(num) ? "prime" : "not prime");
    }
    
    printf("\n2. Sieve of Eratosthenes:\n");
    sieve_of_eratosthenes(50);
    
    printf("\n3. First 20 primes:\n");
    int count = 0;
    int num = 2;
    while (count < 20) {
        if (is_prime(num)) {
            printf("%d ", num);
            count++;
        }
        num++;
    }
    printf("\n");
    
    return 0;
}

