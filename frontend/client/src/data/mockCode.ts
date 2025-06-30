import { TreeNode } from "@/types";

export const mockCode: TreeNode[] = [
  {
    id: "public",
    name: "public",
    type: "folder",
    path: "/public",
    children: []
  },
  {
    id: "src",
    name: "src",
    type: "folder",
    path: "/src",
    expanded: true,
    children: [
      {
        id: "components",
        name: "components",
        type: "folder",
        path: "/src/components",
        expanded: true,
        children: [
          {
            id: "navbar",
            name: "NavBar.jsx",
            type: "file",
            path: "/src/components/NavBar.jsx"
          },
          {
            id: "planetdetail",
            name: "PlanetDetail.jsx",
            type: "file",
            path: "/src/components/PlanetDetail.jsx"
          },
          {
            id: "solarsystem",
            name: "SolarSystem.jsx",
            type: "file",
            path: "/src/components/SolarSystem.jsx"
          },
          {
            id: "controls",
            name: "Controls.jsx",
            type: "file",
            path: "/src/components/Controls.jsx"
          }
        ]
      },
      {
        id: "data",
        name: "data",
        type: "folder",
        path: "/src/data",
        children: []
      },
      {
        id: "utils",
        name: "utils",
        type: "folder",
        path: "/src/utils",
        children: []
      },
      {
        id: "app",
        name: "App.jsx",
        type: "file",
        path: "/src/App.jsx"
      },
      {
        id: "index",
        name: "index.js",
        type: "file",
        path: "/src/index.js"
      }
    ]
  },
  {
    id: "package",
    name: "package.json",
    type: "file",
    path: "/package.json"
  },
  {
    id: "readme",
    name: "README.md",
    type: "file",
    path: "/README.md"
  }
];
