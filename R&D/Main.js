
class Main {

    GenerateMap() {

        var mapData = [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1],
            [1,0,1,1,1,1,0,1,0,0,0,1,0,1,1,1],
            [1,1,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
            [1,0,0,0,1,0,1,0,1,0,1,0,1,1,0,1],
            [1,0,1,0,1,0,1,1,1,0,1,0,1,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,1,0,1,0,0,0,1,1,1,0,0,0,0,1],
            [1,0,0,1,1,0,0,0,1,0,0,0,0,1,0,1],
            [1,0,0,0,0,0,1,0,0,1,0,0,1,1,0,1],
            [1,1,0,1,1,0,1,0,1,1,0,0,0,0,0,1],
            [1,0,0,0,1,0,0,0,0,0,0,1,1,0,1,1],
            [1,0,1,0,1,0,0,1,0,0,0,1,1,0,0,1],
            [1,1,1,0,0,0,1,1,1,0,1,1,0,0,0,1],
            [1,0,0,0,1,0,0,1,0,0,0,0,0,1,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ];
        
        var dungeonRenderer = new DungeonRenderer("container", "./atlas.png", "./atlas.json", mapData);
        
        var lastKeyDown = null;
        
        document.body.onkeydown = function(event) {
        
            if (lastKeyDown != event.which) {
                switch(event.which) {
                    case 37: case 103: case 81: {
                        dungeonRenderer.turnLeft();
                        lastKeyDown = event.which;
                        event.preventDefault();
                    } break;
                    case 39: case 105: case 69: {
                        dungeonRenderer.turnRight();
                        lastKeyDown = event.which;
                        event.preventDefault();
                    } break;
                    case 38: case 104: case 87: {
                        dungeonRenderer.moveForward();
                        lastKeyDown = event.which;
                        event.preventDefault();
                    } break;
                    case 40: case 101: case 83: {
                        dungeonRenderer.moveBackward();
                        lastKeyDown = event.which;
                        event.preventDefault();
                    } break;
                }
            }
        
        };
        
        document.body.onkeyup = function(event) {
            if (lastKeyDown == event.which) {
                lastKeyDown = null
            }
        };
                    
    }

}

