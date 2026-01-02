#include <stdio.h>
#include <string.h>

int main() {
    printf("String Operations Demo\n");
    printf("======================\n\n");

    char str1[100] = "Hello";
    char str2[] = "World";
    char str3[100];

    printf("1. strlen():\n");
    printf("   Length of \"%s\": %lu\n\n", str1, strlen(str1));

    strcpy(str3, str1);
    printf("2. strcpy():\n");
    printf("   Copied \"%s\" to str3: \"%s\"\n\n", str1, str3);

    strcat(str1, " ");
    strcat(str1, str2);
    printf("3. strcat():\n");
    printf("   Concatenated: \"%s\"\n\n", str1);

    printf("4. strcmp():\n");
    printf("   strcmp(\"abc\", \"abc\") = %d\n", strcmp("abc", "abc"));
    printf("   strcmp(\"abc\", \"abd\") = %d\n", strcmp("abc", "abd"));
    printf("   strcmp(\"abd\", \"abc\") = %d\n\n", strcmp("abd", "abc"));

    char *found = strchr(str1, 'o');
    printf("5. strchr():\n");
    printf("   First 'o' in \"%s\": \"%s\"\n\n", str1, found ? found : "not found");

    char *substr = strstr(str1, "World");
    printf("6. strstr():\n");
    printf("   \"World\" found at: \"%s\"\n", substr ? substr : "not found");

    return 0;
}

