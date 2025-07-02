export interface Snippet {
    id: string;
    docstring: string;
    code: string;
    errorMessages: {
        standard: string;
        pragmatic: string;
        contingent: string;
    };
}

export const snippets: Snippet[] = [
    {
        id: 'snippet1',
        docstring: 'This function returns the nth Fibonacci number using dynamic programming.\nArgs:\n    n (int): The position in the Fibonacci sequence.\nReturns:\n    int: The nth Fibonacci number.\n\nNote: There is a bug in the implementation that can cause a recursion depth error.',
        code: `def fibonacci(n, memo={}):
    """
    Returns the nth Fibonacci number using dynamic programming.
    Args:
        n (int): The position in the Fibonacci sequence.
    Returns:
        int: The nth Fibonacci number.
    """
    if n in memo:
        return memo[n]
    if n <= 1:
        return n

    memo[n] = fibonacci(n-1, memo) + fibonacci(n-2, memo)
    return memo[n]

for i in range(10000):
    fibonacci(i)
`,
        errorMessages: {
            standard:
                'Traceback (most recent call last):\n' +
                '  File "main.py", line 15, in <module>\n' +
                '    fibonacci(i)\n' +
                '  File "main.py", line 12, in fibonacci\n' +
                '    memo[n] = fibonacci(n-1, memo) + fibonacci(n-2, memo)\n' +
                '  File "main.py", line 12, in fibonacci\n' +
                '    memo[n] = fibonacci(n-1, memo) + fibonacci(n-2, memo)\n' +
                '  ...\n' +
                'RecursionError: maximum recursion depth exceeded in comparison',
            pragmatic: 'The function uses a mutable default argument (memo={}), which is shared across calls and can cause unexpected recursion depth errors.',
            contingent: 'Using a mutable default argument for memoization can lead to issues. Try initializing memo inside the function instead.',
        },
    },
    {
        id: 'snippet2',
        docstring: 'This function checks if a string is a palindrome.\nArgs:\n    s (str): The string to check.\nReturns:\n    bool: True if s is a palindrome, False otherwise.\n',
        code: `def is_palindrome(s):
    """
    Checks if a string is a palindrome.
    Args:
        s (str): The string to check.
    Returns:
        bool: True if s is a palindrome, False otherwise.
    """
    return s == s[::-1] and len(s) > 0

print(is_palindrome("racecar"))
print(is_palindrome("hello"))
print(is_palindrome(""))
`,
        errorMessages: {
            standard:
                'Traceback (most recent call last):\n' +
                '  File "main.py", line 13, in <module>\n' +
                '    print(is_palindrome(""))\n' +
                '  File "main.py", line 10, in is_palindrome\n' +
                '    return s == s[::-1] and len(s) > 0\n' +
                'AssertionError: Empty string should not be considered a palindrome',
            pragmatic: 'The function returns True for empty strings, which may not be the intended behavior.',
            contingent: 'Consider handling the empty string case separately to avoid incorrect palindrome results.',
        },
    },
    {
        id: 'snippet3',
        docstring: 'This function calculates the average of a list of numbers.\nArgs:\n    numbers (list): List of numbers.\nReturns:\n    float: The average value.\n',
        code: `def average(numbers):
    """
    Calculates the average of a list of numbers.
    Args:
        numbers (list): List of numbers.
    Returns:
        float: The average value.
    """
    return sum(numbers) / len(numbers)

print(average([1, 2, 3]))
print(average([]))
`,
        errorMessages: {
            standard:
                'Traceback (most recent call last):\n' +
                '  File "main.py", line 8, in <module>\n' +
                '    print(average([]))\n' +
                '  File "main.py", line 5, in average\n' +
                '    return sum(numbers) / len(numbers)\n' +
                'ZeroDivisionError: division by zero',
            pragmatic: 'The function does not handle the case when the input list is empty, leading to a division by zero.',
            contingent: 'Add a check for empty lists before performing the division to avoid errors.',
        },
    },
    {
        id: 'snippet4',
        docstring: 'This function finds the maximum value in a list.\nArgs:\n    lst (list): List of numbers.\nReturns:\n    int: The maximum value.\n',
        code: `def find_max(lst):
    """
    Finds the maximum value in a list.
    Args:
        lst (list): List of numbers.
    Returns:
        int: The maximum value.
    """
    return max(lst)

print(find_max([3, 1, 4, 1, 5, 9]))
print(find_max([]))
`,
        errorMessages: {
            standard:
                'Traceback (most recent call last):\n' +
                '  File "main.py", line 10, in <module>\n' +
                '    print(find_max([]))\n' +
                '  File "main.py", line 7, in find_max\n' +
                '    return max(lst)\n' +
                'ValueError: max() arg is an empty sequence',
            pragmatic: 'The function does not handle empty lists, which causes a ValueError when calling max().',
            contingent: 'Check if the list is empty before calling max() to prevent errors.',
        },
    },
];
