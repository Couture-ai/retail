import { File } from "@/types";

export const mockDocuments: File[] = [
  {
    id: "project",
    name: "Project",
    type: "folder",
    expanded: true,
    children: [
      {
        id: "solar-system",
        name: "Solar System",
        type: "folder",
        expanded: true,
        parentId: "project",
        children: [
          {
            id: "overview",
            name: "Overview.md",
            type: "file",
            parentId: "solar-system",
            content: `# Solar System Simulator - Project Overview

This document outlines the key components and goals of our Solar System Simulator educational project. The purpose of this application is to create an interactive, educational tool that helps students learn about our solar system.

## Project Goals

- Create an accurate visual representation of our solar system
- Provide educational information about each celestial body
- Demonstrate orbital mechanics and planetary motion
- Allow for interactive exploration and learning
- Support multiple education levels with adjustable complexity

## Key Features

### 1. 3D Visualization
The core of our application will be a 3D visualization of the solar system, built using Three.js. This will allow users to:
- View planets and their relative sizes
- Observe orbital paths and movements
- Zoom in/out and rotate the view
- Select individual planets for more information

### 2. Educational Content
For each celestial body, we will provide comprehensive educational information:
- Physical characteristics (size, mass, composition)
- Orbital properties (distance from sun, period, eccentricity)
- Surface features and atmospheric conditions
- Historical discovery and exploration information
- Interesting facts and unique properties

### 3. Interactive Controls
Users will be able to interact with the simulation through various controls:
- Time controls (pause, speed up, slow down)
- View controls (perspective, distance, focus)
- Information overlay toggles
- Comparison tools for planetary attributes

> Note: This is a living document that will be updated as we progress through development. See the related [[Planets.md]] file for specific planetary data we'll include.

## Technical Implementation
See the [[Mechanics.md]] document for details on the technical implementation of orbital mechanics and physics simulations.`
          },
          {
            id: "planets",
            name: "Planets.md",
            type: "file",
            parentId: "solar-system",
            content: `# Solar System Planets

This document contains information about each planet in our solar system that will be included in the simulator.

## Mercury
- **Diameter**: 4,879 km
- **Distance from Sun**: 57.9 million km
- **Day Length**: 58.6 Earth days
- **Year Length**: 88 Earth days
- **Description**: Mercury is the smallest and innermost planet in the Solar System. It has a rocky surface covered in craters similar to the Moon.

## Venus
- **Diameter**: 12,104 km
- **Distance from Sun**: 108.2 million km
- **Day Length**: 243 Earth days
- **Year Length**: 225 Earth days
- **Description**: Venus is the second planet from the Sun and is similar in size to Earth. It has a thick atmosphere that traps heat, making it the hottest planet in our solar system.

## Earth
- **Diameter**: 12,742 km
- **Distance from Sun**: 149.6 million km
- **Day Length**: 24 hours
- **Year Length**: 365.25 days
- **Description**: Earth is the third planet from the Sun and the only astronomical object known to harbor life. It has one natural satellite, the Moon.

## Mars
- **Diameter**: 6,779 km
- **Distance from Sun**: 227.9 million km
- **Day Length**: 24.6 hours
- **Year Length**: 687 Earth days
- **Description**: Mars is the fourth planet from the Sun. It has a thin atmosphere and is known for its reddish appearance due to iron oxide (rust) on its surface.

## Jupiter
- **Diameter**: 139,820 km
- **Distance from Sun**: 778.5 million km
- **Day Length**: 9.9 hours
- **Year Length**: 11.9 Earth years
- **Description**: Jupiter is the largest planet in the Solar System. It is a gas giant with a distinctive system of rings and many moons, including the four large Galilean moons.

## Saturn
- **Diameter**: 116,460 km
- **Distance from Sun**: 1,434 billion km
- **Day Length**: 10.7 hours
- **Year Length**: 29.5 Earth years
- **Description**: Saturn is the sixth planet from the Sun and is known for its prominent ring system. Like Jupiter, it is a gas giant with many moons.

## Uranus
- **Diameter**: 50,724 km
- **Distance from Sun**: 2,871 billion km
- **Day Length**: 17.2 hours
- **Year Length**: 84 Earth years
- **Description**: Uranus is the seventh planet from the Sun. It is an ice giant and has a unique feature of rotating on its side with an axial tilt of about 98 degrees.

## Neptune
- **Diameter**: 49,244 km
- **Distance from Sun**: 4,495 billion km
- **Day Length**: 16.1 hours
- **Year Length**: 165 Earth years
- **Description**: Neptune is the eighth and farthest planet from the Sun. It is an ice giant similar to Uranus and has the strongest winds in the Solar System.`
          },
          {
            id: "mechanics",
            name: "Mechanics.md",
            type: "file",
            parentId: "solar-system",
            content: `# Orbital Mechanics and Physics Simulation

This document outlines the technical implementation of orbital mechanics and physics for our Solar System Simulator.

## Kepler's Laws of Planetary Motion

Our simulation will implement Kepler's three laws of planetary motion:

1. **First Law**: The orbit of each planet is an ellipse with the Sun at one of the two foci.
2. **Second Law**: A line segment joining a planet and the Sun sweeps out equal areas during equal intervals of time.
3. **Third Law**: The square of the orbital period of a planet is directly proportional to the cube of the semi-major axis of its orbit.

## Implementation Details

### Elliptical Orbits

For each planet, we'll calculate its position using the following parameters:
- Semi-major axis (a)
- Eccentricity (e)
- Inclination (i)
- Longitude of ascending node (Ω)
- Argument of periapsis (ω)
- Mean anomaly at epoch (M0)

The position calculation will involve:
1. Converting mean anomaly to eccentric anomaly using Kepler's equation
2. Converting eccentric anomaly to true anomaly
3. Calculating the position in the orbital plane
4. Applying rotation matrices to account for inclination and other orbital elements

### Time Controls

The simulation will include time controls that affect the speed of orbital motion:
- Pause: Freezes all planetary motion
- Normal Speed: Real-time orbital motion (scaled appropriately)
- Fast Forward: Accelerated orbital motion (with adjustable speeds)
- Rewind: Reverse orbital motion

### Physics Accuracy

We'll implement the following physics considerations:
- Gravitational interactions between the Sun and planets
- Simplified perturbations due to interactions between planets
- Proper scaling of sizes, distances, and orbital periods
- Realistic axial tilts and rotational periods

## Technical Notes

### Three.js Implementation

For the Three.js implementation:
- Planets will be represented by Sphere geometries
- Orbital paths will be calculated and displayed using Line or Curve objects
- The size of celestial bodies will be scaled for visibility while maintaining relative proportions
- Textures will be applied to each planet for realistic appearance

### Performance Considerations

To maintain good performance:
- Level of Detail (LOD) will be implemented for planet geometries
- Orbital calculations will be optimized using matrix operations
- Background stars and non-essential elements will use efficient rendering techniques
- WebGL capabilities will be detected and features adjusted accordingly

## Future Enhancements

In future versions, we could add:
- N-body simulation for more accurate gravitational interactions
- Spacecraft trajectory planning
- Lagrangian points visualization
- Asteroid belt and Kuiper belt objects
- Comet orbits with proper visualization`
          }
        ]
      },
      {
        id: "learning-resources",
        name: "Learning Resources",
        type: "folder",
        parentId: "project",
        children: []
      }
    ]
  },
  {
    id: "templates",
    name: "Templates",
    type: "folder",
    children: []
  }
];
