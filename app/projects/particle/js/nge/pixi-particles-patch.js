PIXI.particles.AnimatedPathParticle = /** @class */ (function (_super) {
  var extendStatics = function (d, b) {
    extendStatics =
      Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array &&
        function (d, b) {
          d.__proto__ = b;
        }) ||
      function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      };
    return extendStatics(d, b);
  };

  function __extends(d, b) {
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype =
      b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
  }
  __extends(AnimatedPathParticle, _super);
  function AnimatedPathParticle(emitter) {
    var _this = _super.call(this, emitter) || this;
    _this.path = null;
    // _this.initialRotation = 0;
    _this.initialPosition = new PIXI.Point();
    _this.movement = 0;
    _this.rotationSpeedNew = new PIXI.particles.PropertyList();
    _this.accelerationX = new PIXI.particles.PropertyList();
    _this.accelerationY = new PIXI.particles.PropertyList();

    return _this;
  }

  AnimatedPathParticle.prototype.parsePath = function (varName, pathString) {
    return new Function(
      "DISTANCE",
      "var " + varName + " = 0; " + pathString + "; return " + varName + ";"
    );
  };

  AnimatedPathParticle.prototype.parseData = function (extraData) {
    var output = {};
    if (!extraData) return output;

    if (extraData.pathY) {
      try {
        output.pathY = this.parsePath("y", extraData.pathY);
        output.pathY(0);
      } catch (e) {
        console.error("PathParticle: error in parsing pathY expression");
        output.pathY = null;
      }
    } else {
      console.error("PathParticle requires a pathY string in extraData!");
      output.path = null;
    }

    if (extraData.pathX) {
      try {
        output.pathX = this.parsePath("x", extraData.pathX);
        output.pathX(0);
      } catch (e) {
        console.error("PathParticle: error in parsing pathX expression");
        output.pathX = null;
      }
    }

    return output;
  };

  AnimatedPathParticle.prototype.init = function () {
    PIXI.particles.AnimatedParticle.prototype.init.call(this);
    this._doNormalMovement = false;

    this._doAcceleration =
      !!this.accelerationX.current.next && !!this.accelerationY.current.next; // ?

    this.initialRotation = this.rotation;
    this.extraData = this.parseData(this.extraData);
    this.pathY = this.extraData.pathY;
    this.pathX = this.extraData.pathX;
    this.movement = 0;
    this.initialPosition.x = this.position.x;
    this.initialPosition.y = this.position.y;

    const list = this.emitter._origConfig.alpha.list;
    list.forEach((ch) => {
      const randomizer = ch.randomizer;
      let sliderValue = ch.value;
      const minAlpha = sliderValue - randomizer;
      const maxAlpha = 1.01;
      if (sliderValue === 0) {
        this.alpha = 0;
      } else {
        this.alpha = Math.random() * (maxAlpha - minAlpha) + minAlpha;
      }
    });
  };

  AnimatedPathParticle.prototype.update = function (delta) {
    var lerp = PIXI.particles.AnimatedParticle.prototype.update.call(
      this,
      delta
    );

    if (!this.pathY || !this.pathX) {
      var deltaX = void 0;
      var deltaY = void 0;
      // interpolate speed
      if (this._doSpeed) {
        var speed = this.speedList.interpolate(lerp) * this.speedMultiplier;
        exports.ParticleUtils.normalize(this.velocity);
        exports.ParticleUtils.scaleBy(this.velocity, speed);
        deltaX = this.velocity.x * delta;
        deltaY = this.velocity.y * delta;
      } else if (this._doAcceleration) {
        var oldVX = this.velocity.x;
        var oldVY = this.velocity.y;
        const accX = this.accelerationX.interpolate(lerp);
        const accY = this.accelerationY.interpolate(lerp);
        this.velocity.x += accX * delta;
        this.velocity.y += accY * delta;
        if (this.maxSpeed) {
          var currentSpeed = exports.ParticleUtils.length(this.velocity);
          // if we are going faster than we should, clamp at the max speed
          // DO NOT recalculate vector length
          if (currentSpeed > this.maxSpeed) {
            exports.ParticleUtils.scaleBy(
              this.velocity,
              this.maxSpeed / currentSpeed
            );
          }
        }
        // calculate position delta by the midpoint between our old velocity and our new velocity
        deltaX = ((oldVX + this.velocity.x) / 2) * delta;
        deltaY = ((oldVY + this.velocity.y) / 2) * delta;
      } else {
        deltaX = this.velocity.x * delta;
        deltaY = this.velocity.y * delta;
      }
      // adjust position based on velocity
      this.position.x += deltaX;
      this.position.y += deltaY;
    }
    // update rotation
    if (this.rotationAcceleration !== 0 && this.rotationSpeedNew.next) {
      this.rotation = this.rotationSpeedNew.interpolate(lerp);
    } else if (this.rotationAcceleration !== 0) {
      this.rotation += this.rotationSpeedNew.current.value * delta;
    } else if (this.acceleration && !this.noRotation) {
      this.rotation = Math.atan2(this.velocity.y, this.velocity.x); // + Math.PI / 2;
    }

    // only animate the particle if it is still alive
    if (lerp >= 0) {
      if (this.pathY) {
        // increase linear movement based on speed
        if (this._doSpeed) {
          var speed = this.speedList.interpolate(lerp) * this.speedMultiplier;
          this.movement += speed * delta;
        } else {
          var speed = this.speedList.current.value * this.speedMultiplier;
          this.movement += speed * delta;
        }
        // set up the helper point for rotation
        helperPoint$1.x = this.pathX
          ? this.pathX(this.movement)
          : this.movement;
        helperPoint$1.y = this.pathY(this.movement);

        PIXI.particles.ParticleUtils.rotatePoint(
          this.initialRotation,
          helperPoint$1
        );
        this.position.x = this.initialPosition.x + helperPoint$1.x;
        this.position.y = this.initialPosition.y + helperPoint$1.y;
      }
    }
    return lerp;
  };

  var helperPoint$1 = new PIXI.Point();

  return AnimatedPathParticle;
})(PIXI.particles.AnimatedParticle);

