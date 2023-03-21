// clean company data : Name, CIN and ROC data.
// raw company name in first column

function getROCForAllCompanies() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName('Sheet3')
  var range = sheet.getDataRange();
  var values = range.getValues();
  
  for (var i = 1; i < values.length; i++) {
    var companyName = values[i][0];
    var exisit = values[i][1];

    if(!exisit){
      var data = getROC(companyName);
    
      var cin = data[0];
      var company = data[1];
      var roc = getfromzauba(company, cin);
    
      sheet.getRange(i + 1, 2, 1, 3).setValues([[company, cin, roc]]);
      
    }
  }
}

function getROC(cin) {
  // Replace [COMPANY NAME] with the name of the company you want to search for
  var url = "https://www.quickcompany.in/company?q="+cin;
  Logger.log(url)
  var response = UrlFetchApp.fetch(url);
  var html = response.getContentText();
  //Logger.log(html)
  // Extract the ROC number using a regular expression
  var rocRegex1 = /CIN: ([\w-]*)/;
  var rocRegex2 = /\<a href="\/company\/[\w-]*"\>\n\s*([\w\s\(\)]*)\<\/a\>/;

  var rocMatch1 = html.match(rocRegex1);
  var cin = rocMatch1 ? rocMatch1[1] : "N/A";

  var rocMatch2 = html.match(rocRegex2);
  var company = rocMatch2 ? rocMatch2[1] : "N/A";  

  return [cin, company.trim()];
}

function getfromzauba(companyName, CINNumber)
{
  var url = "https://www.zaubacorp.com/company/"+companyName+"/"+CINNumber
  var response = UrlFetchApp.fetch(url);
  var html = response.getContentText();
  //Logger.log(html)
  // Extract the ROC number using a regular expression
  var rocRegex = /RoC-[\w\s]*/ig;

  var rocMatch = html.match(rocRegex);

  var roc = rocMatch ? rocMatch[0] : "N/A";
  Logger.log(roc);
  return roc;

}
