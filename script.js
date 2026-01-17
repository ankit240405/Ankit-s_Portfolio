
class EnhancedStarryBackground {
    constructor() {
        this.container = document.getElementById('three-container');
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x000000, 0.0008);
        
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
        this.camera.position.z = 100;
        
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);
        this.container.appendChild(this.renderer.domElement);
        
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        this.scene.add(ambientLight);
        
        const pointLight1 = new THREE.PointLight(0x00ff88, 1, 150);
        pointLight1.position.set(50, 50, 50);
        this.scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0x0088ff, 1, 150);
        pointLight2.position.set(-50, -50, 50);
        this.scene.add(pointLight2);
        
        this.createMultiLayeredStarfield();
        this.createNebulaClouds();
        this.createEnhancedTechElements();
        this.createGeometricShapes();
        this.createParticleStreams();
        
        this.mouseX = 0;
        this.mouseY = 0;
        this.initMouseTracking();
        this.animate();
        
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    createMultiLayeredStarfield() {
        this.starLayers = [];
        const layerConfigs = [
            { count: 3000, size: 0.05, distance: 200, speed: 0.0001 },
            { count: 2000, size: 0.1, distance: 150, speed: 0.0002 },
            { count: 1000, size: 0.15, distance: 100, speed: 0.0003 }
        ];
        
        layerConfigs.forEach(config => {
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(config.count * 3);
            const colors = new Float32Array(config.count * 3);
            const sizes = new Float32Array(config.count);
            
            for(let i = 0; i < config.count; i++) {
                const radius = config.distance;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(Math.random() * 2 - 1);
                
                positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
                positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
                positions[i * 3 + 2] = radius * Math.cos(phi);
                
                const colorChoice = Math.random();
                if (colorChoice < 0.6) {
                    const brightness = Math.random() * 0.5 + 0.5;
                    colors[i * 3] = brightness;
                    colors[i * 3 + 1] = brightness;
                    colors[i * 3 + 2] = brightness;
                } else if (colorChoice < 0.8) {
                    colors[i * 3] = Math.random() * 0.3;
                    colors[i * 3 + 1] = Math.random() * 0.5 + 0.5;
                    colors[i * 3 + 2] = Math.random() * 0.5 + 0.5;
                } else {
                    colors[i * 3] = Math.random() * 0.3;
                    colors[i * 3 + 1] = Math.random() * 0.5 + 0.5;
                    colors[i * 3 + 2] = Math.random() * 0.3;
                }
                
                sizes[i] = config.size * (Math.random() * 0.5 + 0.5);
            }
            
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
            
            const material = new THREE.PointsMaterial({
                size: config.size,
                vertexColors: true,
                transparent: true,
                opacity: 0.9,
                sizeAttenuation: true,
                blending: THREE.AdditiveBlending
            });
            
            const starField = new THREE.Points(geometry, material);
            starField.userData.speed = config.speed;
            this.scene.add(starField);
            this.starLayers.push(starField);
        });
    }
    
    createNebulaClouds() {
        const nebulaGeometry = new THREE.BufferGeometry();
        const nebulaCount = 500;
        const positions = new Float32Array(nebulaCount * 3);
        const colors = new Float32Array(nebulaCount * 3);
        const sizes = new Float32Array(nebulaCount);
        
        for(let i = 0; i < nebulaCount; i++) {
            const radius = 150;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            
            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi);
            
            const colorType = Math.random();
            if (colorType < 0.4) {
                colors[i * 3] = 0.1;
                colors[i * 3 + 1] = 0.3 + Math.random() * 0.3;
                colors[i * 3 + 2] = 0.5 + Math.random() * 0.5;
            } else if (colorType < 0.7) {
                colors[i * 3] = 0.3 + Math.random() * 0.3;
                colors[i * 3 + 1] = 0.1;
                colors[i * 3 + 2] = 0.5 + Math.random() * 0.5;
            } else {
                colors[i * 3] = 0.1;
                colors[i * 3 + 1] = 0.5 + Math.random() * 0.5;
                colors[i * 3 + 2] = 0.3 + Math.random() * 0.3;
            }
            
            sizes[i] = Math.random() * 3 + 2;
        }
        
        nebulaGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        nebulaGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        nebulaGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const nebulaMaterial = new THREE.PointsMaterial({
            size: 4,
            vertexColors: true,
            transparent: true,
            opacity: 0.15,
            sizeAttenuation: true,
            blending: THREE.AdditiveBlending
        });
        
        this.nebula = new THREE.Points(nebulaGeometry, nebulaMaterial);
        this.scene.add(this.nebula);
    }
    
    createEnhancedTechElements() {
        const techElements = [
            { text: "{ }", color: 0x00ff88, size: 4 },
            { text: "< />", color: 0x0088ff, size: 4 },
            { text: "[ ]", color: 0xff6600, size: 4 },
            { text: "=>", color: 0x00ddff, size: 3.5 },
            { text: "fn()", color: 0xaa00ff, size: 3.5 },
            { text: "AI", color: 0xff0088, size: 4 },
            { text: "API", color: 0x88ff00, size: 3.5 }
        ];
        
        this.techObjects = [];
        const loader = new THREE.FontLoader();
        loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
            techElements.forEach((element, index) => {
                const geometry = new THREE.TextGeometry(element.text, {
                    font: font,
                    size: element.size,
                    height: 0.8,
                    curveSegments: 12,
                    bevelEnabled: true,
                    bevelThickness: 0.15,
                    bevelSize: 0.1,
                    bevelSegments: 5
                });
                
                geometry.computeBoundingBox();
                const centerOffset = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
                
                const material = new THREE.MeshPhongMaterial({
                    color: element.color,
                    emissive: element.color,
                    emissiveIntensity: 0.4,
                    transparent: true,
                    opacity: 0.85,
                    shininess: 150,
                    specular: 0xffffff
                });
                
                const textMesh = new THREE.Mesh(geometry, material);
                const radius = 60;
                const angle = (index / techElements.length) * Math.PI * 2;
                const height = (Math.random() - 0.5) * 30;
                
                textMesh.position.x = Math.cos(angle) * radius + centerOffset;
                textMesh.position.y = height;
                textMesh.position.z = Math.sin(angle) * radius;
                
                textMesh.userData = {
                    originalPosition: textMesh.position.clone(),
                    speed: 0.0005 + Math.random() * 0.001,
                    rotationSpeed: new THREE.Vector3(
                        Math.random() * 0.015 - 0.0075,
                        Math.random() * 0.015 - 0.0075,
                        Math.random() * 0.015 - 0.0075
                    ),
                    orbitRadius: radius,
                    orbitSpeed: 0.0002 + Math.random() * 0.0003,
                    orbitAngle: angle,
                    floatAmplitude: 1 + Math.random() * 2
                };
                
                this.scene.add(textMesh);
                this.techObjects.push(textMesh);
            });
        });
    }
    
    createGeometricShapes() {
        const shapes = [
            { type: 'octahedron', color: 0x0088ff, size: 3 },
            { type: 'dodecahedron', color: 0x00ff88, size: 2.5 },
            { type: 'icosahedron', color: 0xff6600, size: 2.5 },
            { type: 'tetrahedron', color: 0xaa00ff, size: 3 },
            { type: 'torus', color: 0x00ddff, size: 2 },
            { type: 'torusKnot', color: 0xff0088, size: 2 }
        ];
        
        this.geometricObjects = [];
        
        shapes.forEach((shape, index) => {
            let geometry;
            switch(shape.type) {
                case 'octahedron': geometry = new THREE.OctahedronGeometry(shape.size); break;
                case 'dodecahedron': geometry = new THREE.DodecahedronGeometry(shape.size); break;
                case 'icosahedron': geometry = new THREE.IcosahedronGeometry(shape.size); break;
                case 'tetrahedron': geometry = new THREE.TetrahedronGeometry(shape.size); break;
                case 'torus': geometry = new THREE.TorusGeometry(shape.size, 0.8, 16, 100); break;
                case 'torusKnot': geometry = new THREE.TorusKnotGeometry(shape.size, 0.4, 100, 16); break;
            }
            
            const material = new THREE.MeshPhongMaterial({
                color: shape.color,
                emissive: shape.color,
                emissiveIntensity: 0.3,
                transparent: true,
                opacity: 0.5,
                wireframe: true
            });
            
            const mesh = new THREE.Mesh(geometry, material);
            const radius = 45;
            const angle = (index / shapes.length) * Math.PI * 2;
            const height = (Math.random() - 0.5) * 40;
            
            mesh.position.x = Math.cos(angle) * radius;
            mesh.position.y = height;
            mesh.position.z = Math.sin(angle) * radius;
            
            mesh.userData = {
                originalPosition: mesh.position.clone(),
                rotationSpeed: new THREE.Vector3(
                    Math.random() * 0.01 - 0.005,
                    Math.random() * 0.01 - 0.005,
                    Math.random() * 0.01 - 0.005
                ),
                orbitRadius: radius,
                orbitSpeed: 0.0003 + Math.random() * 0.0002,
                orbitAngle: angle,
                floatAmplitude: 2 + Math.random()
            };
            
            this.scene.add(mesh);
            this.geometricObjects.push(mesh);
        });
    }
    
    createParticleStreams() {
        const streamCount = 200;
        const streams = new THREE.BufferGeometry();
        const positions = new Float32Array(streamCount * 3);
        const colors = new Float32Array(streamCount * 3);
        
        for(let i = 0; i < streamCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 200;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
            
            const colorChoice = Math.random();
            if (colorChoice < 0.5) {
                colors[i * 3] = 0;
                colors[i * 3 + 1] = 0.5 + Math.random() * 0.5;
                colors[i * 3 + 2] = 1;
            } else {
                colors[i * 3] = 0;
                colors[i * 3 + 1] = 1;
                colors[i * 3 + 2] = 0.5 + Math.random() * 0.5;
            }
        }
        
        streams.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        streams.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const streamMaterial = new THREE.PointsMaterial({
            size: 0.2,
            vertexColors: true,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending
        });
        
        this.particleStreams = new THREE.Points(streams, streamMaterial);
        this.scene.add(this.particleStreams);
    }
    
    initMouseTracking() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        });
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        const time = Date.now() * 0.001;
        
        this.starLayers.forEach((layer, i) => {
            layer.rotation.y += layer.userData.speed * (i + 1);
            layer.rotation.x += layer.userData.speed * 0.5;
        });
        
        if (this.nebula) {
            this.nebula.rotation.y += 0.00005;
            this.nebula.rotation.x += 0.00003;
        }
        
        this.techObjects.forEach((obj) => {
            if (obj.userData.originalPosition) {
                obj.userData.orbitAngle += obj.userData.orbitSpeed;
                const orbitX = Math.cos(obj.userData.orbitAngle) * obj.userData.orbitRadius;
                const orbitZ = Math.sin(obj.userData.orbitAngle) * obj.userData.orbitRadius;
                const floatY = Math.sin(time * obj.userData.speed * 2) * obj.userData.floatAmplitude;
                
                obj.position.x = orbitX + Math.sin(time * obj.userData.speed) * 2;
                obj.position.y = obj.userData.originalPosition.y + floatY;
                obj.position.z = orbitZ + Math.cos(time * obj.userData.speed) * 2;
                
                obj.rotation.x += obj.userData.rotationSpeed.x;
                obj.rotation.y += obj.userData.rotationSpeed.y;
                obj.rotation.z += obj.userData.rotationSpeed.z;
                
                const pulse = 1 + Math.sin(time * 0.5) * 0.05;
                obj.scale.setScalar(pulse);
            }
        });
        
        this.geometricObjects.forEach((obj) => {
            obj.userData.orbitAngle += obj.userData.orbitSpeed;
            const orbitX = Math.cos(obj.userData.orbitAngle) * obj.userData.orbitRadius;
            const orbitZ = Math.sin(obj.userData.orbitAngle) * obj.userData.orbitRadius;
            const floatY = Math.sin(time * 0.3) * obj.userData.floatAmplitude;
            
            obj.position.x = orbitX;
            obj.position.y = obj.userData.originalPosition.y + floatY;
            obj.position.z = orbitZ;
            
            obj.rotation.x += obj.userData.rotationSpeed.x;
            obj.rotation.y += obj.userData.rotationSpeed.y;
            obj.rotation.z += obj.userData.rotationSpeed.z;
        });
        
        if (this.particleStreams) {
            this.particleStreams.rotation.y += 0.0002;
            const positions = this.particleStreams.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] -= 0.05;
                if (positions[i + 1] < -100) positions[i + 1] = 100;
            }
            this.particleStreams.geometry.attributes.position.needsUpdate = true;
        }
        
        this.camera.position.x += (this.mouseX * 3 - this.camera.position.x) * 0.01;
        this.camera.position.y += (this.mouseY * 2 - this.camera.position.y) * 0.01;
        this.camera.lookAt(this.scene.position);
        
        this.renderer.render(this.scene, this.camera);
    }
}

