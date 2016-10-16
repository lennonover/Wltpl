# Wltpl

有用过Handlebars和Jade，这两款引擎各有优缺点，handlebars语法简洁容易上手但是写起来局限性有点大，Jade用起来很灵活但是坑爹的是空格如果团队不统一IDE就哭吧！就想自己写一个语法灵活用起来比较方便的模板引擎，这个模板语法基本遵循artTemplate，关于artTemplate的速度达到理论极限，实际说的是渲染速度，它的综合速度并不快。

## 使用

    <script src="builds/wltpl.js"></script>

## 表达式

### 输出表达式

默认对数据字符串做转义处理 编码可以防止数据中含有 HTML 字符串，避免引起 XSS 攻击。
    
    {{variable}} 
    {{variable.content}}

不对替换的数据做转义处理

    {{#variable}} 
    {{#variable.content}}


### if表达式

    {{if expression}} 
    {{else if}} 
    {{else}} 
    {{/if}}

### 遍历表达式

其中index和value为固定的变量名，表示数组/对象的key，value

只能这一种写法 
    
    {{each list}}
        <li>{{$index}} - {{$value.user}}</li>
    {{/each}}

artTemplate还支持这样写    
    
    {{each list as value index}}
        <li>{{index}} - {{value.user}}</li>
    {{/each}}

## Demo

    var contentTpl = 
      '<h1>{{title}}</h1>\n'+
      '{{if isPic}}\n'+
          '<img src="{{imgUrl}}">\n'+
      '{{else}}\n'+
        '<div class="content">\n'+
          '{{if textTitle}}\n'+
            '<h4>{{#textTitle}}</h4>\n'+
          '{{/if}}\n'+
        '</div>\n'+
      '{{/if}}';
    var mockdata = {
      imgUrl: "https://placem.at/people?w=640&h=480",
      textTitle: '这是小<a>标题</a>',
      title:"这是<a>标题</a>",
      isPic: false
    };
    document.write(Wltpl(contentTpl, mockdata));

[展示](https://lennonover.github.io/Wltpl/test/BrowerTest.html)