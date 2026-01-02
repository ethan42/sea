#include <stdio.h>

int binary_search(int arr[], int size, int target) {
    int left = 0;
    int right = size - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) {
            return mid;
        }
        
        if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1; // Not found
}

int binary_search_recursive(int arr[], int left, int right, int target) {
    if (left > right) {
        return -1; // Not found
    }
    
    int mid = left + (right - left) / 2;
    
    if (arr[mid] == target) {
        return mid;
    }
    
    if (arr[mid] < target) {
        return binary_search_recursive(arr, mid + 1, right, target);
    } else {
        return binary_search_recursive(arr, left, mid - 1, target);
    }
}

void print_array(int arr[], int size) {
    printf("[");
    for (int i = 0; i < size; i++) {
        printf("%d", arr[i]);
        if (i < size - 1) printf(", ");
    }
    printf("]");
}

int main() {
    printf("Binary Search Demo\n");
    printf("==================\n\n");
    
    int arr[] = {2, 5, 8, 12, 16, 23, 38, 45, 56, 67, 78, 89, 90};
    int size = sizeof(arr) / sizeof(arr[0]);
    
    printf("Sorted array: ");
    print_array(arr, size);
    printf("\n\n");
    
    int targets[] = {23, 5, 90, 100, 12};
    int num_targets = sizeof(targets) / sizeof(targets[0]);
    
    printf("Iterative Binary Search:\n");
    for (int i = 0; i < num_targets; i++) {
        int index = binary_search(arr, size, targets[i]);
        if (index != -1) {
            printf("  Found %d at index %d\n", targets[i], index);
        } else {
            printf("  %d not found\n", targets[i]);
        }
    }
    
    printf("\nRecursive Binary Search:\n");
    for (int i = 0; i < num_targets; i++) {
        int index = binary_search_recursive(arr, 0, size - 1, targets[i]);
        if (index != -1) {
            printf("  Found %d at index %d\n", targets[i], index);
        } else {
            printf("  %d not found\n", targets[i]);
        }
    }
    
    return 0;
}

