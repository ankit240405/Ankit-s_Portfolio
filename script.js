// ===== Deobfuscated portfolio script (requires THREE.js on the page) =====

/* ---------- Three.js animated background ---------- */
class EnhancedStarryBackground {
  constructor() {
    this.container = document.getElementById('three-container');
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x000000, 0.0008); // approx color

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    this.camera.position.z = 100;

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);
    this.container.appendChild(this.renderer.domElement);

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const light1 = new THREE.PointLight(0x00ff88, 1.5, 150); // approx
    light1.position.set(50, 50, 50);
    this.scene.add(light1);
    const light2 = new THREE.PointLight(0x0088ff, 1.5, 150); // approx
    light2.position.set(-50, -50, 50);
    this.scene.add(light2);

    this.starLayers = [];
    this.techObjects = [];
    this.geometricObjects = [];
    this.createMultiLayeredStarfield();
    this.createNebulaClouds();
    this.createEnhancedTechElements();
    this.createGeometricShapes();
    this.createParticleStreams();

    this.mouseX = 0;
    this.mouseY = 0;
    this.initMouseTracking();
    this.animate();
    window.addEventListener('resize', () => this.onWindowResize(), false);
  }

  createMultiLayeredStarfield() {
    const layers = [
      { count: 3000, size: 0.05, distance: 200, speed: 0.0001 },
      { count: 2000, size: 0.1, distance: 150, speed: 0.0002 },
      { count: 1000, size: 0.15, distance: 100, speed: 0.0003 },
    ];
    layers.forEach(({ count, size, distance, speed }) => {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const r = distance + Math.random() * distance;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);
        const c = Math.random();
        if (c < 0.6) { colors[i * 3] = 0.8; colors[i * 3 + 1] = 0.9; colors[i * 3 + 2] = 1; }       // approx
        else if (c < 0.8) { colors[i * 3] = 0.5; colors[i * 3 + 1] = 1; colors[i * 3 + 2] = 0.8; }
        else { colors[i * 3] = 0.3; colors[i * 3 + 1] = 0.6; colors[i * 3 + 2] = 1; }
      }
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      const material = new THREE.PointsMaterial({
        size, vertexColors: true, transparent: true, opacity: 0.9,
        sizeAttenuation: true, blending: THREE.AdditiveBlending,
      });
      const stars = new THREE.Points(geometry, material);
      stars.userData = { speed };
      this.scene.add(stars);
      this.starLayers.push(stars);
    });
  }

  createNebulaClouds() {
    const count = 500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 150;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      colors[i * 3] = 0.4; colors[i * 3 + 1] = 0.1 + Math.random() * 0.3; colors[i * 3 + 2] = 0.5 + Math.random() * 0.2; // approx
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({
      size: 4, vertexColors: true, transparent: true, opacity: 0.15,
      sizeAttenuation: true, blending: THREE.AdditiveBlending,
    });
    this.nebula = new THREE.Points(geometry, material);
    this.scene.add(this.nebula);
  }

  createEnhancedTechElements() {
    const symbols = [
      { text: '{ }', color: 0x00ff88, size: 4 },
      { text: '< />', color: 0x0088ff, size: 4 },
      { text: '[ ]', color: 0xff6600, size: 4 },
      { text: '=>', color: 0x00ddff, size: 3.5 },
      { text: 'fn()', color: 0xaa00ff, size: 4 },
      { text: 'AI', color: 0xff0088, size: 4 },
      { text: 'API', color: 0x88ff00, size: 4 },
    ];
    const loader = new THREE.FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
      symbols.forEach(({ text, color, size }) => {
        const geometry = new THREE.TextGeometry(text, {
          font, size: size * 0.8 / 4 * 4, height: 0.5 * 2, curveSegments: 12,
          bevelEnabled: true, bevelThickness: 0.15, bevelSize: 0.1, bevelSegments: 5,
        }); // approx dimensions
        geometry.computeBoundingBox();
        const centerOffset = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
        const material = new THREE.MeshPhongMaterial({
          color, emissive: color, emissiveIntensity: 0.4,
          transparent: true, opacity: 0.85, shininess: 150, specular: 0xffffff,
        });
        const mesh = new THREE.Mesh(geometry, material);
        const angle = Math.random() * Math.PI * 2;
        const radius = 30 + Math.random() * 30; // approx
        mesh.position.x = Math.cos(angle) * radius + centerOffset;
        mesh.position.y = (Math.random() - 0.5) * 60;
        mesh.position.z = Math.sin(angle) * radius;
        mesh.userData = {
          originalPosition: mesh.position.clone(),
          speed: 0.0005 + Math.random() * 0.001,
          rotationSpeed: new THREE.Vector3(0.015 * Math.random(), 0.015 * Math.random(), 0.0075),
          orbitRadius: radius,
          orbitSpeed: 0.0002 + Math.random() * 0.0003,
          orbitAngle: angle,
          floatAmplitude: 1 + Math.random() * 2,
        };
        this.scene.add(mesh);
        this.techObjects.push(mesh);
      });
    });
  }

  createGeometricShapes() {
    const shapes = [
      { type: 'octahedron', color: 0x0088ff, size: 3 },
      { type: 'dodecahedron', color: 0x00ff88, size: 2.5 },
      { type: 'icosahedron', color: 0xff6600, size: 3 },
      { type: 'tetrahedron', color: 0xaa00ff, size: 3 },
      { type: 'torus', color: 0x00ddff, size: 2 },
      { type: 'torusKnot', color: 0xff0088, size: 2 },
    ];
    shapes.forEach(({ type, color, size }) => {
      let geometry;
      switch (type) {
        case 'octahedron': geometry = new THREE.OctahedronGeometry(size); break;
        case 'dodecahedron': geometry = new THREE.DodecahedronGeometry(size); break;
        case 'icosahedron': geometry = new THREE.IcosahedronGeometry(size); break;
        case 'tetrahedron': geometry = new THREE.TetrahedronGeometry(size); break;
        case 'torus': geometry = new THREE.TorusGeometry(size, 0.8, 16, 100); break;
        case 'torusKnot': geometry = new THREE.TorusKnotGeometry(size, 0.4, 100, 16); break;
      }
      const material = new THREE.MeshPhongMaterial({
        color, emissive: color, emissiveIntensity: 0.3, transparent: true, opacity: 0.5, wireframe: true,
      });
      const mesh = new THREE.Mesh(geometry, material);
      const angle = Math.random() * Math.PI * 2;
      const radius = 40 + Math.random() * 40; // approx
      mesh.position.x = Math.cos(angle) * radius;
      mesh.position.y = (Math.random() - 0.5) * 80;
      mesh.position.z = Math.sin(angle) * radius;
      mesh.userData = {
        originalPosition: mesh.position.clone(),
        rotationSpeed: new THREE.Vector3(0.01 * Math.random(), 0.01 * Math.random(), 0.005),
        orbitRadius: radius,
        orbitSpeed: 0.0003 + Math.random() * 0.0002,
        orbitAngle: angle,
        floatAmplitude: 1 + Math.random() * 3,
      };
      this.scene.add(mesh);
      this.geometricObjects.push(mesh);
    });
  }

  createParticleStreams() {
    const count = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
      colors[i * 3] = 0; colors[i * 3 + 1] = 0.8; colors[i * 3 + 2] = 1; // approx
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({
      size: 0.2, vertexColors: true, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending,
    });
    this.particleStreams = new THREE.Points(geometry, material);
    this.scene.add(this.particleStreams);
  }

  initMouseTracking() {
    document.addEventListener('mousemove', (e) => {
      this.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    }, false);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    const time = Date.now() * 0.001;

    this.starLayers.forEach((layer) => {
      layer.rotation.y += layer.userData.speed;
      layer.rotation.x += layer.userData.speed * 0.5;
    });
    if (this.nebula) {
      this.nebula.rotation.y += 0.00005;
      this.nebula.rotation.x += 0.00003;
    }

    const updateOrbiting = (obj) => {
      const d = obj.userData;
      d.orbitAngle += d.orbitSpeed;
      obj.position.x = Math.cos(d.orbitAngle) * d.orbitRadius + d.originalPosition.x * 0.1;
      obj.position.y = d.originalPosition.y + Math.sin(time * 0.5) * d.floatAmplitude;
      obj.position.z = Math.sin(d.orbitAngle) * d.orbitRadius;
      obj.rotation.x += d.rotationSpeed.x;
      obj.rotation.y += d.rotationSpeed.y;
      obj.rotation.z += d.rotationSpeed.z;
    };
    this.techObjects.forEach(updateOrbiting);
    this.geometricObjects.forEach((obj) => {
      updateOrbiting(obj);
      obj.scale.setScalar(1 + Math.sin(time * 0.5) * 0.05);
    });

    if (this.particleStreams) this.particleStreams.rotation.y += 0.0002;

    this.camera.position.x += (this.mouseX * 5 - this.camera.position.x) * 0.05;
    this.camera.position.y += (this.mouseY * 5 - this.camera.position.y) * 0.05;
    this.camera.lookAt(this.scene.position);

    this.renderer.render(this.scene, this.camera);
  }
}

