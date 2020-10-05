/// Prototypes
Element.prototype.on = Element.prototype.addEventListener;
window.on = window.addEventListener;
Document.prototype.on = Document.prototype.addEventListener;
DocumentFragment.prototype.on = DocumentFragment.prototype.addEventListener;

/// Globals
let score = 0;
let stationCount = 1, stationIndex = 0;
let scoreElem;
let gameElem, buttonElem;
let cursorElem;
let canMove = true;

const stations = [];

/// Functions
const remToPx = rem => {
	const { fontSize } = getComputedStyle(document.documentElement);
	return rem * parseFloat(fontSize);
};

const resize = () => {
	document.documentElement.style.fontSize = '16px';
	
	const { height: headerHeight } = getComputedStyle(document.querySelector('header'));
	const { height: footerHeight } = getComputedStyle(document.querySelector('footer'));
	
	const width = window.innerWidth;
	const height = window.innerHeight - (parseFloat(headerHeight) + parseFloat(footerHeight));
	const ratio = width / height;
	let size = width;
	if (ratio > 1) size = height;
	size /= 35;
	
	console.log(
		window.innerWidth,
		window.innerHeight
	);
	console.log({ size });
	
	document.documentElement.style.fontSize = `${size}px`;
};

const updateProgressText = () => {
	scoreElem.textContent = score;
};

const addStation = () => {
	const elem = document.createElement('div');
	elem.className = 'station';
	gameElem.append(elem);
	stations.push(elem);
	stations.unshift(stations.pop());
	
	const num = stations.length;
	stations.forEach((station, i) => {
		station.style.setProperty('--rotation', `${(i * 360.0) / num}deg`);
	});
};

const spin = () => {
	if (canMove === false) return;
	
	if (++stationIndex === stationCount) {
		stationIndex = 0;
		++score;
		++stationCount;
		canMove = false;
		setTimeout(() => {
			addStation();
			canMove = true;
		}, 500);
	}
	
	const deg = (score + (stationIndex / stationCount)) * 360;
	
	cursorElem.style.setProperty('--rotation', `${deg}deg`);
	
	updateProgressText();
};

let isLoaded = -1;
const onLoad = () => {
	if (++isLoaded < 1) return;
	
	scoreElem = document.querySelector('#score');
	
	gameElem = document.querySelector('#game');
	buttonElem = document.querySelector('#button');
	cursorElem = document.querySelector('#cursor');
	
	updateProgressText();
	
	buttonElem.on('click', spin);
	resize();
	
	window.requestAnimationFrame(() => {
		document.body.classList.remove('loading');
		
		addStation();
	});
};

/// Listeners
document.on('keydown', e => {
	if (e.isComposing || e.keyCode === 229) return;
	
	if (e.keyCode === 32) {
		spin();
	}
});

onLoad();
document.on('DOMContentLoaded', onLoad);

window.on('resize', resize);
