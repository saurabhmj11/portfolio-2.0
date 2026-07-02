const fs = require('fs');
let src = fs.readFileSync('src/components/AgentCore3D.tsx', 'utf8');

const rocketScene = `// 90-DAY LAUNCHPAD
const RocketScene = () => {
    const rocketRef = useRef(null);
    const particlesRef = useRef(null);
    const ring1 = useRef(null); const ring2 = useRef(null); const ring3 = useRef(null);
    const count = 120;
    const [positions, velocities] = useMemo(() => {
        const p = new Float32Array(count * 3), v = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const r = Math.random() * 0.2, a = Math.random() * Math.PI * 2;
            p[i*3]=Math.cos(a)*r; p[i*3+1]=-1.0-Math.random()*1.8; p[i*3+2]=Math.sin(a)*r;
            v[i*3]=(Math.random()-.5)*.015; v[i*3+1]=-(0.02+Math.random()*.05); v[i*3+2]=(Math.random()-.5)*.015;
        }
        return [p, v];
    }, []);
    const particleGeo = useMemo(() => { const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(positions),3)); return g; }, [positions]);
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (rocketRef.current) { rocketRef.current.position.y=Math.sin(t*.7)*.12; rocketRef.current.rotation.z=Math.sin(t*.4)*.04; }
        if (ring1.current) ring1.current.scale.setScalar(1+.1*Math.sin(t*2.0));
        if (ring2.current) ring2.current.scale.setScalar(1+.1*Math.sin(t*2.0+1.2));
        if (ring3.current) ring3.current.scale.setScalar(1+.1*Math.sin(t*2.0+2.4));
        if (particlesRef.current) {
            const pos = particlesRef.current.geometry.attributes.position.array;
            for (let i=0;i<count;i++) { pos[i*3]+=velocities[i*3]; pos[i*3+1]+=velocities[i*3+1]; pos[i*3+2]+=velocities[i*3+2]; if(pos[i*3+1]<-3){const r2=Math.random()*.2,a2=Math.random()*Math.PI*2;pos[i*3]=Math.cos(a2)*r2;pos[i*3+1]=-1.0;pos[i*3+2]=Math.sin(a2)*r2;} }
            particlesRef.current.geometry.attributes.position.needsUpdate = true;
        }
    });
    return (
        <>
            <group ref={rocketRef} position={[0,0.4,0]}>
                <mesh><cylinderGeometry args={[0.15,0.20,1.1,20]}/><meshBasicMaterial color='#f59e0b'/></mesh>
                <mesh position={[0,0.78,0]}><coneGeometry args={[0.15,0.46,20]}/><meshBasicMaterial color='#fde68a'/></mesh>
                <mesh position={[0,0.2,0.16]}><circleGeometry args={[0.07,20]}/><meshBasicMaterial color='#38bdf8'/></mesh>
                {[0,1,2,3].map(i=>(<mesh key={i} rotation={[0,(i*Math.PI)/2,0]} position={[0,-.42,0]}><boxGeometry args={[.06,.28,.22]}/><meshBasicMaterial color='#b45309'/></mesh>))}
                <mesh position={[0,-.58,0]}><cylinderGeometry args={[.09,.04,.18,16]}/><meshBasicMaterial color='#fb923c' transparent opacity={.95}/></mesh>
            </group>
            <mesh ref={ring1} position={[0,-.45,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.55,.013,8,64]}/><meshBasicMaterial color='#f59e0b' transparent opacity={.55}/></mesh>
            <mesh ref={ring2} position={[0,-.45,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.90,.010,8,64]}/><meshBasicMaterial color='#fbbf24' transparent opacity={.35}/></mesh>
            <mesh ref={ring3} position={[0,-.45,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[1.28,.007,8,64]}/><meshBasicMaterial color='#fde68a' transparent opacity={.18}/></mesh>
            <points ref={particlesRef} geometry={particleGeo}><pointsMaterial color='#f97316' size={0.065} transparent opacity={0.9} sizeAttenuation/></points>
            <ambientLight intensity={0.2}/>
            <pointLight color='#f59e0b' intensity={6} distance={7} position={[0,-0.7,0]}/>
            <pointLight color='#fde68a' intensity={1.5} distance={4} position={[0,2,0]}/>
        </>
    );
};`;