/* ---------- Typing effect (hero terminal) ---------- */
class TypingEffect {
  constructor() {
    this.typingCommand = document.getElementById('typing-command');
    this.techStack = document.getElementById('tech-stack');
    this.commands = [
      'about_me',
      'educational_info',
      'profile_highlights',
    ];
    this.outputs = {
      about_me: 'Engineering student focused on scalable systems and real-time applications',
      educational_info: [
        'B.Tech (ECE) - Netaji Subhas University of Technology (NSUT), Delhi (Currently in 6th Semester)',
        'CGPA: 8.44 (Till 5th Semester)',
      ],
      profile_highlights: [
        'Strong problem-solving skills with 500+ DSA problems solved across platforms',
        'Transforming concepts into functional, production-style applications',
      ],
    };
    // Original stores the 5 text lines in this order:
    this.techStackItems = [
      'Engineering student focused on scalable systems and real-time applications',
      'Strong problem-solving skills with 500+ DSA problems solved across platforms',
      'B.Tech (ECE) - Netaji Subhas University of Technology (NSUT), Delhi (Currently in 6th Semester)',
      'CGPA: 8.44 (Till 5th Semester)',
      'Transforming concepts into functional, production-style applications',
    ];
    this.currentCommandIndex = 0;
    this.currentCharIndex = 0;
    this.isDeleting = false;
    this.startTyping();
    this.showTechStack();
  }

