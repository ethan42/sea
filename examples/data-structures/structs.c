#include <stdio.h>
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
    printf("  Name: %s\n", p.name);
    printf("  Age: %d years\n", p.age);
    printf("  Height: %.2f meters\n", p.height);
}

int main() {
    printf("Structures Demo\n");
    printf("===============\n\n");

    struct Person alice;
    strcpy(alice.name, "Alice Johnson");
    alice.age = 28;
    alice.height = 1.65;

    struct Person bob = {"Bob Smith", 35, 1.80};

    printf("Person 1:\n");
    print_person(alice);
    printf("\nPerson 2:\n");
    print_person(bob);

    printf("\nPoints Demo:\n");
    struct Point p1 = {0, 0};
    struct Point p2 = {3, 4};

    printf("  Point 1: (%d, %d)\n", p1.x, p1.y);
    printf("  Point 2: (%d, %d)\n", p2.x, p2.y);
    printf("  Squared distance: %.2f\n", distance(p1, p2));

    return 0;
}

