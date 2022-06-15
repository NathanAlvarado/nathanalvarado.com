---
title: "Contact"
description: "Drop us an email."
date: 2022-04-06T09:19:42+01:00
lastmod: 2022-04-06T09:19:42+01:00
draft: false
images: []
---

<form action="https://formspree.io/f/xpzbnnwe" method="POST">
  <div class="form-group">
    <label for="name">Name</label>
    <input type="text" class="form-control" id="name" pattern="[A-Za-z]+" name="name" required />
  </div>
  <div class="form-group">
    <label for="email">Email</label>
    <input type="email" class="form-control" id="email" name="email" required />
  </div>
  <div class="form-group">
    <label for="message">Message</label>
    <textarea class="form-control" id="message" rows="3" name="message" required></textarea>
  </div><br />
    <button type="submit" class="btn btn-primary">Submit</button>
</form>