  startTyping() {
    const command = this.commands[this.currentCommandIndex];
    if (this.isDeleting) {
      this.typingCommand.textContent = command.substring(0, this.currentCharIndex - 1);
      this.currentCharIndex--;
    } else {
      this.typingCommand.textContent = command.substring(0, this.currentCharIndex + 1);
      this.currentCharIndex++;
    }

    let delay = this.isDeleting ? 50 : 100;
    if (!this.isDeleting && this.currentCharIndex === command.length) {
      this.isDeleting = true;
      delay = 2000;
    } else if (this.isDeleting && this.currentCharIndex === 0) {
      this.isDeleting = false;
      this.currentCommandIndex = (this.currentCommandIndex + 1) % this.commands.length;
      delay = 500;
    }
    setTimeout(() => this.startTyping(), delay);
  }

  showTechStack() {
    let html = '';
    this.techStackItems.forEach((item) => {
      html += `<div class="tech-item">
        <span class="prompt">></span> ${item}
        <span class="progress-bar">
          <span class="progress" style="width: ${Math.floor(Math.random() * 30 + 70)}%"></span>
        </span>
      </div>`; // approx: bar widths were random
    });
    this.techStack.innerHTML = html;
    setTimeout(() => {
      document.querySelectorAll('.progress').forEach((el) => {
        el.style.transition = 'width 2s ease-out';
      });
    }, 500);
  }
}

