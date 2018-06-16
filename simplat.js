var c = document.getElementById('simCanvas');
var ctx = c.getContext("2d");

var basePath = "";
var baseModule = 'simplat'
var moduleName = "";

var drawSpeed = 100;
var loadedFiles = 0;
var totalFiles = 2;
var imagesLoaded = 0;
var pixSize = 10;
var tileWidth = 0;
var tileHeight = 0;

var firstRun = false;
var prefLoaded = false;
var levelsLoaded = false;

var keys = [];
var tiles = [];
var curLevel = [];

var prefs = {};
var levels = {};
var textures = {};
var allLevelDataJSON = {};


c.width = window.innerWidth;
c.height = window.innerHeight;

console.log('hello world, variables set');


function preload() {

  preLoadStart();

  function preLoadStart() {
    if (firstRun === false) {
      var drawTimeout = setTimeout(preLoadLoop, 200);
    }

    function preLoadLoop() {
      //first load prefs
      console.log('getting levels');
      loadJSON('data/' + baseModule + '/levels.json',
        function(data) {
          if (!prefLoaded) {
            levels = data;
            prefLoaded = true;
            loadedFiles++;
            //console.log(loadedFiles);
          }
        },
        function(xhr) {}
      );

      console.log('getting textures');
      //load levels json from the module name specified in the prefs file
      loadJSON('data/' + baseModule + '/textures.json',
        function(data) {
          if (!levelsLoaded) {
            textures = data;
            levelsLoaded = true;
            //console.log(loadedFiles);
          }
        },
        function(xhr) {}
      );

      if (levelsLoaded && prefLoaded) {
        firstRun = true;
        setup();
      } else if (loadedFiles < totalFiles) {
        preLoadStart();
      }


    }
  }
}

document.addEventListener('keydown', function(event) {
  keys[event.keyCode] = true;
  console.log(event.key);
});
document.addEventListener('keyup', function(event) {
  keys[event.keyCode] = false;
});

console.log('added key listener');

// start setup

function setup() {
  // for (var i = 1; i < allLevelDataJSON['textureFilenameMax'] + 1; i++) {
  //
  //
  //           ctx.drawImage(tiles[i - 1], i * 10,0);
  //           console.log('drew ' + i);
  //
  //
  //      console.log(window.location.protocol + window.location.hostname + ':8000' + '/data/' + moduleName + '/textures/' + i + '.png');
  //
  // }

  console.log(levels);
  console.log(textures);

  curLevel = levels['level1'].split('%');


}

function draw() {


  for (var i = 0; i < curLevel.length; i++) {
    var renderStrip = curLevel[i].split('.');

    for (var j = 0; j < renderStrip.length; j++) {
      //console.log(renderStrip[j]);
      drawTexture(j * pixSize * textures.textureWidth,
        i * pixSize * textures.textureHeight,
        renderStrip[j]);

    }
  }

}

function loadJSON(path, success, error) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        if (success)
          success(JSON.parse(xhr.responseText));
      } else {
        if (error)
          error(xhr);
      }
    }
  };
  xhr.open("GET", path, true);
  xhr.send();
}

drawStart();

function drawStart() {
  var drawTimeout = setTimeout(drawLoop, drawSpeed);

  function drawLoop() {

    draw();
    drawStart();
  }
}

function drawTexture(x, y, textureID) {
  var texDataRaw = textures[textureID];
  var texData = texDataRaw.split('.');
  //console.log(texData);

  for (var i = 0; i < textures.textureWidth; i++) {
    for (var j = 0; j < textures.textureHeight; j++) {

      if (textureID == 1) {
        console.log(textures.colorIndex[texData[i + j * textures.textureWidth]]);
      }

      if (textures.colorIndex[texData[i + j * textures.textureWidth]] == "alpha") {
        ctx.fillStyle = textures.background;
        ctx.fillRect(i * pixSize + x, j * pixSize + y, pixSize, pixSize);
      } else {
        ctx.fillStyle = textures.colorIndex[texData[i + j * textures.textureWidth]];
        ctx.fillRect(i * pixSize + x, j * pixSize + y, pixSize, pixSize);
      }


    }
  }
}