const branchScene = `// DUDUSL001 — data flowing through git branches
const BranchScene = () => {
    const groupRef = useRef(null);
    const nodeRefs = useRef([]);
    const signalRefs = useRef([]);
    const nodes = useMemo(() => [
        {pos:[0,-1.1,0],c:'#a78bfa'},{pos:[-0.75,-0.15,.2],c:'#c084fc'},{pos:[0.75,-0.15,-.2],c:'#c084fc'},
        {pos:[-1.15,.75,.1],c:'#e879f9'},{pos:[-0.3,.75,-.15],c:'#e879f9'},{pos:[0.3,.75,.15],c:'#e879f9'},{pos:[1.15,.75,-.1],c:'#e879f9'},
    ], []);
    const edges = useMemo(()=>[[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]], []);
    const signalProgress = useRef(edges.map(()=>Math.random()));
    const edgeData = useMemo(() => edges.map(([a,b]) => {
        const from = new THREE.Vector3(...nodes[a].pos), to = new THREE.Vector3(...nodes[b].pos);
        const mid = from.clone().lerp(to,.5), len = from.distanceTo(to);
        const dir = to.clone().sub(from).normalize();
        const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),dir);
        return {from,to,mid,len,q};
    }), [edges,nodes]);
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (groupRef.current) { groupRef.current.rotation.y=t*0.28; groupRef.current.rotation.x=Math.sin(t*0.18)*0.15; }
        nodeRefs.current.forEach((m,i)=>{ if(m) m.scale.setScalar(0.88+0.12*Math.sin(t*2.5+i*0.9)); });
        edges.forEach(([a,b],i) => {
            signalProgress.current[i] = (signalProgress.current[i]+0.008)%1;
            const s = signalRefs.current[i];
            if (s) {
                const p = signalProgress.current[i];
                s.position.lerpVectors(edgeData[i].from, edgeData[i].to, p);
                s.scale.setScalar(0.7+0.3*Math.sin(p*Math.PI));
            }
        });
    });
    return (
        <group ref={groupRef}>
            {edgeData.map((e,i)=>(<mesh key={i} position={e.mid} quaternion={e.q}><cylinderGeometry args={[.014,.014,e.len,6]}/><meshBasicMaterial color='#6d28d9' transparent opacity={0.45}/></mesh>))}
            {nodes.map((n,i)=>(<mesh key={i} position={n.pos} ref={el=>{if(el)nodeRefs.current[i]=el;}}><sphereGeometry args={[.13,16,16]}/><meshBasicMaterial color={n.c}/></mesh>))}
            {edges.map((_,i)=>(<mesh key={i} ref={el=>{if(el)signalRefs.current[i]=el;}}><sphereGeometry args={[.055,10,10]}/><meshBasicMaterial color='#f0abfc'/></mesh>))}
            <ambientLight intensity={0.3}/>
            <pointLight color='#a78bfa' intensity={4} distance={7}/>
            <pointLight color='#e879f9' intensity={2} distance={5} position={[0,1.5,0]}/>
        </group>
    );
};`;

const plannerScene = `// AGENT PLAN 01 — orbiting satellites around a command core
const PlannerScene = () => {
    const coreRef = useRef(null);
    const ring1Ref = useRef(null), ring2Ref = useRef(null), ring3Ref = useRef(null);
    const satCount = 6;
    const satRefs = useRef([]);
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (coreRef.current) { coreRef.current.rotation.x=t*.4; coreRef.current.rotation.y=t*.3; }
        if (ring1Ref.current) { ring1Ref.current.rotation.z=t*.5; ring1Ref.current.rotation.x=0.4; }
        if (ring2Ref.current) { ring2Ref.current.rotation.z=-t*.35; ring2Ref.current.rotation.y=0.6; }
        if (ring3Ref.current) { ring3Ref.current.rotation.z=t*.25; ring3Ref.current.rotation.x=-0.5; ring3Ref.current.rotation.y=t*.1; }
        satRefs.current.forEach((s,i)=>{ if(s){ const a=t*.7+i*(Math.PI*2/satCount); s.position.set(Math.cos(a)*1.2,Math.sin(a*.5)*.4,Math.sin(a)*1.2); } });
    });
    return (
        <>
            <mesh ref={coreRef}><icosahedronGeometry args={[.42,1]}/><meshBasicMaterial color='#34d399' wireframe/></mesh>
            <mesh><sphereGeometry args={[.32,16,16]}/><meshBasicMaterial color='#064e3b' transparent opacity={.7}/></mesh>
            <mesh ref={ring1Ref}><torusGeometry args={[1.2,.014,8,80]}/><meshBasicMaterial color='#34d399' transparent opacity={.7}/></mesh>
            <mesh ref={ring2Ref}><torusGeometry args={[1.0,.010,8,80]}/><meshBasicMaterial color='#6ee7b7' transparent opacity={.5}/></mesh>
            <mesh ref={ring3Ref}><torusGeometry args={[1.4,.007,8,80]}/><meshBasicMaterial color='#a7f3d0' transparent opacity={.3}/></mesh>
            {Array.from({length:satCount},(_,i)=>(<mesh key={i} ref={el=>{if(el)satRefs.current[i]=el;}}><boxGeometry args={[.09,.09,.18]}/><meshBasicMaterial color={i%2===0?'#34d399':'#6ee7b7'}/></mesh>))}
            <ambientLight intensity={0.25}/>
            <pointLight color='#34d399' intensity={5} distance={7}/>
            <pointLight color='#a7f3d0' intensity={1.5} distance={5} position={[1.5,1,0]}/>
        </>
    );
};`;