/* ---------- Projects ---------- */
class ProjectsManager {
  constructor() {
    this.projects = [
      {
        title: 'FirstHire',
        subtitle: 'AI-Powered ATS Resume Analyzer & Career Mentor',
        description:
          '**Built an AI-powered platform with secure authentication and authorization, enabling resume upload (PDF/DOCX) and structured ATS scoring with section-wise analysis.**\n\n' +
          '• Used OpenAI APIs and Noupe Chatbot for resume parsing, improvement recommendations, and career guidance.\n' +
          '• Created a user dashboard with scan history, improvement trends, skill gap statistics, and downloadable ATS reports.',
        tech: ['MERN Stack', 'OpenAI API', 'Chatbot'],
        icon: '<i class="fas fa-robot"></i>',
        liveDemo: true,
        link: 'https://firsthire.onrender.com/',
      },
      {
        title: 'YipYap',
        subtitle: 'Real-Time Chat Web Application',
        description:
          '**Developed a real-time chat application with secure user authentication and session management using JWT and bcrypt.**\n\n' +
          '• Implemented core messaging features including online user presence, typing indicators, image sharing, and emoji support.\n' +
          '• Enabled user profile customization and integrated DaisyUI to support multiple UI themes for an enhanced user experience.',
        tech: ['MERN Stack', 'Socket.io'],
        icon: '<i class="fas fa-comments"></i>',
        liveDemo: true,
        link: 'https://realtimechatapp-1ucq.onrender.com/',
      },
      {
        title: 'SereneStay',
        subtitle: 'Travel Listing Web App',
        description:
          '**Developed a web app for property listings with add, edit, delete, and review functionality using Node.js and MongoDB.**\n\n' +
          '• Implemented secure authentication, authorization, and image upload with Cloudinary and Multer.\n' +
          '• Designed a responsive UI using EJS and Bootstrap, ensuring seamless experience across all devices.',
        tech: ['Node.js', 'EJS', 'Cloudinary'],
        icon: '<i class="fas fa-hotel"></i>',
        liveDemo: true,
        link: 'https://airbnbclone2-1.onrender.com/',
      },
      {
        title: 'Trackerr',
        subtitle: 'Real-Time Location Sharing Web App',
        description:
          '**Built a real-time map interface to share user locations dynamically across multiple devices using Socket.io and the Geolocation API.**\n\n' +
          '• Improved real-time communication performance for smoother location updates across connected users.',
        tech: ['Node.js', 'Express.js', 'Socket.io', 'Leaflet.js'],
        icon: '<i class="fas fa-map-marker-alt"></i>',
        liveDemo: true,
        link: 'https://trackerr-sq4i.onrender.com/',
      },
    ];
    this.renderProjects();
  }

  renderTechBadge(tech) {
    return `
      <span class="tech-badge">
        <span class="tech-dot"></span>
        ${tech}
      </span>`;
  }

  renderProject(p) {
    return `
      <div class="github-repo">
        <!-- Header -->
        <div class="repo-header">
          <div class="repo-title">
            <div class="repo-icon">${p.icon}</div>
            <div class="title-content">
              <h3 class="repo-name">
                <a href="${p.link}" target="_blank" class="repo-link">${p.title}</a>
              </h3>
              <span class="repo-badge">Public</span>
            </div>
          </div>
          <div class="repo-stats">
            <span class="live-badge"><span class="live-dot"></span>Live</span>
          </div>
        </div>

        <!-- Description -->
        <div class="repo-desc">${p.subtitle}</div>

        <!-- README Content -->
        <div class="readme-container">
          <div class="readme-header">
            <span class="readme-title">README.md</span>
          </div>

          <div class="readme-body">
            <!-- Description Section -->
            <div class="markdown-section">
              <h2 class="section-heading">Description</h2>
              <div class="markdown-content">${p.description}</div>
            </div>

            <!-- Tech Stack Section -->
            <div class="markdown-section">
              <h2 class="section-heading">Tech Stack</h2>
              <div class="tech-stack">
                ${p.tech.map((t) => this.renderTechBadge(t)).join('')}
              </div>
            </div>

            <!-- Live Demo Section -->
            <div class="markdown-section">
              <h2 class="section-heading">Live Demo</h2>
              <div class="demo-link">
                <a href="${p.link}" target="_blank" class="demo-btn">View Live Project</a>
              </div>
            </div>
          </div>
        </div>
      </div>`; // SVG octicons omitted for readability
  }

  renderProjects() {
    const grid = document.querySelector('.projects-grid');
    grid.innerHTML = this.projects.map((p) => this.renderProject(p)).join('');
  }
}