class TypingEffect {
    constructor() {
        this.typingCommand = document.getElementById('typing-command');
        this.techStack = document.getElementById('tech-stack');
        this.commands = ["about_me?", "education_info", "position_of_responsibility", "profile_highlights"];
        this.techStackItems = [
       "Engineering student focused on scalable systems and real-time applications",
       "Solved 350+ LeetCode problems",
       "B.Tech (ECE) @ NSUT Delhi | 6th Semester | CGPA: 8.44 (Till 5th Semester)",
      "Building scalable, high-performance systems with real-time capabilities",
      "Executive Council Member (2024-25) - Subhasha (NSUT)"
];
        this.currentCommandIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.startTyping();
        this.showTechStack();
    }
    
    startTyping() {
        const cmd = this.commands[this.currentCommandIndex];
        if (this.isDeleting) {
            this.typingCommand.textContent = cmd.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;
        } else {
            this.typingCommand.textContent = cmd.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
        }
        
        if (!this.isDeleting && this.currentCharIndex === cmd.length) {
            this.isDeleting = true;
            setTimeout(() => this.startTyping(), 2000);
        } else if (this.isDeleting && this.currentCharIndex === 0) {
            this.isDeleting = false;
            this.currentCommandIndex = (this.currentCommandIndex + 1) % this.commands.length;
            setTimeout(() => this.startTyping(), 500);
        } else {
            setTimeout(() => this.startTyping(), this.isDeleting ? 50 : 100);
        }
    }
    
