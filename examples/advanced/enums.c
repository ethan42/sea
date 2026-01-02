#include <stdio.h>

// Basic enum declaration
enum Color {
    RED,
    GREEN,
    BLUE
};

// Enum with explicit values
enum Status {
    PENDING = 1,
    PROCESSING = 5,
    COMPLETED = 10,
    FAILED = -1
};

// Enum with typedef (common practice)
typedef enum {
    MONDAY,
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY,
    SATURDAY,
    SUNDAY
} Day;

// Enum for state machine
typedef enum {
    IDLE,
    RUNNING,
    PAUSED,
    STOPPED
} State;

const char* get_state_name(State s) {
    switch (s) {
        case IDLE: return "IDLE";
        case RUNNING: return "RUNNING";
        case PAUSED: return "PAUSED";
        case STOPPED: return "STOPPED";
        default: return "UNKNOWN";
    }
}

int main() {
    printf("Enum Examples\n");
    printf("=============\n\n");
    
    // 1. Basic enum usage
    printf("1. Basic Enum (Color):\n");
    enum Color c1 = RED;
    enum Color c2 = GREEN;
    enum Color c3 = BLUE;
    
    printf("   RED = %d\n", c1);
    printf("   GREEN = %d\n", c2);
    printf("   BLUE = %d\n", c3);
    printf("\n");
    
    // 2. Enum with explicit values
    printf("2. Enum with Explicit Values (Status):\n");
    enum Status s1 = PENDING;
    enum Status s2 = PROCESSING;
    enum Status s3 = COMPLETED;
    enum Status s4 = FAILED;
    
    printf("   PENDING = %d\n", s1);
    printf("   PROCESSING = %d\n", s2);
    printf("   COMPLETED = %d\n", s3);
    printf("   FAILED = %d\n", s4);
    printf("\n");
    
    // 3. Typedef enum usage
    printf("3. Typedef Enum (Day):\n");
    Day today = MONDAY;
    Day tomorrow = TUESDAY;
    
    printf("   Today: %d (MONDAY)\n", today);
    printf("   Tomorrow: %d (TUESDAY)\n", tomorrow);
    printf("   Weekend starts at: %d (SATURDAY)\n", SATURDAY);
    printf("\n");
    
    // 4. Enum in switch statement
    printf("4. Enum in Switch Statement (State Machine):\n");
    State current_state = IDLE;
    
    printf("   Initial state: %s\n", get_state_name(current_state));
    
    current_state = RUNNING;
    printf("   After start: %s\n", get_state_name(current_state));
    
    current_state = PAUSED;
    printf("   After pause: %s\n", get_state_name(current_state));
    
    current_state = STOPPED;
    printf("   After stop: %s\n", get_state_name(current_state));
    printf("\n");
    
    // 5. Enum iteration
    printf("5. Enum Values:\n");
    printf("   All days of the week:\n");
    for (int i = MONDAY; i <= SUNDAY; i++) {
        const char* day_names[] = {
            "Monday", "Tuesday", "Wednesday", "Thursday",
            "Friday", "Saturday", "Sunday"
        };
        printf("     %d: %s\n", i, day_names[i]);
    }
    printf("\n");
    
    // 6. Enum comparison
    printf("6. Enum Comparison:\n");
    Day day1 = FRIDAY;
    Day day2 = MONDAY;
    
    if (day1 > day2) {
        printf("   FRIDAY (%d) comes after MONDAY (%d)\n", day1, day2);
    }
    
    if (day1 == FRIDAY) {
        printf("   day1 is indeed FRIDAY\n");
    }
    
    return 0;
}

