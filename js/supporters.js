Handlebars.registerHelper('toLowerCase', function(str) {
  return str.toLowerCase();
});

$.ajax({
  url: 'https://api.propublica.org/congress/v1/115/bills/hr1272/cosponsors.json',
  headers : {'X-API-Key': "G6E4RyL1RfPPrB7DrPiHF6Jwmk7oSsNmVtY0vA3D"},
  type: 'GET',
  dataType: 'json'
}).done(function(data){
  hr1272_cosponsors = data['results'][0]['cosponsors'];

  var source = $('#entry-template').html();
  var template = Handlebars.compile(source);

  $(hr1272_cosponsors).each(function(i, cosponsor){

    $.ajax({
      url: cosponsor.cosponsor_uri,
      headers : {'X-API-Key': "G6E4RyL1RfPPrB7DrPiHF6Jwmk7oSsNmVtY0vA3D"},
      type: 'GET',
      dataType: 'json'
    }).done(function(data){
        var member = data.results[0];
        console.log(member);
        id = member.member_id;
        image = 'https://theunitedstates.io/images/congress/450x550/'+id+'.jpg'
        var context = {name: cosponsor.name, state: cosponsor.cosponsor_state, title: cosponsor.cosponsor_title, party: cosponsor.cosponsor_party, joindate: cosponsor.date, image: image};
        var html = template(context);
        $('.cosponsors.house').append(html);
    });
  });
});

$.ajax({
  url: 'https://api.propublica.org/congress/v1/115/bills/s3191/cosponsors.json',
  headers : {'X-API-Key': "G6E4RyL1RfPPrB7DrPiHF6Jwmk7oSsNmVtY0vA3D"},
  type: 'GET',
  dataType: 'json'
}).done(function(data){
  s3191_cosponsors = data['results'][0]['cosponsors'];


  var source = $('#entry-template').html();
  var template = Handlebars.compile(source);

  $(s3191_cosponsors).each(function(i, cosponsor){
    $.ajax({
      url: cosponsor.cosponsor_uri,
      headers : {'X-API-Key': "G6E4RyL1RfPPrB7DrPiHF6Jwmk7oSsNmVtY0vA3D"},
      type: 'GET',
      dataType: 'json'
    }).done(function(data){
        var member = data.results[0];
        console.log(member);
        id = member.member_id;
        image = 'https://theunitedstates.io/images/congress/450x550/'+id+'.jpg'
        var context = {name: cosponsor.name, state: cosponsor.cosponsor_state, title: cosponsor.cosponsor_title, party: cosponsor.cosponsor_party, joindate: cosponsor.date, image: image};
        var html = template(context);
        $('.cosponsors.senate').append(html);
    });
  });
});