    showTechStack() {
        let html = '';
        this.techStackItems.forEach((tech) => {
            html += `<div class="tech-item">
                <span class="prompt">></span> ${tech}
                <span class="progress-bar">
                    <span class="progress" style="width: ${Math.floor(Math.random() * 30 + 70)}%"></span>
                </span>
            </div>`;
        });
        this.techStack.innerHTML = html;
        setTimeout(() => {
            document.querySelectorAll('.progress').forEach(bar => {
                bar.style.transition = 'width 2s ease-out';
            });
        }, 500);
    }
}

class ProjectsManager {
    constructor() {
      
this.projects = [
    { 
        title: "FirstHire", 
        subtitle: "AI-Powered ATS Resume Analyzer & Career Mentor",
        description: `**Built an AI-powered platform with secure authentication and authorization, enabling resume upload (PDF/DOCX) and structured ATS scoring with section-wise analysis.**

• Used OpenAI APIs and Noupe Chatbot for resume parsing, improvement recommendations, and career guidance.  
• Created a user dashboard with scan history, improvement trends, skill gap statistics, and downloadable ATS reports.`, 
        tech: ["MERN Stack", "OpenAI API", "Chatbot"], 
        icon: '<i class="fas fa-robot"></i>',
        liveDemo: true,
        link: "https://firsthire.onrender.com/"
    },
    { 
        title: "YipYap", 
        subtitle: "Real-Time Chat Web Application",
        description: `**Developed a real-time chat application with secure user authentication and session management using JWT and bcrypt.**

• Implemented core messaging features including online user presence, typing indicators, image sharing, and emoji support.  
• Enabled user profile customization and integrated DaisyUI to support multiple UI themes for an enhanced user experience.`, 
        tech: ["MERN Stack", "Socket.io"], 
        icon: '<i class="fas fa-comments"></i>',
        liveDemo: true,
        link: "https://realtimechatapp-1ucq.onrender.com/"
    },
    { 
        title: "SereneStay", 
        subtitle: "Travel Listing Web App",
        description: `**Developed a web app for property listings with add, edit, delete, and review functionality using Node.js and MongoDB.**

• Implemented secure authentication, authorization, and image upload with Cloudinary and Multer.  
• Designed a responsive UI using EJS and Bootstrap, ensuring seamless experience across all devices.`, 
        tech: ["MERN Stack", "EJS", "Cloudinary"], 
        icon: '<i class="fas fa-hotel"></i>',
        liveDemo: true,
        link: "https://airbnbclone2-1.onrender.com/"
    },
    { 
        title: "Trackerr", 
        subtitle: "Real-Time Location Sharing Web App",
        description: `**Built a real-time map interface to share user locations dynamically across multiple devices using Socket.io and the Geolocation API.**

• Improved real-time communication performance for smoother location updates across connected users.`, 
        tech: ["Node.js", "Express.js", "Leaflet.js", "Socket.io"], 
        icon: '<i class="fas fa-map-marker-alt"></i>',
        liveDemo: true,
        link: "https://trackerr-sq4i.onrender.com/"
    }
];

        this.renderProjects();
    }
    
