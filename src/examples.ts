// C Code Examples for Sea - Dynamically loaded from examples directory

// Import all example C files as raw text
import helloCode from '../examples/basics/hello.c?raw';
import pointersCode from '../examples/basics/pointers.c?raw';
import stringsCode from '../examples/basics/strings.c?raw';
import mathCode from '../examples/basics/math.c?raw';
import memoryCode from '../examples/basics/memory.c?raw';
import fibonacciCode from '../examples/algorithms/fibonacci.c?raw';
import factorialCode from '../examples/algorithms/factorial.c?raw';
import binarySearchCode from '../examples/algorithms/binary-search.c?raw';
import primesCode from '../examples/algorithms/primes.c?raw';
import arraysCode from '../examples/data-structures/arrays.c?raw';
import structsCode from '../examples/data-structures/structs.c?raw';
import linkedListCode from '../examples/data-structures/linked-list.c?raw';
import binaryTreeCode from '../examples/data-structures/binary-tree.c?raw';
import treeTraversalCode from '../examples/data-structures/tree-traversal.c?raw';
import avlTreeCode from '../examples/data-structures/avl-tree.c?raw';
import functionPointersCode from '../examples/advanced/function-pointers.c?raw';
import macrosCode from '../examples/advanced/macros.c?raw';
import enumsCode from '../examples/advanced/enums.c?raw';
import unionsCode from '../examples/advanced/unions.c?raw';

export interface ExampleInfo {
    title: string;
    description: string;
    code: string;
    category: string;
}

// Single source of truth: metadata with code references
export const EXAMPLES_INFO: Record<string, ExampleInfo> = {
    hello: {
        title: 'Hello World',
        description: 'Basic printf example',
        code: helloCode,
        category: 'basics',
    },
    macros: {
        title: 'Preprocessor Macros',
        description: 'Macro definitions and usage',
        code: macrosCode,
        category: 'basics',
    },
    fibonacci: {
        title: 'Fibonacci',
        description: 'Recursive function',
        code: fibonacciCode,
        category: 'algorithms',
    },
    factorial: {
        title: 'Factorial',
        description: 'Iterative & recursive',
        code: factorialCode,
        category: 'algorithms',
    },
    'binary-search': {
        title: 'Binary Search',
        description: 'Iterative & recursive search',
        code: binarySearchCode,
        category: 'algorithms',
    },
    primes: {
        title: 'Prime Numbers',
        description: 'Sieve of Eratosthenes',
        code: primesCode,
        category: 'algorithms',
    },
    arrays: {
        title: 'Arrays & Sorting',
        description: 'Bubble sort implementation',
        code: arraysCode,
        category: 'data-structures',
    },
    structs: {
        title: 'Structures',
        description: 'Struct definitions and usage',
        code: structsCode,
        category: 'data-structures',
    },
    'linked-list': {
        title: 'Linked List',
        description: 'Dynamic linked list operations',
        code: linkedListCode,
        category: 'data-structures',
    },
    'binary-tree': {
        title: 'Binary Search Tree',
        description: 'BST operations and traversals',
        code: binaryTreeCode,
        category: 'data-structures',
    },
    'tree-traversal': {
        title: 'Tree Traversal',
        description: 'Inorder, preorder, postorder, level-order',
        code: treeTraversalCode,
        category: 'data-structures',
    },
    'avl-tree': {
        title: 'AVL Tree',
        description: 'Self-balancing binary search tree',
        code: avlTreeCode,
        category: 'data-structures',
    },
    pointers: {
        title: 'Pointers',
        description: 'Pointer manipulation',
        code: pointersCode,
        category: 'advanced',
    },
    strings: {
        title: 'String Operations',
        description: 'String library functions',
        code: stringsCode,
        category: 'advanced',
    },
    math: {
        title: 'Math Functions',
        description: 'Using math.h',
        code: mathCode,
        category: 'advanced',
    },
    memory: {
        title: 'Memory Management',
        description: 'malloc, calloc, realloc, free',
        code: memoryCode,
        category: 'advanced',
    },
    'function-pointers': {
        title: 'Function Pointers',
        description: 'Function pointer usage',
        code: functionPointersCode,
        category: 'advanced',
    },
    enums: {
        title: 'Enums',
        description: 'Enumeration types and usage',
        code: enumsCode,
        category: 'advanced',
    },
    unions: {
        title: 'Unions',
        description: 'Union types and memory sharing',
        code: unionsCode,
        category: 'advanced',
    },
};

// Derive EXAMPLES from EXAMPLES_INFO to avoid duplication
export const EXAMPLES: Record<string, string> = Object.fromEntries(
    Object.entries(EXAMPLES_INFO).map(([key, info]) => [key, info.code])
);
