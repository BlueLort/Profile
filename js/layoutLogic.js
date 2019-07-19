const Http = new XMLHttpRequest();
const url='../content/home.html';
Http.open("GET", url);
Http.send();

Http.onreadystatechange = (e) => {
	$( "#content" ).html( Http.responseText );
}