const neuralScene = `// S L 011 — neural net with animated signal pulses
const NeuralScene = () => {
    const groupRef = useRef(null);
    const nodeRefs = useRef([]);
    const pulseRefs = useRef([]);
    const layers = [
        [[-1,-.9,0],[-1,0,0],[-1,.9,0]],
        [[0,-.6,.3],[0,.6,-.3]],
        [[1,-.9,0],[1,0,0],[1,.9,0]],
    ];
    const allNodes = layers.flat();
    const edges = [];
    layers[0].forEach((_,a)=>layers[1].forEach((__,b)=>edges.push([a,3+b])));
    layers[1].forEach((_,a)=>layers[2].forEach((__,b)=>edges.push([3+a,5+b])));
    const pulseProgress = useRef(edges.map((_,i)=>i/edges.length));
    const edgeData = useMemo(()=>edges.map(([a,b])=>{
        const from=new THREE.Vector3(...allNodes[a]),to=new THREE.Vector3(...allNodes[b]);
        const mid=from.clone().lerp(to,.5),len=from.distanceTo(to);
        const dir=to.clone().sub(from).normalize();
        const q=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),dir);
        return{from,to,mid,len,q};
    }),[]);
    const layerColors=['#f43f5e','#f43f5e','#f43f5e','#fb7185','#fb7185','#fda4af','#fda4af','#fda4af'];
    useFrame((state)=>{
        const t=state.clock.getElapsedTime();
        if(groupRef.current){groupRef.current.rotation.y=t*.22;groupRef.current.rotation.x=Math.sin(t*.18)*.12;}
        nodeRefs.current.forEach((m,i)=>{if(m)m.scale.setScalar(.85+.15*Math.sin(t*3+i*1.2));});
        edges.forEach((_,i)=>{
            pulseProgress.current[i]=(pulseProgress.current[i]+0.01)%1;
            const p=pulseRefs.current[i];
            if(p){p.position.lerpVectors(edgeData[i].from,edgeData[i].to,pulseProgress.current[i]);p.scale.setScalar(.8+.4*Math.sin(pulseProgress.current[i]*Math.PI));}
        });
    });
    return(
        <group ref={groupRef}>
            {edgeData.map((e,i)=>(<mesh key={i} position={e.mid} quaternion={e.q}><cylinderGeometry args={[.011,.011,e.len,4]}/><meshBasicMaterial color='#9f1239' transparent opacity={0.4}/></mesh>))}
            {allNodes.map((pos,i)=>(<mesh key={i} position={pos} ref={el=>{if(el)nodeRefs.current[i]=el;}}><sphereGeometry args={[.15,14,14]}/><meshBasicMaterial color={layerColors[i]}/></mesh>))}
            {edges.map((_,i)=>(<mesh key={i} ref={el=>{if(el)pulseRefs.current[i]=el;}}><sphereGeometry args={[.06,8,8]}/><meshBasicMaterial color='#fda4af'/></mesh>))}
            <ambientLight intensity={0.3}/>
            <pointLight color='#f43f5e' intensity={4} distance={7}/>
            <pointLight color='#fb7185' intensity={2} distance={5} position={[1.5,0,0]}/>
        </group>
    );
};`;

// Replace each scene
function replaceScene(src, startComment, newCode) {
    const lines = src.split('\n');
    let start = -1, end = -1, depth = 0, inFn = false;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(startComment)) { start = i; }
        if (start >= 0 && lines[i].includes('const ') && lines[i].includes('Scene = () =>')) { inFn = true; }
        if (inFn) {
            for (const ch of lines[i]) { if (ch==='{') depth++; else if (ch==='}') depth--; }
            if (depth === 0 && lines[i].trim() === '};') { end = i; break; }
        }
    }
    if (start === -1 || end === -1) { console.log('NOT FOUND:', startComment); return src; }
    console.log('Replacing lines', start, '-', end);
    lines.splice(start, end-start+1, newCode);
    return lines.join('\n');
}

src = replaceScene(src, '90-DAY LAUNCHPAD', rocketScene);
src = replaceScene(src, 'DUDUSL001', branchScene);
src = replaceScene(src, 'AGENT PLAN 01', plannerScene);
src = replaceScene(src, 'S L 011', neuralScene);

fs.writeFileSync('src/components/AgentCore3D.tsx', src, 'utf8');
console.log('Done. Lines:', src.split('\n').length);
