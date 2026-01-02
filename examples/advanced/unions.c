#include <stdio.h>
#include <string.h>

// Basic union - shares memory space
union Data {
    int i;
    float f;
    char str[20];
};

// Union with struct (tagged union pattern)
typedef enum {
    INT_TYPE,
    FLOAT_TYPE,
    STRING_TYPE
} DataType;

typedef struct {
    DataType type;
    union {
        int int_value;
        float float_value;
        char string_value[20];
    } value;
} Variant;

// Union for type punning (reading memory as different type)
union IntFloat {
    int int_bits;
    float float_bits;
};

// Union for efficient storage of different types
typedef union {
    struct {
        unsigned char r, g, b, a;
    } rgba;
    unsigned int color;
} Color32;

void print_variant(Variant* v) {
    switch (v->type) {
        case INT_TYPE:
            printf("   Integer: %d\n", v->value.int_value);
            break;
        case FLOAT_TYPE:
            printf("   Float: %.2f\n", v->value.float_value);
            break;
        case STRING_TYPE:
            printf("   String: %s\n", v->value.string_value);
            break;
    }
}

int main() {
    printf("Union Examples\n");
    printf("==============\n\n");
    
    // 1. Basic union usage
    printf("1. Basic Union (shares memory):\n");
    union Data data;
    
    printf("   Size of union: %zu bytes\n", sizeof(union Data));
    printf("   (int: %zu, float: %zu, char[20]: %zu)\n\n",
           sizeof(int), sizeof(float), sizeof(char[20]));
    
    data.i = 42;
    printf("   Setting int: %d\n", data.i);
    printf("   Reading as float: %.2f (garbage)\n", data.f);
    
    data.f = 3.14f;
    printf("   Setting float: %.2f\n", data.f);
    printf("   Reading as int: %d (garbage)\n", data.i);
    
    strcpy(data.str, "Hello");
    printf("   Setting string: %s\n", data.str);
    printf("   Reading as int: %d (garbage)\n", data.i);
    printf("\n");
    
    // 2. Tagged union pattern
    printf("2. Tagged Union (Variant type):\n");
    Variant v1, v2, v3;
    
    v1.type = INT_TYPE;
    v1.value.int_value = 100;
    printf("   Variant 1:");
    print_variant(&v1);
    
    v2.type = FLOAT_TYPE;
    v2.value.float_value = 3.14159f;
    printf("   Variant 2:");
    print_variant(&v2);
    
    v3.type = STRING_TYPE;
    strcpy(v3.value.string_value, "Union Demo");
    printf("   Variant 3:");
    print_variant(&v3);
    printf("\n");
    
    // 3. Type punning (viewing memory as different type)
    printf("3. Type Punning (bit manipulation):\n");
    union IntFloat converter;
    
    converter.float_bits = 3.14159f;
    printf("   Float value: %.5f\n", converter.float_bits);
    printf("   As integer bits: 0x%08X\n", converter.int_bits);
    
    converter.int_bits = 0x40490FDB; // IEEE 754 representation of ~3.14159
    printf("   Setting bits: 0x%08X\n", converter.int_bits);
    printf("   As float: %.5f\n", converter.float_bits);
    printf("\n");
    
    // 4. Efficient color storage
    printf("4. Efficient Storage (Color32):\n");
    Color32 color;
    
    // Set RGBA components
    color.rgba.r = 255;
    color.rgba.g = 128;
    color.rgba.b = 64;
    color.rgba.a = 255;
    
    printf("   RGBA: (%d, %d, %d, %d)\n",
           color.rgba.r, color.rgba.g, color.rgba.b, color.rgba.a);
    printf("   As 32-bit integer: 0x%08X\n", color.color);
    
    // Access as integer
    color.color = 0xFF8040FF;
    printf("   Setting integer: 0x%08X\n", color.color);
    printf("   RGBA: (%d, %d, %d, %d)\n",
           color.rgba.r, color.rgba.g, color.rgba.b, color.rgba.a);
    printf("\n");
    
    // 5. Memory efficiency comparison
    printf("5. Memory Efficiency:\n");
    struct {
        int i;
        float f;
        char str[20];
    } separate = {42, 3.14f, "Hello"};
    
    printf("   Struct size: %zu bytes (all fields stored)\n", sizeof(separate));
    printf("   Union size: %zu bytes (only largest field)\n", sizeof(union Data));
    printf("   Memory saved: %zu bytes\n",
           sizeof(separate) - sizeof(union Data));
    
    return 0;
}

