var slide_id = '<slide id>';

function generate() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var range = sheet.getDataRange();
  var data = range.getValues();

  var keys = data.shift();

  var template = SlidesApp.openById(slide_id);

  for(var i=0; i<data.length; i++){

    var slide = template.getSlides()[0].duplicate();
    var images = slide.getImages();

    for(var j=0; j<keys.length; j++){
      slide.replaceAllText("{"+keys[j]+"}", data[i][j]);

      for(var k=0; k<images.length; k++){
        if(images[k].getTitle() == keys[j]){
          images[k].replace(data[i][j]);
        }
      }

    }

  }
}
