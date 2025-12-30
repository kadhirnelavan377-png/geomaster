
// --- State & Constants ---
interface Point { x: number; y: number; }
type LabMode = 'triangle' | 'circle';

const localState = {
    user: localStorage.getItem('geolab_user') || '',
    mode: 'triangle' as LabMode,
    lesson: 'Classification',
    points: {
        a: { x: 200, y: 100 },
        b: { x: 80, y: 300 },
        c: { x: 320, y: 300 },
        circleCenter: { x: 200, y: 200 },
        radius: 100
    },
    audio: {
        music: false,
        sfx: true
    }
};

// SFX Engine
const SFX = {
    click: new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'),
    playClick: () => {
        if (localState.audio.sfx) {
            const sound = SFX.click.cloneNode() as HTMLAudioElement;
            sound.volume = 0.4;
            sound.play().catch(() => {});
        }
    }
};

const LESSON_DATABASE: any = {
    'Classification': {
        desc: "Triangles are name-tagged in two ways: by how long their walls are (Sides) or how wide their corners open (Angles). It's just like sorting blocks by size and shape!",
        formula: "Sorting Shapes",
        diagramType: "basic"
    },
    'Angle Sum': {
        desc: "Every triangle in the world follows one golden rule: if you add up the 'width' of all three corners, you always get exactly 180°. It's the triangle's DNA!",
        formula: "Total = 180°",
        diagramType: "angles"
    },
    'Centroid': {
        desc: "This is the triangle's perfect 'Balance Point.' If you cut this triangle out of wood and put your finger right here, it would stay perfectly flat without tipping!",
        formula: "Balance Point",
        diagramType: "median"
    },
    'Incenter': {
        desc: "Imagine trying to hide a ball inside a triangle. The Incenter is the exact middle spot that is the same distance from every wall. It's the ultimate 'Safe Zone'.",
        formula: "The Safe Zone",
        diagramType: "incircle"
    },
    'Circumcenter': {
        desc: "The anchor point for a giant ring that perfectly touches all three corners. It's like finding the exact center of a three-legged table.",
        formula: "Outer Anchor",
        diagramType: "circum"
    },
    'Orthocenter': {
        desc: "Where the 'Heights' meet. Imagine dropping a string from each corner straight down to the floor—this is the point where those three strings cross each other.",
        formula: "Height Junction",
        diagramType: "altitude"
    },
    'Pythagoras': {
        desc: "A special trick for L-shaped corners: The square area of the two short sides added together perfectly fills the square area of the long side. Math magic!",
        formula: "A² + B² = C²",
        diagramType: "right"
    },
    'Parts of Circle': {
        desc: "A circle is just a collection of dots that are all the exact same distance from one center point. The Radius is that distance—the circle's reach!",
        formula: "The Edge's Reach",
        diagramType: "basic_circle"
    },
    'Tangents': {
        desc: "A line that 'kisses' the circle at only one tiny dot before flying away. It's perfectly straight and always stays at a right angle to the center.",
        formula: "The One-Dot Kiss",
        diagramType: "tangent"
    },
    'Sectors & Segments': {
        desc: "A Sector is a 'Pizza Slice' (cut from the middle). A Segment is just a 'Slice of Bread' (cut across the edge). Both are just pieces of the whole pie!",
        formula: "Pizza vs Bread",
        diagramType: "sector"
    },
    'Chords': {
        desc: "A bridge connecting two spots on the circle's edge. It doesn't have to go through the middle, but if it does, we call it the Diameter!",
        formula: "Edge Bridge",
        diagramType: "chord"
    },
    'Inscribed Angles': {
        desc: "If you move a corner from the center of the circle to the very edge, it becomes exactly half as wide! It's like zooming out on a camera.",
        formula: "Half-Width Rule",
        diagramType: "inscribed"
    }
};

const DATA = {
    triangle: ['Classification', 'Angle Sum', 'Centroid', 'Incenter', 'Circumcenter', 'Orthocenter', 'Pythagoras'],
    circle: ['Parts of Circle', 'Tangents', 'Sectors & Segments', 'Chords', 'Inscribed Angles']
};

const ui = {
    lessonList: () => document.getElementById('lesson-list'),
    canvas: () => (window as any).d3 ? (window as any).d3.select('#canvas') : null,
    stats: () => document.getElementById('stats-container'),
    modal: () => document.getElementById('modal-container'),
    modalBody: () => document.getElementById('modal-body'),
    navTriangle: () => document.getElementById('nav-triangle'),
    navCircle: () => document.getElementById('nav-circle'),
    authHub: () => document.getElementById('auth-hub'),
    loginView: () => document.getElementById('login-view'),
    signupView: () => document.getElementById('signup-view'),
    innerSettings: () => document.getElementById('inner-settings'),
    innerHow: () => document.getElementById('inner-how'),
    dashSettingsBtn: () => document.getElementById('dash-settings-btn'),
    entrySettingsBtn: () => document.getElementById('entry-settings-btn')
};

