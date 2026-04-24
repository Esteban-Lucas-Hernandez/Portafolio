document.addEventListener('DOMContentLoaded', () => {
    const universeContainer = document.getElementById('universe');
    if (!universeContainer) return;

    // Clear previous elements
    universeContainer.innerHTML = '';

    // Create central axis / sun ELH
    const sun = document.createElement('div');
    sun.className = 'universe-sun';
    sun.innerHTML = `<span>ELH</span>`;
    universeContainer.appendChild(sun);

    const technologies = [
        { name: "HTML", icon: "fab fa-html5", color: "#E34F26", size: 60 },
        { name: "CSS", icon: "fab fa-css3-alt", color: "#1572B6", size: 60 },
        { name: "JavaScript", icon: "fab fa-js", color: "#F7DF1E", size: 70 },
        { name: "React", icon: "fab fa-react", color: "#61DAFB", size: 80 },
        { name: "Angular", icon: "fab fa-angular", color: "#DD0031", size: 80 },
        { name: "Vue", icon: "fab fa-vuejs", color: "#4FC08D", size: 70 },
        { name: "Java", icon: "fab fa-java", color: "#007396", size: 80 },
        { name: "Spring", icon: "fas fa-leaf", color: "#6DB33F", size: 80 },
        { name: "Django", icon: "fab fa-python", color: "#092E20", size: 70 },
        { name: "Laravel", icon: "fab fa-laravel", color: "#FF2D20", size: 60 },
        { name: "PostgreSQL", icon: "fas fa-database", color: "#336791", size: 65 },
        { name: "MySQL", icon: "fas fa-database", color: "#00758F", size: 60 },
        { name: "Git", icon: "fab fa-git-alt", color: "#F05032", size: 50 },
        { name: "GitHub", icon: "fab fa-github", color: "#FFFFFF", size: 50 },
        { name: "JWT", icon: "fas fa-key", color: "#FF0000", size: 50 },
        { name: "Scrum", icon: "fas fa-tasks", color: "#00A6DF", size: 50 }
    ];

    // Create Canvas for Sphere bonds
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '5'; // Below planets, above background
    universeContainer.appendChild(canvas);
    
    let width = universeContainer.clientWidth;
    let height = universeContainer.clientHeight;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');

    window.addEventListener('resize', () => {
        width = universeContainer.clientWidth;
        height = universeContainer.clientHeight;
        canvas.width = width;
        canvas.height = height;
    });

    // 1. Sphere Geometry (Fibonacci Lattice algorithm for evenly distributing points on a sphere)
    const N = 80;
    const vertices = [];
    for (let i = 0; i < N; i++) {
        const phi = Math.acos(1 - 2 * (i + 0.5) / N);
        const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
        const x = Math.cos(theta) * Math.sin(phi);
        const y = Math.sin(theta) * Math.sin(phi);
        const z = Math.cos(phi);
        vertices.push({ x, y, z });
    }

    // 2. Connect nearest neighbors creating a wireframe grid (geodesic-like layout)
    const edges = [];
    const threshold = 0.55; // Threshold radius for connection
    for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
            const dx = vertices[i].x - vertices[j].x;
            const dy = vertices[i].y - vertices[j].y;
            const dz = vertices[i].z - vertices[j].z;
            const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
            if (dist < threshold) {
                edges.push({ a: i, b: j });
            }
        }
    }

    // 3. Create Planet DOMs
    const planets = [];
    technologies.forEach((tech, i) => {
        const el = document.createElement('div');
        el.className = 'floating-planet';
        const displaySize = window.innerWidth < 768 ? tech.size * 0.7 : tech.size;
        
        el.style.width = `${displaySize}px`;
        el.style.height = `${displaySize}px`;
        el.innerHTML = `
            <i class="${tech.icon}" style="color: ${tech.color}; font-size: ${displaySize * 0.5}px;"></i>
            <div class="planet-tooltip">${tech.name}</div>
        `;
        
        universeContainer.appendChild(el);
        
        // Place technology at specific nodes to prevent overlap 
        // 16 tech * 5 steps = 80 total evenly spread target points
        const vertexIndex = i * 5; 
        planets.push({ el, tech, vIdx: vertexIndex, baseSize: displaySize, isHovered: false });

        // Hover events integration
        el.addEventListener('mouseenter', () => {
            planets[i].isHovered = true;
            el.style.boxShadow = `0 0 20px ${tech.color}, 0 0 40px ${tech.color}80, inset 0 0 20px ${tech.color}50`;
            el.classList.add('planet-hovered');
            
            const cursor = document.querySelector('.custom-cursor');
            const cursorFollower = document.querySelector('.custom-cursor-follower');
            if(cursor) cursor.classList.add('hover');
            if(cursorFollower) cursorFollower.classList.add('hover');
        });
        
        el.addEventListener('mouseleave', () => {
            planets[i].isHovered = false;
            el.style.boxShadow = '';
            el.classList.remove('planet-hovered');
            
            const cursor = document.querySelector('.custom-cursor');
            const cursorFollower = document.querySelector('.custom-cursor-follower');
            if(cursor) cursor.classList.remove('hover');
            if(cursorFollower) cursorFollower.classList.remove('hover');
        });
    });

    // Add Stars background
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        const s = Math.random() * 3;
        star.style.width = s + 'px';
        star.style.height = s + 'px';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.position = 'absolute';
        star.style.backgroundColor = '#fff';
        star.style.borderRadius = '50%';
        star.style.opacity = Math.random() * 0.8 + 0.2;
        star.style.animation = `twinkle ${Math.random() * 3 + 2}s infinite alternate`;
        star.style.zIndex = '1';
        universeContainer.appendChild(star);
    }
    
    if (!document.getElementById('star-twinkle-style')) {
        const style = document.createElement('style');
        style.id = 'star-twinkle-style';
        style.innerHTML = `
            @keyframes twinkle {
                0% { opacity: 0.2; transform: scale(0.8); }
                100% { opacity: 1; transform: scale(1.2); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Engine State
    let angleX = 0;
    let angleY = 0;
    
    // Mouse interactivity for the entire sphere
    let mouseX = 0;
    let mouseY = 0;
    
    universeContainer.addEventListener('mousemove', (e) => {
        const rect = universeContainer.getBoundingClientRect();
        // Calculate raw deviation from the center (-1 to 1)
        mouseX = ((e.clientX - rect.left) / width) * 2 - 1;
        mouseY = ((e.clientY - rect.top) / height) * 2 - 1;
    });

    universeContainer.addEventListener('mouseleave', () => {
        // Return to natural spin direction
        mouseX = 0;
        mouseY = 0;
    });
    
    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Matrix Rotation Speed + Interactive Camera effect
        angleY += 0.003 + (mouseX * 0.015);
        angleX += 0.002 + (mouseY * 0.015);

        ctx.clearRect(0, 0, width, height);

        const centerY = height / 2;
        const centerX = width / 2;
        
        // Sphere dynamic scaling bounds
        const radius = width < 768 ? width * 0.4 : height * 0.38; 
        
        // 4. Calculate 3D coordinates applying continuous 3D rotation matrix
        const cosX = Math.cos(angleX);
        const sinX = Math.sin(angleX);
        const cosY = Math.cos(angleY);
        const sinY = Math.sin(angleY);

        const rotatedVertices = vertices.map(v => {
            // First rotation on the X axis
            let y1 = v.y * cosX - v.z * sinX;
            let z1 = v.y * sinX + v.z * cosX;
            
            // Second rotation on the Y axis
            let x2 = v.x * cosY + z1 * sinY;
            let y2 = y1;
            let z2 = -v.x * sinY + z1 * cosY;
            
            return {
                x: centerX + x2 * radius,
                y: centerY + y2 * radius,
                z: z2 * radius,
                rawZ: z2 // Native -1 (back) to 1 (front) property
            };
        });

        // 5. Draw the Wireframe Edges
        ctx.lineWidth = 1.3;
        
        edges.forEach(edge => {
            const v1 = rotatedVertices[edge.a];
            const v2 = rotatedVertices[edge.b];
            
            const avgZ = (v1.rawZ + v2.rawZ) / 2;
            
            // Render depth: Fade lines in the rear background, bold in the front
            const opacity = Math.max(0.05, Math.min(0.4, (avgZ + 1) / 2));
            
            ctx.strokeStyle = `rgba(180, 200, 255, ${opacity})`;
            
            ctx.beginPath();
            ctx.moveTo(v1.x, v1.y);
            ctx.lineTo(v2.x, v2.y);
            ctx.stroke();
        });
        
        // 6. Imprint nodes in vacant vertices (Tech-network visual logic)
        rotatedVertices.forEach((v, index) => {
            if (index % 5 !== 0) { // If it's NOT a heavy planet node
                const opacity = Math.max(0.1, Math.min(0.7, (v.rawZ + 1) / 2));
                ctx.fillStyle = `rgba(200, 220, 255, ${opacity * 0.7})`;
                ctx.beginPath();
                ctx.arc(v.x, v.y, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        });

        // 7. Push 3D constraints onto our HTML physical elements
        planets.forEach(p => {
            const v = rotatedVertices[p.vIdx];
            const depthRatio = (v.rawZ + 1) / 2; // Math from 0 to 1
            const scale = 0.5 + depthRatio * 0.7; // From scaled down (0.5) to scaled up (1.2)
            
            p.el.style.left = `${v.x}px`;
            p.el.style.top = `${v.y}px`;
            
            if (!p.isHovered) {
                const zIndex = Math.floor(depthRatio * 100) + 10;
                p.el.style.zIndex = zIndex;
                p.el.style.transform = `translate(-50%, -50%) scale(${scale})`;
                
                // Native DOM Depth of Field
                if (v.rawZ < 0) {
                    p.el.style.filter = `brightness(${0.4 + depthRatio * 0.6}) blur(${(1 - depthRatio) * 3}px)`;
                } else {
                    p.el.style.filter = `brightness(${0.8 + depthRatio * 0.4}) blur(0px)`;
                }
            }
        });
    }
    
    // Execute rendering loop
    animate();
});