var emitterOld = PIXI.particles.Emitter;
PIXI.particles.Emitter = /** @class */ (function (_super) {
  var extendStatics = function (d, b) {
    extendStatics =
      Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array &&
        function (d, b) {
          d.__proto__ = b;
        }) ||
      function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      };
    return extendStatics(d, b);
  };

  function __extends(d, b) {
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype =
      b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
  }

  __extends(EmitterNew, _super);
  function EmitterNew(particleParent, particleImages, config) {
    var _this =
      _super.call(this, particleParent, particleImages, config) || this;

    this.rotationSpeedNew = null;
    this.rotationSpeed = null;
    return _this;
  }

  EmitterNew.prototype.init = function (art, config) {
    emitterOld.prototype.init.call(this, art, config);
    var acceleration = config.acceleration;
    const PropertyNode = PIXI.particles.PropertyNode;
    if (acceleration && (acceleration.x || acceleration.y)) {
      // make sure we disable speed interpolation
      this.startSpeed.next = null;
      this.accelerationX = PropertyNode.createList(acceleration.x);
      this.accelerationY = PropertyNode.createList(acceleration.y);
      this.maxSpeed = config.maxSpeed || NaN;
    } else {
      this.accelerationX = PropertyNode.createList(acceleration.x);
      this.accelerationY = PropertyNode.createList(acceleration.y);
    }

    // set up the rotation speed
    if (config.rotationSpeed) {
      this.rotationSpeedNew = PropertyNode.createList(config.rotationSpeed);
    } else {
      this.minRotationSpeed = this.maxRotationSpeed = 0;
    }
  };

  EmitterNew.prototype.update = function (delta) {
    if (this._autoUpdate) {
      delta = delta / pixi.settings.TARGET_FPMS / 1000;
    }
    // if we don't have a parent to add particles to, then don't do anything.
    // this also works as a isDestroyed check
    if (!this._parent) return;
    // update existing particles
    var i;
    var particle;
    var next;
    for (particle = this._activeParticlesFirst; particle; particle = next) {
      next = particle.next;
      particle.update(delta);
    }
    var prevX;
    var prevY;
    // if the previous position is valid, store these for later interpolation
    if (this._prevPosIsValid) {
      prevX = this._prevEmitterPos.x;
      prevY = this._prevEmitterPos.y;
    }
    // store current position of the emitter as local variables
    var curX = this.ownerPos.x + this.spawnPos.x;
    var curY = this.ownerPos.y + this.spawnPos.y;
    // spawn new particles
    if (this._emit) {
      // decrease spawn timer
      this._spawnTimer -= delta < 0 ? 0 : delta;
      // while _spawnTimer < 0, we have particles to spawn
      while (this._spawnTimer <= 0) {
        // determine if the emitter should stop spawning
        if (this._emitterLife >= 0) {
          this._emitterLife -= this._frequency;
          if (this._emitterLife <= 0) {
            this._spawnTimer = 0;
            this._emitterLife = 0;
            this.emit = false;
            break;
          }
        }
        // determine if we have hit the particle limit
        if (this.particleCount >= this.maxParticles) {
          this._spawnTimer += this._frequency;
          continue;
        }
        // determine the particle lifetime
        var lifetime = void 0;
        if (this.minLifetime === this.maxLifetime) {
          lifetime = this.minLifetime;
        } else {
          lifetime =
            Math.random() * (this.maxLifetime - this.minLifetime) +
            this.minLifetime;
        }
        // only make the particle if it wouldn't immediately destroy itself
        if (-this._spawnTimer < lifetime) {
          // If the position has changed and this isn't the first spawn,
          // interpolate the spawn position
          var emitPosX = void 0;
          var emitPosY = void 0;
          if (this._prevPosIsValid && this._posChanged) {
            // 1 - _spawnTimer / delta, but _spawnTimer is negative
            var lerp = 1 + this._spawnTimer / delta;
            emitPosX = (curX - prevX) * lerp + prevX;
            emitPosY = (curY - prevY) * lerp + prevY;
          } // otherwise just set to the spawn position
          else {
            emitPosX = curX;
            emitPosY = curY;
          }
          // create enough particles to fill the wave (non-burst types have a wave of 1)
          i = 0;
          for (
            var len = Math.min(
              this.particlesPerWave,
              this.maxParticles - this.particleCount
            );
            i < len;
            ++i
          ) {
            // see if we actually spawn one
            if (this.spawnChance < 1 && Math.random() >= this.spawnChance) {
              continue;
            }
            // create particle
            var p = void 0;
            if (this._poolFirst) {
              p = this._poolFirst;
              this._poolFirst = this._poolFirst.next;
              p.next = null;
            } else {
              p = new this.particleConstructor(this);
            }
            // set a random texture if we have more than one
            if (this.particleImages.length > 1) {
              // if using ordered art
              if (this._currentImageIndex !== -1) {
                // get current art index, then increment for the next particle
                p.applyArt(this.particleImages[this._currentImageIndex++]);
                // loop around if needed
                if (
                  this._currentImageIndex < 0 ||
                  this._currentImageIndex >= this.particleImages.length
                ) {
                  this._currentImageIndex = 0;
                }
              }
              // otherwise grab a random one
              else {
                p.applyArt(
                  this.particleImages[
                    Math.floor(Math.random() * this.particleImages.length)
                  ]
                );
              }
            } else {
              // if they are actually the same texture, a standard particle
              // will quit early from the texture setting in setTexture().
              p.applyArt(this.particleImages[0]);
            }
            // set up the start and end values
            p.alphaList.reset(this.startAlpha);
            if (this.minimumSpeedMultiplier !== 1) {
              // eslint-disable-next-line max-len
              p.speedMultiplier =
                Math.random() * (1 - this.minimumSpeedMultiplier) +
                this.minimumSpeedMultiplier;
            }
            p.speedList.reset(this.startSpeed);
            p.accelerationX.reset(this.accelerationX);
            p.accelerationY.reset(this.accelerationY);
            p.maxSpeed = this.maxSpeed;
            if (this.minimumScaleMultiplier !== 1) {
              // eslint-disable-next-line max-len
              p.scaleMultiplier =
                Math.random() * (1 - this.minimumScaleMultiplier) +
                this.minimumScaleMultiplier;
            }
            p.scaleList.reset(this.startScale);
            p.colorList.reset(this.startColor);
            // randomize the rotation speed
            p.rotationSpeedNew.reset(this.rotationSpeedNew);

            p.rotationAcceleration = this.rotationAcceleration;
            p.noRotation = this.noRotation;
            // set up the lifetime
            p.maxLife = lifetime;
            // set the blend mode
            p.blendMode = this.particleBlendMode;
            // set the custom ease, if any
            p.ease = this.customEase;
            // set the extra data, if any
            p.extraData = this.extraData;
            // set additional properties to particle
            this.applyAdditionalProperties(p);
            // call the proper function to handle rotation and position of particle
            this._spawnFunc(p, emitPosX, emitPosY, i);
            // initialize particle
            p.init();
            // add the particle to the display list
            if (!p.parent) {
              if (this.addAtBack) {
                this._parent.addChildAt(p, 0);
              } else {
                this._parent.addChild(p);
              }
            } else {
              // kind of hacky, but performance friendly
              // shuffle children to correct place
              var children = this._parent.children;
              // avoid using splice if possible
              if (children[0] === p) {
                children.shift();
              } else if (children[children.length - 1] === p) {
                children.pop();
              } else {
                var index = children.indexOf(p);
                children.splice(index, 1);
              }
              if (this.addAtBack) {
                children.unshift(p);
              } else {
                children.push(p);
              }
            }
            // add particle to list of active particles
            if (this._activeParticlesLast) {
              this._activeParticlesLast.next = p;
              p.prev = this._activeParticlesLast;
              this._activeParticlesLast = p;
            } else {
              this._activeParticlesLast = this._activeParticlesFirst = p;
            }
            ++this.particleCount;
            // update the particle by the time passed, so the particles are spread out properly
            p.update(-this._spawnTimer); // we want a positive delta, because a negative delta messes things up
          }
        }
        // increase timer and continue on to any other particles that need to be created
        this._spawnTimer += this._frequency;
      }
    }
    // if the position changed before this update, then keep track of that
    if (this._posChanged) {
      this._prevEmitterPos.x = curX;
      this._prevEmitterPos.y = curY;
      this._prevPosIsValid = true;
      this._posChanged = false;
    }
    // if we are all done and should destroy ourselves, take care of that
    if (!this._emit && !this._activeParticlesFirst) {
      if (this._completeCallback) {
        var cb = this._completeCallback;
        this._completeCallback = null;
        cb();
      }
      if (this._destroyWhenComplete) {
        this.destroy();
      }
    }
  };
  return EmitterNew;
})(emitterOld);
