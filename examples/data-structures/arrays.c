#include <stdio.h>

void print_array(int arr[], int size, const char *label) {
    printf("%s: [", label);
    for (int i = 0; i < size; i++) {
        printf("%d", arr[i]);
        if (i < size - 1) printf(", ");
    }
    printf("]\n");
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

    printf("Array Operations Demo\n");
    printf("=====================\n\n");

    print_array(numbers, size, "Original");

    bubble_sort(numbers, size);

    print_array(numbers, size, "Sorted  ");

    int min = numbers[0], max = numbers[size - 1];
    int sum = 0;
    for (int i = 0; i < size; i++) {
        sum += numbers[i];
    }

    printf("\nStatistics:\n");
    printf("  Min: %d\n", min);
    printf("  Max: %d\n", max);
    printf("  Sum: %d\n", sum);
    printf("  Avg: %.2f\n", (float)sum / size);

    return 0;
}

