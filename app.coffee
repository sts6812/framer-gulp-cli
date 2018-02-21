## Project:
## Version:
## Author:
## Description:

# Add your Framer code here
# Refer to https://framer.com/docs/ for documentation
{TextLayer, convertTextLayers} = require 'TextLayer'
flipCard = require "flipCard"
module = require "gridddle"
data = JSON.parse Utils.domLoadDataSync 'Untitled-1psd/jsonInfo.json'
map = Framer.Importer.load("Untitled-1", scale: 1)
Utils.globalLayers(map)
console.log Group_3.y
x=convertTextLayers(map, false)







	

    
myText = new TextLayer
    text: "this is just a test \n
onl a test"



myText.classList.add("this_is_just_a_test_onl_a_test")
myText.x=Group_3.x  
myText.y=Group_3.y
myText.parent=Group_3.parent

console.log flipCard