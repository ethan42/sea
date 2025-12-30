// C Code Examples for Sea

export const EXAMPLES = {
    hello: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    printf("Welcome to Sea - an in-browser C compiler.\\n");
    printf("This uses Clang compiled to WebAssembly via Wasmer SDK.\\n");
    return 0;
}`,

    fibonacci: `#include <stdio.h>

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
    printf("Fibonacci Sequence\\n");
    printf("==================\\n\\n");
    
    printf("First 20 Fibonacci numbers (iterative):\\n");
    for (int i = 0; i < 20; i++) {
        printf("F(%d) = %ld\\n", i, fib_iterative(i));
    }
    
    printf("\\nRecursive calculation for F(10): %ld\\n", fib_recursive(10));
    
    return 0;
}`,

    factorial: `#include <stdio.h>

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
    printf("Factorial Calculator\\n");
    printf("====================\\n\\n");
    
    for (int i = 0; i <= 20; i++) {
        printf("%2d! = %llu\\n", i, factorial_iterative(i));
    }
    
    printf("\\nNote: Values overflow after 20! for 64-bit integers\\n");
    
    return 0;
}`,

    arrays: `#include <stdio.h>

void print_array(int arr[], int size, const char *label) {
    printf("%s: [", label);
    for (int i = 0; i < size; i++) {
        printf("%d", arr[i]);
        if (i < size - 1) printf(", ");
    }
    printf("]\\n");
}

