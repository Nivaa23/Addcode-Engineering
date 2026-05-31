/**
 * Hero Background - Particle/Node System
 * Inspired by Google Antigravity & Evervault
 * Clean, technical, and interactive.
 */

class HeroBackground {
    constructor(container) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);

        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };
        this.resize();

        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));

        // Initial particles
        this.init();
        this.animate();
    }

    resize() {
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    handleMouseMove(e) {
        const rect = this.container.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
    }

    init() {
        this.particles = [];
        const isMobile = window.innerWidth < 768;
        const particleDensityMultiplier = isMobile ? 30000 : 15000;
        const quantity = Math.floor((this.width * this.height) / particleDensityMultiplier);
        for (let i = 0; i < quantity; i++) {
            this.particles.push(new Particle(this));
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        const isMobile = window.innerWidth < 768;
        const connectionDistance = isMobile ? 80 : 120;

        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].update();
            this.particles[i].draw();

            // Connect lines
            for (let j = i; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.hypot(dx, dy);

                if (distance < connectionDistance) {
                    this.ctx.strokeStyle = `rgba(37, 99, 235, ${0.15 * (1 - distance / connectionDistance)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }

        requestAnimationFrame(() => this.animate());
    }
}

class Particle {
    constructor(parent) {
        this.parent = parent;
        this.x = Math.random() * parent.width;
        this.y = Math.random() * parent.height;
        this.size = Math.random() * 2 + 1;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
        this.speedX = (Math.random() * 1) - 0.5;
        this.speedY = (Math.random() * 1) - 0.5;
    }

    draw() {
        this.parent.ctx.fillStyle = 'rgba(37, 99, 235, 0.4)';
        this.parent.ctx.beginPath();
        this.parent.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.parent.ctx.closePath();
        this.parent.ctx.fill();
    }

    update() {
        // Natural movement
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off walls
        if (this.x < 0 || this.x > this.parent.width) this.speedX *= -1;
        if (this.y < 0 || this.y > this.parent.height) this.speedY *= -1;

        // Mouse interaction
        let dx = this.parent.mouse.x - this.x;
        let dy = this.parent.mouse.y - this.y;
        let distance = Math.hypot(dx, dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = this.parent.mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < this.parent.mouse.radius) {
            this.x -= directionX;
            this.y -= directionY;
        }
    }
}

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    const containers = document.querySelectorAll('.hero-bg-canvas');
    containers.forEach(container => new HeroBackground(container));

    // Subtle parallax shift on scroll
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        containers.forEach(container => {
            container.style.transform = `translateY(${scrolled * 0.4}px)`;
        });
    });
});
