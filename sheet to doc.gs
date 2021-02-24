var folder_id = "<folder id>"; //folder id
var sheet_name = "sheet1" //sheet name

function myFunction() {
  var folder = DriveApp.getFolderById(folder_id);

  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(sheet_name);

  var data_range = sheet.getRange(1,1, sheet.getLastRow(), sheet.getLastColumn());
  var data = data_range.getValues();

  var header = data.shift();

  var heading_style = {}
  heading_style[DocumentApp.Attribute.BOLD] = true;

  for(var i=0; i<data.length; i++){

    var document = DocumentApp.create(data[i][0]);
    var body = document.getBody();

    for(var j=0; j<header.length; j++){
      
      if(header[j]){
      
        var question = body.appendParagraph(header[j]);

        var content = data[i][j];

        if(content){
          content = content+'\r';
        }
        else{
          content = "NA \r";
        }

        body.appendParagraph(content);

        question.setAttributes(heading_style);
      
      }
      
    }

    document.saveAndClose();

    var file = DriveApp.getFileById(document.getId());
    file.moveTo(folder);

    var pdf = folder.createFile(file.getAs(MimeType.PDF));
    pdf.setName(file.getName());
  
    file.setTrashed(true);

  }
  
}

