let btn = document.querySelector(".toggle");
let icon = btn.querySelector(".fa-bars");
let navbar = document.querySelector ('.navbar');

btn.onclick = function(){
	if(icon.classList.contains("fa-bars")){
	icon.classList.replace("fa-bars", "fa-times");
	navbar.classList.toggle('active');
}
else {
	icon.classList.replace("fa-times", "fa-bars");
	navbar.classList.remove('active');
	}
};

window.onscroll = function(){
	if(icon.classList.contains("fa-bars")){
	navbar.classList.remove('active');
}
else {
	icon.classList.replace("fa-times", "fa-bars");
	navbar.classList.remove('active');
	}
};