/* ---------- Skills marquee ---------- */
class PerfectMarquee {
  constructor() {
    this.container = document.querySelector('.marquee-container');
    this.track = document.querySelector('.marquee-track');
    this.skills = [
      { name: 'C++', icon: '<i class="devicon-cplusplus-plain"></i>' },
      { name: 'JavaScript', icon: '<i class="devicon-javascript-plain"></i>' },
      { name: 'MySQL', icon: '<i class="devicon-mysql-plain"></i>' },
      { name: 'React.js', icon: '<i class="devicon-react-original"></i>' },
      { name: 'Node.js', icon: '<i class="devicon-nodejs-plain"></i>' },
      { name: 'Express.js', icon: '<i class="devicon-express-original"></i>' },
      { name: 'HTML', icon: '<i class="devicon-html5-plain"></i>' },
      { name: 'CSS', icon: '<i class="devicon-css3-plain"></i>' },
      { name: 'Bootstrap', icon: '<i class="devicon-bootstrap-plain"></i>' },
      { name: 'MongoDB', icon: '<i class="devicon-mongodb-plain"></i>' },
      { name: 'GitHub', icon: '<i class="devicon-github-original"></i>' },
      { name: 'Postman', icon: '<i class="devicon-postman-plain"></i>' },
      { name: 'OpenAI', icon: '<i class="fa-solid fa-robot"></i>' },
      { name: 'Python', icon: '<i class="devicon-python-plain"></i>' },
      { name: 'PostgreSQL', icon: '<i class="devicon-postgresql-plain"></i>' },
      { name: 'Socket.io', icon: '<i class="devicon-socketio-plain"></i>' },
      { name: 'npm', icon: '<i class="devicon-npm-original-wordmark"></i>' },
      { name: 'Hoppscotch', icon: '<i class="devicon-hoppscotch-plain"></i>' },
    ];
    this.init();
  }

  createItem(skill) {
    const item = document.createElement('div');
    item.className = 'marquee-item';
    item.innerHTML = `<div class="tech-logo">${skill.icon}</div><span class="tech-name">${skill.name}</span>`;
    this.track.appendChild(item);
  }

  pause() { this.track.style.animationPlayState = 'paused'; }
  resume() { this.track.style.animationPlayState = 'running'; }

  init() {
    if (!this.container || !this.track) return;
    this.track.innerHTML = '';
    // Duplicate the list 3x for a seamless loop
    for (let copy = 0; copy < 3; copy++) {
      this.skills.forEach((s) => this.createItem(s));
    }
    this.track.style.animation = `marquee ${this.skills.length * 2.5}s linear infinite`;
    this.container.addEventListener('mouseenter', () => this.pause());
    this.container.addEventListener('mouseleave', () => this.resume());
  }
}

