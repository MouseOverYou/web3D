var canvas = document.getElementById("renderCanvas");

var engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
var oscar_P
var delayCreateScene = function () {
    
    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI/2, Math.PI/2, 80, new BABYLON.Vector3(0, 10, 0), scene);
    camera.attachControl(canvas, true);
    
    var mainLight = new BABYLON.DirectionalLight("mainLight", new BABYLON.Vector3(0,-1, 0.45), scene);
    mainLight.position = new BABYLON.Vector3(0,4,0);
    mainLight.intensity = 0

    var assetsManager = new BABYLON.AssetsManager(scene)

    //ENV TASK
    var envTask = assetsManager.addCubeTextureTask("envTask", "./assets/environment.dds");

    envTask.onSuccess = function (task) {
        //alert('HDR LOADED');
        hdrTexture = new BABYLON.CubeTexture.CreateFromPrefilteredData("./assets/environment.dds", scene);

        // Create Skybox
        var hdrSkybox = BABYLON.Mesh.CreateBox("hdrSkyBox", 1000.0, scene);
        hdrSkybox.visibility = 1
        var hdrSkyboxMaterial = new BABYLON.PBRMaterial("skyBox", scene);
        hdrSkyboxMaterial.backFaceCulling = false;
        hdrSkyboxMaterial.microSurface = 1.0;
        hdrSkyboxMaterial.disableLighting = true;
        hdrSkybox.material = hdrSkyboxMaterial;
        hdrSkybox.infiniteDistance = false;

    }
    envTask.onError = function (task, message, exception) {
        console.log(message, exception);
    }
    
    oscar_P = new BABYLON.TransformNode("oscar_P");
    SceneMeshes = new BABYLON.TransformNode("SceneMeshes");
    console.log("LoadMeshes called")

    //SlotMachine
    oscarMeshTask = assetsManager.addMeshTask("", "", "./assets/oscar.glb")

    oscarMeshTask.onSuccess = function (task) {
        
        //task.loadedMeshes[0].position.x = 0
        task.loadedMeshes[0].parent = oscar_P
        //oscar_P.rotation.y = Math.PI*2
        console.log(task.loadedMeshes[0])
    }

    oscarMeshTask.onError = function (task, message, exception) {
        console.log(message, exception);
    }

    assetsManager.onFinish = function (task) {
        scene.getMaterialByName("Award-Statue-Metal-01").reflectionTexture = hdrTexture
        scene.getMaterialByName("Award-Statue-Metal-01").albedoColor = new BABYLON.Color3.FromHexString("#F0DF7D")
        scene.getMaterialByName("Award-Statue-Metal-01").metallic = 1
        scene.getMaterialByName("Award-Statue-Metal-02").reflectionTexture = hdrTexture

    }

    assetsManager.load();


    return scene;
};

//engine = createDefaultEngine();
if (!engine) throw 'engine should not be null.';
scene = delayCreateScene();
//scene.debugLayer.show();


engine.runRenderLoop(function () {
    if (scene) {
        scene.render();
    }
});

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});
