class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        this.player = new Player(this.width / 2, this.height - 50);
        this.bullets = [];
        this.enemies = [];
        this.particles = [];
        
        this.score = 0;
        this.lives = 3;
        this.gameRunning = true;
        
        this.keys = {};
        this.lastTime = 0;
        this.enemySpawnTimer = 0;
        
        this.setupEventListeners();
        this.gameLoop();
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.restart();
        });
    }
    
    update(deltaTime) {
        if (!this.gameRunning) return;
        
        // Update player
        this.player.update(this.keys, deltaTime);
        
        // Spawn enemies
        this.enemySpawnTimer += deltaTime;
        if (this.enemySpawnTimer > 1000) {
            this.enemies.push(new Enemy(Math.random() * (this.width - 40), -40));
            this.enemySpawnTimer = 0;
        }
        
        // Update bullets
        this.bullets = this.bullets.filter(bullet => {
            bullet.update(deltaTime);
            return bullet.y > -10;
        });
        
        // Update enemies
        this.enemies = this.enemies.filter(enemy => {
            enemy.update(deltaTime);
            return enemy.y < this.height + 40;
        });
        
        // Update particles
        this.particles = this.particles.filter(particle => {
            particle.update(deltaTime);
            return particle.life > 0;
        });
        
        // Check collisions
        this.checkCollisions();
        
        // Player shooting
        if (this.keys['Space']) {
            this.player.shoot(this.bullets);
        }
    }
    
    checkCollisions() {
        // Bullet vs Enemy
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            for (let j = this.enemies.length - 1; j >= 0; j--) {
                if (this.bullets[i] && this.enemies[j] && 
                    this.checkCollision(this.bullets[i], this.enemies[j])) {
                    
                    // Create explosion particles
                    this.createExplosion(this.enemies[j].x, this.enemies[j].y);
                    
                    this.bullets.splice(i, 1);
                    this.enemies.splice(j, 1);
                    this.score += 10;
                    document.getElementById('scoreValue').textContent = this.score;
                    break;
                }
            }
        }
        
        // Player vs Enemy
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            if (this.checkCollision(this.player, this.enemies[i])) {
                this.createExplosion(this.enemies[i].x, this.enemies[i].y);
                this.enemies.splice(i, 1);
                this.lives--;
                document.getElementById('livesValue').textContent = this.lives;
                
                if (this.lives <= 0) {
                    this.gameOver();
                }
            }
        }
    }
    
    checkCollision(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }
    
    createExplosion(x, y) {
        for (let i = 0; i < 8; i++) {
            this.particles.push(new Particle(x, y));
        }
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Render game objects
        this.player.render(this.ctx);
        
        this.bullets.forEach(bullet => bullet.render(this.ctx));
        this.enemies.forEach(enemy => enemy.render(this.ctx));
        this.particles.forEach(particle => particle.render(this.ctx));
    }
    
    gameOver() {
        this.gameRunning = false;
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOver').classList.remove('hidden');
    }
    
    restart() {
        this.bullets = [];
        this.enemies = [];
        this.particles = [];
        this.score = 0;
        this.lives = 3;
        this.gameRunning = true;
        this.player = new Player(this.width / 2, this.height - 50);
        
        document.getElementById('scoreValue').textContent = this.score;
        document.getElementById('livesValue').textContent = this.lives;
        document.getElementById('gameOver').classList.add('hidden');
    }
    
    gameLoop(currentTime = 0) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        this.update(deltaTime);
        this.render();
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }
}

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.speed = 0.3;
        this.shootCooldown = 0;
    }
    
    update(keys, deltaTime) {
        // Movement
        if (keys['ArrowLeft'] || keys['KeyA']) {
            this.x = Math.max(0, this.x - this.speed * deltaTime);
        }
        if (keys['ArrowRight'] || keys['KeyD']) {
            this.x = Math.min(800 - this.width, this.x + this.speed * deltaTime);
        }
        if (keys['ArrowUp'] || keys['KeyW']) {
            this.y = Math.max(0, this.y - this.speed * deltaTime);
        }
        if (keys['ArrowDown'] || keys['KeyS']) {
            this.y = Math.min(600 - this.height, this.y + this.speed * deltaTime);
        }
        
        this.shootCooldown = Math.max(0, this.shootCooldown - deltaTime);
    }
    
    shoot(bullets) {
        if (this.shootCooldown <= 0) {
            bullets.push(new Bullet(this.x + this.width / 2, this.y, true));
            this.shootCooldown = 200;
        }
    }
    
    render(ctx) {
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw a simple ship shape
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x, this.y + this.height);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.closePath();
        ctx.fill();
    }
}

class Bullet {
    constructor(x, y, isPlayer = false) {
        this.x = x;
        this.y = y;
        this.width = 4;
        this.height = 10;
        this.speed = isPlayer ? -0.5 : 0.3;
        this.isPlayer = isPlayer;
    }
    
    update(deltaTime) {
        this.y += this.speed * deltaTime;
    }
    
    render(ctx) {
        ctx.fillStyle = this.isPlayer ? '#ffff00' : '#ff0000';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.speed = 0.1;
    }
    
    update(deltaTime) {
        this.y += this.speed * deltaTime;
    }
    
    render(ctx) {
        ctx.fillStyle = '#ff4444';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw enemy details
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.x + 5, this.y + 5, 20, 20);
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(this.x + 10, this.y + 10, 10, 10);
    }
}

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.life = 1000;
        this.maxLife = 1000;
    }
    
    update(deltaTime) {
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;
        this.life -= deltaTime;
    }
    
    render(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.fillStyle = `rgba(255, 255, 0, ${alpha})`;
        ctx.fillRect(this.x, this.y, 3, 3);
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new Game();
});