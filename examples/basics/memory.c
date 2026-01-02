#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void demonstrate_malloc() {
    printf("1. malloc() - Dynamic Memory Allocation:\n");
    int* arr = (int*)malloc(5 * sizeof(int));
    if (arr == NULL) {
        printf("   Memory allocation failed!\n");
        return;
    }
    
    printf("   Allocated array of 5 integers\n");
    for (int i = 0; i < 5; i++) {
        arr[i] = i * 10;
        printf("   arr[%d] = %d\n", i, arr[i]);
    }
    
    free(arr);
    printf("   Memory freed\n\n");
}

void demonstrate_calloc() {
    printf("2. calloc() - Zero-initialized Allocation:\n");
    int* arr = (int*)calloc(5, sizeof(int));
    if (arr == NULL) {
        printf("   Memory allocation failed!\n");
        return;
    }
    
    printf("   Allocated and zero-initialized array:\n");
    for (int i = 0; i < 5; i++) {
        printf("   arr[%d] = %d\n", i, arr[i]);
    }
    
    free(arr);
    printf("   Memory freed\n\n");
}

void demonstrate_realloc() {
    printf("3. realloc() - Resizing Memory:\n");
    int* arr = (int*)malloc(3 * sizeof(int));
    if (arr == NULL) {
        printf("   Memory allocation failed!\n");
        return;
    }
    
    printf("   Initial array (size 3):\n");
    for (int i = 0; i < 3; i++) {
        arr[i] = i + 1;
        printf("   arr[%d] = %d\n", i, arr[i]);
    }
    
    arr = (int*)realloc(arr, 6 * sizeof(int));
    if (arr == NULL) {
        printf("   Reallocation failed!\n");
        return;
    }
    
    printf("   Resized array (size 6):\n");
    for (int i = 3; i < 6; i++) {
        arr[i] = i + 1;
    }
    for (int i = 0; i < 6; i++) {
        printf("   arr[%d] = %d\n", i, arr[i]);
    }
    
    free(arr);
    printf("   Memory freed\n\n");
}

void demonstrate_string_allocation() {
    printf("4. String Memory Management:\n");
    char* str1 = (char*)malloc(20 * sizeof(char));
    if (str1 == NULL) {
        printf("   Memory allocation failed!\n");
        return;
    }
    
    strcpy(str1, "Hello, World!");
    printf("   Allocated string: \"%s\"\n", str1);
    printf("   Length: %lu\n", strlen(str1));
    
    char* str2 = (char*)calloc(20, sizeof(char));
    if (str2 == NULL) {
        free(str1);
        return;
    }
    
    strcpy(str2, "Dynamic Memory");
    printf("   Another string: \"%s\"\n", str2);
    
    free(str1);
    free(str2);
    printf("   Both strings freed\n");
}

int main() {
    printf("Memory Management Demo\n");
    printf("======================\n\n");
    
    demonstrate_malloc();
    demonstrate_calloc();
    demonstrate_realloc();
    demonstrate_string_allocation();
    
    return 0;
}

