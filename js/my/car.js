var container
var scene, camera, renderer

var ground, driveway, tree

var cars = [[], [], [], []];
var woods = [[], [], [], []];
var trees = [];

var car, frog, wood
var goAhead, goBack, goLeft, goRight
var sunLight, moonLight, river, water
var counter = 0

var sunR = 400;
var jumpFrame = 50;
var jumpSpeed = 0.4;
var woodR = 5;
var woodSpeed = [0.2, -0.4, 0.4, -0.2];
var woodGap = 100;
var carSpeed = [0.4, 0.8, -0.4, -0.6];
var carGap = 200;

init = () => {
    container = document.createElement( 'div' );
    document.body.appendChild( container );

    //scene
    scene = new THREE.Scene();
    //scene.background = new THREE.Color( 0xcce0ff );
    //scene.fog = new THREE.Fog( 0xcce0ff, 500, 10000 );

    //camera
    camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set( 0, 10, -5 );

    //light
    //scene.add( new THREE.AmbientLight( 0x222222 ) );
    sunLight = new THREE.DirectionalLight( 0xdfebff, 1 );
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.angle = 0;

    sunLight.shadow.camera.left = - sunR;
    sunLight.shadow.camera.right = sunR;
    sunLight.shadow.camera.top = sunR;
    sunLight.shadow.camera.bottom = - sunR;

    sunLight.shadow.camera.far = 2*sunR;

    var geometry = new THREE.SphereGeometry( 5, 32, 32 );
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    var sphere = new THREE.Mesh( geometry, material );
    sunLight.add(new THREE.Mesh(new THREE.SphereGeometry( 5, 32, 32 ), new THREE.MeshBasicMaterial({color: 0xffff00})));
    sunLight.position.set(0, sunR, 0);
    scene.add( sunLight );

    moonLight = new THREE.DirectionalLight( 0x444444, 1 );
    moonLight.castShadow = true;
    moonLight.shadow.mapSize.width = 1024;
    moonLight.shadow.mapSize.height = 1024;
    moonLight.angle = Math.PI;

    moonLight.shadow.camera.left = -sunR;
    moonLight.shadow.camera.right = sunR;
    moonLight.shadow.camera.top = sunR;
    moonLight.shadow.camera.bottom = -sunR;

    moonLight.shadow.camera.far = 2*sunR;
    moonLight.add(new THREE.Mesh(new THREE.SphereGeometry( 5, 32, 32 ), new THREE.MeshBasicMaterial({color: 0xffffff})));
    moonLight.position.set(0, -sunR, 0);
    scene.add(moonLight);


    //ground
    var loader = new THREE.TextureLoader();
    var groundTexture = loader.load( 'textures/terrain/grasslight-big.jpg' );
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set( 25, 25 );
    groundTexture.anisotropy = 16;

    var groundMaterial = new THREE.MeshLambertMaterial( { map: groundTexture } );

    ground = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2*sunR, 2*sunR ), groundMaterial );
    ground.position.y = 0;
    ground.rotation.x = - Math.PI / 2;
    ground.receiveShadow = true;
    scene.add( ground );


    //driveway
    var drivewayTexture = loader.load( 'textures/my/road.jpeg' );
    drivewayTexture.wrapS = drivewayTexture.wrapT = THREE.RepeatWrapping;
    drivewayTexture.repeat.set( 10, 1);
    drivewayTexture.anisotropy = 1;

    var drivewayMaterial = new THREE.MeshPhongMaterial( { map: drivewayTexture } );

    driveway = new THREE.Mesh( new THREE.PlaneBufferGeometry(2*sunR, 200), drivewayMaterial);
    driveway.position.y = 1;
    driveway.rotation.x = - Math.PI / 2;
    driveway.receiveShadow = true;
    scene.add(driveway);

    //river bottom
    var riverBottomTexture = loader.load( 'textures/my/river.jpeg' );
    riverBottomTexture.wrapT = riverBottomTexture.wrapS = THREE.RepeatWrapping;
    riverBottomTexture.repeat.set(4, 1);
    riverBottomTexture.anisotropy = 1;

    var riverBottomMaterial = new THREE.MeshLambertMaterial({map:riverBottomTexture});

    river = new THREE.Mesh( new THREE.PlaneBufferGeometry(2*sunR, 200), riverBottomMaterial);
    river.position.y = 1;
    river.position.z = 200;
    river.rotation.x = -Math.PI / 2;
    scene.add(river);

    // water
    var waterGeometry = new THREE.PlaneBufferGeometry( 2*sunR, 200 );

	water = new THREE.Water( waterGeometry, {
				color: '#ffffff',
				scale: 4,
				flowDirection: new THREE.Vector2( 2, 1 ),
				textureWidth: 1024,
				textureHeight: 1024
	} );

    water.position.y = 3;
    water.position.z = 200;
	water.rotation.x = Math.PI * - 0.5;
	scene.add( water );

	//tree
	var objLoader = new THREE.OBJLoader();
	var mtlLoader = new THREE.MTLLoader();
	mtlLoader.load('models/45-trees/tree01.mtl', function(material){
	    material.preload();
	    objLoader.setMaterials(material);
        objLoader.load('models/45-trees/tree01.obj', function(obj){
            //console.log(obj);
            tree = obj.children[0];
            tree.scale.set(10, 10, 10);
            tree.castShadow = true;
            //scene.add(tree);
        })
	})

	//wood
	wood = new THREE.Group();
    var wood_sides_geo =  new THREE.CylinderGeometry( woodR, woodR, 40, 100.0, 10.0, true );
    var wood_cap_geo = new THREE.Geometry();
    for (var i=0; i<100; i++) {
        var a = i * 1/100 * Math.PI * 2;
        var z = Math.sin(a);
        var x = Math.cos(a);
        var a1 = (i+1) * 1/100 * Math.PI * 2;
        var z1 = Math.sin(a1);
        var x1 = Math.cos(a1);
        wood_cap_geo.vertices.push(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(x*woodR, 0, z*woodR),
            new THREE.Vector3(x1*woodR, 0, z1*woodR)
        );
        wood_cap_geo.faceVertexUvs[0].push([
            new THREE.Vector2(0.5, 0.5),
            new THREE.Vector2(x/2+0.5, z/2+0.5),
            new THREE.Vector2(x1/2+0.5, z1/2+0.5)
        ]);
        wood_cap_geo.faces.push(new THREE.Face3(i*3, i*3+1, i*3+2));
    }

    var wood_sides_texture = loader.load("textures/my/wood1.jpeg");
    var wood_cap_texture = loader.load("textures/my/wood2.jpeg");


    var wood_sides_mat = new THREE.MeshLambertMaterial({map:wood_sides_texture});
    var wood_sides = new THREE.Mesh( wood_sides_geo, wood_sides_mat );

    var wood_cap_mat = new THREE.MeshLambertMaterial({map:wood_cap_texture});
    var wood_cap_top = new THREE.Mesh( wood_cap_geo, wood_cap_mat );
    var wood_cap_bottom = new THREE.Mesh( wood_cap_geo, wood_cap_mat );
    wood_cap_top.position.y = 20;
    wood_cap_bottom.position.y = -20;
    wood_cap_top.rotation.x = Math.PI;

    wood.add(wood_sides);
    wood.add(wood_cap_top);
    wood.add(wood_cap_bottom);
    wood.rotation.z = Math.PI / 2;
    wood.position.set(0, 5, 200);
    for (var i = 0; i < 4; i++){
        for (var j = 0; j < (2*sunR / woodGap); j++){
            var newWood = wood.clone();
            newWood.position.set(j*woodGap - sunR, 5, 125 + 50*i);
            woods[i].push(newWood);
            scene.add(newWood);
        }
    }
    //scene.add(wood);

    //car
    THREE.DRACOLoader.setDecoderPath( 'js/libs/draco/gltf/' );

	var loader = new THREE.GLTFLoader();
	loader.setDRACOLoader( new THREE.DRACOLoader() );
	loader.load( 'models/CesiumMilkTruck/glTF-Draco/CesiumMilkTruck.gltf', function ( gltf ) {
	    car = gltf.scene.children[0];
		car.position.set( 0, 0, 20 );
		car.scale.set( 10, 10, 10 );
		//car.castShadow = true;
		car.children.forEach((d)=>{d.castShadow=true;})

		var geometry = new THREE.BoxGeometry( 0.1, 0.4, 0.2 );
        var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        var leftLight = new THREE.Mesh( geometry, material );
        leftLight.position.set(2.4, 1.0, 0.8);
        car.add( leftLight );

        rightLight = leftLight.clone();
        rightLight.position.set(2.4, 1.0, -0.8);
        car.add( rightLight );

		var leftSpotLight = new THREE.SpotLight( 0xffff00, 1);
        leftSpotLight.position.set( 2.4, 1.0, 0.8 );
        leftSpotLight.angle = Math.PI / 10
        leftSpotLight.target.position.set(3.0, 1.0, 0.8)
        leftSpotLight.decay = 2
        leftSpotLight.castShadow = false;
        leftSpotLight.shadow.mapSize.width = 1024;
        leftSpotLight.shadow.mapSize.height = 1024;

        leftSpotLight.shadow.camera.near = 1;
        leftSpotLight.shadow.camera.far = 400;
        //leftSpotLight.shadow.camera.fov = 30;

        //car.add(leftSpotLight);
        //car.add(leftSpotLight.target);

        var rightSpotLight = leftSpotLight.clone()
        rightSpotLight.position.set( 2.4, 1.0, -0.8 );
        rightSpotLight.target.position.set(3.0, 1.0, -0.8);

        //car.add(rightSpotLight);
        //car.add(rightSpotLight.target);

		for (var i = 0; i < 4; i++){
		    for (var j = 0; j < (2*sunR / carGap); j++){
		        var newCar = car.clone();
		        newCar.position.set(carGap*j-sunR, 0, -75+i*50);
		        if (carSpeed[i] < 0)
		            newCar.rotation.y = Math.PI
		        cars[i].push(newCar);
		        scene.add(newCar);
		    }
		}
		//scene.add( car );

	}, undefined, function ( e ) {console.error( e );});

	//frog
	loader.load('models/frog/Frog.gltf', function (gltf) {
	    frog = gltf.scene.children[0];
	    frog.position.set(0, 1, -100);
	    frog.rotation.y = -Math.PI / 2;
	    frog.scale.set (0.1, 0.1, 0.1);
	    //frog.castShadow = true;
	    frog.children.forEach((d)=>{d.castShadow=true;});
        frog.jump = (direction, counter) => {
            if (direction == 'ahead'){
                y = (x) => {return 0.01*x*(x-jumpFrame);};
                frog.position.z += jumpSpeed;
                frog.position.y += (y(counter) - y(counter-1))
            }
            else if (direction == 'back'){
                y = (x) => {return 0.01*x*(x-jumpFrame);};
                frog.position.z -= jumpSpeed;
                frog.position.y += (y(counter) - y(counter-1))
            }
            else if (direction == 'left'){
                y = (x) => {return 0.01*x*(x-jumpFrame);};
                frog.position.x += jumpSpeed;
                frog.position.y += (y(counter) - y(counter-1))
            }
            else if (direction == 'right'){
                y = (x) => {return 0.01*x*(x-jumpFrame);};
                frog.position.x -= jumpSpeed;
                frog.position.y += (y(counter) - y(counter-1))
            }
        }
	    scene.add(frog);
	})

    //renderer
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;


    // controls
    var controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.maxPolarAngle = Math.PI * 0.5;
    controls.minDistance = 1000;
    controls.maxDistance = 5000;

    //render
    renderer.render( scene, camera );

    //interaction
    document.addEventListener('keydown', (event) => {
        if (counter > 0){
            return;
        }
        else{
            counter = jumpFrame;
            goAhead = goBack = goLeft = goRight = false
            if (event.code == 'KeyW')
                goAhead = true
            else if (event.code == 'KeyS')
                goBack = true
            else if (event.code == 'KeyA')
                goLeft = true
            else if (event.code == 'KeyD')
                goRight = true
        }
    })
    //document.addEventListener('keyup', (event) => {if (event.code == 'KeyW') goAhead = false;})
}