function initLab() {
    window.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.closest('button')) SFX.playClick();
    });

    document.getElementById('go-to-signup')?.addEventListener('click', () => {
        ui.loginView()?.classList.add('hidden');
        ui.signupView()?.classList.remove('hidden');
    });
    document.getElementById('go-to-login')?.addEventListener('click', () => {
        ui.signupView()?.classList.add('hidden');
        ui.loginView()?.classList.remove('hidden');
    });

    const openSettings = () => {
        ui.innerSettings()?.classList.remove('translate-y-full');
        ui.innerHow()?.classList.add('translate-y-full');
    };
    const openHow = () => {
        ui.innerHow()?.classList.remove('translate-y-full');
        ui.innerSettings()?.classList.add('translate-y-full');
    };

    ui.entrySettingsBtn()?.addEventListener('click', openSettings);
    ui.dashSettingsBtn()?.addEventListener('click', openSettings);
    document.getElementById('close-inner-settings')?.addEventListener('click', () => ui.innerSettings()?.classList.add('translate-y-full'));
    document.getElementById('entry-how-btn')?.addEventListener('click', openHow);
    document.getElementById('close-inner-how')?.addEventListener('click', () => ui.innerHow()?.classList.add('translate-y-full'));

    document.getElementById('btn-login-submit')?.addEventListener('click', () => {
        const user = (document.getElementById('login-user') as HTMLInputElement).value || 'Explorer';
        handleLogin(user);
    });
    document.getElementById('btn-signup-submit')?.addEventListener('click', () => {
        const user = (document.getElementById('signup-user') as HTMLInputElement).value || 'Explorer';
        handleLogin(user);
    });

    document.getElementById('logout-trigger')?.addEventListener('click', () => {
        localStorage.removeItem('geolab_user');
        window.location.reload();
    });

    ui.navTriangle()?.addEventListener('click', () => { localState.mode = 'triangle'; localState.lesson = DATA.triangle[0]; updateUI(); });
    ui.navCircle()?.addEventListener('click', () => { localState.mode = 'circle'; localState.lesson = DATA.circle[0]; updateUI(); });

    ['modal-close-x', 'modal-close-btn', 'modal-overlay'].forEach(id => {
        document.getElementById(id)?.addEventListener('click', () => ui.modal()?.classList.add('hidden'));
    });

    document.getElementById('setting-music-toggle')?.addEventListener('click', () => {
        localState.audio.music = !localState.audio.music;
        const knob = document.getElementById('music-knob');
        const btn = document.getElementById('setting-music-toggle');
        if (knob && btn) {
            knob.style.transform = localState.audio.music ? 'translateX(24px)' : 'translateX(0)';
            btn.classList.toggle('bg-violet-600', localState.audio.music);
            btn.classList.toggle('bg-slate-800', !localState.audio.music);
        }
    });

    document.getElementById('setting-sfx-toggle')?.addEventListener('click', () => {
        localState.audio.sfx = !localState.audio.sfx;
        const knob = document.getElementById('sfx-knob');
        const btn = document.getElementById('setting-sfx-toggle');
        if (knob && btn) {
            knob.style.transform = localState.audio.sfx ? 'translateX(24px)' : 'translateX(0)';
            btn.classList.toggle('bg-emerald-600', localState.audio.sfx);
            btn.classList.toggle('bg-slate-800', !localState.audio.sfx);
        }
    });

    renderBackgroundShapes();
}

function handleLogin(name: string) {
    localState.user = name;
    localStorage.setItem('geolab_user', name);
    ui.authHub()?.classList.add('hidden');
    const shell = document.getElementById('app-shell')!;
    shell.classList.remove('hidden');
    shell.style.display = 'block';
    shell.style.opacity = '1';
    document.getElementById('display-user')!.innerText = name;
    document.getElementById('display-user')!.classList.remove('hidden');
    updateUI();
}

function renderBackgroundShapes() {
    const d3 = (window as any).d3;
    const svg = d3.select('#bg-shapes').append('svg').attr('width', '100%').attr('height', '100%');
    for (let i = 0; i < 10; i++) {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const size = 30 + Math.random() * 80;
        const color = Math.random() > 0.5 ? '#10b981' : '#8b5cf6';
        svg.append('path').attr('d', `M ${x} ${y} L ${x+size} ${y} L ${x+size/2} ${y-size} Z`).attr('fill', 'none').attr('stroke', color).attr('stroke-width', 0.5).attr('opacity', 0.1);
    }
}

