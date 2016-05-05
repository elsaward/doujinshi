function checkAnswer(num, answer) {
  var answers = [
    [8,'铃村神社'],
    ['土'],
    ['近藤剑司'],
    ['姬岛','彦岛'],
    [11],
    ['特殊医疗'],
    ['越南'],
    ['澳大利亚','达尔文']
  ];
  answer = decodeURIComponent(answer);
  return answer == answers[num].join(',');
}

module.exports = checkAnswer;