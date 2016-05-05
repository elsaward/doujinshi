(function() {
  var vm;
  Vue.partial("end", "<p>您已完成所有题目</p>");
  Vue.partial("success", "<p>您已预订成功,我会在一日之内发送确认邮件到您的邮箱</p>")

  init();

  function init() {
    get("quiz", function(quiz) {
      quiz = JSON.parse(quiz);
      quiz.forEach(function(item, index) {
        Vue.partial("quiz_"+index, "<p>"+item["tpl"]+"</p>");
      });
      vm = build(quiz);
    });
  }

  function build(quiz) {
    var log = read(quiz);
    var t;
    return new Vue({
      el: "#quiz",
      data: {
        quiz: quiz,
        qnum: log,
        name: '',
        email: '',
        success: false
      },
      computed: {
        partialId: function() {
          if(this.success) {
            return "success";
          } else if(this.qnum >= this.quiz.length) {
            return "end";
          } else {
            return "quiz_"+this.qnum;
          }
        },
        inputs: function() {
          return this.quiz[this.qnum].inputs;
        },
        title: function() {
          if(this.qnum >= this.quiz.length) {
            return "答题结束";
          } else {
            return "第"+(this.qnum+1)+"题";
          }
        },
        percent: function() {
          return this.qnum / this.quiz.length * 100 + "%";
        }
      },
      methods: {
        typing: function(e) {
          var item = e.target.id;
          this.$set(item, e.target.value);
        },
        submit: function() {
          var self = this;
          var answer = [], input;
          var inputs = document.getElementsByTagName("input");
          for(var i = 0, len = inputs.length; i < len; i++) {
            input = inputs[i];
            //if(input.value) {
              answer.push(input.value);
            //} else {
            //  alert("尚未填写所有答案");
            //  return false;
            //}
          }

          post("/answer", {
            qnum: this.qnum,
            answer: encodeURIComponent(answer.join(","))
          }, function(res) {
            res = JSON.parse(res);
            if(res["code"]) {
              self.next()
            } else {
              alert('回答有误');
            }
          });
        },
        next: function() {
          var inputs = document.getElementsByTagName("input");
          for(var i = 0, len = inputs.length; i < len; i++) {
            inputs[i].value = "";
            this.$set(inputs[i].id, "");
          }
          this.$set("qnum", this.qnum+1);
          if(this.qnum == this.quiz.length) {
            clearInterval(t);
          }
        },
        booking: function() {
          var self = this;
          if(this.name != "" && this.email != "") {
            post("/booking", {
              name: this.name,
              email: this.email
            }, function(res) {
              res = JSON.parse(res);
              if(res["code"]) {
                self.success = true;
              } else {
                alert('提交失败,请稍后再试')
              }
            });
          }
        }
      },
      ready: function() {
        this.$el.style.display = "block";
      }
    });
  }

  function post(url, data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("post", url, true);
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
      if(xhr.status == 200 && xhr.readyState == 4) {
        if(typeof callback == "function") callback(xhr.responseText);
      } else if(xhr.status != 200) {
        alert("连接失败,请稍后再试");
      }
    };
    data = (function(obj){
      var str = "";
      for(var prop in obj){
        str += prop + "=" + obj[prop] + "&"
      }
      return str;
    })(data);
    xhr.send(data);
  }

  function get(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("get", url);
    xhr.onreadystatechange = function() {
      if(xhr.status == 200 && xhr.readyState == 4) {
        if(typeof callback == "function") callback(xhr.responseText);
      } else if(xhr.status != 200) {
        alert("连接失败,请稍后再试");
      }
    };
    xhr.send(null);
  }

  function save() {
    localStorage.setItem("fafner-quiz-log", vm.qnum);
  }

  function read(quiz) {
    var log = localStorage.getItem("fafner-quiz-log") || 0;
    log = parseInt(log);
    if(isNaN(log)) log = 0;
    if(log > quiz.length) {
      log = quiz.length;
    }
    return log;
  }

  //window.onbeforeunload = save;
})();