void bubble_sort(int arr[], int size) {
    for (int i = 0; i < size - 1; i++) {
        for (int j = 0; j < size - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}

int main() {
    int numbers[] = {64, 34, 25, 12, 22, 11, 90, 42, 15, 7};
    int size = sizeof(numbers) / sizeof(numbers[0]);
    
    printf("Array Operations Demo\\n");
    printf("=====================\\n\\n");
    
    print_array(numbers, size, "Original");
    
    bubble_sort(numbers, size);
    
    print_array(numbers, size, "Sorted  ");
    
    int min = numbers[0], max = numbers[size - 1];
    int sum = 0;
    for (int i = 0; i < size; i++) {
        sum += numbers[i];
    }
    
    printf("\\nStatistics:\\n");
    printf("  Min: %d\\n", min);
    printf("  Max: %d\\n", max);
    printf("  Sum: %d\\n", sum);
    printf("  Avg: %.2f\\n", (float)sum / size);
    
    return 0;
}`,

    structs: `#include <stdio.h>
#include <string.h>

struct Person {
    char name[50];
    int age;
    float height;
};

struct Point {
    int x;
    int y;
};

float distance(struct Point p1, struct Point p2) {
    int dx = p2.x - p1.x;
    int dy = p2.y - p1.y;
    return (float)(dx * dx + dy * dy);
}

void print_person(struct Person p) {
    printf("  Name: %s\\n", p.name);
    printf("  Age: %d years\\n", p.age);
    printf("  Height: %.2f meters\\n", p.height);
}

int main() {
    printf("Structures Demo\\n");
    printf("===============\\n\\n");
    
    struct Person alice;
    strcpy(alice.name, "Alice Johnson");
    alice.age = 28;
    alice.height = 1.65;
    
    struct Person bob = {"Bob Smith", 35, 1.80};
    
    printf("Person 1:\\n");
    print_person(alice);
    printf("\\nPerson 2:\\n");
    print_person(bob);
    
    printf("\\nPoints Demo:\\n");
    struct Point p1 = {0, 0};
    struct Point p2 = {3, 4};
    
    printf("  Point 1: (%d, %d)\\n", p1.x, p1.y);
    printf("  Point 2: (%d, %d)\\n", p2.x, p2.y);
    printf("  Squared distance: %.2f\\n", distance(p1, p2));
    
    return 0;
}`,

    pointers: `#include <stdio.h>

void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main() {
    printf("Pointers Demo\\n");
    printf("=============\\n\\n");
    
    int value = 42;
    int *ptr = &value;
    
    printf("1. Basic Pointers:\\n");
    printf("   value = %d\\n", value);
    printf("   &value (address) = %p\\n", (void*)&value);
    printf("   ptr = %p\\n", (void*)ptr);
    printf("   *ptr (dereferenced) = %d\\n\\n", *ptr);
    
    *ptr = 100;
    printf("2. After *ptr = 100:\\n");
    printf("   value = %d\\n\\n", value);
    
    int arr[] = {10, 20, 30, 40, 50};
    int *arr_ptr = arr;
    
    printf("3. Pointer Arithmetic:\\n");
    printf("   Array: [10, 20, 30, 40, 50]\\n");
    for (int i = 0; i < 5; i++) {
        printf("   *(arr_ptr + %d) = %d\\n", i, *(arr_ptr + i));
    }
    
    int x = 5, y = 10;
    printf("\\n4. Swap using pointers:\\n");
    printf("   Before: x = %d, y = %d\\n", x, y);
    swap(&x, &y);
    printf("   After:  x = %d, y = %d\\n", x, y);
    
    return 0;
}`,

    strings: `#include <stdio.h>
#include <string.h>

int main() {
    printf("String Operations Demo\\n");
    printf("======================\\n\\n");
    
    char str1[100] = "Hello";
    char str2[] = "World";
    char str3[100];
    
    printf("1. strlen():\\n");
    printf("   Length of \\"%s\\": %lu\\n\\n", str1, strlen(str1));
    
    strcpy(str3, str1);
    printf("2. strcpy():\\n");
    printf("   Copied \\"%s\\" to str3: \\"%s\\"\\n\\n", str1, str3);
    
    strcat(str1, " ");
    strcat(str1, str2);
    printf("3. strcat():\\n");
    printf("   Concatenated: \\"%s\\"\\n\\n", str1);
    
    printf("4. strcmp():\\n");
    printf("   strcmp(\\"abc\\", \\"abc\\") = %d\\n", strcmp("abc", "abc"));
    printf("   strcmp(\\"abc\\", \\"abd\\") = %d\\n", strcmp("abc", "abd"));
    printf("   strcmp(\\"abd\\", \\"abc\\") = %d\\n\\n", strcmp("abd", "abc"));
    
    char *found = strchr(str1, 'o');
    printf("5. strchr():\\n");
    printf("   First 'o' in \\"%s\\": \\"%s\\"\\n\\n", str1, found ? found : "not found");
    
    char *substr = strstr(str1, "World");
    printf("6. strstr():\\n");
    printf("   \\"World\\" found at: \\"%s\\"\\n", substr ? substr : "not found");
    
    return 0;
}`,

    math: `#include <stdio.h>
#include <math.h>

int main() {
    printf("Math Functions Demo\\n");
    printf("===================\\n\\n");
    
    double x = 2.0;
    double y = 3.0;
    
    printf("1. Power and Roots:\\n");
    printf("   pow(%.1f, %.1f) = %.4f\\n", x, y, pow(x, y));
    printf("   sqrt(16.0) = %.4f\\n", sqrt(16.0));
    printf("   cbrt(27.0) = %.4f\\n\\n", cbrt(27.0));
    
    double angle = M_PI / 4;
    printf("2. Trigonometric (angle = PI/4 = 45 degrees):\\n");
    printf("   sin(PI/4) = %.4f\\n", sin(angle));
    printf("   cos(PI/4) = %.4f\\n", cos(angle));
    printf("   tan(PI/4) = %.4f\\n\\n", tan(angle));
    
    printf("3. Logarithms:\\n");
    printf("   log(e) = %.4f (natural log)\\n", log(M_E));
    printf("   log10(100) = %.4f\\n", log10(100));
    printf("   log2(8) = %.4f\\n\\n", log2(8));
    
    double val = 3.7;
    printf("4. Rounding (value = %.1f):\\n", val);
    printf("   floor(%.1f) = %.1f\\n", val, floor(val));
    printf("   ceil(%.1f) = %.1f\\n", val, ceil(val));
    printf("   round(%.1f) = %.1f\\n\\n", val, round(val));
    
    printf("5. Absolute values:\\n");
    printf("   fabs(-5.5) = %.1f\\n\\n", fabs(-5.5));
    
    printf("6. Math Constants:\\n");
    printf("   PI = %.10f\\n", M_PI);
    printf("   E  = %.10f\\n", M_E);
    
    return 0;
}`
};
