/**
 * @author: walei
 * @date:   2016-08-16
 * @desc:   类似artTemplate的模板引擎
 */

const IdentifyWholeLineSyntaxReg = /^\s*{{[\w\W]+}}$/;
const HasInlineSyntaxReg = /{{[\w\W]*?}}/;
const SplitInlineBlockReg = /({{[\w\W]*?}})/;
const GetSyntaxContentReg = /^\s*{{\s*|\s*}}$/g;
const SyntaxKeywordFilterReg = /^(?:(if)|(else\sif)|(include)|(each)|(for))(?=\s+)|^(?:(\/if)|(else)|(\/each))\s*$|^(#\b)|^(\$\b)/;

const CharacterEntity = {
  '&': '&#38;',
  '<': '&#60;',
  '>': '&#62;',
  '"': '&#34;',
  '\\\'': '&#39;',
};

const DataObjName = 'DataObj';
const ResultStrArrName = 'ResultStrArr';


let trim = (str) => {
  return str.replace(/^\s*|\s*$/g, '');
}


let removeUnnecessarySpace = (str) => {
  return str.replace(/\s+/g, ' ');
}


let addStringToResultStrArr = (str) => {
  return ResultStrArrName + '.push(\'' + str + '\');';
}


let addExpressionToResultStrArr = (expression, isNeedEncode) => {
  if (isNeedEncode) {
    let characterEntiryFunctionStr = Object.keys(CharacterEntity).reduce((pre, cur) => {
      return pre + '.replace(/' + cur + '/g,\'' + CharacterEntity[cur] + '\')';
    }, '');
    let encodedStr = '(' + expression + ')&&(' + expression + characterEntiryFunctionStr + ')';
    return ResultStrArrName + '.push(' + encodedStr + ');';
  }
  return ResultStrArrName + '.push(' + expression + ');';
}


let multiLineEngine = (tplLineArr) => {
  return tplLineArr.map((oneLine) => {
    return oneLine.match(IdentifyWholeLineSyntaxReg) ? wholeLineSyntaxParse(oneLine) : oneLine.match(HasInlineSyntaxReg) ? inlineEngine(oneLine) : addStringToResultStrArr(oneLine);
  }).join('');
}


let wholeLineSyntaxParse = (syntaxString) => {
  syntaxString = removeUnnecessarySpace(syntaxString);
  let syntaxContent = syntaxString.replace(GetSyntaxContentReg, '');

  let syntaxKeywordFilter = syntaxContent.match(SyntaxKeywordFilterReg);
  let syntaxKeyword = (syntaxKeywordFilter && syntaxKeywordFilter[0]) || '';
  let expressionStr = trim(syntaxContent.slice(syntaxKeyword.length)) || '';

  let expressionStr_objAdded = expressionStr && expressionStr.replace(/(?:[\w\$_]+)(?:\.[\w\$_]+)*/g, (match) => {
    return DataObjName + '.' + match;
  });

  let syntaxParseResult = '';
  switch (syntaxKeyword) {
    case 'if':
      syntaxParseResult = 'if(' + expressionStr_objAdded + '){';
      break;
    case 'else':
      syntaxParseResult = '}else{'
      break;
    case 'else if':
      syntaxParseResult = '}else if(' + expressionStr_objAdded + '){';
      break;
    case '/if':
      syntaxParseResult = '}';
      break;
    case 'each':
      syntaxParseResult = 'for( index in ' + expressionStr_objAdded + '){var value=' + expressionStr_objAdded + '[index];';
      break;
    case '/each':
      syntaxParseResult = '}';
      break;
    case '$':
      syntaxParseResult = addExpressionToResultStrArr(expressionStr);
      break;
    case '#':
      syntaxParseResult = addExpressionToResultStrArr(expressionStr_objAdded);
      break;
    default:
      syntaxParseResult = addExpressionToResultStrArr(expressionStr_objAdded, true);
      break;
  }

  return syntaxParseResult;
}


let inlineEngine = (tplStr) => {
  let tplBlockArr = tplStr.split(SplitInlineBlockReg);

  return multiLineEngine(tplBlockArr);
}

let Wltpl = (tplStr, dataObj) => {
  let tplResultStr = 'var ' + ResultStrArrName + '=[];';
  tplResultStr += multiLineEngine(tplStr.split('\n'));
  tplResultStr = tplResultStr + 'return ' + ResultStrArrName + '.join(\'\');';

  return (new Function(DataObjName, tplResultStr))(dataObj);
}

export {Wltpl};