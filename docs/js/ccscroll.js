// Gets all of the elements in the DOM
function ObserveDOM(thing)
{
	var children = [];

	for (var i = 0; i < thing.children.length; i++) {
		children[children.length] = thing.children[i];
		children = children.concat(ObserveDOM(thing.children[i]));
	}

	return children;
}

//The data structures containing the elements to be moved
var toRight = [];
var toLeft = [];
var toCenter = [];

var elements = ObserveDOM(document);

for (var i = 0; i < elements.length; i++) {
	var current = elements[i];

	if (current.dataset.scroll == "child")
	{
		// A horizontal scroll automater
		current.style.position = "relative";
		current.parentElement.style.overflow = "hidden";

		var direction = current.dataset.to;

		if (direction == "left")
			toLeft.push(current);
		else if (direction == "right")
			toRight.push(current);
		else if (direction == "center")
			toCenter.push(current);
	}
}

// Calculates the X (left) values for the given context of the elements
function CalculateX(current, direction, from = null)
{	
	var windowHeight = window.innerHeight;
	var bottomPos = window.scrollY + windowHeight;

	var currentWidth = current.clientWidth;
	var parent = current.parentElement;
	var parentWidth = parent.clientWidth;
	var parentLocation = parent.offsetTop;
	
	var new_x = 0;

	var middle_reducer = 0;

	if (current.dataset.middle != "off")
		middle_reducer = currentWidth / 2;

	if (parent.dataset.scroll == "parent")
	{
		if (bottomPos > parentLocation)
		{
			if (direction == "left")
			{
				var percent = ((bottomPos - parentLocation) / windowHeight) * 100;
				if (current.dataset.factor != null)
						percent = percent * parseFloat(current.dataset.factor);
				new_x = parentWidth - ((parentWidth / 100) * percent) - middle_reducer;
			}else if (direction == "right")
			{
				var percent = ((bottomPos - parentLocation) / windowHeight) * 100;
				if (current.dataset.factor != null)
						percent = percent * parseFloat(current.dataset.factor);
				new_x = ((parentWidth / 100) * percent) - middle_reducer;
			}else if (direction == "center")
			{
				if (from == "left")
				{
					var percent = ((bottomPos - parentLocation) / windowHeight) * 100;
					
					if (current.dataset.factor != null)
						percent = percent * parseFloat(current.dataset.factor);

					var new_x = (((parentWidth / 100) * percent) / 2) - middle_reducer;
				}else if (from == "right")
				{
					var percent = ((bottomPos - parentLocation) / windowHeight) * 100;
					if (current.dataset.factor != null)
						percent = percent * parseFloat(current.dataset.factor);
					var new_x = parentWidth - (((parentWidth / 100) * percent) / 2) - middle_reducer;
				}
			}
		}
	}

	return new_x;
}

//Add the scroll event listener
window.addEventListener("scroll", function()
{
	//Animate elements from right
	for (var i = 0; i < toLeft.length; i++) {
		var current = toLeft[i];

		var parent = current.parentElement;
		if (parent.dataset.scroll == "parent")
		{
			current.style.left = CalculateX(current, "left") + "px";
		}
	}

	//Animate elements from left
	for (var i = 0; i < toRight.length; i++) {
		var current = toRight[i]

		var parent = current.parentElement;
		if (parent.dataset.scroll == "parent")
		{
			current.style.left =CalculateX(current, "right") + "px";
		}
	}

	//Animate elements to center from anywhere
	for (var i = 0; i < toCenter.length; i++) {
		var current = toCenter[i]
		var parent = current.parentElement;
		if (parent.dataset.scroll == "parent")
		{
			current.style.left =CalculateX(current, "center", current.dataset.from) + "px";
		}
	}
})