    renderProjects() {
    const grid = document.querySelector('.projects-grid');
    let html = '';
    
    this.projects.forEach(p => {
        html += `
        <div class="github-repo">
            <!-- Header -->
            <div class="repo-header">
                <div class="repo-title">
                    <div class="repo-icon">${p.icon}</div>
                    <div class="title-content">
                        <h3 class="repo-name">
                            <a href="${p.link}" target="_blank" class="repo-link">
                                ${p.title}
                            </a>
                        </h3>
                        <span class="repo-badge">Public</span>
                    </div>
                </div>
                <div class="repo-stats">
                    <span class="live-badge">
                        <span class="live-dot"></span>
                        Live
                    </span>
                </div>
            </div>
            
            <!-- Description -->
            <div class="repo-desc">
                ${p.subtitle}
            </div>
            
            <!-- README Content -->
            <div class="readme-container">
                <div class="readme-header">
                    <svg class="octicon" viewBox="0 0 16 16" width="16" height="16">
                        <path fill="currentColor" d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 0 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 0 1 1-1h8zM5 12.25v3.25a.25.25 0 0 0 .4.2l1.45-1.087a.25.25 0 0 1 .3 0L8.6 15.7a.25.25 0 0 0 .4-.2v-3.25a.25.25 0 0 0-.25-.25h-3.5a.25.25 0 0 0-.25.25z"></path>
                    </svg>
                    <span class="readme-title">README.md</span>
                </div>
                
                <div class="readme-body">
                    <!-- Description Section -->
                    <div class="markdown-section">
                        <h2 class="section-heading">
                            <svg class="octicon" viewBox="0 0 16 16" width="16" height="16">
                                <path fill="currentColor" d="M0 1.75A.75.75 0 0 1 .75 1h4.253c1.227 0 2.317.59 3 1.501A3.744 3.744 0 0 1 11.006 1h4.245a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75h-4.507a2.25 2.25 0 0 0-1.591.659l-.622.621a.75.75 0 0 1-1.06 0l-.622-.621A2.25 2.25 0 0 0 5.258 13H.75a.75.75 0 0 1-.75-.75V1.75zm8.755 3a2.25 2.25 0 0 1 2.25-2.25H14.5v9h-3.757c-.71 0-1.4.201-2.004.572L8 12.133l-.74-.561A2.25 2.25 0 0 0 5.257 10.5H1.5v-9h5.757a2.25 2.25 0 0 1 2.25 2.25v.25a.75.75 0 0 0 1.5 0v-.25z"></path>
                            </svg>
                            Description
                        </h2>
                        <div class="markdown-content">${p.description}</div>
                    </div>
                    
                    <!-- Tech Stack Section -->
                    <div class="markdown-section">
                        <h2 class="section-heading">
                            <svg class="octicon" viewBox="0 0 16 16" width="16" height="16">
                                <path fill="currentColor" d="M8 1.5c-2.363 0-4 1.69-4 3.75 0 .984.424 1.625.984 2.304l.214.253c.223.264.47.556.673.848.284.411.537.896.621 1.49a.75.75 0 0 1-1.484.211c-.04-.282-.163-.547-.37-.847a8.456 8.456 0 0 0-.542-.68c-.084-.1-.173-.205-.268-.32C3.201 7.75 2.5 6.766 2.5 5.25 2.5 2.31 4.863 0 8 0s5.5 2.31 5.5 5.25c0 1.516-.701 2.5-1.328 3.259-.095.115-.184.22-.268.319-.207.245-.383.453-.541.681-.208.3-.33.565-.37.847a.75.75 0 0 1-1.485-.212c.084-.594.337-1.078.621-1.489.203-.292.45-.584.673-.848.075-.088.147-.173.213-.253.561-.679.985-1.32.985-2.304 0-2.06-1.637-3.75-4-3.75zM6 15.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75z"></path>
                            </svg>
                            Tech Stack
                        </h2>
                        <div class="tech-stack">
                            ${p.tech.map(tech => `
                                <span class="tech-badge">
                                    <span class="tech-dot"></span>
                                    ${tech}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- Live Demo Section -->
                    <div class="markdown-section">
                        <h2 class="section-heading">
                            <svg class="octicon" viewBox="0 0 16 16" width="16" height="16">
                                <path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path>
                            </svg>
                            Live Demo
                        </h2>
                        <div class="demo-link">
                            <a href="${p.link}" target="_blank" class="demo-btn">
                                <svg class="octicon" viewBox="0 0 16 16" width="16" height="16">
                                    <path fill="currentColor" d="M1.5 0A1.5 1.5 0 0 0 0 1.5v13A1.5 1.5 0 0 0 1.5 16h13a1.5 1.5 0 0 0 1.5-1.5v-9a1.5 1.5 0 0 0-1.5-1.5H9.5V1.5A1.5 1.5 0 0 0 8 0H1.5zM1 1.5a.5.5 0 0 1 .5-.5H8a.5.5 0 0 1 .5.5V8H1.5a.5.5 0 0 1-.5-.5v-6zM1.5 9H9v5.5a.5.5 0 0 1-.5.5h-6a.5.5 0 0 1-.5-.5V9zM15 1.5a.5.5 0 0 1-.5.5H9V1.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-.5.5H9.5V8h5a1.5 1.5 0 0 0 1.5-1.5v-5z"></path>
                                </svg>
                                View Live Project
                                <svg class="external-icon" viewBox="0 0 24 24" width="16" height="16">
                                    <path fill="currentColor" d="M10 6v2H5v11h11v-5h2v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6zm11-3v9h-2V6.413l-7.793 7.794-1.414-1.414L17.585 5H13V3h8z"></path>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    });
    
    grid.innerHTML = html;
}
}

