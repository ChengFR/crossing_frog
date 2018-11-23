# 3D Crossing Frog

### Overview

The project aims to design and implement a 3D game called "Crossing Frog". The player controls a frog to cross lanes to reach the goal without being hit by the cars running through the lanes. The game will base on browsers and be implemented on WebGL and three.js.

### Design Description

##### Game Design

This part is about the logic of the game. The frog can move in four directions in the plane. If the frog reach the goal without being hit by any car, the player win, otherwise, fail.

##### Model Design

Models in this games include object models and scene models, like car models and road models. Our design will base on the model resources from the library. 

##### Shading and Shadowing Design

We tend to build a cartoon-like scene. The textures and the lighting will be set properly for building such a cartoon-like scene. And we will add front-lights for cars. Those moving light sources will increase the difficulty of lighting and shadowing but also improve the rendering results.

### Implementation

The implementation of our project will base on WebGL and three.js. The implementation is divided into 5 stages: modeling, lighting & shadow, surface texture, insteraction, and refinement. Each stage will be introduced in the following content. In the modeling stage, we will focus on the geometry part of the game. We will search for models and scenes from library and set the meshes and the camera in the proper location. We will improve the lighting part of shading in lighting stage and add textures to mesh surfaces in texture stage. In insteraction stage, we will add interaction for the frog's movement with the keyboard input. In the last stage, refinement, we will improve our work based on the actual result.

### Schedule

* Modeling stage -- find model resources and set the scene with simple shading                      by 13th Nov
* Lighting stage -- improve the lighting part of shading                                                                   by 17th Nov
* Texture stage -- add textures to surfaces                                                                                         by 20th Nov
* Interaction stage -- add interaction and animation                                                                        by 24th Nov
* Refinement stage -- refine and make a video                                                                                  by 27th Nov