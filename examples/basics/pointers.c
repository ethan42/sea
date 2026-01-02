#include <stdio.h>

void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main() {
    printf("Pointers Demo\n");
    printf("=============\n\n");

    int value = 42;
    int *ptr = &value;

    printf("1. Basic Pointers:\n");
    printf("   value = %d\n", value);
    printf("   &value (address) = %p\n", (void*)&value);
    printf("   ptr = %p\n", (void*)ptr);
    printf("   *ptr (dereferenced) = %d\n\n", *ptr);

    *ptr = 100;
    printf("2. After *ptr = 100:\n");
    printf("   value = %d\n\n", value);

    int arr[] = {10, 20, 30, 40, 50};
    int *arr_ptr = arr;

    printf("3. Pointer Arithmetic:\n");
    printf("   Array: [10, 20, 30, 40, 50]\n");
    for (int i = 0; i < 5; i++) {
        printf("   *(arr_ptr + %d) = %d\n", i, *(arr_ptr + i));
    }

    int x = 5, y = 10;
    printf("\n4. Swap using pointers:\n");
    printf("   Before: x = %d, y = %d\n", x, y);
    swap(&x, &y);
    printf("   After:  x = %d, y = %d\n", x, y);

    return 0;
}