class PerfectMarquee {
    constructor() {
        this.container = document.querySelector('.marquee-container');
        this.track = document.querySelector('.marquee-track');
        if (!this.container || !this.track) return;
        
    this.skills = [
    { name: "C++", icon: '<i class="devicon-cplusplus-plain"></i>' },
    { name: "JavaScript", icon: '<i class="devicon-javascript-plain"></i>' },
    { name: "SQL", icon: '<i class="devicon-mysql-plain"></i>' },
    { name: "React.js", icon: '<i class="devicon-react-original"></i>' },
    { name: "Node.js", icon: '<i class="devicon-nodejs-plain"></i>' },
    { name: "Express.js", icon: '<i class="devicon-express-original"></i>' },
    { name: "HTML", icon: '<i class="devicon-html5-plain"></i>' },
    { name: "CSS", icon: '<i class="devicon-css3-plain"></i>' },
    { name: "Bootstrap", icon: '<i class="devicon-bootstrap-plain"></i>' },
    { name: "MongoDB", icon: '<i class="devicon-mongodb-plain"></i>' },
    { name: "GitHub", icon: '<i class="devicon-github-original"></i>' },
    { name: "Postman", icon: '<i class="devicon-postman-plain"></i>'},
    { name: "OpenAI", icon: '<i class="fa-solid fa-robot"></i>' },
    { name: "Python", icon: '<i class="devicon-python-plain"></i>' },
    { name: "PostgreSQL", icon: '<i class="devicon-postgresql-plain"></i>' },
    { name: "Socket.io", icon: '<i class="devicon-socketio-plain"></i>' },
    { name: "npm", icon: '<i class="devicon-npm-original-wordmark"></i>' },
    { name: "Hoppscotch", icon: '<i class="devicon-hoppscotch-plain"></i>'}
];
        this.init();
    }
    
