$(function(){
	
	var quoteArray=[
		{quote:"'If A is success in life, then A equals x plus y plus z.Work is x ; y is play; and z is keeping your mouth shut.'", name: "Albert Einstein - In the Observer, 15 Jan."},
		{quote:"'Success is to be measured not so much by the position that one has reached in life as by the obstacles which he has overcome.'", name: "Booker T. Washington"},
		{quote:"'Love is absolute loyalty. People fade, looks fade, but loyalty never fades. You can depend so much on certain people, you can set your watch by them. And that’s love, even if it doesn’t seem very exciting'", name: "Sylvester Stallone"}
	];
	var quoteElem = $("blockquote");
	showQuotation(quoteElem,quoteArray);

	setInterval(function(){
		showQuotation(quoteElem,quoteArray);
	},3000);
})
function showQuotation(quoteElem,quoteArray){
	var index = Math.floor(Math.random() * quoteArray.length);
		quoteElem.find("p").html(quoteArray[index].quote);
		quoteElem.find("small").html(quoteArray[index].name);
}