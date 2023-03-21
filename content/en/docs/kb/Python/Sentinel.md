---
title: "sentinel"
description: "sentinel"
lead: "sentinel"
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

A sentinel value is a special value in a program that is used to indicate the end of a sequence or the termination of a loop. It serves as a flag to control the flow of the program, allowing it to exit a loop or skip over certain parts of a program.

In some cases, sentinel values are used to represent missing or undefined values, and can be used to differentiate between actual data and the end of the data. For example, a sentinel value could be used to indicate the end of a list of numbers, or the end of input from a user.

For example, consider the following code that uses a sentinel value of 0 to indicate the end of a list of numbers:
```python
numbers = []
x = int(input("Enter a number (0 to end): "))
while x != 0:
    numbers.append(x)
    x = int(input("Enter a number (0 to end): "))
print(numbers)

```

In this code, the user is prompted to enter numbers until they enter the sentinel value of 0. The numbers entered by the user are stored in a list, and the list is printed when the sentinel value is reached.