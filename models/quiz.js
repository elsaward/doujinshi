function checkAnswer(num, answer) {
  var answers = [
    [8,15,'铃村神社'],
    ['土'],
    ['近藤剑司'],
    ['彦岛','姬岛'],
    [11],
    ['特殊医疗'],
    ['老挝'],
    ['澳大利亚','达尔文']
  ];
  answer = decodeURIComponent(answer);
  return answer == answers[num].join(',');
}

module.exports = checkAnswer;