    init() {
        this.track.innerHTML = '';
        for (let copy = 0; copy < 3; copy++) {
            this.skills.forEach((skill) => {
                const item = document.createElement('div');
                item.className = 'marquee-item';
                item.innerHTML = `<div class="tech-logo">${skill.icon}</div><span class="tech-name">${skill.name}</span>`;
                this.track.appendChild(item);
            });
        }
        
        const duration = (this.skills.length * 3) * 2.5;
        this.track.style.animation = `marquee ${duration}s linear infinite`;
        
        this.container.addEventListener('mouseenter', () => this.track.style.animationPlayState = 'paused');
        this.container.addEventListener('mouseleave', () => this.track.style.animationPlayState = 'running');
    }
}

class ContactRobot {
    constructor() {
        this.container = document.getElementById('contact-robot');
        if (!this.container) return;
        
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
        this.camera.position.set(0, 1, 8);
        
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setClearColor(0x000000, 0);
        this.container.appendChild(this.renderer.domElement);
        
        const ambLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambLight);
        
        const pLight1 = new THREE.PointLight(0x00ff88, 1, 100);
        pLight1.position.set(5, 5, 5);
        this.scene.add(pLight1);
        
        const pLight2 = new THREE.PointLight(0x0088ff, 1, 100);
        pLight2.position.set(-5, 3, 5);
        this.scene.add(pLight2);
        
