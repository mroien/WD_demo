exports.homePage = function(){
	this.hp01 = driver.waitforcss( {css: "[id$='/home_1']"});
	this.hpo1_width = driver.findElement({ id: "[id$='/home_1']"}).getAttribute('width');

}

module.export = new homePage();