/* ---------- 3D robot in the contact section ---------- */
class ContactRobot {
  constructor() {
    this.container = document.getElementById('contact-robot');
    if (!this.container) return;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
    this.camera.position.set(0, 0, 8);
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setClearColor(0x000000, 0);
    this.container.appendChild(this.renderer.domElement);

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const l1 = new THREE.PointLight(0x00ff88, 1, 100); l1.position.set(5, 5, 5); this.scene.add(l1);
    const l2 = new THREE.PointLight(0x0088ff, 1, 100); l2.position.set(-5, 5, 5); this.scene.add(l2);

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
    const glowGreen = new THREE.MeshPhongMaterial({ color: 0x00ff88, emissive: 0x00ff88, emissiveIntensity: 0.5 });
    const glowBlue = new THREE.MeshPhongMaterial({ color: 0x00ddff, emissive: 0x00ddff, emissiveIntensity: 0.8, transparent: true, opacity: 0.9 });

    // Head
    this.head = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 1.5, 6), bodyMat); // approx dims
    this.head.position.y = 2;
    this.robotGroup.add(this.head);

    // Antenna
    this.antennaBall = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), glowGreen);
    this.antennaBall.position.y = 3.3;
    this.robotGroup.add(this.antennaBall);

    // Eyes
    const eyeGeo = new THREE.SphereGeometry(0.2, 16, 16);
    this.leftEye = new THREE.Mesh(eyeGeo, glowBlue);
    this.leftEye.position.set(-0.4, 2.2, 1);
    this.robotGroup.add(this.leftEye);
    this.rightEye = new THREE.Mesh(eyeGeo, glowBlue);
    this.rightEye.position.set(0.4, 2.2, 1);
    this.robotGroup.add(this.rightEye);

    // Chest screen
    this.chestScreen = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.6, 0.1), glowBlue);
    this.chestScreen.position.set(0, 0.65, 1.5); // approx
    this.robotGroup.add(this.chestScreen);

    // Body
    const body = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1, 2.5, 6), bodyMat); // approx
    body.position.y = 0.5;
    this.robotGroup.add(body);

    // Floating particles
    const count = 50;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.particles = new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0x00ff88, size: 0.1, transparent: true, opacity: 0.8 })); // approx
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

    this.robotGroup.rotation.y = this.mouseX * 0.3;
    this.robotGroup.rotation.x = -this.mouseY * 0.2;
    this.robotGroup.position.y = Math.sin(t) * 0.1;
    this.head.rotation.y = Math.sin(t * 0.5) * 0.1;

    const blink = 1 + Math.sin(t * 2) * 0.1;
    this.leftEye.scale.set(1, blink, 1);
    this.rightEye.scale.set(1, blink, 1);
    this.antennaBall.material.emissiveIntensity = 0.5 + Math.sin(t * 3) * 0.5; // approx
    this.chestScreen.material.emissiveIntensity = 0.8 + Math.sin(t * 2) * 0.2; // approx

    const pos = this.particles.geometry.attributes.position.array;
    for (let i = 1; i < pos.length; i += 3) {
      pos[i] += 0.01;
      if (pos[i] > 2.5) pos[i] = -2.5;
    }
    this.particles.geometry.attributes.position.needsUpdate = true;

    this.renderer.render(this.scene, this.camera);
  }
}

