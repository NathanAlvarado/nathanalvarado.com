---
title: "Try Block"
description: "Try Block"
lead: "Try Block"
date: 2022-04-06T09:19:42+01:00
lastmod: 2022-08-18T13:57:42+01:00
draft: false
images: []
menu:
  docs:
    parent: "Python"
weight: 630
toc: true
---  

In Python, a "try block" is used to handle exceptions (errors) that may occur during the execution of a program. It is used to catch exceptions that could cause a program to terminate abruptly, and to allow the program to gracefully handle the error and continue execution. The code inside the "try block" is executed normally, and if an exception occurs, the code inside the "except block" is executed instead. The syntax for a "try block" is as follows:

```python
try:
    # code that may raise an exception
except ExceptionType:
    # code to handle the exception
```

The `ExceptionType` is the type of exception that is being handled, and it can be any of the built-in exception types, or a custom exception type. If no exception occurs, the code inside the "except block" is skipped.


In Python, there are several built-in exception types, some of which are:

1.  `TypeError` - Raised when an operation or function is applied to an object of inappropriate type.
2.  `ValueError` - Raised when a function gets an argument of correct type but improper value.
3.  `IndexError` - Raised when an index is out of range.
4.  `KeyError` - Raised when a key is not found in a dictionary.
5.  `NameError` - Raised when a variable is not found in local or global scope.
6.  `ZeroDivisionError` - Raised when division or modulo by zero takes place.
7.  `FileNotFoundError` - Raised when a file or directory is requested but doesn't exist.
8.  `ImportError` - Raised when an import statement fails.
9.  `KeyboardInterrupt` - Raised when the user hits the interrupt key (Ctrl+C).
10.  `AssertionError` - Raised when an assertion fails.

And many more. Additionally, users can create their own exception types by deriving from the built-in `Exception` class.