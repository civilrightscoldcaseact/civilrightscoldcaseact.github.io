---
order: 6
title: Our Supporters
link: Our Supporters
---

<div class="row">
  
      </div>
    </li>
  </ul>
  <ul class="cosponsors col-md-6">
  <h2>House Sponsor</h2>
  <li class="cosponsor d">
    <div class="photoblock">
      <img src="https://theunitedstates.io/images/congress/450x550/R000515.jpg" class="photoblock-img" alt="Rep. Bobby Rush headshot">
    </div>
    <div class="info">
      <p class="name">Rep. Bobby Rush</p>
      <p class="data">D-IL</p>
      <p class="joindate">Introduced on: 2017/03/01</p>
    </div>
  </li>
  </ul>
</div>

<div class="row">
  <ul class="cosponsors senate col-md-12">
    <h2>Senate Cosponsors</h2>
  </ul>
</div>

<div class="row">
  <ul class="cosponsors house col-md-12">
    <h2>House Cosponsors</h2>
  </ul>
</div>
<script id="entry-template" type="text/x-handlebars-template">
    {% raw %}
      <li class="cosponsor {{toLowerCase party}}">
        <div class="photoblock">
          <img src="{{image}}" class="photoblock-img" alt="{{title}} {{name}} headshot">
        </div>
        <div class="info">
          <p class="name">{{title}} {{name}}</p>
          <p class="data">{{party}}-{{state}}</p>
          <p class="joindate">Joined on: {{joindate}}</p>
        </div>
      </li>
    {% endraw %}
</script>
