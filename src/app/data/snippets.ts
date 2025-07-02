export interface Snippet {
    id: string;
    code: string;
    errorMessages: {
        standard: string;
        pragmatic: string;
        contingent: string;
    };
}

export const snippets: Snippet[] = [
    {
        id: 'snippetA',
        code: `def build_list(n):
    """
    Build a list of integers from 0 up to n-1.
    Args:
        n (int): The length of the list.
    Returns:
        list[int]: A list of integers.
    """
    result = []
    for i in range(n):
        result = result.append(i)
    return result`,
        errorMessages: {
            standard: `Traceback (most recent call last):
  File "main.py", line 17, in <module>
    build_list(10)
  File "main.py", line 11, in build_list
    result = result.append(i)
             ^^^^^^^^^^^^^
AttributeError: 'NoneType' object has no attribute 'append'`,
            pragmatic: `You assigned the return value of result.append(i) (which is None) back to result. Instead, call result.append(i) without assignment and then return result.`,
            contingent: `Remember that list.append() modifies the list in-place and returns None. How could you adjust the code so result remains a list?`,
        },
    },
    {
        id: 'snippetB',
        code: `def top_three(items):
    """
    Return the top three largest numbers from a list.
    Args:
        items (list[int]): A list of numbers.
    Returns:
        list[int]: The three largest numbers.
    """
    # BUG: list.sort() returns None
    sorted_items = items.sort(reverse=True)
    return sorted_items[:3]`,
        errorMessages: {
            standard: `Traceback (most recent call last):
  File "main.py", line 6, in top_three
    return sorted_items[:3]
TypeError: 'NoneType' object is not subscriptable`,
            pragmatic: `You assigned the result of items.sort(), which sorts in-place and returns None, to sorted_items. Use sorted(items, reverse=True) or call items.sort() first and then slice items.`,
            contingent: `The list.sort() method doesn’t return the sorted list. What built-in function could you use instead to get a new sorted list?`,
        },
    },
    {
        id: 'snippetC',
        code: `def get_third_element(lst):
    """
    Return the third element of the list.
    Args:
        lst (list): A list of elements.
    Returns:
        Any: The third element.
    """
    # BUG: no length check before indexing
    return lst[2]`,
        errorMessages: {
            standard: `Traceback (most recent call last):
  File "main.py", line 5, in get_third_element
    return lst[2]
IndexError: list index out of range`,
            pragmatic: `The function directly accesses lst[2] without ensuring the list has at least three elements. Consider checking len(lst) before indexing.`,
            contingent: `Could the list be shorter than 3? How might you handle lists of varying lengths to avoid this error?`,
        },
    },
    {
        id: 'snippetD',
        code: `def parse_numbers(data):
    """
    Parse comma-separated numbers into a list of ints.
    Args:
        data (str): A comma-separated string of numbers.
    Returns:
        list[int]: List of integers.
    """
    # BUG: data might be a list, not a string
    return [int(x) for x in data.split(',')]`
        ,
        errorMessages: {
            standard: `Traceback (most recent call last):
  File "main.py", line 6, in parse_numbers
    return [int(x) for x in data.split(',')]
AttributeError: 'list' object has no attribute 'split'`,
            pragmatic: `The function expects a string with commas, but data is a list. You could join the list into a string first or adjust the function to handle lists.`,
            contingent: `Is data always a string? If you’re passing in a list, maybe you need to, for example, join it: ','.join(data), or handle both types differently.`,
        },
    },
];