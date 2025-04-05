const PLAYER_MAX_HEALTH = 3;
const SPEED_STEPS = 250;
const SUPPLY_MAXRAND = 5;
const INVINC_MAXRAND = 15;
const BOMB_MAXRAND = 10;
const MONSTER_PLANT_SCORE = 1;
const MONSTER_BEE_SCORE = 3;
const MONSTER_SKULL_SCORE = 1;
const MONSTER_ELECTRO_SCORE = 4;
const MONSTER_SPIKE_SCORE = 5;

class HortusGame extends Phaser.Scene {
    preload()
    {
        this.load.setBaseURL(window.location.origin);

        this.load.image('sky', 'game/assets/sprites/sky.png');
        this.load.image('clouds', 'game/assets/sprites/clouds.png');
        this.load.image('ground', 'game/assets/sprites/grass.png');
        this.load.image('tree_bottom', 'game/assets/sprites/tree_bottom.png');
        this.load.image('tree_stem', 'game/assets/sprites/tree_stem.png');
        this.load.image('tree_top', 'game/assets/sprites/tree_top.png');
        this.load.image('flower', 'game/assets/sprites/flower.png');
        this.load.image('shrooms', 'game/assets/sprites/shrooms.png');
        this.load.image('bush', 'game/assets/sprites/bush.png');
        this.load.image('box', 'game/assets/sprites/box.png');
        this.load.image('button', 'game/assets/sprites/button.png');
        this.load.spritesheet('fox', 'game/assets/sprites/fox.png', { frameWidth: 48, frameHeight: 26 });
        this.load.spritesheet('plant', 'game/assets/sprites/plant.png', { frameWidth: 376, frameHeight: 500 });
        this.load.spritesheet('bomb', 'game/assets/sprites/bomb.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('laser', 'game/assets/sprites/laser.png', { frameWidth: 123, frameHeight: 119 });
        this.load.spritesheet('phaser', 'game/assets/sprites/phaser.png', { frameWidth: 99, frameHeight: 60 });
        this.load.spritesheet('bolt', 'game/assets/sprites/bolt.png', { frameWidth: 32, frameHeight: 256 });
        this.load.spritesheet('bee', 'game/assets/sprites/bee.png', { frameWidth: 712, frameHeight: 520});
        this.load.spritesheet('skull', 'game/assets/sprites/skull.png', { frameWidth: 512, frameHeight: 554 });
        this.load.spritesheet('electro', 'game/assets/sprites/electro.png', { frameWidth: 343, frameHeight: 430 });
        this.load.spritesheet('spike', 'game/assets/sprites/spike.png', { frameWidth: 364, frameHeight: 202 });
        this.load.spritesheet('boom', 'game/assets/sprites/explosion.png', { frameWidth: 192, frameHeight: 192 });
        this.load.spritesheet('puff', 'game/assets/sprites/puff.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('star', 'game/assets/sprites/star.png', { frameWidth: 64, frameHeight: 60 });
        this.load.spritesheet('bluebomb', 'game/assets/sprites/bluebomb.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('detonation', 'game/assets/sprites/detonation.png', { frameWidth: 192, frameHeight: 192 });

        this.load.audio('theme', 'game/assets/sounds/theme.ogg');
        this.load.audio('invincible', 'game/assets/sounds/invincible.wav');
        this.load.audio('jump', 'game/assets/sounds/jump.wav');
        this.load.audio('hurt', 'game/assets/sounds/hurt.wav');
        this.load.audio('explosion', 'game/assets/sounds/explosion.wav');
        this.load.audio('detonation', 'game/assets/sounds/detonation.wav');
        this.load.audio('up', 'game/assets/sounds/up.wav');
        this.load.audio('fuse', 'game/assets/sounds/fuse.wav');
        this.load.audio('monster_spawn', 'game/assets/sounds/monster_spawn.wav');
        this.load.audio('monster_shoot', 'game/assets/sounds/monster_shoot.wav');
        this.load.audio('monster_dispose', 'game/assets/sounds/monster_dispose.wav');
        this.load.audio('bee_spawn', 'game/assets/sounds/bee.wav');
        this.load.audio('electro_spawn', 'game/assets/sounds/charge.wav');
        this.load.audio('electro_attack', 'game/assets/sounds/bolt.wav');
        this.load.audio('spike', 'game/assets/sounds/spike.wav');

        this.load.image('heart', 'game/assets/sprites/heart.png');

        for (let i = 1; i <= PLAYER_MAX_HEALTH; i++) {
            this.load.image('heart' + i, 'game/assets/sprites/heart.png');
        }

        this.trees = [];
        this.obstacles = [];
        this.bees = [];
        this.skulls = [];
        this.electros = [];
        this.spike = null;
        this.bombs = [];
        this.lasers = [];
        this.phasers = [];
        this.bolts = [];
        this.hearts = [];
        this.playerScore = 0;
        this.playerHealth = PLAYER_MAX_HEALTH;
        this.playerInvincible = false;
        this.tmSpawnObstaclesSpeed = {
            min: 2000,
            max: 5000
        };
        this.tmSpawnBeesSpeed = {
            min: 5000,
            max: 7500
        };
        this.tmSpawnSkullSpeed = {
            min: 2000,
            max: 5000
        };
        this.tmSpawnElectroSpeed = {
            min: 15000,
            max: 25000,
        };
        this.tmSpawnSpikeSpeed = {
            min: 15000,
            max: 20000
        };
        this.tmGameTime = {
            start: Date.now(),
            current: Date.now()
        };

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    create()
    {
        let self = this;

        this.add.image(0, 0, 'sky').setOrigin(0, 0);

        this.clouds = this.add.tileSprite(0, 0, gameconfig.scale.width, 300, 'clouds').setOrigin(0, 0);
        this.clouds.y += 50;

        for (let i = 0; i < this.playerHealth; i++) {
            this.hearts.push(this.add.image(55 + i * 50, 40, 'heart' + (i + 1)));
        }

        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(50, gameconfig.scale.height - 25, 'ground').setScale(50, 1).refreshBody();

        this.addTree(200, gameconfig.scale.height - 80);
        this.addTree(gameconfig.scale.width - 190, gameconfig.scale.height - 80);

        this.add.image(455, gameconfig.scale.height - 105, 'flower').setScale(0.5, 0.5);
        this.add.image(635, gameconfig.scale.height - 105, 'flower').setScale(0.5, 0.5);
        this.add.image(375, gameconfig.scale.height - 86, 'shrooms').setScale(0.75, 0.75);
        this.add.image(535, gameconfig.scale.height - 86, 'shrooms').setScale(0.75, 0.75);
        this.add.image(50, gameconfig.scale.height - 79, 'bush').setScale(0.75, 0.75);
        this.add.image(gameconfig.scale.width - 40, gameconfig.scale.height - 79, 'bush').setScale(0.75, 0.75);

        this.player = this.physics.add.sprite(50, gameconfig.scale.height - 80, 'fox').setScale(1.5).refreshBody();

        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.player.setGravity(0, 300);

        this.playerGlow = this.player.preFX.addGlow();
        this.playerGlow.active = false;

        this.tweens.add({
            targets: this.playerGlow,
            outerStrength: 20,
            yoyo: true,
            loop: -1,
            ease: 'sine.inout'
        });

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('fox', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });

        this.physics.add.collider(this.player, this.platforms);

        this.anims.create({
            key: 'chew',
            frames: this.anims.generateFrameNumbers('plant', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'float',
            frames: this.anims.generateFrameNumbers('bee', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'jaw',
            frames: this.anims.generateFrameNumbers('skull', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'boom',
            frames: this.anims.generateFrameNumbers('boom', { start: 0, end: 15 }),
            frameRate: 25,
            repeat: 0
        });

        this.anims.create({
            key: 'detonation',
            frames: this.anims.generateFrameNumbers('detonation', { start: 0, end: 15 }),
            frameRate: 25,
            repeat: 0
        });

        this.anims.create({
            key: 'fuse',
            frames: this.anims.generateFrameNumbers('bluebomb', { start: 0, end: 14 }),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create({
            key: 'bolt',
            frames: this.anims.generateFrameNumbers('bolt', { start: 0, end: 8 }),
            frameRate: 15,
            repeat: 0
        });

        this.anims.create({
            key: 'puff',
            frames: this.anims.generateFrameNumbers('puff', { start: 0, end: 9 }),
            frameRate: 50,
            repeat: 0
        });

        this.obstTmrConfig = {
            delay: Phaser.Math.Between(self.tmSpawnObstaclesSpeed.min, self.tmSpawnObstaclesSpeed.max),
            loop: true,
            callback: self.spawnEnemyObstacle,
            callbackScope: self
        };

        this.obstTimer = this.time.addEvent(this.obstTmrConfig);

        this.beeTmrConfig = {
            delay: Phaser.Math.Between(self.tmSpawnBeesSpeed.min, self.tmSpawnBeesSpeed.max),
            loop: true,
            callback: self.spawnEnemyBee,
            callbackScope: self
        };

        this.beeTimer = this.time.addEvent(this.beeTmrConfig);

        this.bCanSpawnBees = false;
        this.startSpawningBees = this.time.addEvent({
            delay: 30000,
            loop: false,
            callback: function() {
                this.bCanSpawnBees = true;
            },
            callbackScope: self
        });

        this.skullTmrConfig = {
            delay: Phaser.Math.Between(self.tmSpawnSkullSpeed.min, self.tmSpawnSkullSpeed.max),
            loop: true,
            callback: self.spawnEnemySkull,
            callbackScope: self
        };

        this.skullTimer = this.time.addEvent(this.skullTmrConfig);

        this.bCanSpawnSkulls = false;
        this.startSpawningSkulls = this.time.addEvent({
            delay: 15000,
            loop: false,
            callback: function() {
                this.bCanSpawnSkulls = true;
            },
            callbackScope: self
        });

        this.electroTmrConfig = {
            delay: Phaser.Math.Between(self.tmSpawnElectroSpeed.min, self.tmSpawnElectroSpeed.max),
            loop: true,
            callback: self.spawnEnemyElectro,
            callbackScope: self
        };

        this.electroTimer = this.time.addEvent(this.electroTmrConfig);

        this.bCanSpawnElectros = false;
        this.startSpawningElectros = this.time.addEvent({
            delay: 15000,
            loop: false,
            callback: function() {
                this.bCanSpawnElectros = true;
            },
            callbackScope: self
        });

        this.spikeTmrConfig = {
            delay: Phaser.Math.Between(self.tmSpawnSpikeSpeed.min, self.tmSpawnSpikeSpeed.max),
            loop: true,
            callback: self.spawnEnemySpike,
            callbackScope: self
        };
        this.spikeTimer = this.time.addEvent(this.spikeTmrConfig);

        this.txtTime = this.add.text(gameconfig.scale.width / 2 - 40, 25, 'Time: 0', { fontSize: '24px' });
        this.txtScore = this.add.text(gameconfig.scale.width - 40, 25, 'Score: 0', { rtl: true, fontSize: '24px', color: 'rgb(255, 255, 0)' });
        
        this.rectOverlay = this.add.rectangle(0, 0, gameconfig.scale.width, gameconfig.scale.height, 0x000000, 150).setOrigin(0, 0).setVisible(false);

        this.txtGameOver = this.add.text(gameconfig.scale.width / 2 - 55, gameconfig.scale.height / 2 - 69, 'GAME OVER!', {
            color: 'rgb(255, 255, 255)',
            fontSize: '32px',

        }).setVisible(false);

        this.txtScoreResult = this.add.text(gameconfig.scale.width / 2, gameconfig.scale.height / 2, '', {
            color: 'rgb(255, 255, 255)',
            fontSize: '23px',

        }).setVisible(false);

        this.rectRestart = this.add.image(gameconfig.scale.width / 2 + 37, gameconfig.scale.height / 2 + 90, 'button').setVisible(false);
        this.btnRestart = this.add.text(gameconfig.scale.width / 2 - 5, gameconfig.scale.height / 2 + 81, 'Restart', {
            color: 'rgb(0, 100, 150)',
            fontSize: '20px'
        }).setInteractive().on('pointerdown', function() {
            self.restartGame();
        }).on('pointerover', function() {
            self.btnRestart.setStyle({ color: 'rgb(255, 255, 255)', fontSize: '20px' });
            document.body.style.cursor = 'pointer';
        }).on('pointerout', function() {
            self.btnRestart.setStyle({ color: 'rgb(0, 100, 150)', fontSize: '20px' });
            document.body.style.cursor = '';
        }).setVisible(false);

        this.sndTheme = this.sound.add('theme');
        this.sndInvicible = this.sound.add('invincible');
        this.sndJump = this.sound.add('jump');
        this.sndHurt = this.sound.add('hurt');
        this.sndExplosion = this.sound.add('explosion');
        this.sndDetonation = this.sound.add('detonation');
        this.sndFuse = this.sound.add('fuse');
        this.sndUp = this.sound.add('up');
        this.sndMonsterSpawn = this.sound.add('monster_spawn');
        this.sndMonsterShoot = this.sound.add('monster_shoot');
        this.sndMonsterDispose = this.sound.add('monster_dispose');
        this.sndBeeSpawn = this.sound.add('bee_spawn');
        this.sndSkullSpawn = this.sound.add('monster_spawn');
        this.sndElectroSpawn = this.sound.add('electro_spawn');
        this.sndElectroAttack = this.sound.add('electro_attack');
        this.sndSpike = this.sound.add('spike');

        this.children.bringToTop(this.txtScore);

        for (let i = 0; i < this.playerHealth; i++) {
            this.children.bringToTop(this.hearts[i]);
        }

        this.sndTheme.loop = true;
        this.sndTheme.play();

        this.sndInvicible.loop = true;
    }

    update()
    {
        if (this.playerHealth <= 0) {
            this.finishGame();

            return;
        }

        this.tmGameTime.current = Date.now();
        this.txtTime.setText(this.getFormattedGameTime());

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-330);
            this.player.anims.play('walk', true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(330);
            this.player.anims.play('walk', true);
        }

        if (this.input.activePointer.isDown) {
            if (this.input.activePointer.worldX < this.player.getCenter().x) {
                this.player.setVelocityX(-330);
                this.player.anims.play('walk', true);
                
                if (this.player.body.touching.down) {
                    this.player.setVelocityY(-530);
                    this.sndJump.play();
                }
            } else {
                this.player.setVelocityX(330);
                this.player.anims.play('walk', true);

                if (this.player.body.touching.down) {
                    this.player.setVelocityY(-530);
                    this.sndJump.play();
                }
            }
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-530);
            this.sndJump.play();
        }

        this.clouds.tilePositionX += 0.5;

        this.updateObstacles();
        this.updateBees();
        this.updateSkulls();
        this.updateElectros();
        this.updateLasers();
        this.updatePhasers();
        this.updateBombs();
        this.updateBolts();
        this.updateSpike();

        this.txtScore.setText('Score: ' + this.playerScore);
    }

    spawnEnemyObstacle()
    {
        if (this.playerHealth <= 0) {
            return;
        }

        let self = this;

        let posx = gameconfig.scale.width - 20;
        let posy = Phaser.Math.Between(150, gameconfig.scale.height - 100);

        let box = this.physics.add.sprite(posx, posy, 'box');
        let plant = this.physics.add.sprite(posx, posy - 85, 'plant').setScale(0.2).refreshBody();

        let ident = 'obstacle_' + Math.random().toString(16).slice(2);

        this.obstacles.push({
            ident: ident,
            box: box,
            plant: plant,
            speed: Phaser.Math.Between(1, 3),
            destruction: false,
            shoot: self.time.addEvent({
                delay: Phaser.Math.Between(2000, 3500),
                loop: true,
                callback: function() {
                    if (self.playerHealth <= 0) {
                        return;
                    }

                    let laser = self.physics.add.sprite(plant.x - 20, plant.y, 'laser');  
                    laser.setVelocity(Phaser.Math.Between(200, 350) * -1, 0);
                    
                    self.lasers.push({
                        laser: laser,
                        target: {
                            x: self.player.x,
                            y: self.player.y
                        },
                        destruction: false,
                        parent: ident,
                        tStart: Date.now(),
                        tNow: Date.now(),
                        tLifeTime: 10000
                    });

                    let lasIndex = self.lasers.length - 1;

                    self.physics.add.collider(self.player, laser, function() {
                        self.inflictPlayer();

                        self.removeLaser(lasIndex);
                    });

                    self.sndMonsterShoot.play();
                },
                callbackScope: self
            })
        });

        let obstIndex = this.obstacles.length - 1;

        this.physics.add.collider(this.player, box, function() {
            self.playerScore += MONSTER_PLANT_SCORE;

            self.sndMonsterDispose.play();

            self.spawnExplosion(box.x, box.y);
            self.checkItemSpawn(box.x, box.y);

            if (typeof self.obstacles[obstIndex] !== 'undefined') {
                self.removeObstacle(obstIndex, true);
            }
        });

        this.physics.add.collider(box, plant, function() {
            plant.setGravity(50);
        });

        this.sndMonsterSpawn.play();
    }

    updateObstacles()
    {
        for (let i = 0; i < this.obstacles.length; i++) {
            if (!this.obstacles[i].destruction) {
                this.obstacles[i].box.x -= this.obstacles[i].speed;
                this.obstacles[i].plant.x -= this.obstacles[i].speed;

                this.obstacles[i].plant.anims.play('chew', true);

                if (this.obstacles[i].box.x <= -50) {
                    this.removeObstacle(i, true);
                }
            }
        }
    }

    updateLasers()
    {
        for (let i = 0; i < this.lasers.length; i++) {
            if (!this.lasers[i].destruction) {
                this.lasers[i].tNow = Date.now();
                if (this.lasers[i].tNow > this.lasers[i].tStart + this.lasers[i].tLifeTime) {
                    this.removeLaser(i);

                    continue;
                }
            }
        }
    }

    spawnEnemyBee()
    {
        if ((this.playerHealth <= 0) || (!this.bCanSpawnBees)) {
            return;
        }

        let self = this;

        let posx = gameconfig.scale.width - 20;
        let posy = Phaser.Math.Between(50, 250);

        let bee = this.physics.add.sprite(posx, posy, 'bee').setScale(0.2).refreshBody();

        let ident = 'bee_' + Math.random().toString(16).slice(2);

        this.bees.push({
            ident: ident,
            bee: bee,
            speed: Phaser.Math.Between(5, 7),
            destruction: false,
            shoot: self.time.addEvent({
                delay: 200,
                loop: false,
                callback: function() {
                    if (self.playerHealth <= 0) {
                        return;
                    }

                    for (let i = 0; i < 3; i++) {
                        setTimeout(() => {
                            let bomb = self.physics.add.sprite(bee.x - 20, bee.y, 'bomb');

                            let vector = new Phaser.Math.Vector2(self.player.x - bomb.x, self.player.y - bomb.y);
                            vector.setLength(250);
                            
                            bomb.setVelocity(vector.x, vector.y);
                            
                            self.bombs.push({
                                bomb: bomb,
                                target: {
                                    x: self.player.x,
                                    y: self.player.y
                                },
                                destruction: false,
                                parent: ident,
                                tStart: Date.now(),
                                tNow: Date.now(),
                                tLifeTime: 10000
                            });

                            let bomIndex = self.bombs.length - 1;

                            self.physics.add.collider(self.player, bomb, function() {
                                self.inflictPlayer();

                                self.removeBomb(bomIndex);
                            });

                            self.sndMonsterShoot.play();
                        }, i * 200);
                    }
                },
                callbackScope: self
            })
        });

        let beeIndex = this.bees.length - 1;

        this.physics.add.collider(this.player, bee, function() {
            self.playerScore += MONSTER_BEE_SCORE;

            self.sndMonsterDispose.play();

            self.spawnExplosion(bee.x, bee.y);
            self.checkItemSpawn(bee.x, bee.y);

            if (typeof self.bees[beeIndex] !== 'undefined') {
                self.removeBee(beeIndex, true);
            }
        });

        this.sndBeeSpawn.play();
    }

    updateBees()
    {
        for (let i = 0; i < this.bees.length; i++) {
            if (!this.bees[i].destruction) {
                this.bees[i].bee.x -= this.bees[i].speed;

                this.bees[i].bee.anims.play('float', true);

                if (this.bees[i].bee.x <= -50) {
                    this.removeBee(i, true);
                }
            }
        }
    }

    updateBombs()
    {
        for (let i = 0; i < this.bombs.length; i++) {
            if (!this.bombs[i].destruction) {
                this.bombs[i].tNow = Date.now();
                if (this.bombs[i].tNow > this.bombs[i].tStart + this.bombs[i].tLifeTime) {
                    this.removeBomb(i);

                    continue;
                }
            }
        }
    }

    spawnEnemySkull()
    {
        if ((this.playerHealth <= 0) || (!this.bCanSpawnSkulls)) {
            return;
        }

        let self = this;

        let posx = gameconfig.scale.width - 20;
        let posy = Phaser.Math.Between(150, gameconfig.scale.height - 100);

        let skull = this.physics.add.sprite(posx, posy, 'skull').setScale(0.2).refreshBody();

        let ident = 'skull_' + Math.random().toString(16).slice(2);

        this.skulls.push({
            ident: ident,
            skull: skull,
            speed: Phaser.Math.Between(1, 4),
            destruction: false,
            shoot: self.time.addEvent({
                delay: Phaser.Math.Between(1000, 2500),
                loop: true,
                callback: function() {
                    if (self.playerHealth <= 0) {
                        return;
                    }

                    let phaser = self.physics.add.sprite(skull.x - 20, skull.y, 'phaser');  
                    phaser.setVelocity(Phaser.Math.Between(300, 550) * -1, 0);
                    
                    self.phasers.push({
                        phaser: phaser,
                        target: {
                            x: self.player.x,
                            y: self.player.y
                        },
                        destruction: false,
                        parent: ident,
                        tStart: Date.now(),
                        tNow: Date.now(),
                        tLifeTime: 10000
                    });

                    let phasIndex = self.phasers.length - 1;

                    self.physics.add.collider(self.player, phaser, function() {
                        self.inflictPlayer();

                        self.removePhaser(phasIndex);
                    });

                    self.sndMonsterShoot.play();
                },
                callbackScope: self
            })
        });

        let skullIndex = this.skulls.length - 1;

        this.physics.add.collider(this.player, skull, function() {
            self.playerScore += MONSTER_SKULL_SCORE;

            self.sndMonsterDispose.play();

            self.spawnExplosion(skull.x, skull.y);
            self.checkItemSpawn(skull.x, skull.y);

            if (typeof self.skulls[skullIndex] !== 'undefined') {
                self.removeSkull(skullIndex, true);
            }
        });

        this.sndSkullSpawn.play();
    }

    updateSkulls()
    {
        for (let i = 0; i < this.skulls.length; i++) {
            if (!this.skulls[i].destruction) {
                this.skulls[i].skull.x -= this.skulls[i].speed;

                this.skulls[i].skull.anims.play('jaw', true);

                if (this.skulls[i].skull.x <= -50) {
                    this.removeSkull(i, true);
                }
            }
        }
    }

    updatePhasers()
    {
        for (let i = 0; i < this.phasers.length; i++) {
            if (!this.phasers[i].destruction) {
                this.phasers[i].tNow = Date.now();
                if (this.phasers[i].tNow > this.phasers[i].tStart + this.phasers[i].tLifeTime) {
                    this.removePhaser(i);

                    continue;
                }
            }
        }
    }

    spawnEnemyElectro()
    {
        if ((this.playerHealth <= 0) || (!this.bCanSpawnElectros)) {
            return;
        }

        let self = this;

        let posx = Phaser.Math.Between(300, gameconfig.scale.width - 300);
        let posy = 0;

        let electro = this.physics.add.sprite(posx, posy, 'electro').setScale(0.4).refreshBody();

        let ident = 'electro_' + Math.random().toString(16).slice(2);

        this.electros.push({
            ident: ident,
            electro: electro,
            speed: 2,
            reverse: false,
            destruction: false,
            shoot: self.time.addEvent({
                delay: 2000,
                loop: false,
                callback: function() {
                    if (self.playerHealth <= 0) {
                        return;
                    }

                    let bolt = self.physics.add.sprite(electro.x - 1, electro.y + 315, 'bolt');
                    bolt.setScale(1.0, 1.8);  
                    bolt.setVelocity(0, 0);
                    
                    self.bolts.push({
                        bolt: bolt,
                        target: {
                            x: self.player.x,
                            y: self.player.y
                        },
                        destruction: false,
                        parent: ident,
                        tStart: Date.now(),
                        tNow: Date.now(),
                        tLifeTime: 500
                    });

                    let boltIndex = self.bolts.length - 1;

                    self.physics.add.collider(self.player, bolt, function() {
                        self.inflictPlayer();

                        self.removeBolt(boltIndex);
                    });

                    bolt.anims.play('bolt', true);
                    bolt.on('animationcomplete', function() {
                    });

                    self.sndElectroAttack.play();
                },
                callbackScope: self
            })
        });

        let electroIndex = this.electros.length - 1;

        this.physics.add.collider(this.player, electro, function() {
            self.playerScore += MONSTER_ELECTRO_SCORE;

            self.sndMonsterDispose.play();

            self.spawnExplosion(electro.x, electro.y);
            self.checkItemSpawn(electro.x, electro.y);

            if (typeof self.electros[electroIndex] !== 'undefined') {
                self.removeElectro(electroIndex, true);
            }
        });

        self.time.addEvent({
            delay: 3500,
            loop: false,
            callback: function() {
                if (typeof self.electros[electroIndex] !== 'undefined') {
                    self.electros[electroIndex].reverse = true;
                }
            },
            callbackScope: self
        });

        this.sndElectroSpawn.play();
    }

    updateElectros()
    {
        for (let i = 0; i < this.electros.length; i++) {
            if (!this.electros[i].destruction) {
                if (!this.electros[i].reverse) {
                    if (this.electros[i].electro.y <= 150) {
                        this.electros[i].electro.y += this.electros[i].speed;
                    }
                } else {
                    this.electros[i].electro.y -= this.electros[i].speed;

                    if (this.electros[i].electro.y <= -50) {
                        this.removeElectro(i);
                    }
                }
            }
        }
    }

    updateBolts()
    {
        for (let i = 0; i < this.bolts.length; i++) {
            if (!this.bolts[i].destruction) {
                this.bolts[i].tNow = Date.now();
                if (this.bolts[i].tNow > this.bolts[i].tStart + this.bolts[i].tLifeTime) {
                    this.removeBolt(i);

                    continue;
                }
            }
        }
    }

    spawnEnemySpike()
    {
        if ((this.playerHealth <= 0) || (this.spike)) {
            return;
        }

        let self = this;

        let posx = gameconfig.scale.width - 5;
        let posy = gameconfig.scale.height - 89;

        let sprite = this.physics.add.sprite(posx, posy, 'spike').setScale(0.3, 0.3).refreshBody();

        this.spike = {
            sprite: sprite,
            idle: true,
            collided: false,
            timer: this.time.addEvent({
                delay: 1500,
                loop: false,
                callback: function() {
                    if (self.spike) {
                        self.spike.idle = false;
                    }
                },
                callbackScope: self
            })
        };

        this.physics.add.collider(this.player, this.spike.sprite, function() {
            if (self.spike.collided) {
                return;
            }

            self.spike.collided = true;

            self.inflictPlayer();
        });

        self.sndSpike.loop = true;
        self.sndSpike.play();
    }

    updateSpike()
    {
        if ((this.spike) && (!this.spike.idle)) {
            this.spike.sprite.x -= 10;

            if (this.spike.sprite.x <= -50) {
                this.sndSpike.stop();

                this.spike.sprite.destroy();
                this.spike = null;
            }
        }
    }

    spawnExplosion(x, y)
    {
        let explosion = this.physics.add.sprite(x, y, 'boom');
        explosion.anims.play('boom', true);
        explosion.on('animationcomplete', function() {
            explosion.destroy();
        });
        this.sndExplosion.play();
    }

    clearGameObjects()
    {
        for (let i = 0; i < this.lasers.length; i++) {
            if (!this.lasers[i].destruction) {
                this.lasers[i].destruction = true;
                this.lasers[i].laser.destroy();
            }
        }

        for (let i = 0; i < this.bombs.length; i++) {
            if (!this.bombs[i].destruction) {
                this.bombs[i].destruction = true;
                this.bombs[i].bomb.destroy();
            }
        }

        for (let j = 0; j < this.obstacles.length; j++) {
            if (!this.obstacles[j].destruction) {
                this.obstacles[j].destruction = true;
                this.obstacles[j].box.destroy();
                this.obstacles[j].plant.destroy();
            }
        }

        for (let k = 0; k < this.bees.length; k++) {
            if (!this.bees[k].destruction) {
                this.bees[k].destruction = true;
                this.bees[k].bee.destroy();
            }
        }

        for (let l = 0; l < this.skulls.length; l++) {
            if (!this.skulls[l].destruction) {
                this.skulls[l].destruction = true;
                this.skulls[l].skull.destroy();
            }
        }

        for (let m = 0; m < this.electros.length; m++) {
            if (!this.electros[m].destruction) {
                this.electros[m].destruction = true;
                this.electros[m].electro.destroy();
            }
        }

        this.obstacles = [];
        this.bees = [];
        this.skulls = [];
        this.electros = [];
        this.bombs = [];
    }

    inflictPlayer()
    {
        if (!this.playerInvincible) {
            this.playerHealth--;

            this.sndHurt.play();

            if (this.playerHealth >= 0) {
                this.hearts[this.playerHealth].setVisible(false);
            }
        }
    }

    finishGame()
    {
        if (this.playerHealth > 0) {
            return;
        }

        localStorage.setItem('last_score', this.playerScore);
        let playerRecord = localStorage.getItem('player_record');
        if ((playerRecord === null) || (this.playerScore > playerRecord)) {
            localStorage.setItem('player_record', this.playerScore);
            playerRecord = this.playerScore;
        }

        this.player.setVelocity(0, 0);

        if (!this.rectOverlay.visible) {
            this.rectOverlay.setVisible(true);
        }

        if (!this.txtGameOver.visible) {
            this.txtGameOver.setVisible(true);
            this.txtGameOver.postFX.addGlow(0x00FF00, 4, 0, true, 0.1, 10);
            this.children.bringToTop(this.txtGameOver);
        }

        if (!this.txtScoreResult.visible) {
            this.txtScoreResult.setText('Score: ' + this.playerScore + '   Record: ' + playerRecord);
            this.txtScoreResult.x = (gameconfig.scale.width / 2) - (this.txtScoreResult.width / 2) + 35;
            this.txtScoreResult.setVisible(true);
            this.children.bringToTop(this.txtScoreResult);
        }

        if (!this.rectRestart.visible) {
            this.rectRestart.setVisible(true);
            this.children.bringToTop(this.rectRestart);
        }

        if (!this.btnRestart.visible) {
            this.btnRestart.setVisible(true);
            this.children.bringToTop(this.btnRestart);

            this.clearGameObjects();
        }
    }

    restartGame()
    {
        location.reload();
    }

    removeObstacle(index, withLaser = false)
    {
        if (!this.obstacles[index].destruction) {
            let parentIdent = this.obstacles[index].ident;
            this.obstacles[index].shoot.paused = true;
            this.obstacles[index].destruction = true;

            if (withLaser) {
                for (let i = 0; i < this.lasers.length; i++) {
                    if (!this.lasers[i].destruction) {
                        if (this.lasers[i].parent === parentIdent) {
                            this.removeLaser(i);
                            continue;
                        }
                    }
                }
            }

            this.obstacles[index].box.destroy();
            this.obstacles[index].plant.destroy();
            this.obstacles.slice(index, 1);
        }
    }

    removeBee(index, withBomb = false)
    {
        if (!this.bees[index].destruction) {
            let parentIdent = this.bees[index].ident;
            this.bees[index].shoot.paused = true;
            this.bees[index].destruction = true;

            if (withBomb) {
                for (let i = 0; i < this.bombs.length; i++) {
                    if (!this.bombs[i].destruction) {
                        if (this.bombs[i].parent === parentIdent) {
                            this.removeBomb(i);
                            continue;
                        }
                    }
                }
            }

            this.bees[index].bee.destroy();
            this.bees.slice(index, 1);
        }
    }

    removeSkull(index, withPhaser = false)
    {
        if (!this.skulls[index].destruction) {
            let parentIdent = this.skulls[index].ident;
            this.skulls[index].shoot.paused = true;
            this.skulls[index].destruction = true;

            if (withPhaser) {
                for (let i = 0; i < this.phasers.length; i++) {
                    if (!this.phasers[i].destruction) {
                        if (this.phasers[i].parent === parentIdent) {
                            this.removePhaser(i);
                            continue;
                        }
                    }
                }
            }

            this.skulls[index].skull.destroy();
            this.skulls.slice(index, 1);
        }
    }

    removeElectro(index, withBolt = false)
    {
        if ((typeof this.electros[index] !== 'undefined') && (!this.electros[index].destruction)) {
            let parentIdent = this.electros[index].ident;
            this.electros[index].shoot.paused = true;
            this.electros[index].destruction = true;

            if (withBolt) {
                for (let i = 0; i < this.bolts.length; i++) {
                    if (!this.bolts[i].destruction) {
                        if (this.bolts[i].parent === parentIdent) {
                            this.removeBolt(i);
                            continue;
                        }
                    }
                }
            }

            this.electros[index].electro.destroy();
            this.electros.slice(index, 1);
        }
    }

    removeLaser(index)
    {
        if (!this.lasers[index].destruction) {
            this.lasers[index].destruction = true;
            this.lasers[index].laser.destroy();
            this.obstacles.slice(index, 1);
        }
    }

    removeBomb(index)
    {
        if (!this.bombs[index].destruction) {
            this.bombs[index].destruction = true;
            this.bombs[index].bomb.destroy();
            this.bees.slice(index, 1);
        }
    }

    removePhaser(index)
    {
        if (!this.phasers[index].destruction) {
            this.phasers[index].destruction = true;
            this.phasers[index].phaser.destroy();
            this.skulls.slice(index, 1);
        }
    }

    removeBolt(index)
    {
        if (!this.bolts[index].destruction) {
            this.bolts[index].destruction = true;
            this.bolts[index].bolt.destroy();
            this.electros.slice(index, 1);
        }
    }

    addTree(x, y)
    {
        let bottom = this.add.image(x, y - 30, 'tree_bottom');
        let stem1 = this.add.image(x - 5, y - 145, 'tree_stem');
        let stem2 = this.add.image(x - 5, y - 270, 'tree_stem');
        let top = this.add.image(x - 20, y - 415, 'tree_top');

        bottom.setScale(0.5, 0.5);
        stem1.setScale(0.5, 0.5);
        stem2.setScale(0.5, 0.5);
        top.setScale(0.75, 0.75);

        let tree = {
            bottom: bottom,
            stems: [stem1, stem2],
            top: top
        };

        this.trees.push(tree);
    }

    checkItemSpawn(x, y)
    {
        this.checkSupplySpawn(x, y);
        this.checkInvicibleSpawn(x, y);
        this.checkBombSpawn(x, y);
    }

    checkSupplySpawn(x, y)
    {
        if (this.playerHealth < PLAYER_MAX_HEALTH) {
            let rndSpawnSupply = Phaser.Math.Between(1, SUPPLY_MAXRAND);
            if (rndSpawnSupply === SUPPLY_MAXRAND) {
                this.spawnHealthSupply(x, y);
            }
        }
    }

    spawnHealthSupply(x, y)
    {
        let self = this;

        let supply = this.physics.add.sprite(x, y, 'heart');

        supply.setGravityY(200);
        supply.setGravityX(Phaser.Math.Between(-100, 100));
        supply.setCollideWorldBounds(true);
        supply.setBounce(0.5, 0.5);

        self.time.addEvent({
            delay: 5000,
            loop: false,
            callback: function() {
                if (supply) {
                    self.spawnPuff(supply.x, supply.y);
                    supply.destroy();
                    supply = null;
                }
            },
            callbackScope: self
        });

        this.physics.add.collider(supply, this.platforms);

        this.physics.add.collider(this.player, supply, function() {
            if (self.playerHealth < PLAYER_MAX_HEALTH) {
                self.hearts[self.playerHealth].setVisible(true);
                self.playerHealth++;
                self.sndUp.play();
            }

            supply.destroy();
            supply = null;
        });
    }

    checkInvicibleSpawn(x, y)
    {
        if (!this.playerInvincible) {
            let rndSpawnItem = Phaser.Math.Between(1, INVINC_MAXRAND);
            if (rndSpawnItem === INVINC_MAXRAND) {
                this.spawnInvicibleItem(x, y);
            }
        }
    }

    spawnInvicibleItem(x, y)
    {
        let self = this;

        let invinc = this.physics.add.sprite(x, y - 100, 'star');

        invinc.setGravityY(200);
        invinc.setGravityX(Phaser.Math.Between(-100, 100));
        invinc.setScale(0.5, 0.5);
        invinc.setCollideWorldBounds(true);
        invinc.setBounce(0.5, 1.0);

        let glow = invinc.preFX.addGlow();

        let tween = this.tweens.add({
            targets: glow,
            outerStrength: 20,
            yoyo: true,
            loop: -1,
            ease: 'sine.inout'
        });

        self.time.addEvent({
            delay: 5000,
            loop: false,
            callback: function() {
                if (invinc) {
                    self.spawnPuff(invinc.x, invinc.y);
                    tween.remove();
                    invinc.destroy();
                    invinc = null;
                }
            },
            callbackScope: self
        });

        this.physics.add.collider(invinc, this.platforms);

        this.physics.add.collider(this.player, invinc, function() {
            self.playerInvincible = true;
            self.playerGlow.active = true;
            self.sndTheme.pause();
            self.sndInvicible.play();

            self.time.addEvent({
                delay: 15000,
                loop: false,
                callback: function() {
                    self.playerInvincible = false;
                    self.playerGlow.active = false;
                    self.sndInvicible.stop();
                    self.sndTheme.resume();
                },
                callbackScope: self
            });

            tween.remove();
            invinc.destroy();
            invinc = null;
        });
    }

    checkBombSpawn(x, y)
    {
        let rndSpawnItem = Phaser.Math.Between(1, BOMB_MAXRAND);
        if (rndSpawnItem === BOMB_MAXRAND) {
            this.spawnBombItem(x, y);
        }
    }

    spawnBombItem(x, y)
    {
        let self = this;

        let item = this.physics.add.sprite(x, y, 'bluebomb');

        item.setGravityY(200);
        item.setGravityX(Phaser.Math.Between(-100, 100));
        item.setCollideWorldBounds(true);
        item.setBounce(0.5, 0.5);

        this.physics.add.collider(item, this.platforms);

        this.sndFuse.play();

        item.anims.play('fuse', true);
        item.on('animationcomplete', function() {
            item.destroy();

            let detonation = self.physics.add.sprite(item.x, item.y, 'detonation');
            detonation.setScale(5.0, 5.0);
            detonation.anims.play('detonation', true);
            detonation.on('animationcomplete', function() {
                detonation.destroy();
            });

            for (let i = 0; i < self.obstacles.length; i++) {
                self.physics.add.collider(detonation, self.obstacles[i].plant, function() {
                    self.spawnExplosion(self.obstacles[i].plant.x, self.obstacles[i].plant.y);
                    self.removeObstacle(i, true);
                    self.playerScore += MONSTER_PLANT_SCORE;
                });

                self.physics.add.collider(detonation, self.obstacles[i].box, function() {
                    self.spawnExplosion(self.obstacles[i].box.x, self.obstacles[i].box.y);
                    self.removeObstacle(i, true);
                });
            }

            for (let i = 0; i < self.bees.length; i++) {
                self.physics.add.collider(detonation, self.bees[i].bee, function() {
                    self.spawnExplosion(self.bees[i].bee.x, self.bees[i].bee.y);
                    self.removeBee(i, true);
                    self.playerScore += MONSTER_BEE_SCORE;
                });
            }

            for (let i = 0; i < self.skulls.length; i++) {
                self.physics.add.collider(detonation, self.skulls[i].skull, function() {
                    self.spawnExplosion(self.skulls[i].skull.x, self.skulls[i].skull.y);
                    self.removeSkull(i, true);
                    self.playerScore += MONSTER_SKULL_SCORE;
                });
            }

            for (let i = 0; i < self.electros.length; i++) {
                self.physics.add.collider(detonation, self.electros[i].electro, function() {
                    self.spawnExplosion(self.electros[i].electro.x, self.electros[i].electro.y);
                    self.removeElectro(i, true);
                    self.playerScore += MONSTER_ELECTRO_SCORE;
                });
            }

            if (self.spike) {
                self.physics.add.collider(detonation, self.spike.sprite, function() {
                    self.spawnExplosion(self.spike.sprite.x, self.spike.sprite.y);

                    self.sndSpike.stop();

                    self.spike.sprite.destroy();
                    self.spike = null;

                    self.playerScore += MONSTER_SPIKE_SCORE;
                });
            }

            self.sndDetonation.play();
        });
    }

    spawnPuff(x, y)
    {
        let puff = this.physics.add.sprite(x, y, 'puff');
        puff.setScale(2.0, 2.0);
        puff.anims.play('puff', true);

        puff.on('animationcomplete', function() {
            puff.destroy();
        });
    }

    getFormattedGameTime()
    {
        let curms = (this.tmGameTime.current - this.tmGameTime.start);
        let cursecs = Math.round((curms % 60000) / 1000);
        let curmins = Math.floor(curms / 60000).toFixed(0);

        if (cursecs >= 60) {
            cursecs = 0;
            curmins++;
        }

        return ((curmins < 10) ? '0' + curmins : curmins) + ':' + ((cursecs < 10) ? '0' + cursecs : cursecs);
    }
}

const gameconfig = {
    type: Phaser.AUTO,
    scene: HortusGame,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1024,
        height: 768
    }
};