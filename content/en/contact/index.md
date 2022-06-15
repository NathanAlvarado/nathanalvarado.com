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
    <input id="name" type="text" name="name" class="form-control"  pattern="[A-Za-z]+" required />
  </div>
  <div class="form-group">
    <label for="email">Email</label>
    <input id="email" type="email" name="email" class="form-control" required />
  </div>
  <div class="form-group">
    <label for="message">Message</label>
    <textarea id="message" name="message" rows="3" class="form-control" required></textarea>
  </div><br />
    <button type="submit" class="btn btn-primary">Submit</button>
</form>
