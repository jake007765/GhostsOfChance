let _dungeonRenderer;

function DungeonRenderer(container, atlasFilename, jsonFilename, mapData) {

    _dungeonRenderer = this;

    this.container = document.getElementById(container);
    this.container.innerHTML = "";
    this.atlasFilename = atlasFilename;
    this.jsonFilename = jsonFilename;
    this.dungeon = null;
    this.atlasImage = null;

    this.canvas = null;
    this.ctx = null;

    this.wallLayers = [];
    this.floorLayers = [];
    this.ceilingLayers = [];
    this.images = [];

    this.imagesLoaded = 0;
    this.numberOfImagesToLoad = 0;
    this.mapSize = 16;
    this.map = mapData;
    this.player = {x: 1, y: 2, dir: 0};

    this.directions = [
        {x: 0, y: -1},
        {x: 1, y: 0},
        {x: 0, y: 1},
        {x: -1, y: 0}
    ]

    this.fetchJSONFile(jsonFilename, function(caller, obj){
        caller.dungeon = obj;
        caller.loadAtlasImage();
    });

}

DungeonRenderer.prototype.loadAtlasImage = function() {
    var caller = this;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', this.atlasFilename, true);
    xhr.onload = function(){
        var response = xhr.responseText;
        var binary = ""
        for(i=0;i<response.length;i++){
            binary += String.fromCharCode(response.charCodeAt(i) & 0xff);
        }
        caller.atlasImage = new Image();
        caller.atlasImage.onload = function() {
            caller.generateImages();
        }
        caller.atlasImage.src = 'data:image/jpeg;base64,' + btoa(binary);
    }
    xhr.overrideMimeType('text/plain; charset=x-user-defined');
    xhr.send();
}


DungeonRenderer.prototype.fetchJSONFile = function (path, callback) {
    var httpRequest = new XMLHttpRequest();
    var caller = this;
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {
            var status = httpRequest.status;
            if (status === 0 || (status >= 200 && status < 400)) {
                var obj = JSON.parse(httpRequest.responseText);
                if (callback) callback(caller, obj);
            }
        }
    };
    httpRequest.open('GET', path);
    httpRequest.send();
}

DungeonRenderer.prototype.ready = function() {

    this.wallLayers = this.getLayersOfType("Walls");
    this.floorLayers = this.getLayersOfType("Floor");
    this.ceilingLayers = this.getLayersOfType("Ceiling");

    this.createDisplay();
    this.render();
}

DungeonRenderer.prototype.createDisplay = function() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = 320;
    this.canvas.height = 256;
    this.ctx = this.canvas.getContext("2d");
    this.container.appendChild(this.canvas);
}

DungeonRenderer.prototype.generateImages = function() {

    var atlasCanvas = document.createElement("canvas");
    atlasCanvas.width = this.atlasImage.width;
    atlasCanvas.height = this.atlasImage.height;
    var atlasCtx = atlasCanvas.getContext("2d");
    atlasCtx.drawImage(this.atlasImage, 0, 0);

    this.images = new Array(this.dungeon.layers.length);
    this.numberOfImagesToLoad = 0;

    this.dungeon.layers.forEach((layer, layerIndex) => {
        this.numberOfImagesToLoad += layer.tiles.length;
    });

    this.dungeon.layers.forEach((layer, layerIndex) => {
        this.images[layerIndex] = new Array(layer.tiles.length);
        layer.tiles.forEach((entry, i) => {
            this.images[layerIndex][i] = entry;
            var imageData = atlasCtx.getImageData(entry.coords.x, entry.coords.y, entry.coords.w, entry.coords.h);
            var tmpCanvas = document.createElement("canvas");
            tmpCanvas.width = entry.coords.w;
            tmpCanvas.height = entry.coords.h;
            var tmpCtx = tmpCanvas.getContext("2d");
            if (entry.flipped) {
                var data = this.flipImage(entry.coords.w, entry.coords.h, imageData.data);
                imageData.data.set(data);
            }
            tmpCtx.putImageData(imageData, 0, 0);
            var img = new Image();
            this.images[layerIndex][i].image = img;
            img.src = tmpCanvas.toDataURL("image/png");
            img.onload = this.onImageLoaded;
        });
    });

}

DungeonRenderer.prototype.onImageLoaded = function() {
    _dungeonRenderer.imagesLoaded++;
    if (_dungeonRenderer.imagesLoaded >= _dungeonRenderer.numberOfImagesToLoad) {
        _dungeonRenderer.ready();
    }
}

DungeonRenderer.prototype.getImage = function(layerIndex, type, x, z) {
    for(var i=0;i<this.images[layerIndex].length;i++) {
        var entry = this.images[layerIndex][i];
        if (entry.type == type && entry.tile.x == x && entry.tile.z == z) {
            return entry;
        }
    }
    return null;
}

