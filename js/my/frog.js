var container;
var scene, camera, renderer;

var ground;

let controls,
    mouseDown,
    world,
    night = false;

let sheep;

let width,
    height;


init = () => {
    container = document.createElement( 'div' );
    document.body.appendChild( container );

    //scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xcce0ff );
    scene.fog = new THREE.Fog( 0xcce0ff, 500, 10000 );

    //camera
    camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 10000 );
    // camera.position.set( 1000, 50, 1500 );
    camera.position.set(0, 10, 20);

    //light
    scene.add( new THREE.AmbientLight( 0x666666 ) );
    var light = new THREE.DirectionalLight( 0xdfebff, 1 );
    light.position.set( 50, 200, 100 );
    light.position.multiplyScalar( 1.3 );
    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;

    var d = 300;
    light.shadow.camera.left = - d;
    light.shadow.camera.right = d;
    light.shadow.camera.top = d;
    light.shadow.camera.bottom = - d;
    light.shadow.camera.far = 1000;

    scene.add( light );

    //ground
    var loader = new THREE.TextureLoader();
    var groundTexture = loader.load( 'textures/terrain/grasslight-big.jpg' );
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set( 25, 25 );
    groundTexture.anisotropy = 16;

    var groundMaterial = new THREE.MeshLambertMaterial( { map: groundTexture } );

    ground = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20000, 20000 ), groundMaterial );
    ground.position.y = - 250;
    ground.rotation.x = - Math.PI / 2;
    ground.receiveShadow = true;
    scene.add( ground );

    //renderer
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.shadowMap.enabled = true;

    // controls
    var controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.maxPolarAngle = Math.PI * 0.5;
    // controls.minDistance = 1000;
    // controls.maxDistance = 5000;
    controls.enableZoom = false;

    drawSheep();

    // world = document.querySelector('.world');
    // world.appendChild(renderer.domElement);

    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    //render
    renderer.render( scene, camera );
}

animate = () => {
    requestAnimationFrame( animate );
    sheep.jumpOnMouseDown();
    renderer.render( scene, camera );
}


function drawSheep() {
  sheep = new Sheep();
  scene.add(sheep.group);
}

function onMouseDown(event) {
  mouseDown = true;
}

function onMouseUp() {
  mouseDown = false;
}


class Sheep {
  constructor() {
      this.group = new THREE.Group();
      this.group.position.y = 0.4;

      this.woolMaterial = new THREE.MeshStandardMaterial({
          color: 0x005200,
          roughness: 1,
          shading: THREE.FlatShading
      });
      this.skinMaterial = new THREE.MeshStandardMaterial({
          color: 0x00a300,
          roughness: 1,
          shading: THREE.FlatShading
      });
      this.darkMaterial = new THREE.MeshStandardMaterial({
          color: 0x001200,
          roughness: 1,
          shading: THREE.FlatShading
      });

      this.vAngle = 0;

      this.drawHead();
      this.drawLegs();
  }
  drawHead() {
    const head = new THREE.Group();
    // head.position.set(0, 0, 0);
    head.rotation.x = rad(-20);
    this.group.add(head);

    var bodyGeometry = new THREE.CylinderGeometry( 0.1*3, 0.3*3, 0.5 * 3, 4 );
    var body = new THREE.Mesh( bodyGeometry, this.woolMaterial );
    body.rotation.x = rad(-90);
    body.castShadow = true;
    body.receiveShadow = true;
    head.add(body);

    const foreheadGeometry = new THREE.CylinderGeometry( 0, 0.3*3, 0.5 * 3, 4 );
    const forehead = new THREE.Mesh(foreheadGeometry, this.skinMaterial);
    forehead.castShadow = true;
    forehead.receiveShadow = true;
    forehead.position.z = 1.5;
    forehead.rotation.x = rad(90);
    head.add(forehead);

    const rightEyeGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 6);
    const rightEye = new THREE.Mesh(rightEyeGeometry, this.darkMaterial);
    rightEye.castShadow = true;
    rightEye.receiveShadow = true;
    rightEye.position.set(0.35, 0.3, 1.3);
    rightEye.rotation.set(-90, -60, 40);
    head.add(rightEye);

    const leftEye = rightEye.clone();
    leftEye.position.x = -rightEye.position.x;
    leftEye.rotation.set(-90, 60, -40);
    // leftEye.rotation.z = -rightEye.rotation.z;
    head.add(leftEye);

  }
  drawLegs() {
    const legGeometry = new THREE.CylinderGeometry(0.21, 0.15, 0.6, 4);
    legGeometry.translate(0, -0.5, 0);
    this.frontRightLeg = new THREE.Mesh(legGeometry, this.darkMaterial);
    this.frontRightLeg.castShadow = true;
    this.frontRightLeg.receiveShadow = true;
    this.frontRightLeg.position.set(0.5, -0.3, 0.5);
    this.frontRightLeg.rotation.x = rad(-80);
    this.group.add(this.frontRightLeg);

    this.frontLeftLeg = this.frontRightLeg.clone();
    this.frontLeftLeg.position.x = -this.frontRightLeg.position.x;
    this.frontLeftLeg.rotation.z = -this.frontRightLeg.rotation.z;
    this.group.add(this.frontLeftLeg);

    const backLegGeometry = new THREE.CylinderGeometry(0.21, 0.15, 0.8, 4);
    backLegGeometry.translate(0, -0.5, 0);
    this.backRightLeg = new THREE.Mesh(backLegGeometry, this.darkMaterial);
    this.backRightLeg.position.set(0.5, -0.3, 0.5);
    this.backRightLeg.position.z = -this.frontRightLeg.position.z;
    this.backRightLeg.rotation.x = this.frontRightLeg.rotation.x;
    this.group.add(this.backRightLeg);

    this.backLeftLeg = new THREE.Mesh(backLegGeometry, this.darkMaterial);
    this.backLeftLeg.position.set(-0.5, -0.3, 0.5);
    this.frontLeftLeg.rotation.z = -this.frontRightLeg.rotation.z;
    this.backLeftLeg.position.z = -this.frontLeftLeg.position.z;
    this.backLeftLeg.rotation.x = this.frontLeftLeg.rotation.x;
    this.group.add(this.backLeftLeg);
  }
  jump(speed) {
    this.vAngle += speed;
    this.group.position.y = Math.sin(this.vAngle) + 1.38;

    const legRotation = Math.sin(this.vAngle) * Math.PI / 6 + 0.4;

    this.frontRightLeg.rotation.z = legRotation;
    this.backRightLeg.rotation.z = legRotation;
    this.backRightLeg.rotation.y = legRotation;
    this.frontLeftLeg.rotation.z = -legRotation;
    this.backLeftLeg.rotation.z = -legRotation;
    this.backLeftLeg.rotation.y = -legRotation;
  }
  jumpOnMouseDown() {
    if (mouseDown) {
      this.jump(0.1);
    } else {
      if (this.group.position.y <= 0.4) return;
      this.jump(0.12);
    }
  }
}


function rad(degrees) {
  return degrees * (Math.PI / 180);
}




init();
animate();