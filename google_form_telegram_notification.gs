var token = "<bot token>";
var chat_id = "<user id>";
var url = `https://api.telegram.org/bot${token}/sendMessage`;

function generateRow(item){
  return `${item.getItem().getTitle()}: *${item.getResponse()}*\n`;
}

function onFormSubmit(e) {
  
  var response = e.response;
  var items = response.getItemResponses();

  var result = "";

  for(var i = 0; i < items.length; i++){
    var item = items[i];
    result += generateRow(item);
  }

  var data = {
    chat_id: chat_id,
    parse_mode: 'markdown',
    text: result
  };

  var options = {
    method: "post",
    headers: {
      "Content-Type": "application/json"
    },
    payload: JSON.stringify(data),
  };

  var response = UrlFetchApp.fetch(url, options);
  
}