function updateUI() {
    const isTri = localState.mode === 'triangle';
    const nTri = ui.navTriangle();
    const nCir = ui.navCircle();
    if (nTri) nTri.className = `px-4 md:px-6 py-2 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-wider transition-all ${isTri ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500'}`;
    if (nCir) nCir.className = `px-4 md:px-6 py-2 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-wider transition-all ${!isTri ? 'bg-violet-600 text-white shadow-lg' : 'text-slate-500'}`;
    
    document.getElementById('view-title')!.innerText = isTri ? 'Triangle Mastery' : 'Circle Mastery';
    document.getElementById('view-lesson')!.innerText = localState.lesson;
    document.getElementById('view-lesson')!.className = isTri ? 'text-emerald-500' : 'text-violet-500';

    renderLessonsUI();
    draw();
}

function renderLessonsUI() {
    const list = ui.lessonList();
    if (!list) return;
    list.innerHTML = '';
    DATA[localState.mode].forEach(name => {
        const isActive = localState.lesson === name;
        const color = localState.mode === 'triangle' ? 'emerald' : 'violet';
        const btn = document.createElement('button');
        btn.className = `shrink-0 md:w-full text-left p-4 md:p-5 rounded-2xl border transition-all duration-300 min-w-[140px] md:min-w-0 ${
            isActive ? `bg-${color}-600 border-${color}-400 text-white shadow-xl scale-[1.02] z-10` : 'bg-slate-900/50 border-white/5 text-slate-500 hover:bg-white/10'
        }`;
        btn.innerHTML = `<div class="flex items-center gap-3"><i data-lucide="book-open" class="w-3 h-3"></i><span class="font-black text-[9px] uppercase tracking-widest leading-none">${name}</span></div>`;
        btn.onclick = () => { 
            localState.lesson = name; 
            updateUI(); 
            showExplanation(name);
        };
        list.appendChild(btn);
    });
    if ((window as any).lucide) (window as any).lucide.createIcons();
}

function showExplanation(topic: string) {
    const modal = ui.modal(), body = ui.modalBody();
    if (!modal || !body) return;
    const data = LESSON_DATABASE[topic];
    if (!data) return;

    modal.classList.remove('hidden');
    document.getElementById('modal-title')!.innerText = topic;

    body.innerHTML = `
        <div class="space-y-8 animate-fade-in">
            <div class="flex items-center gap-2 mb-4">
                <div class="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                    <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span class="text-[9px] font-black uppercase tracking-widest text-emerald-500">Mastery Guide</span>
                </div>
            </div>
            <div class="flex flex-col md:flex-row gap-8 items-start">
                <div class="flex-1 space-y-6">
                    <p class="text-slate-200 leading-relaxed text-sm md:text-base font-medium">${data.desc}</p>
                    <div class="bg-white/5 p-5 rounded-[2rem] border border-white/5 text-center shadow-inner">
                        <span class="text-[9px] uppercase font-black text-slate-500 tracking-[0.4em] block mb-2 italic">The Formula</span>
                        <span class="text-2xl md:text-3xl font-black text-white italic tracking-tight">${data.formula}</span>
                    </div>
                </div>
                <div class="w-full md:w-48 md:h-48 aspect-square bg-slate-950 rounded-[2rem] md:rounded-[2.5rem] border border-white/10 p-4 flex items-center justify-center relative overflow-hidden shadow-2xl shrink-0">
                    <svg id="modal-mini-diagram" width="100%" height="100%" viewBox="0 0 200 200"></svg>
                </div>
            </div>
            <div class="p-5 md:p-6 bg-white/5 rounded-3xl border border-white/5 flex gap-4 items-center">
                <div class="p-3 bg-emerald-500/20 rounded-2xl"><i data-lucide="info" class="text-emerald-400 w-5 h-5"></i></div>
                <p class="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                    Dragging points in the lab helps visualize this concept. Try it out!
                </p>
            </div>
        </div>
    `;
    renderMiniDiagram(topic);
    if ((window as any).lucide) (window as any).lucide.createIcons();
}

function renderMiniDiagram(topic: string) {
    const d3 = (window as any).d3;
    const svg = d3.select('#modal-mini-diagram');
    svg.selectAll('*').remove();
    const color = localState.mode === 'triangle' ? '#10b981' : '#8b5cf6';
    if (localState.mode === 'triangle') {
        svg.append('path').attr('d', 'M 100 40 L 40 160 L 160 160 Z').attr('fill', `${color}22`).attr('stroke', color).attr('stroke-width', 4).attr('stroke-linejoin', 'round');
    } else {
        svg.append('circle').attr('cx', 100).attr('cy', 100).attr('r', 70).attr('fill', `${color}22`).attr('stroke', color).attr('stroke-width', 4);
    }
}