        this.createRobot();
        this.mouseX = 0;
        this.mouseY = 0;
        
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        window.addEventListener('resize', () => this.onWindowResize());
        this.animate();
    }
    
    createRobot() {
        this.robotGroup = new THREE.Group();
        
        const bodyMat = new THREE.MeshPhongMaterial({ color: 0x1a1a2e, emissive: 0x0088ff, emissiveIntensity: 0.3, shininess: 100 });
        const accentMat = new THREE.MeshPhongMaterial({ color: 0x00ff88, emissive: 0x00ff88, emissiveIntensity: 0.5, shininess: 150 });
        const glassMat = new THREE.MeshPhongMaterial({ color: 0x00ddff, emissive: 0x0088ff, emissiveIntensity: 0.8, transparent: true, opacity: 0.9, shininess: 200 });
        
        this.head = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1.2, 6), bodyMat);
        this.head.position.y = 2;
        this.robotGroup.add(this.head);
        
        const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.8), accentMat);
        antenna.position.y = 2.8;
        this.robotGroup.add(antenna);
        
        this.antennaBall = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), glassMat);
        this.antennaBall.position.y = 3.3;
        this.robotGroup.add(this.antennaBall);
        
        this.leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), glassMat);
        this.leftEye.position.set(-0.4, 2.2, 0.8);
        this.robotGroup.add(this.leftEye);
        
        this.rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), glassMat);
        this.rightEye.position.set(0.4, 2.2, 0.8);
        this.robotGroup.add(this.rightEye);
        
        const body = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2, 1.2), bodyMat);
        body.position.y = 0.2;
        this.robotGroup.add(body);
        
        this.chestScreen = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 0.1), glassMat);
        this.chestScreen.position.set(0, 0.5, 0.65);
        this.robotGroup.add(this.chestScreen);
        
        for (let i = 0; i < 2; i++) {
            const x = i === 0 ? -1.2 : 1.2;
            const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.15, 1.5), bodyMat);
            arm.position.set(x, 0, 0);
            this.robotGroup.add(arm);
        }
        
        for (let i = 0; i < 2; i++) {
            const x = i === 0 ? -0.5 : 0.5;
            const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, 2.5), bodyMat);
            leg.position.set(x, -2, 0);
            this.robotGroup.add(leg);
        }
        
        const pCount = 50;
        const pGeo = new THREE.BufferGeometry();
        const pPos = new Float32Array(pCount * 3);
        const pCol = new Float32Array(pCount * 3);
        
        for (let i = 0; i < pCount; i++) {
            pPos[i * 3] = (Math.random() - 0.5) * 10;
            pPos[i * 3 + 1] = (Math.random() - 0.5) * 10;
            pPos[i * 3 + 2] = (Math.random() - 0.5) * 5;
            
            if (Math.random() < 0.5) {
                pCol[i * 3] = 0; pCol[i * 3 + 1] = 1; pCol[i * 3 + 2] = 0.53;
            } else {
                pCol[i * 3] = 0; pCol[i * 3 + 1] = 0.53; pCol[i * 3 + 2] = 1;
            }
        }
        
        pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
        pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));
        this.particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ size: 0.1, vertexColors: true, transparent: true, opacity: 0.6 }));
        this.scene.add(this.particles);
        this.scene.add(this.robotGroup);
    }
    
    onMouseMove(e) {
        this.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    }
    
    onWindowResize() {
        if (!this.container) return;
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        const t = Date.now() * 0.001;
        
        if (this.robotGroup) {
            this.robotGroup.rotation.y += (this.mouseX * 0.3 - this.robotGroup.rotation.y) * 0.05;
            this.robotGroup.rotation.x += (this.mouseY * 0.2 - this.robotGroup.rotation.x) * 0.05;
            this.robotGroup.position.y = Math.sin(t * 0.5) * 0.3;
            
            if (this.head) this.head.rotation.y = Math.sin(t * 0.8) * 0.1;
            
            if (this.leftEye && this.rightEye) {
                const eyeScale = 1 + Math.sin(t * 2) * 0.1;
                this.leftEye.scale.set(eyeScale, eyeScale, eyeScale);
                this.rightEye.scale.set(eyeScale, eyeScale, eyeScale);
            }
            
            if (this.antennaBall) {
                this.antennaBall.rotation.y = t * 2;
                const ballScale = 1 + Math.sin(t * 3) * 0.2;
                this.antennaBall.scale.set(ballScale, ballScale, ballScale);
            }
            
            if (this.chestScreen) {
                this.chestScreen.material.emissiveIntensity = 0.5 + Math.sin(t * 1.5) * 0.3;
            }
        }
        
        if (this.particles) {
            this.particles.rotation.y = t * 0.1;
            const pos = this.particles.geometry.attributes.position.array;
            for (let i = 0; i < pos.length; i += 3) {
                pos[i + 1] += Math.sin(t + i) * 0.01;
            }
            this.particles.geometry.attributes.position.needsUpdate = true;
        }
        
        this.renderer.render(this.scene, this.camera);
    }
}


class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        if (this.form) {
            this.form.setAttribute('novalidate', 'novalidate');
            
            this.setupCustomValidation();
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }
    
    setupCustomValidation() {
        const inputs = this.form.querySelectorAll('input[required], textarea[required]');
        
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.clearError(input);
                if (input.value.trim() !== '') {
                    this.showSuccess(input);
                }
            });
            
            input.addEventListener('blur', () => {
                if (input.value.trim() === '') {
                    this.showError(input);
                } else if (input.type === 'email' && !this.isValidEmail(input.value)) {
                    this.showError(input, 'Invalid email format');
                } else {
                    this.showSuccess(input);
                }
            });
        });
    }
    
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    showError(input, customMsg) {
        this.clearError(input);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'terminal-error';
        
        let errorMsg = customMsg || `ERROR: ${input.placeholder || 'This field'} is required`;
        
        errorDiv.innerHTML = `
            <span class="error-icon">✗</span> 
            <span class="error-text">${errorMsg}</span>
        `;
        
        input.classList.add('input-error');
        input.classList.remove('input-success');
        
        input.parentNode.insertBefore(errorDiv, input.nextSibling);
        
        
        input.style.animation = 'shake 0.4s';
        setTimeout(() => input.style.animation = '', 400);
    }
    
    showSuccess(input) {
        this.clearError(input);
        input.classList.remove('input-error');
        input.classList.add('input-success');
    }
    
    clearError(input) {
        input.classList.remove('input-error');
        input.classList.remove('input-success');
        const error = input.parentNode.querySelector('.terminal-error');
        if (error) error.remove();
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const inputs = this.form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (input.value.trim() === '') {
                this.showError(input);
                isValid = false;
            } else if (input.type === 'email' && !this.isValidEmail(input.value)) {
                this.showError(input, 'ERROR: Invalid email format');
                isValid = false;
            }
        });
        
        if (!isValid) {
            return;
        }
        
        const btn = this.form.querySelector('.terminal-btn');
        btn.innerHTML = '<span class="prompt">$</span> Sending<span class="dots">...</span>';
        btn.disabled = true;
        
        this.form.submit();
    }
}

