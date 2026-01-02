#include <stdio.h>

// Function pointer type definitions
typedef int (*MathOperation)(int, int);
typedef void (*PrintFunction)(const char*);

// Math operations
int add(int a, int b) {
    return a + b;
}

int subtract(int a, int b) {
    return a - b;
}

int multiply(int a, int b) {
    return a * b;
}

int divide(int a, int b) {
    if (b == 0) {
        printf("Error: Division by zero!\n");
        return 0;
    }
    return a / b;
}

// Print functions
void print_normal(const char* msg) {
    printf("%s\n", msg);
}

void print_uppercase(const char* msg) {
    int i = 0;
    while (msg[i] != '\0') {
        if (msg[i] >= 'a' && msg[i] <= 'z') {
            printf("%c", msg[i] - 32);
        } else {
            printf("%c", msg[i]);
        }
        i++;
    }
    printf("\n");
}

void print_with_prefix(const char* msg) {
    printf(">>> %s\n", msg);
}

// Calculator using function pointers
int calculate(int a, int b, MathOperation op) {
    return op(a, b);
}

// Apply print function
void apply_print(const char* message, PrintFunction print_func) {
    print_func(message);
}

int main() {
    printf("Function Pointers Demo\n");
    printf("=====================\n\n");
    
    printf("1. Math Operations:\n");
    int x = 20, y = 4;
    
    MathOperation operations[] = {add, subtract, multiply, divide};
    const char* op_names[] = {"Add", "Subtract", "Multiply", "Divide"};
    
    for (int i = 0; i < 4; i++) {
        int result = calculate(x, y, operations[i]);
        printf("   %s(%d, %d) = %d\n", op_names[i], x, y, result);
    }
    
    printf("\n2. Print Functions:\n");
    const char* message = "Hello from function pointer!";
    
    PrintFunction printers[] = {print_normal, print_uppercase, print_with_prefix};
    const char* printer_names[] = {"Normal", "Uppercase", "With Prefix"};
    
    for (int i = 0; i < 3; i++) {
        printf("   %s: ", printer_names[i]);
        apply_print(message, printers[i]);
    }
    
    printf("\n3. Function Pointer Array:\n");
    MathOperation ops[] = {add, multiply};
    int values[] = {10, 5, 8, 2};
    
    for (int i = 0; i < 2; i++) {
        int result = ops[i](values[i * 2], values[i * 2 + 1]);
        printf("   Operation %d: %d\n", i + 1, result);
    }
    
    return 0;
}

