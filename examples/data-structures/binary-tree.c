#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int data;
    struct Node* left;
    struct Node* right;
} Node;

Node* create_node(int data) {
    Node* new_node = (Node*)malloc(sizeof(Node));
    if (new_node == NULL) {
        printf("Memory allocation failed!\n");
        return NULL;
    }
    new_node->data = data;
    new_node->left = NULL;
    new_node->right = NULL;
    return new_node;
}

void insert(Node** root, int data) {
    if (*root == NULL) {
        *root = create_node(data);
        return;
    }
    
    if (data < (*root)->data) {
        insert(&((*root)->left), data);
    } else if (data > (*root)->data) {
        insert(&((*root)->right), data);
    }
}

void inorder_traversal(Node* root) {
    if (root == NULL) return;
    inorder_traversal(root->left);
    printf("%d ", root->data);
    inorder_traversal(root->right);
}

void preorder_traversal(Node* root) {
    if (root == NULL) return;
    printf("%d ", root->data);
    preorder_traversal(root->left);
    preorder_traversal(root->right);
}

void postorder_traversal(Node* root) {
    if (root == NULL) return;
    postorder_traversal(root->left);
    postorder_traversal(root->right);
    printf("%d ", root->data);
}

int search(Node* root, int data) {
    if (root == NULL) return 0;
    if (root->data == data) return 1;
    if (data < root->data) return search(root->left, data);
    return search(root->right, data);
}

int find_min(Node* root) {
    if (root == NULL) return -1;
    while (root->left != NULL) {
        root = root->left;
    }
    return root->data;
}

int find_max(Node* root) {
    if (root == NULL) return -1;
    while (root->right != NULL) {
        root = root->right;
    }
    return root->data;
}

int height(Node* root) {
    if (root == NULL) return -1;
    int left_height = height(root->left);
    int right_height = height(root->right);
    return (left_height > right_height ? left_height : right_height) + 1;
}

void free_tree(Node* root) {
    if (root == NULL) return;
    free_tree(root->left);
    free_tree(root->right);
    free(root);
}

int main() {
    printf("Binary Search Tree Demo\n");
    printf("======================\n\n");
    
    Node* root = NULL;
    
    // Insert values
    int values[] = {50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45};
    int size = sizeof(values) / sizeof(values[0]);
    
    printf("1. Inserting values: ");
    for (int i = 0; i < size; i++) {
        printf("%d ", values[i]);
        insert(&root, values[i]);
    }
    printf("\n\n");
    
    printf("2. Tree Traversals:\n");
    printf("   Inorder (sorted):   ");
    inorder_traversal(root);
    printf("\n");
    
    printf("   Preorder:            ");
    preorder_traversal(root);
    printf("\n");
    
    printf("   Postorder:          ");
    postorder_traversal(root);
    printf("\n\n");
    
    printf("3. Tree Properties:\n");
    printf("   Height: %d\n", height(root));
    printf("   Minimum value: %d\n", find_min(root));
    printf("   Maximum value: %d\n", find_max(root));
    printf("\n");
    
    printf("4. Search Operations:\n");
    int search_values[] = {40, 55, 70, 100};
    for (int i = 0; i < 4; i++) {
        int found = search(root, search_values[i]);
        printf("   %d: %s\n", search_values[i], found ? "Found" : "Not found");
    }
    
    free_tree(root);
    printf("\n5. Tree freed (memory deallocated)\n");
    
    return 0;
}

