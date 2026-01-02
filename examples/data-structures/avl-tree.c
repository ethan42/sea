#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int data;
    struct Node* left;
    struct Node* right;
    int height;
} Node;

int max(int a, int b) {
    return (a > b) ? a : b;
}

int get_height(Node* node) {
    if (node == NULL) return 0;
    return node->height;
}

int get_balance(Node* node) {
    if (node == NULL) return 0;
    return get_height(node->left) - get_height(node->right);
}

Node* create_node(int data) {
    Node* node = (Node*)malloc(sizeof(Node));
    node->data = data;
    node->left = NULL;
    node->right = NULL;
    node->height = 1;
    return node;
}

Node* right_rotate(Node* y) {
    Node* x = y->left;
    Node* T2 = x->right;
    
    x->right = y;
    y->left = T2;
    
    y->height = max(get_height(y->left), get_height(y->right)) + 1;
    x->height = max(get_height(x->left), get_height(x->right)) + 1;
    
    return x;
}

Node* left_rotate(Node* x) {
    Node* y = x->right;
    Node* T2 = y->left;
    
    y->left = x;
    x->right = T2;
    
    x->height = max(get_height(x->left), get_height(x->right)) + 1;
    y->height = max(get_height(y->left), get_height(y->right)) + 1;
    
    return y;
}

Node* insert(Node* node, int data) {
    if (node == NULL) {
        return create_node(data);
    }
    
    if (data < node->data) {
        node->left = insert(node->left, data);
    } else if (data > node->data) {
        node->right = insert(node->right, data);
    } else {
        return node; // Duplicate values not allowed
    }
    
    node->height = 1 + max(get_height(node->left), get_height(node->right));
    
    int balance = get_balance(node);
    
    // Left Left Case
    if (balance > 1 && data < node->left->data) {
        return right_rotate(node);
    }
    
    // Right Right Case
    if (balance < -1 && data > node->right->data) {
        return left_rotate(node);
    }
    
    // Left Right Case
    if (balance > 1 && data > node->left->data) {
        node->left = left_rotate(node->left);
        return right_rotate(node);
    }
    
    // Right Left Case
    if (balance < -1 && data < node->right->data) {
        node->right = right_rotate(node->right);
        return left_rotate(node);
    }
    
    return node;
}

void inorder(Node* root) {
    if (root == NULL) return;
    inorder(root->left);
    printf("%d (h:%d, b:%d) ", root->data, root->height, get_balance(root));
    inorder(root->right);
}

void free_tree(Node* root) {
    if (root == NULL) return;
    free_tree(root->left);
    free_tree(root->right);
    free(root);
}

int main() {
    printf("AVL Tree (Self-Balancing) Demo\n");
    printf("==============================\n\n");
    
    Node* root = NULL;
    
    printf("1. Inserting values (AVL tree auto-balances):\n");
    int values[] = {10, 20, 30, 40, 50, 25};
    int size = sizeof(values) / sizeof(values[0]);
    
    for (int i = 0; i < size; i++) {
        printf("   Inserting %d...\n", values[i]);
        root = insert(root, values[i]);
    }
    
    printf("\n2. Inorder traversal (with height and balance factor):\n");
    printf("   ");
    inorder(root);
    printf("\n\n");
    
    printf("3. Tree Properties:\n");
    printf("   Root: %d\n", root->data);
    printf("   Root height: %d\n", root->height);
    printf("   Root balance: %d\n", get_balance(root));
    printf("   (Balance should be -1, 0, or 1 for AVL property)\n");
    
    free_tree(root);
    printf("\n4. Tree freed\n");
    
    return 0;
}

