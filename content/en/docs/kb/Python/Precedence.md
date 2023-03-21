---
title: "Precedence"
description: "Precedence"
lead: "Precedence rules"
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

### Precedence rules for arithmetic, logical, and relational operators

| Operator/Convention  |  Description  |  Explanation  |
|:---:|:---:|:---:|
|  ( )  |  Items within parentheses are evaluated first  | In  (a * (b + c)) - d, the + is evaluated first, then *, then -.   |
|  * / % + - |  Arithmetic operators (using their precedence rules; see earlier section)  | z - 45 * y < 53 evaluates *  first, then -, then <.   |
|  <   <=   >   >=   ==   != |  Relational, (in)equality, and membership operators |  x < 2 or x >= 10 is evaluated as (x < 2) or (x >= 10) because < and >= have precedence over or.  |
|  not  |  not (logical NOT) |  not x or y is evaluated as (not x) or y |
|  and  | Logical AND  |  x == 5 or y == 10 and z != 10 is evaluated as (x == 5) or ((y == 10) and (z != 10)) because and has precedence over or.  |
|  or  |  Logical OR |    x == 7 or x < 2 is evaluated as (x == 7) or (x < 2) because < and == have precedence over or |