class TechFooter {
    constructor() {
        this.techStatus = document.getElementById('tech-status');
        this.currentDate = document.getElementById('current-date');
        this.currentTime = document.getElementById('current-time');
        
        this.techPhases = [
            "Initializing...",
            "Loading dependencies...",
            "Compiling code...",
            "Building project...",
            "Running tests...",
            "Deploying...",
            "Optimizing...",
            "Live reloading...",
            "Debugging...",
            "Pushing to GitHub...",
            "Merging branches...",
            "Updating docs...",
            "Code review...",
            "Refactoring...",
            "Containerizing...",
            "Scaling infrastructure..."
        ];
        
        this.currentPhase = 0;
        
        if (this.techStatus && this.currentDate && this.currentTime) {
            this.init();
        }
    }
    
    init() {
        this.updateDateTime();
        setInterval(() => this.updateDateTime(), 1000); 
        this.rotateTechStatus();
        setInterval(() => this.rotateTechStatus(), 4000); 
    }
    
    updateDateTime() {
        const now = new Date();
        
        const dateOptions = { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        };
        this.currentDate.textContent = now.toLocaleDateString('en-US', dateOptions);
        
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        
        const colon = now.getSeconds() % 2 === 0 ? ':' : ':';
        
        this.currentTime.innerHTML = `
            <span class="time-hours">${hours}</span>
            <span class="time-colon">${colon}</span>
            <span class="time-minutes">${minutes}</span>
            <span class="time-colon">${colon}</span>
            <span class="time-seconds">${seconds}</span>
        `;
    }
    
    rotateTechStatus() {
        if (!this.techStatus) return;
        
        this.techStatus.style.opacity = '0.5';
        this.techStatus.style.transform = 'translateX(-5px)';
        
        setTimeout(() => {
            this.currentPhase = (this.currentPhase + 1) % this.techPhases.length;
            this.techStatus.textContent = this.techPhases[this.currentPhase];
            
            this.techStatus.style.opacity = '1';
            this.techStatus.style.transform = 'translateX(0)';
            
            if (this.techPhases[this.currentPhase].includes('Deploying') || 
                this.techPhases[this.currentPhase].includes('Live')) {
                this.techStatus.style.color = 'var(--primary-green)';
                this.techStatus.style.textShadow = '0 0 10px var(--primary-green)';
            } else if (this.techPhases[this.currentPhase].includes('Debugging')) {
                this.techStatus.style.color = '#ff6600';
                this.techStatus.style.textShadow = '0 0 10px rgba(255, 102, 0, 0.3)';
            } else if (this.techPhases[this.currentPhase].includes('Optimizing') ||
                      this.techPhases[this.currentPhase].includes('Scaling')) {
                this.techStatus.style.color = '#0088ff';
                this.techStatus.style.textShadow = '0 0 10px rgba(0, 136, 255, 0.3)';
            } else {
                this.techStatus.style.color = 'var(--primary-green)';
                this.techStatus.style.textShadow = 'none';
            }
        }, 300);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TechFooter(); 
});
class SmoothScroll {
    constructor() {
        document.querySelectorAll('a[href^="#"]').forEach(a => {
            a.addEventListener('click', (e) => {
                e.preventDefault();
                const id = a.getAttribute('href');
                if (id === '#') return;
                const el = document.querySelector(id);
                if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
   
    new EnhancedStarryBackground();
    new TypingEffect();
    new ProjectsManager();
    new PerfectMarquee();
    new ContactForm();
    new ContactRobot();
    new SmoothScroll();
    
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', () => card.style.transform = 'translateY(-10px) scale(1.02)');
        card.addEventListener('mouseleave', () => card.style.transform = 'translateY(0) scale(1)');
    });
    
    document.querySelectorAll('.terminal-input, .terminal-textarea').forEach(input => {
        input.addEventListener('focus', () => input.parentElement.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.3)');
        input.addEventListener('blur', () => input.parentElement.style.boxShadow = '');
    });
    
   
});
function resetForm() {
    setTimeout(() => {
        const form = document.getElementById('contact-form');
        if (form) {
            form.reset();
            
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.classList.remove('input-success');
                input.classList.remove('input-error');
            });
            
            const btn = form.querySelector('.terminal-btn');
            if (btn) {
                btn.innerHTML = '<span class="prompt">$</span> ./send_message.sh';
                btn.disabled = false;
            }
        }
    }, 100); 
}