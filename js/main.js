const userAgent = navigator.userAgent;
const IS_FIREFOX = (/\bfirefox\//i.test(userAgent) &&
    !/\bseamonkey\//i.test(userAgent));

/// Prototypes
Element.prototype.on = Element.prototype.addEventListener;
window.on = window.addEventListener;
Document.prototype.on = Document.prototype.addEventListener;
DocumentFragment.prototype.on = DocumentFragment.prototype.addEventListener;

Math.lerp = (a, b, t) => (b - a) * t + a;
Math.easeIn = (t) => t * t;
Math.easeOut = (t) => -t * (t - 2);
Math.easeInOut = (t) => (t <= .5) ? (t * t * 2) : (1 - (--t) * t * 2);

/// Globals
let score = 0;
let stationCount = 1, stationIndex = 0;
let scoreElem;
let gameElem, buttonElem;
let lastCycleRotation = 0, cycleRotation = 0, cycleRotationProgress = 0, isCycling = false;
let cycleElem, cycleFillerElem, cycleMaskElem, cursorElem;
let canMove = true;

const stations = [];

let cycleColor = 130;

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
	
	document.documentElement.style.fontSize = (IS_FIREFOX) ? `${Math.floor(size)}px` : `${size}px`;
};

const updateProgressText = () => {
	scoreElem.textContent = score;
};

const addStation = () => {
	const elem = document.createElement('div');
	elem.className = 'station';
	gameElem.prepend(elem);
	stations.unshift(elem);
	if (stations.length >= 2) {
		stations[1].style.background = `hsl(${cycleColor}, 90%, 50%)`;
		gameElem.style.setProperty('--last_cycle_color', `hsl(${cycleColor}, 60%, 50%)`);
	}
	
	cycleColor += 33;
	
	const num = stations.length;
	stations.forEach((station, i) => {
		station.style.setProperty('--rotation', `${(i * 360.0) / num}deg`);
	});
};

// TODO(bret): Maybe add some input buffering of sorts? idk
const spin = () => {
	if (canMove === false) return;
	
	canMove = false;
	isCycling = true;
	
	if (stationIndex === 0) {
		lastCycleRotation = 0;
		cycleElem.style.setProperty('--cycleBackground', `hsl(${cycleColor}, 60%, 50%)`);
	}
	cycleRotation = (stationIndex + 1) * (360 / stationCount);
	
	let addNewStation = false;
	if (++stationIndex === stationCount) {
		stationIndex = 0;
		++score;
		++stationCount;
		addNewStation = true;
	}
	
	setTimeout(() => {
		if (addNewStation)
			addStation();
		canMove = true;
	}, 500);
	
	const deg = (score + (stationIndex / stationCount)) * 360;
	
	cursorElem.style.setProperty('--rotation', `${deg}deg`);
	cycleElem.style.setProperty('--rotation', `${deg}deg`);
	
	updateProgressText();
};

let isLoaded = -1;
const onLoad = () => {
	if (++isLoaded < 1) return;
	
	scoreElem = document.querySelector('#score');
	
	gameElem = document.querySelector('#game');
	buttonElem = document.querySelector('#button');
	cursorElem = document.querySelector('#cursor');
	cycleElem = document.querySelector('#cycle');
	cycleFillerElem = cycleElem.querySelector('.filler');
	cycleMaskElem = cycleElem.querySelector('.mask');
	
	updateProgressText();
	
	buttonElem.on('click', spin);
	resize();
	
	window.requestAnimationFrame(() => {
		document.body.classList.remove('loading');
		
		addStation();
	});
};

let lastTime = null;
const render = time => {
	window.requestAnimationFrame(render);
	
	if (lastTime === null) {
		lastTime = time;
		return;
	}
	
	const dt = (time - lastTime) / 1000;
	lastTime = time;
	
	const cycleTime = 0.34;
	if (isCycling) {
		cycleRotationProgress += dt;
		if (cycleRotationProgress >= cycleTime) {
			cycleRotationProgress -= cycleTime;
			lastCycleRotation = cycleRotation;
			cycleRotationProgress = 0;
			isCycling = false;
		}
	} else {
		cycleRotationProgress = 0;
	}
	
	let newCycleRotation = Math.lerp(lastCycleRotation, cycleRotation, Math.easeInOut(cycleRotationProgress * (1 / cycleTime)));
	cycleElem.style.setProperty('--rotation', `${newCycleRotation}deg`);
	if (newCycleRotation >= 180) {
		cycleFillerElem.style.opacity = 1;
		cycleMaskElem.style.opacity = 0;
	} else {
		cycleFillerElem.style.opacity = 0;
		cycleMaskElem.style.opacity = 1;
	}
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
window.requestAnimationFrame(render);
