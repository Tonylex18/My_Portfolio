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

// Services slider: seamless rightward auto-scroll with pause on hover
const servicesSlider = document.querySelector('.services-slider');

if (servicesSlider) {
	const track = servicesSlider.querySelector('.services-track');
	const originalSlides = Array.from(track?.querySelectorAll('.service-slide') || []);
	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
	const speedPxPerSec = 40; // adjust for faster/slower marquee speed
	let clones = [];
	let baseWidth = 0;
	let currentX = 0;
	let paused = false;
	let lastTime = performance.now();
	let resizeTimer;

	const getVisibleCount = () => {
		if (window.innerWidth <= 768) return 1;
		if (window.innerWidth >= 1024) return 3;
		return 2;
	};
	const updateVisibleVar = () => servicesSlider.style.setProperty('--services-visible', getVisibleCount());

	const buildLoop = () => {
		updateVisibleVar();
		track.style.transition = 'none';

		// remove old clones
		clones.forEach(clone => clone.remove());
		clones = [];

		// append clones to create a second seamless set
		originalSlides.forEach(slide => {
			const clone = slide.cloneNode(true);
			clone.classList.add('clone');
			track.appendChild(clone);
			clones.push(clone);
		});

		// measure width of one full set (originals only)
		const totalWidth = track.scrollWidth;
		baseWidth = totalWidth / 2;
		currentX = 0;
		track.style.transform = 'translateX(0px)';

		// re-enable transitions on the next frame (for any other transforms)
		requestAnimationFrame(() => {
			track.style.transition = '';
		});
	};

	const tick = (time) => {
		const delta = (time - lastTime) / 1000;
		lastTime = time;

		if (!paused && !prefersReducedMotion.matches && baseWidth > 0) {
			currentX -= speedPxPerSec * delta;
			// reset position when one full set has scrolled to keep it seamless
			if (-currentX >= baseWidth) {
				currentX += baseWidth;
			}
			track.style.transform = `translateX(${currentX}px)`;
		}

		requestAnimationFrame(tick);
	};

	servicesSlider.addEventListener('mouseenter', () => {
		paused = true;
	});

	servicesSlider.addEventListener('mouseleave', () => {
		paused = false;
		lastTime = performance.now();
	});

	prefersReducedMotion.addEventListener('change', () => {
		if (prefersReducedMotion.matches) {
			track.style.transform = 'translateX(0px)';
		} else {
			lastTime = performance.now();
		}
	});

	window.addEventListener('resize', () => {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(() => {
			buildLoop();
		}, 200);
	});

	if (originalSlides.length) {
		buildLoop();
		requestAnimationFrame((time) => {
			lastTime = time;
			tick(time);
		});
	}
}

window.onscroll = function(){
	if(icon.classList.contains("fa-bars")){
	navbar.classList.remove('active');
}
else {
	icon.classList.replace("fa-times", "fa-bars");
	navbar.classList.remove('active');
	}
};

// Contact form handling with EmailJS (no page reload)
(function initContactForm() {
	const form = document.getElementById('contact-form');
	const submitBtn = document.getElementById('contact-submit');
	const statusEl = document.querySelector('.form-status');

	if (!form || !submitBtn || !statusEl || !window.emailjs) return;

	const EMAILJS_PUBLIC_KEY = 'yCyEAdsF0KuREwKYZ';
	const EMAILJS_SERVICE_ID = 'service_e79m3g4';
	const EMAILJS_TEMPLATE_ID = 'template_vr4ug9i';
	const EMAILJS_TO_EMAIL = 'anthonyagada2000@gmail.com';

	// Initialize EmailJS SDK
	emailjs.init(EMAILJS_PUBLIC_KEY);

	const setStatus = (message, type = '') => {
		statusEl.textContent = message;
		statusEl.classList.remove('error', 'success');
		if (type) statusEl.classList.add(type);
	};

	const isValidEmail = (value) => /\S+@\S+\.\S+/.test(value);

	form.addEventListener('submit', async (e) => {
		e.preventDefault();

		const formData = new FormData(form);
		const fromName = formData.get('name')?.trim();
		const replyTo = formData.get('email')?.trim();
		const subject = formData.get('subject')?.trim();
		const message = formData.get('message')?.trim();
		const honey = formData.get('website');

		// Honeypot: silently accept to avoid hinting bots
		if (honey) {
			form.reset();
			return;
		}

		if (!fromName || !replyTo || !subject || !message) {
			setStatus('Please fill in all fields.', 'error');
			return;
		}

		if (!isValidEmail(replyTo)) {
			setStatus('Please enter a valid email address.', 'error');
			return;
		}

		submitBtn.disabled = true;
		submitBtn.textContent = 'Sending...';
		setStatus('');

		try {
			await emailjs.send(
				EMAILJS_SERVICE_ID,
				EMAILJS_TEMPLATE_ID,
				{
					to_email: EMAILJS_TO_EMAIL,  
					name: fromName,              
					mailTo: replyTo,              
					message,                      
					subject                       
				}
			);

			setStatus('Message sent! I will get back to you soon.', 'success');
			form.reset();
		} catch (err) {
			const msg = err?.text || 'Something went wrong. Please try again in a moment.';
			console.error('Email send error', err);
			setStatus(msg, 'error');
		} finally {
			submitBtn.disabled = false;
			submitBtn.textContent = 'Send Message';
		}
	});
})();
