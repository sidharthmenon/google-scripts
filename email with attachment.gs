function myFunction() {
  // var mails = getDraftMessages();
  // Logger.log(mails);
  // 177b5ce5f75102cc

  var gmail_msg = GmailApp.getMessageById('177b5ce5f75102cc'); // id of the message in draft.
  var extracted = getInlineImages(gmail_msg);

  var message = extracted.htmlBody;
  var message_text = gmail_msg.getPlainBody();
  var subject = gmail_msg.getSubject();

  var images = extracted.inlineImages;
  var attachments = extracted.attachments;

  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName('test'); // sheet from which data to be taken
  
  var data_range = sheet.getRange(2,1,sheet.getLastRow()-1,2);
  var data = data_range.getValues();

  for(var i=0; i<data.length; i++){
    var status_cell = getStatusCell(sheet,2+i,4); //column with status 

    if(status_cell.getValue() == ""){
      //send email

      var to_address = data[i][0]; // column with email ids
      var file_url = data[i][1]; // column with drive file ids

      var file_id = file_url.match(/[-\w]{25,}/);
      var file = DriveApp.getFileById(file_id);

      var email_attachement = attachments.concat([file.getAs(MimeType.PDF)])

      GmailApp.sendEmail(to_address, subject, message_text, {
        name: "Your Name",
        replyTo: "email@example.com",
        htmlBody: message,
        inlineImages: images,
        attachments: email_attachement
      })

      Logger.log([to_address, file_url, email_attachement ]);

      status_cell.setValue('MAIL_SENT');
    }

  }

}

function getStatusCell(sheet,row,col){
  return sheet.getRange(row,col,1,1);
}


function getInlineImages(message) {

    var body = message.getBody();
    var attachments = message.getAttachments();
    var rawc = message.getRawContent();
    var inlineImages = {};
    var imgTags = body.match(/<img[^>]+>/g) || []; // all image tags, embedded or by url

    for (var i = 0; i < imgTags.length; i++) {
      //Logger.log(imgTags[i]);
        var realattid = imgTags[i].match(/src="cid:(.*?)"/i); // extract the image cid if embedded
        if (realattid) { // image is inline and embedded
          //Logger.log(realattid);
            var cid = realattid[1];
            var imgTagNew = imgTags[i].replace(/src="[^\"]+\"/, "src=\"cid:" + cid + "\""); // replace the long-source with just the cid
            body = body.replace(imgTags[i], imgTagNew); // update embedded image tag in message body
            var b64c1 = rawc.lastIndexOf(cid) + cid.length + 3; // first character in image base64
            var b64cn = rawc.substr(b64c1).indexOf("--") - 3; // last character in image base64
            var imgb64 = rawc.substring(b64c1, b64c1 + b64cn + 1); // is this fragile or safe enough?
            var imgblob = Utilities.newBlob(Utilities.base64Decode(imgb64), "image/jpeg", cid); // decode and blob
            inlineImages[cid] = imgblob;
        }
    }

    return {
        "htmlBody": body,
        "inlineImages": inlineImages,
        "attachments": attachments
    }
}

function getDraftMessages(){
  // Get draft mails from gmail
  
  var drafts = GmailApp.getDraftMessages();
  
  var mails = drafts.map(function(item){
    return { id: item.getId(), subject: item.getSubject() ? item.getSubject() : '(no subject)' }
  })
  
  //Logger.log(mails);
  
  return mails;
}