/* ---------- Contact form ---------- */
class ContactForm {
  constructor() {
    this.form = document.getElementById('contact-form');
    if (!this.form) return;
    this.form.setAttribute('novalidate', '');
    this.setupCustomValidation();
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  setupCustomValidation() {
    this.form.querySelectorAll('input[required], textarea[required]').forEach((input) => {
      input.addEventListener('input', () => {
        this.clearError(input);
        if (input.value.trim() !== '') this.showSuccess(input);
      });
      input.addEventListener('blur', () => {
        const value = input.value.trim();
        if (value === '') {
          this.showError(input);
        } else if (input.type === 'email' && !this.isValidEmail(value)) {
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

  showError(input, message) {
    this.clearError(input);
    const error = document.createElement('div');
    error.className = 'terminal-error';
    const label = message || 'ERROR: ' + (input.placeholder || 'This field') + ' is required';
    error.innerHTML = `
      <span class="error-icon">✗</span>
      <span class="error-text">${label}</span>`;
    input.classList.add('input-error');
    input.classList.remove('input-success');
    input.parentNode.insertBefore(error, input.nextSibling);
    input.style.animation = 'shake 0.4s';
    setTimeout(() => { input.style.animation = ''; }, 400);
  }

  showSuccess(input) {
    input.classList.remove('input-error');
    input.classList.add('input-success');
  }

  clearError(input) {
    input.classList.remove('input-error');
    input.classList.remove('input-success');
    const existing = input.parentNode.querySelector('.terminal-error');
    if (existing) existing.remove();
  }

  handleSubmit(e) {
    let isValid = true;
    this.form.querySelectorAll('input[required], textarea[required]').forEach((input) => {
      const value = input.value.trim();
      if (value === '') {
        this.showError(input);
        isValid = false;
      } else if (input.type === 'email' && !this.isValidEmail(value)) {
        this.showError(input, 'ERROR: Invalid email format');
        isValid = false;
      }
    });

    if (!isValid) {
      e.preventDefault();
      return;
    }

    const btn = this.form.querySelector('.terminal-btn');
    btn.innerHTML = '<span class="prompt">$</span> Sending<span class="dots">...</span>';
    btn.disabled = true;
    // Form then submits normally (e.g. to a form service)
  }
}

/* ---------- Footer status / clock ---------- */
class TechFooter {
  constructor() {
    this.techStatus = document.getElementById('tech-status');
    this.currentDate = document.getElementById('current-date');
    this.currentTime = document.getElementById('current-time');
    this.techPhases = [
      'Initializing...', 'Loading dependencies...', 'Compiling code...', 'Building project...',
      'Running tests...', 'Deploying...', 'Optimizing...', 'Live reloading...', 'Debugging...',
      'Pushing to GitHub...', 'Merging branches...', 'Updating docs...', 'Code review...',
      'Refactoring...', 'Containerizing...', 'Scaling infrastructure...',
    ];
    this.currentPhase = 0;
    this.init();
  }

  init() {
    if (this.currentDate) {} // original has no-op guards here
    this.updateDateTime();
    setInterval(() => this.updateDateTime(), 1000);
    this.rotateTechStatus();
    setInterval(() => this.rotateTechStatus(), 4000);
  }

  updateDateTime() {
    const now = new Date();
    this.currentDate.textContent = now.toLocaleDateString('en-US', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
    });
    const pad = (n) => n.toString().padStart(2, '0');
    this.currentTime.innerHTML = `
      <span class="time-hours">${pad(now.getHours())}</span>
      <span class="time-colon">:</span>
      <span class="time-minutes">${pad(now.getMinutes())}</span>
      <span class="time-colon">:</span>
      <span class="time-seconds">${pad(now.getSeconds())}</span>`;
  }

  rotateTechStatus() {
    const el = this.techStatus;
    if (!el) return;
    el.style.opacity = '0.5';
    el.style.transform = 'translateX(-5px)';
    setTimeout(() => {
      this.currentPhase = (this.currentPhase + 1) % this.techPhases.length;
      const phase = this.techPhases[this.currentPhase];
      el.textContent = phase;
      el.style.opacity = '1';
      el.style.transform = 'translateX(0)';

      if (phase.includes('Deploying') || phase.includes('Live')) {
        el.style.color = 'var(--primary-green)';
        el.style.textShadow = '0 0 10px var(--primary-green)';
      } else if (phase.includes('Debugging')) {
        el.style.color = '#ff6600';
        el.style.textShadow = '0 0 10px rgba(255, 102, 0, 0.3)';
      } else if (phase.includes('Optimizing') || phase.includes('Scaling')) {
        el.style.color = '#0088ff';
        el.style.textShadow = '0 0 10px rgba(0, 136, 255, 0.3)';
      } else {
        el.style.color = 'var(--primary-green)';
        el.style.textShadow = 'none';
      }
    }, 300);
  }
}

/* ---------- Smooth scroll for in-page anchors ---------- */
class SmoothScroll {
  constructor() {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const href = a.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
          window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        }
      });
    });
  }
}

/* ---------- Skills "SQL terminal" ---------- */
class SkillsManager {
  constructor() {
    this.skillsData = {
      programming: { category: 'Programming & Scripting', skills: 'C++, JavaScript, SQL' },
      webdev: { category: 'Web Development', skills: 'React.js, Node.js, Express.js, EJS, HTML, CSS, Bootstrap, Socket.io' },
      dbtools: { category: 'Databases & Tools', skills: 'MongoDB, Git, GitHub, Postman, Hoppscotch, Cloud Deployment' },
      core: { category: 'Core Competencies', skills: 'REST APIs, OOPs, Data Structures & Algorithms, WebSockets, OpenAI API Integration' },
    };
    this.currentQueryElement = document.getElementById('current-query');
    this.queryResultsElement = document.getElementById('query-results');
    this.queryStatusElement = document.getElementById('query-status');
    this.queryButtons = document.querySelectorAll('.sql-cmd');
    this.speedButtons = document.querySelectorAll('.speed-btn');
    this.marqueeTrack = document.querySelector('.marquee-track');
    this.speedSettings = { slow: 120, medium: 60, fast: 20 };
    this.init();
  }

  init() {
    this.updateMarqueeSpeed('slow');
    this.initSpeedControls();
    this.initQueryButtons();
    this.updateStatus('Database Connected...');
  }

