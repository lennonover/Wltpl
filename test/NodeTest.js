let CntTemplate = require('../builds/wltpl').CntTemplate;

let contentTpl = `<h1>{{title}}</h1>
{{if isPic}}
    <img src="{{imgUrl}}">
{{else}}
  <div class="content">
    {{if textTitle}}
      <h4>{{textTitle}}</h4>
    {{/if}}
  </div>
{{/if}}`;

let mockdata = {
  imgUrl: "https://placem.at/people?w=640&h=480",
  textTitle: '这是小标题',
  title:"这是标题",
  isPic: false
};

console.log(Wltpl(contentTpl, mockdata));