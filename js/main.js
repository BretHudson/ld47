/// Prototypes
Element.prototype.on = Element.prototype.addEventListener;
window.on = window.addEventListener;
Document.prototype.on = Document.prototype.addEventListener;
DocumentFragment.prototype.on = DocumentFragment.prototype.addEventListener;

/// Globals
let score = 0, level = 1;
let scoreElem, levelElem;
let gameElem, buttonElem;

/// Functions
const updateProgressText = () => {
	scoreElem.textContent = score;
	levelElem.textContent = level;
};

const spin = () => {
	++score;
	updateProgressText();
};

/// Listeners
document.on('keydown', e => {
	if (e.isComposing || e.keyCode === 229) return;
	
	if (e.keyCode === 32) {
		spin();
	}
});

document.on('DOMContentLoaded', e => {
	gameElem = document.querySelector('#game');
	buttonElem = document.querySelector('#button');
	scoreElem = document.querySelector('#score');
	levelElem = document.querySelector('#level');
	
	updateProgressText();
	
	buttonElem.on('click', spin);
});
