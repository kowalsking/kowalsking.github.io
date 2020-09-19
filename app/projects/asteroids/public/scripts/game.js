!function(){function t(e,i,s){function n(r,o){if(!i[r]){if(!e[r]){var h="function"==typeof require&&require;if(!o&&h)return h(r,!0);if(a)return a(r,!0);var u=new Error("Cannot find module '"+r+"'");throw u.code="MODULE_NOT_FOUND",u}var c=i[r]={exports:{}};e[r][0].call(c.exports,function(t){var i=e[r][1][t];return n(i||t)},c,c.exports,t,e,i,s)}return i[r].exports}for(var a="function"==typeof require&&require,r=0;r<s.length;r++)n(s[r]);return n}return t}()({1:[function(t,e,i){"use strict";function s(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(i,"__esModule",{value:!0});var n=function(){function t(t,e){for(var i=0;i<e.length;i++){var s=e[i];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(t,s.key,s)}}return function(e,i,s){return i&&t(e.prototype,i),s&&t(e,s),e}}(),a=function(){function t(e){s(this,t),this.config=e}return n(t,[{key:"create",value:function(t,e){var i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:this.config.astrSize/2,s=Math.random()*this.config.astrSpd/this.config.fps;return this.asteroid={x:t,y:e,radius:i,xv:s*this.changeDirection(),yv:s*this.changeDirection()}}},{key:"move",value:function(){this.asteroid.x+=this.asteroid.xv,this.asteroid.y+=this.asteroid.yv}},{key:"changeDirection",value:function(){return Math.random()<.5?1:-1}}]),t}();i["default"]=a},{}],2:[function(t,e,i){"use strict";function s(t){return t&&t.__esModule?t:{"default":t}}function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(i,"__esModule",{value:!0});var a=function(){function t(t,e){for(var i=0;i<e.length;i++){var s=e[i];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(t,s.key,s)}}return function(e,i,s){return i&&t(e.prototype,i),s&&t(e,s),e}}(),r=t("./Game"),o=s(r),h=t("./View"),u=s(h),c=function(){function t(){n(this,t),this.game=new o["default"],this.view=new u["default"],this.width=this.view.canvas.width,this.height=this.view.canvas.height,this.game.markBoundaries(this.width,this.height),this.init()}return a(t,[{key:"init",value:function(){var t=this;this.game.setup(),this.eventsHandlers(),this.onResize(),requestAnimationFrame(function(e){return t.update(e)})}},{key:"eventsHandlers",value:function(){var t=this;document.addEventListener("keydown",function(e){t.game.keyDown(e)}),document.addEventListener("keyup",function(e){t.game.keyUp(e)}),window.addEventListener("resize",function(){t.onResize()})}},{key:"update",value:function(t){var e=this;this.updateView(),this.updateMoving(),this.checkCollision(),this.checkIsGameOver(),this.game.prevUpdateTime=t,requestAnimationFrame(function(t){return e.update(t)})}},{key:"updateView",value:function(){this.view.clearScreen(),this.view.drawShip(this.game.ship.body),this.view.drawAsteroids(this.game.allAsteroids),this.view.drawBullets(this.game.ship.body.bullets),this.view.drawScore(this.game.state.score)}},{key:"updateMoving",value:function(){this.game.ship.body.moving?this.game.ship.push():this.game.ship.brake(),this.game.ship.rotate(),this.game.ship.move(),this.game.ship.moveBullet(),this.game.moveAsteroids(this.game.allAsteroids)}},{key:"checkCollision",value:function(){var t=this.game.ship.body;this.game.checkCollision(this.game.state,t,this.game.allAsteroids),this.game.shellHit(this.game.state,t.bullets,this.game.allAsteroids),this.game.handleEdgeOfSpace([t]),this.game.handleEdgeOfSpace(this.game.allAsteroids),this.game.removeBulletsOutOfScreen(t.bullets)}},{key:"checkIsGameOver",value:function(){this.game.state.isGameOver&&this.stopGame()}},{key:"onResize",value:function(){var t=this.view.container.clientWidth,e=this.view.container.clientHeight;this.view.updateCanvasDimensions(),this.game.markBoundaries(t,e)}},{key:"stopGame",value:function(){this.view.drawFinalScreen(this.game.state.score)}}]),t}();i["default"]=c},{"./Game":3,"./View":5}],3:[function(t,e,i){"use strict";function s(t){return t&&t.__esModule?t:{"default":t}}function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(i,"__esModule",{value:!0});var a=function(){function t(t,e){for(var i=0;i<e.length;i++){var s=e[i];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(t,s.key,s)}}return function(e,i,s){return i&&t(e.prototype,i),s&&t(e,s),e}}(),r=t("./Ship"),o=s(r),h=t("./Asteroid"),u=s(h),c=function(){function t(){n(this,t)}return a(t,[{key:"markBoundaries",value:function(t,e){this.width=t,this.height=e}},{key:"setup",value:function(){this.prevUpdateTime=0,this.setupConfig(),this.setupShip(),this.setupAsteroids(),this.setupStateOfGame()}},{key:"setupConfig",value:function(){this.config=this.createConfig()}},{key:"setupShip",value:function(){var t=this.width,e=this.height,i=this.config.shipSize;this.ship=new o["default"](this.config),this.ship.body=this.ship.create(t,e,i)}},{key:"setupAsteroids",value:function(){this.allAsteroids=this.createAsteroids()}},{key:"setupStateOfGame",value:function(){this.state=this.getState()}},{key:"createConfig",value:function(){return this.config={shipSize:30,fps:60,rotationSpd:this.degreesToRadians(360),acceleration:6,braking:.7,astrSize:100,astrSpd:70,astrNum:6,bulletSpd:500}}},{key:"getState",value:function(){return{score:0,isGameOver:!1}}},{key:"newAsteroid",value:function(t,e){var i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:this.config.astrSize/2,s=Math.random()*this.config.astrSpd/this.config.fps;return{x:t,y:e,radius:i,xv:s*this.changeDirection(),yv:s*this.changeDirection()}}},{key:"moveAsteroids",value:function(t){t.forEach(function(t){t.x+=t.xv,t.y+=t.yv})}},{key:"createAsteroids",value:function(){for(var t=[],e=0;e<this.config.astrNum;e++){var i=Math.random()*this.width,s=Math.random()*this.height,n=new u["default"](this.config);t.push(n.create(i,s))}return t}},{key:"checkCollision",value:function(t,e,i){var s=this;i.forEach(function(i){var n=s.distBetweenPoints(e.x,e.y,i.x,i.y),a=e.radius+i.radius;n<a&&(t.isGameOver=!0)})}},{key:"shellHit",value:function(t,e,i){var s=this;e.forEach(function(n,a){i.forEach(function(r,o){var h=s.distBetweenPoints(n.x,n.y,r.x,r.y);h<r.radius&&(t.score+=10,s.destroyAsteroid(i,o),s.destroyBullet(e,a))})})}},{key:"removeBulletsOutOfScreen",value:function(t){var e=this;t.forEach(function(i,s){var n=i.x<0||i.x>e.width||i.y<0||i.y>e.height;n&&t.splice(s,1)})}},{key:"destroyAsteroid",value:function(t,e){var i=t[e].radius,s=this.config.astrSize;i!==s/2&&i!==s/4||this.splitInTwo(t,e),t.splice(e,1)}},{key:"destroyBullet",value:function(t,e){t.splice(e,1)}},{key:"splitInTwo",value:function(t,e){var i=t[e];t.push(this.newAsteroid(i.x,i.y,i.radius/2)),t.push(this.newAsteroid(i.x,i.y,i.radius/2))}},{key:"changeDirection",value:function(){return Math.random()<.5?1:-1}},{key:"distBetweenPoints",value:function(t,e,i,s){return Math.sqrt(Math.pow(i-t,2)+Math.pow(s-e,2))}},{key:"degreesToRadians",value:function(t){return t/180*Math.PI}},{key:"handleEdgeOfSpace",value:function(t){var e=this;t.forEach(function(t){t.x<0-t.radius?t.x=e.width+t.radius:t.x>e.width+t.radius&&(t.x=0-t.radius),t.y<0-t.radius?t.y=e.height+t.radius:t.y>e.height+t.radius&&(t.y=0-t.radius)})}},{key:"restart",value:function(){this.setupShip(),this.prevUpdateTime=0,this.setupAsteroids(),this.setupStateOfGame()}},{key:"keyDown",value:function(t){var e=this.config.rotationSpd,i=this.config.fps;switch(t.keyCode){case 13:this.state.isGameOver&&this.restart();break;case 32:this.ship.shoot();break;case 37:this.ship.body.rotation=e/i;break;case 38:this.ship.body.moving=!0;break;case 39:this.ship.body.rotation=-e/i}}},{key:"keyUp",value:function(t){switch(t.keyCode){case 37:this.ship.body.rotation=0;break;case 38:this.ship.body.moving=!1;break;case 39:this.ship.body.rotation=0}}}]),t}();i["default"]=c},{"./Asteroid":1,"./Ship":4}],4:[function(t,e,i){"use strict";function s(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(i,"__esModule",{value:!0});var n=function(){function t(t,e){for(var i=0;i<e.length;i++){var s=e[i];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(t,s.key,s)}}return function(e,i,s){return i&&t(e.prototype,i),s&&t(e,s),e}}(),a=function(){function t(e){s(this,t),this.config=e}return n(t,[{key:"create",value:function(t,e,i){return this.ship={color:"#FFCC00",x:t/2,y:e/2,fillShip:!0,size:i,radius:i/2,a:this.degreesToRadians(90),rotation:0,moving:!1,bullets:[],pos:{x:0,y:0}}}},{key:"push",value:function(){var t=this.config.acceleration,e=this.config.fps;this.ship.pos.x+=t*Math.cos(this.ship.a)/e,this.ship.pos.y-=t*Math.sin(this.ship.a)/e}},{key:"brake",value:function(){var t=this.config.fps,e=this.config.braking;this.ship.pos.x-=e*this.ship.pos.x/t,this.ship.pos.y-=e*this.ship.pos.y/t}},{key:"rotate",value:function(){this.ship.a+=this.ship.rotation}},{key:"move",value:function(){this.ship.x+=this.ship.pos.x,this.ship.y+=this.ship.pos.y}},{key:"moveBullet",value:function(){this.ship.bullets.forEach(function(t){t.x+=t.xv,t.y+=t.yv})}},{key:"shoot",value:function(){var t=this.config.fps,e=this.config.bulletSpd,i={x:this.ship.x+this.ship.radius*Math.cos(this.ship.a),y:this.ship.y-this.ship.radius*Math.sin(this.ship.a),size:2,xv:e*Math.cos(this.ship.a)/t,yv:-e*Math.sin(this.ship.a)/t};return this.ship.bullets.push(i)}},{key:"degreesToRadians",value:function(t){return t/180*Math.PI}}]),t}();i["default"]=a},{}],5:[function(t,e,i){"use strict";function s(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(i,"__esModule",{value:!0});var n=function(){function t(t,e){for(var i=0;i<e.length;i++){var s=e[i];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(t,s.key,s)}}return function(e,i,s){return i&&t(e.prototype,i),s&&t(e,s),e}}(),a=function(){function t(){s(this,t),this.setupCanvas()}return n(t,[{key:"setupCanvas",value:function(){this.container=document.getElementById("content"),this.canvas=document.getElementById("canvas"),this.ctx=this.canvas.getContext("2d"),this.updateCanvasDimensions(),this.container.append(this.canvas)}},{key:"updateCanvasDimensions",value:function(){this.canvas.width=this.container.clientWidth,this.canvas.height=this.container.clientHeight}},{key:"drawShip",value:function(t){this.ctx.strokeStyle=t.color,this.ctx.beginPath(),this.ctx.moveTo(t.x+t.radius*Math.cos(t.a),t.y-t.radius*Math.sin(t.a)),this.ctx.lineTo(t.x-t.radius*(Math.cos(t.a)+Math.sin(t.a)),t.y+t.radius*(Math.sin(t.a)-Math.cos(t.a))),this.ctx.lineTo(t.x-t.radius*(Math.cos(t.a)-Math.sin(t.a)),t.y+t.radius*(Math.sin(t.a)+Math.cos(t.a))),this.ctx.fillStyle=t.color,this.ctx.closePath(),t.fillShip?this.ctx.fill():this.ctx.stroke()}},{key:"drawAsteroids",value:function(t){var e=this,i=5;t.forEach(function(t){var s=t.radius,n=t.x,a=t.y;e.ctx.strokeStyle="white",e.ctx.beginPath(),e.ctx.moveTo(n+s*Math.cos(2*Math.PI),a+s*Math.sin(2*Math.PI));for(var r=0;r<5;r++)e.ctx.lineTo(n+s*Math.cos(2*Math.PI+r*Math.PI*2/i),a+s*Math.sin(2*Math.PI+r*Math.PI*2/i));e.ctx.closePath(),e.ctx.stroke()})}},{key:"drawBullets",value:function(t){var e=this;t.forEach(function(t){e.ctx.fillStyle="red",e.ctx.beginPath(),e.ctx.arc(t.x,t.y,t.size,0,2*Math.PI,!1),e.ctx.fill()})}},{key:"drawScore",value:function(t){this.ctx.textAlign="start",this.ctx.textBaseline="top",this.ctx.fillStyle="white",this.ctx.font='14px "Press start 2P"',this.ctx.fillText("Score: "+t,50,50)}},{key:"drawFinalScreen",value:function(t){this.clearScreen(),this.ctx.fillStyle="white",this.ctx.font='18px "Press Start 2P"',this.ctx.textAlign="center",this.ctx.textBaseline="middle",this.ctx.fillText("GAME OVER",this.canvas.width/2,this.canvas.height/2-48),this.ctx.fillText("Score: "+t,this.canvas.width/2,this.canvas.height/2),this.ctx.fillText("Press ENTER to Restart",this.canvas.width/2,this.canvas.height/2+48)}},{key:"clearScreen",value:function(){this.ctx.fillStyle="black",this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height)}}]),t}();i["default"]=a},{}],6:[function(t,e,i){"use strict";function s(t){return t&&t.__esModule?t:{"default":t}}var n=t("./Controller.js"),a=s(n);new a["default"]},{"./Controller.js":2}]},{},[6]);