DungeonRenderer.prototype.flipImage = function(w, h, data) {
  var flippedData = new Uint8Array(w * h * 4);
  for (let col = 0; col < w ; col++) {
      for (let row = 0; row < h; row++) {
          var index = (((w-1)-col)*4) + (row * w * 4);
          var index2 = col*4 + (row * w * 4);
          flippedData[index2] = data[index];
          flippedData[index2+1] = data[index+1];
          flippedData[index2+2] = data[index+2];
          flippedData[index2+3] = data[index+3];
      }
  }
  return flippedData;
}

DungeonRenderer.prototype.getLayersOfType = function(type) {

    var result = [];

    this.dungeon.layers.forEach((layer, layerIndex) => {
        if (layer.type == type) {
            layer.index = layerIndex;
            result.push(layer);
        }
    });

    return result;

}

DungeonRenderer.prototype.canMove = function(x,y) {
    return (this.map[y][x] == 0);
}

DungeonRenderer.prototype.moveForward = function() {

    var vector = this.directions[this.player.dir];

    if (!this.canMove(this.player.x + vector.x, this.player.y + vector.y)) {
        return;
    }

    this.player.x += vector.x;
    this.player.y += vector.y;

    if (this.player.x < 1) { this.player.x = 1; }
    if (this.player.y < 1) { this.player.y = 1; }

    this.render();

}

DungeonRenderer.prototype.moveBackward = function() {

    var vector = this.directions[this.player.dir];

    if (!this.canMove(this.player.x - vector.x, this.player.y - vector.y)) {
        return;
    }

    this.player.x -= vector.x;
    this.player.y -= vector.y;

    if (this.player.x < 1) { this.player.x = 1; }
    if (this.player.y < 1) { this.player.y = 1; }

    this.render();

}

DungeonRenderer.prototype.turnLeft = function() {

    this.player.dir--;
    if (this.player.dir < 0) { this.player.dir = 3; }
    this.render();

}

DungeonRenderer.prototype.turnRight = function() {

    this.player.dir++;
    if (this.player.dir > 3) { this.player.dir = 0; }
    this.render();

}

DungeonRenderer.prototype.drawSides = function(z) {

    for(var x = -(this.dungeon.width-1); x <= this.dungeon.width-1; x++) {

        switch(this.player.dir) {
            case 0: {
                var px = this.player.x + x;
                var py = this.player.y + z;
            } break;
            case 1: {
                var px = this.player.x - z;
                var py = this.player.y + x;
            } break;
            case 2: {
                var px = this.player.x - x;
                var py = this.player.y - z;
            } break;
            case 3: {
                var px = this.player.x + z;
                var py = this.player.y - x;
            } break;
        }

        if ((px >= 0) && (py >= 0) && (px < this.mapSize) && (py < this.mapSize)) {
            if (this.map[py][px] == 1) {
                this.wallLayers.forEach((layer, layerIndex) => {
                    if (result = this.getImage(layer.index, "side", x, z)) {
                        if (result.flipped) {
                            var dx = result.screen.x - result.coords.w;
                            var dy = result.screen.y;
                            this.ctx.drawImage(result.image, dx,dy);
                        } else {
                            var dx = result.screen.x;
                            var dy = result.screen.y;
                            this.ctx.drawImage(result.image, dx,dy);
                        }
                    }
                });
            }
        }

    }

}

DungeonRenderer.prototype.drawFronts = function(z) {

    for(var x = -(this.dungeon.width-1); x <= this.dungeon.width-1; x++) {

        switch(this.player.dir) {
            case 0: {
                var px = this.player.x + x;
                var py = this.player.y + z;
            } break;
            case 1: {
                var px = this.player.x - z;
                var py = this.player.y + x;
            } break;
            case 2: {
                var px = this.player.x - x;
                var py = this.player.y - z;
            } break;
            case 3: {
                var px = this.player.x + z;
                var py = this.player.y - x;
            } break;
        }

        if ((px >= 0) && (py >= 0) && (px < this.mapSize) && (py < this.mapSize)) {
            if (this.map[py][px] == 1) {
                this.wallLayers.forEach((layer, layerIndex) => {
                    if (layer.type == "Walls") {
                        if (result = this.getImage(layer.index, "front", 0, z)) {
                            var dx = result.screen.x + (x * result.coords.fullWidth);
                            var dy = result.screen.y;
                            this.ctx.drawImage(result.image, dx,dy);
                        }
                    }
                });
            }
        }

    }

}

DungeonRenderer.prototype.cls = function() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
}

DungeonRenderer.prototype.render = function() {

    this.cls();

    if (this.floorLayers.length > 0) {
        this.floorLayers.forEach((layer, i) => {
            if (result = this.getImage(layer.index, "floor", -1, -1)) {
                this.ctx.drawImage(result.image, result.screen.x,result.screen.y);
            }
        });
    }

    if (this.ceilingLayers.length > 0) {
        this.ceilingLayers.forEach((layer, i) => {
            if (result = this.getImage(layer.index, "ceiling", -1, -1)) {
                this.ctx.drawImage(result.image, result.screen.x,result.screen.y);
            }
        });
    }

    for(var z = -this.dungeon.depth; z <= 0 ; z++) {
        this.drawSides(z);
        this.drawFronts(z);
    }

}