// --- Main Drawing Engine ---
const getDist = (p1: Point, p2: Point) => Math.sqrt((p2.x - p1.x)**2 + (p2.y - p1.y)**2);
const getAngle = (p1: Point, p2: Point, p3: Point) => {
    const a = getDist(p2, p3), b = getDist(p1, p3), c = getDist(p1, p2);
    if (a*c === 0) return 0;
    const cos = (a*a + c*c - b*b) / (2*a*c);
    return Math.acos(Math.max(-1, Math.min(1, cos))) * (180 / Math.PI);
};

function draw() {
    const canvas = ui.canvas();
    if (!canvas) return;
    canvas.selectAll('*').remove();
    if (localState.mode === 'triangle') drawTriangle();
    else drawCircle();
}

function drawTriangle() {
    const canvas = ui.canvas(), d3 = (window as any).d3;
    const { a, b, c } = localState.points;
    const sA = getDist(b, c), sB = getDist(a, c), sC = getDist(a, b);
    const perimeter = sA + sB + sC, s = perimeter / 2;
    const area = Math.sqrt(Math.max(0.1, s * (s - sA) * (s - sB) * (s - sC)));

    canvas.append('path').attr('d', `M${a.x},${a.y} L${b.x},${b.y} L${c.x},${c.y} Z`).attr('fill', 'rgba(16, 185, 129, 0.08)').attr('stroke', '#10b981').attr('stroke-width', 4).attr('stroke-linejoin', 'round');

    const dragHandler = d3.drag().on('drag', function(event: any, d: any) {
        (localState.points as any)[d].x = Math.max(10, Math.min(390, event.x));
        (localState.points as any)[d].y = Math.max(10, Math.min(390, event.y));
        draw();
    });
    ['a', 'b', 'c'].forEach(k => canvas.append('circle').datum(k).attr('cx', (localState.points as any)[k].x).attr('cy', (localState.points as any)[k].y).attr('r', 16).attr('fill', '#10b981').attr('stroke', 'white').attr('stroke-width', 2).attr('cursor', 'pointer').call(dragHandler));

    updateStats([
        { l: 'Angles', v: [getAngle(b,a,c), getAngle(a,b,c), getAngle(a,c,b)].map(x => Math.round(x)).join('°, ') + '°', c: 'text-sky-400' },
        { l: 'Perimeter', v: Math.round(perimeter), c: 'text-amber-400' },
        { l: 'Area', v: Math.round(area), c: 'text-emerald-400' }
    ]);
}

function drawCircle() {
    const canvas = ui.canvas(), d3 = (window as any).d3;
    const { circleCenter, radius } = localState.points;
    const area = Math.PI * radius * radius, circum = 2 * Math.PI * radius;
    canvas.append('circle').attr('cx', circleCenter.x).attr('cy', circleCenter.y).attr('r', radius).attr('fill', 'rgba(139, 92, 246, 0.1)').attr('stroke', '#8b5cf6').attr('stroke-width', 3);

    const dragC = d3.drag().on('drag', (e: any) => {
        localState.points.circleCenter.x = Math.max(radius, Math.min(400-radius, e.x));
        localState.points.circleCenter.y = Math.max(radius, Math.min(400-radius, e.y));
        draw();
    });
    const dragR = d3.drag().on('drag', (e: any) => {
        const dx = e.x - circleCenter.x, dy = e.y - circleCenter.y;
        localState.points.radius = Math.max(20, Math.min(180, Math.sqrt(dx*dx + dy*dy)));
        draw();
    });
    canvas.append('circle').attr('cx', circleCenter.x).attr('cy', circleCenter.y).attr('r', 12).attr('fill', '#8b5cf6').attr('stroke', 'white').attr('cursor', 'move').call(dragC);
    canvas.append('circle').attr('cx', circleCenter.x + radius).attr('cy', circleCenter.y).attr('r', 16).attr('fill', '#f43f5e').attr('stroke', 'white').attr('cursor', 'pointer').call(dragR);

    updateStats([
        { l: 'Radius', v: Math.round(radius), c: 'text-rose-400' },
        { l: 'Circumf.', v: Math.round(circum), c: 'text-violet-400' },
        { l: 'Area', v: Math.round(area), c: 'text-emerald-400' }
    ]);
}

function updateStats(items: any[]) {
    const stats = ui.stats();
    if (!stats) return;
    stats.innerHTML = `<div class="grid grid-cols-2 md:grid-cols-3 gap-3">` + items.map(i => `<div class="bg-white/5 p-4 rounded-2xl border border-white/5"><p class="text-[8px] font-black text-slate-500 uppercase mb-1 tracking-widest">${i.l}</p><p class="text-base md:text-xl font-black ${i.c}">${i.v}</p></div>`).join('') + `</div>`;
}

initLab();
