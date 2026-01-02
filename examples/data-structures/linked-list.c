#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int data;
    struct Node* next;
} Node;

Node* create_node(int data) {
    Node* new_node = (Node*)malloc(sizeof(Node));
    if (new_node == NULL) {
        printf("Memory allocation failed!\n");
        return NULL;
    }
    new_node->data = data;
    new_node->next = NULL;
    return new_node;
}

void insert_at_end(Node** head, int data) {
    Node* new_node = create_node(data);
    if (*head == NULL) {
        *head = new_node;
        return;
    }
    Node* current = *head;
    while (current->next != NULL) {
        current = current->next;
    }
    current->next = new_node;
}

void insert_at_beginning(Node** head, int data) {
    Node* new_node = create_node(data);
    new_node->next = *head;
    *head = new_node;
}

void delete_node(Node** head, int data) {
    if (*head == NULL) return;
    
    if ((*head)->data == data) {
        Node* temp = *head;
        *head = (*head)->next;
        free(temp);
        return;
    }
    
    Node* current = *head;
    while (current->next != NULL && current->next->data != data) {
        current = current->next;
    }
    
    if (current->next != NULL) {
        Node* temp = current->next;
        current->next = current->next->next;
        free(temp);
    }
}

void print_list(Node* head) {
    Node* current = head;
    printf("List: ");
    while (current != NULL) {
        printf("%d", current->data);
        if (current->next != NULL) printf(" -> ");
        current = current->next;
    }
    printf(" -> NULL\n");
}

void free_list(Node** head) {
    Node* current = *head;
    while (current != NULL) {
        Node* temp = current;
        current = current->next;
        free(temp);
    }
    *head = NULL;
}

int main() {
    printf("Linked List Demo\n");
    printf("===============\n\n");
    
    Node* head = NULL;
    
    printf("1. Inserting at end: 10, 20, 30\n");
    insert_at_end(&head, 10);
    insert_at_end(&head, 20);
    insert_at_end(&head, 30);
    print_list(head);
    
    printf("\n2. Inserting at beginning: 5\n");
    insert_at_beginning(&head, 5);
    print_list(head);
    
    printf("\n3. Deleting node with value 20\n");
    delete_node(&head, 20);
    print_list(head);
    
    printf("\n4. Inserting more nodes: 15, 25\n");
    insert_at_end(&head, 15);
    insert_at_end(&head, 25);
    print_list(head);
    
    free_list(&head);
    printf("\n5. List freed (memory deallocated)\n");
    
    return 0;
}

