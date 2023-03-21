---
title: "DataTypes"
description: "DataTypes"
lead: "Python DataTypes"
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

# Numeric types:
```python
# int (integers)
x = 20
# float (floating point numbers)
x = 20.5
# complex (complex numbers)
x = 1j
```
# Boolean type:
```python
# bool (True or False)
x = True
```
# Sequence types:
```python
# str (strings)
x = "Hello World"
# list (mutable sequences)
x = ["apple", "banana", "cherry"]
# tuple (immutable sequences) 
x = ("apple", "banana", "cherry")
# range (immutable sequences of numbers)
x = range(6)
```
# Mapping type:
```python
# dict (dictionaries)
x = {"name" : "John", "age" : 36}
```
# Set types:
```python
# set (mutable sets)
x = {"apple", "banana", "cherry"}
# frozenset (immutable sets)
x = frozenset({"apple", "banana", "cherry"})
```
# Binary types:
```python
# bytes (immutable sequences of bytes)
x = b"Hello"
# bytearray (mutable sequences of bytes)
x = bytearray(5)
# memoryview (memory access of other binary objects)
x = memoryview(bytes(5))
```
# None Type
```python
# NoneType (single value of 'None')
x = None
```