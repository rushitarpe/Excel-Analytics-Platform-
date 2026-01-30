import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/**
 * Chart3D Component
 * Renders 3D charts using Three.js
 */
export default function Chart3D({ chartData, chartConfig, height = 400 }) {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Three.js scene
    const width = containerRef.current.clientWidth;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfafafa);
    sceneRef.current = scene;

    // Setup camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Setup controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    // Add grid helper
    const gridHelper = new THREE.GridHelper(10, 10, 0xcccccc, 0xe0e0e0);
    scene.add(gridHelper);

    // Add axes helper
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // Create 3D visualization based on chart type
    createVisualization(scene, chartData, chartConfig);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      const newWidth = containerRef.current?.clientWidth || width;
      camera.aspect = newWidth / height;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, height);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      controls.dispose();
    };
  }, [chartData, chartConfig, height]);

  const createVisualization = (scene, data, config) => {
    const { chartType } = config;
    const values = data.datasets[0]?.data || [];
    const labels = data.labels || [];

    switch (chartType) {
      case 'bar3d':
        create3DBars(scene, values, labels);
        break;
      case 'scatter3d':
        create3DScatter(scene, values, labels);
        break;
      case 'line3d':
        create3DLine(scene, values, labels);
        break;
      default:
        create3DBars(scene, values, labels);
    }
  };

  const create3DBars = (scene, values, labels) => {
    const barWidth = 0.5;
    const spacing = 1.5;
    const startX = -(values.length * spacing) / 2;

    values.forEach((value, index) => {
      const height = (value / Math.max(...values)) * 4;
      const geometry = new THREE.BoxGeometry(barWidth, height, barWidth);
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(index / values.length, 0.7, 0.5),
      });
      const bar = new THREE.Mesh(geometry, material);
      bar.position.set(startX + index * spacing, height / 2, 0);
      scene.add(bar);

      // Add edge lines for better visibility
      const edges = new THREE.EdgesGeometry(geometry);
      const line = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 1 })
      );
      line.position.copy(bar.position);
      scene.add(line);
    });
  };

  const create3DScatter = (scene, values, labels) => {
    const geometry = new THREE.SphereGeometry(0.2, 16, 16);

    values.forEach((value, index) => {
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(index / values.length, 0.7, 0.5),
      });
      const sphere = new THREE.Mesh(geometry, material);

      // Position in 3D space
      const x = (index - values.length / 2) * 0.8;
      const y = (value / Math.max(...values)) * 4;
      const z = Math.random() * 2 - 1; // Random Z for 3D effect

      sphere.position.set(x, y, z);
      scene.add(sphere);
    });
  };

  const create3DLine = (scene, values, labels) => {
    const points = [];
    const spacing = 1.2;
    const startX = -(values.length * spacing) / 2;

    values.forEach((value, index) => {
      const x = startX + index * spacing;
      const y = (value / Math.max(...values)) * 4;
      const z = 0;
      points.push(new THREE.Vector3(x, y, z));
    });

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0x0ea5e9,
      linewidth: 3,
    });
    const line = new THREE.Line(geometry, material);
    scene.add(line);

    // Add spheres at data points
    const sphereGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const sphereMaterial = new THREE.MeshPhongMaterial({ color: 0x0ea5e9 });

    points.forEach((point) => {
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.copy(point);
      scene.add(sphere);
    });
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: `${height}px`,
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    />
  );
}