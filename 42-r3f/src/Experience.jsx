import { SphereGeometry } from "three";
import { extend, useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

extend({ OrbitControls})

export default function Experience(){
    const cubeRef = useRef()
    const groupRef = useRef()
    const {camera, gl} = useThree()
    
    useFrame((state, delta) => {
        cubeRef.current.rotation.y += delta
        groupRef.current.rotation.y += delta
    })

    return <>
        <orbitControls args={[camera, gl.domElement]}/>
        <group ref={groupRef}>
            <mesh position={[-1.5,0,0]}>
                <sphereGeometry args={[1.5, 32, 32]}/>
                <meshBasicMaterial args={[{color: 'orange', wireframe: false}]} />
            </mesh>

            <mesh position={[1.5,0,0]} ref={cubeRef}>
                <boxGeometry/>
                <meshBasicMaterial args={[{color: 'purple'}]}/>
            </mesh>
        </group>
        

        <mesh position-y={-1} rotation-x={-Math.PI * 0.25} scale={10}>
            <planeGeometry />
            <meshBasicMaterial args={[{color: 'green'}]}/>
        </mesh>
    </>
}