  initSpeedControls() {
    this.speedButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.speedButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.updateMarqueeSpeed(btn.dataset.speed);
      });
    });
  }

  updateMarqueeSpeed(speed) {
    const duration = this.speedSettings[speed];
    if (this.marqueeTrack) this.marqueeTrack.style.animationDuration = duration + 's';
  }

  initQueryButtons() {
    this.queryButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.queryButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.executeQuery(btn.dataset.query);
      });
    });
  }

  executeQuery(query) {
    if (this.currentQueryElement) this.currentQueryElement.textContent = query;
    this.updateStatus('Processing...');
    setTimeout(() => {
      const key = this.parseQuery(query);
      const results = this.getQueryResults(key);
      this.displayResults(results);
      this.updateStatus(results.length + ' row(s) returned');
    }, 300);
  }

  parseQuery(query) {
    const q = query.toLowerCase();
    if (q.includes('programming')) return 'programming';
    if (q.includes('webdev')) return 'webdev';
    if (q.includes('dbtools')) return 'dbtools';
    if (q.includes('core')) return 'core';
    return 'programming'; // approx default
  }

  getQueryResults(key) {
    const row = this.skillsData[key];
    return row ? [row] : [];
  }

  displayResults(results) {
    this.queryResultsElement.innerHTML = '';
    if (results.length === 0) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 2;
      td.textContent = 'No results found';
      td.style.color = 'var(--text-secondary)';
      td.style.textAlign = 'center';
      td.style.padding = '1rem';
      tr.appendChild(td);
      this.queryResultsElement.appendChild(tr);
      return;
    }
    results.forEach((row) => {
      const tr = document.createElement('tr');
      const cat = document.createElement('td');
      cat.textContent = row.category;
      cat.style.color = 'var(--primary-green)';
      cat.style.fontWeight = 'bold';
      const skills = document.createElement('td');
      skills.textContent = row.skills;
      skills.style.color = 'var(--text-secondary)';
      tr.appendChild(cat);
      tr.appendChild(skills);
      this.queryResultsElement.appendChild(tr);
    });
  }

  updateStatus(text) {
    if (!this.queryStatusElement) return;
    this.queryStatusElement.textContent = text;
    if (text.includes('Processing')) this.queryStatusElement.style.color = 'var(--primary-orange)';
    else if (text.includes('row(s) returned') || text.includes('Ready')) this.queryStatusElement.style.color = 'var(--primary-green)';
    else this.queryStatusElement.style.color = 'var(--text-secondary)';
  }
}

/* ---------- Page init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  new EnhancedStarryBackground();
  new TypingEffect();
  new ProjectsManager();
  new PerfectMarquee();
  new SkillsManager();
  new ContactForm();
  new ContactRobot();
  new SmoothScroll();

  // Hover lift on project cards
  document.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('mouseenter', () => { card.style.transform = 'translateY(-10px) scale(1.02)'; });
    card.addEventListener('mouseleave', () => { card.style.transform = 'translateY(0) scale(1)'; });
  });

  // Glow on terminal inputs
  document.querySelectorAll('.terminal-input, .terminal-textarea').forEach((input) => {
    input.addEventListener('focus', () => { input.parentElement.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.3)'; });
    input.addEventListener('blur', () => { input.parentElement.style.boxShadow = ''; });
  });
});

document.addEventListener('DOMContentLoaded', () => new TechFooter());

/* ---------- Global helpers used by inline HTML handlers ---------- */
function resetForm() {
  const form = document.getElementById('contact-form');
  if (form) form.reset();
  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach((i) => i.classList.remove('input-success', 'input-error'));
  const btn = form.querySelector('.terminal-btn');
  if (btn) {
    btn.innerHTML = '<span class="prompt">$</span> ./send_message.sh';
    btn.disabled = false;
  }
}

function copyEmail() {
  const email = 'ankit.sharma.ug23@nsut.ac.in';
  navigator.clipboard.writeText(email).then(() => {
    const link = document.querySelector('.footer-links a[href="#"]');
    if (!link) return;
    const original = link.innerHTML;
    link.innerHTML = '<i class="fas fa-check"></i> Copied!';
    link.style.color = 'var(--primary-green)';
    setTimeout(() => {
      link.innerHTML = original;
      link.style.color = '';
    }, 2000);
  }).catch(() => {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = email;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  });
}