carMoving = () => {
    for(var i = 0; i < 4; i++){
        cars[i].forEach((car) => {
            car.position.x += carSpeed[i]
            if (car.position.x > sunR-20 && carSpeed[i] > 0){
                car.position.x -= 2*sunR;
            }
            else if (car.position.x < -sunR+20 && carSpeed[i] < 0){
                car.position.x += 2*sunR;
            }
            /*
            if (sunLight.position.y > 0){
                car.children[7].color.setHex(0x000000);
                car.children[9].color.setHex(0x000000);
            }
            else{
                car.children[7].color.setHex(0xffff00);
                car.children[9].color.setHex(0xffff00);
            }
            console.log(car.position);
            */
        })
    }
}

sunMoving = () => {
    sunLight.position.set(sunR*Math.cos(sunLight.angle), sunR*Math.sin(sunLight.angle),0);
    moonLight.position.set(sunR*Math.cos(moonLight.angle), sunR*Math.sin(moonLight.angle),0);
    sunLight.angle += 0.1/180*Math.PI;
    moonLight.angle += 0.1/180*Math.PI;
}

frogMoving = () => {
    if (counter > 0) {
        if (goAhead)
            frog.jump('ahead', counter);
        else if (goBack)
            frog.jump('back', counter);
        else if (goLeft)
            frog.jump('left', counter);
        else if (goRight)
            frog.jump('right', counter);
        counter -= 1;
    }
}

woodMoving = () => {
    for (var i = 0; i < 4; i++){
        woods[i].forEach((wood) => {
            wood.position.x += woodSpeed[i];
            if (wood.position.x > sunR-20 && woodSpeed[i] > 0)
                wood.position.x -= (2*sunR);
            else if (wood.position.x < -sunR+20 && woodSpeed[i] < 0)
                wood.position.x += (2*sunR);
        })
    }
    //wood.position.x -= woodSpeed;
}

crashCheck = () => {
    var dz = Math.abs(frog.position.z - car.position.z);
    var dx = Math.abs(frog.position.x - car.position.x);
    if (dx < 36 && dz < 24){
        return true;
    }
    return false;
}

animate = () => {
    requestAnimationFrame( animate );
    carMoving();
    woodMoving();
    sunMoving();
    frogMoving();
    if (crashCheck()){
        console.log("fail");
        frog.position.set(0, 1, -100);
        counter = 0;
    }
    renderer.render( scene, camera );

}

init();
animate();