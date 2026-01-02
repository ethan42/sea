#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int data;
    struct Node* left;
    struct Node* right;
} Node;

Node* create_node(int data) {
    Node* node = (Node*)malloc(sizeof(Node));
    node->data = data;
    node->left = NULL;
    node->right = NULL;
    return node;
}

// Inorder: Left -> Root -> Right
void inorder(Node* root) {
    if (root == NULL) return;
    inorder(root->left);
    printf("%d ", root->data);
    inorder(root->right);
}

// Preorder: Root -> Left -> Right
void preorder(Node* root) {
    if (root == NULL) return;
    printf("%d ", root->data);
    preorder(root->left);
    preorder(root->right);
}

// Postorder: Left -> Right -> Root
void postorder(Node* root) {
    if (root == NULL) return;
    postorder(root->left);
    postorder(root->right);
    printf("%d ", root->data);
}

// Level-order (BFS) using recursion
int max_level(Node* root) {
    if (root == NULL) return 0;
    int left = max_level(root->left);
    int right = max_level(root->right);
    return (left > right ? left : right) + 1;
}

void print_level(Node* root, int level) {
    if (root == NULL) return;
    if (level == 1) {
        printf("%d ", root->data);
    } else if (level > 1) {
        print_level(root->left, level - 1);
        print_level(root->right, level - 1);
    }
}

void level_order(Node* root) {
    int h = max_level(root);
    for (int i = 1; i <= h; i++) {
        print_level(root, i);
    }
}

int count_nodes(Node* root) {
    if (root == NULL) return 0;
    return 1 + count_nodes(root->left) + count_nodes(root->right);
}

int count_leaves(Node* root) {
    if (root == NULL) return 0;
    if (root->left == NULL && root->right == NULL) return 1;
    return count_leaves(root->left) + count_leaves(root->right);
}

void free_tree(Node* root) {
    if (root == NULL) return;
    free_tree(root->left);
    free_tree(root->right);
    free(root);
}

int main() {
    printf("Tree Traversal Demo\n");
    printf("===================\n\n");
    
    // Create a sample tree:
    //        1
    //       / \
    //      2   3
    //     / \   \
    //    4   5   6
    //       /
    //      7
    
    Node* root = create_node(1);
    root->left = create_node(2);
    root->right = create_node(3);
    root->left->left = create_node(4);
    root->left->right = create_node(5);
    root->right->right = create_node(6);
    root->left->right->left = create_node(7);
    
    printf("Tree Structure:\n");
    printf("        1\n");
    printf("       / \\\n");
    printf("      2   3\n");
    printf("     / \\   \\\n");
    printf("    4   5   6\n");
    printf("       /\n");
    printf("      7\n\n");
    
    printf("1. Depth-First Traversals:\n");
    printf("   Inorder:   ");
    inorder(root);
    printf("\n");
    
    printf("   Preorder:  ");
    preorder(root);
    printf("\n");
    
    printf("   Postorder: ");
    postorder(root);
    printf("\n\n");
    
    printf("2. Breadth-First Traversal:\n");
    printf("   Level-order: ");
    level_order(root);
    printf("\n\n");
    
    printf("3. Tree Statistics:\n");
    printf("   Total nodes: %d\n", count_nodes(root));
    printf("   Leaf nodes: %d\n", count_leaves(root));
    printf("   Tree height: %d\n", max_level(root) - 1);
    
    free_tree(root);
    printf("\n4. Tree freed\n");
    
    return 0;
}

