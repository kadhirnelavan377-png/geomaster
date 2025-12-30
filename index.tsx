
export {};

// --- Types & Constants ---
type LabDomain = 'triangle' | 'congruence' | 'coordinates' | 'circle' | 'lines' | 'quads';

const MATH_QUOTES = [
    { text: "Mathematics is the music of reason.", author: "James Sylvester" },
    { text: "Pure mathematics is, in its way, the poetry of logical ideas.", author: "Albert Einstein" },
    { text: "The only way to learn mathematics is to do mathematics.", author: "Paul Halmos" },
    { text: "Geometry is knowledge of the eternally existent.", author: "Pythagoras" },
    { text: "Nature is written in mathematical language.", author: "Galileo Galilei" }
];

const localState = {
    user: 'Explorer',
    domain: 'triangle' as LabDomain,
    lesson: 'Equilateral Δ',
    mastery: 45,
    rating: 0,
    isMenuOpen: false,
    workflow: {} as Record<string, 'idle' | 'active' | 'complete'>,
    points: {
        t1a: { x: 250, y: 100 }, t1b: { x: 100, y: 350 }, t1c: { x: 400, y: 350 },
        t2a: { x: 150, y: 150 }, t2b: { x: 100, y: 350 }, t2c: { x: 250, y: 350 },
        t3a: { x: 350, y: 150 }, t3b: { x: 300, y: 350 }, t3c: { x: 450, y: 350 },
        c1: { x: 250, y: 250 }, r1: 120,
        lineA: { y: 150 }, lineB: { y: 350 },
        trans: { x1: 150, x2: 350 },
        p1: { x: 350, y: 150 }, p2: { x: 150, y: 350 },
        q1: { x: 150, y: 150 }, q2: { x: 350, y: 150 }, q3: { x: 350, y: 350 }, q4: { x: 150, y: 350 }
    }
};

const LAB_MAP = {
    lines: ['Parallel Axiom', 'Corresponding ∠', 'Alternate Interior'],
    triangle: ['Equilateral Δ', 'Isosceles Δ', 'Triangle Sum', 'Right Angle Δ'],
    congruence: ['SSS Criterion', 'SAS Rule', 'ASA Axiom'],
    quads: ['Parallelogram', 'Rectangle Prop', 'Mid-point Theorem'],
    coordinates: ['Cartesian Graph', 'Midpoint Law', 'Quadrant Logic'],
    circle: ['Tangent Axiom', 'Chord Property', 'Arc & Sector']
};

const LESSON_DB: any = {
    'Parallel Axiom': { title: "Parallel Rule", desc: "Lines that never intersect, maintaining a fixed distance.", steps: ["1. Distance remains constant.", "2. They have the same slope.", "3. They never meet in infinity."] },
    'Corresponding ∠': { title: "Position Equality", desc: "Angles in matching corners are equal when lines are parallel.", steps: ["1. Check same side of transversal.", "2. Check same relative position.", "3. Equal only if base lines are ||."] },
    'Alternate Interior': { title: "The 'Z' Logic", desc: "Inner angles on opposite sides of the cross-line.", steps: ["1. Look for the 'Z' shape.", "2. Identify interior corners.", "3. These are equal if lines are ||."] },
    'Equilateral Δ': { title: "Perfect Symmetry", desc: "All sides are equal, and all angles are 60°.", steps: ["1. Side AB = BC = CA.", "2. Each angle = 180° / 3.", "3. Highly symmetrical shape."] },
    'Isosceles Δ': { title: "Twin Sides", desc: "A triangle with at least two equal sides.", steps: ["1. Two sides are congruent.", "2. Angles opposite equal sides match.", "3. One line of symmetry exists."] },
    'Triangle Sum': { title: "The 180° Constant", desc: "Internal angles always total exactly 180°.", steps: ["1. Add ∠A + ∠B + ∠C.", "2. Total is always 180°.", "3. Works for ANY triangle shape."] },
    'Right Angle Δ': { title: "Pythagoras Lab", desc: "A triangle with one corner at exactly 90°.", steps: ["1. Identify the 'L' corner.", "2. Longest side is Hypotenuse.", "3. a² + b² = c² applies here."] },
    'SSS Criterion': { title: "Side-Side-Side", desc: "Identity based purely on matching lengths.", steps: ["1. Match Side 1 to Side 1'.", "2. Match Side 2 to Side 2'.", "3. Match Side 3 to Side 3'."] },
    'SAS Rule': { title: "Side-Angle-Side", desc: "Two sides and the angle trapped between them.", steps: ["1. Side-Angle-Side sequence.", "2. Angle must be 'Included'.", "3. Guarantees a total clone."] },
    'ASA Axiom': { title: "Angle-Side-Angle", desc: "Two angles and the side connecting them.", steps: ["1. Measure two angles.", "2. Check the side between them.", "3. Triangle is fully defined."] },
    'Parallelogram': { title: "Parallel Box", desc: "Opposite sides are parallel and equal in length.", steps: ["1. Opposite sides are parallel.", "2. Opposite angles are equal.", "3. Diagonals bisect each other."] },
    'Rectangle Prop': { title: "Right Quad", desc: "A parallelogram where every angle is 90°.", steps: ["1. All properties of Parallelogram.", "2. Every corner is 90 degrees.", "3. Diagonals are equal length."] },
    'Mid-point Theorem': { title: "Triangle Half-Line", desc: "The line joining mid-points is half the base.", steps: ["1. Find midpoints of two sides.", "2. Join them with a segment.", "3. Segment is || and 1/2 of base."] },
    'Cartesian Graph': { title: "Grid Address", desc: "Locating points using X and Y coordinates.", steps: ["1. (0,0) is the center origin.", "2. X moves Left/Right.", "3. Y moves Up/Down."] },
    'Midpoint Law': { title: "Center Finder", desc: "Calculating the exact center of a segment.", steps: ["1. Average the X coordinates.", "2. Average the Y coordinates.", "3. Result is the geometric center."] },
    'Quadrant Logic': { title: "Four Zones", desc: "The graph is split into four distinct regions.", steps: ["1. Q1 is (+,+).", "2. Q2 is (-,+).", "3. Q3 is (-,-).", "4. Q4 is (+,-)."] },
    'Tangent Axiom': { title: "The 'Kiss' Line", desc: "A line touching the circle at exactly one point.", steps: ["1. Touches at Point of Contact.", "2. Perpendicular to Radius (90°).", "3. Stays outside the interior."] },
    'Chord Property': { title: "Chord Bisector", desc: "Perpendicular from center bisects the chord.", steps: ["1. Draw any chord segment.", "2. Drop 90° line from center.", "3. Chord is split into 2 equal parts."] },
    'Arc & Sector': { title: "Pizza Slice", desc: "A portion of circle area defined by two radii.", steps: ["1. Area is a 'Sector'.", "2. Edge is the 'Arc'.", "3. Central angle defines the size."] }
};

const DOMAINS: { id: LabDomain; label: string; icon: string; color: string }[] = [
    { id: 'triangle', label: 'Triangles', icon: 'triangle', color: 'emerald' },
    { id: 'coordinates', label: 'Cartesian', icon: 'grid', color: 'sky' },
    { id: 'circle', label: 'Circles', icon: 'circle', color: 'violet' },
    { id: 'lines', label: 'Lines', icon: 'split', color: 'rose' },
    { id: 'congruence', label: 'Congruence', icon: 'layers', color: 'amber' },
    { id: 'quads', label: 'Quadrilaterals', icon: 'box', color: 'indigo' }
];

function init() {
    setupEventListeners();
    updateUI();
    cycleQuotes();
}

function setupEventListeners() {
    document.getElementById('btn-login-submit')?.addEventListener('click', () => {
        const val = (document.getElementById('login-user') as HTMLInputElement).value;
        localState.user = val || 'Creator';
        document.getElementById('user-display')!.innerText = `Active Session: ${localState.user}`;
        document.getElementById('auth-hub')!.classList.add('hidden');
        document.getElementById('app-shell')!.classList.remove('hidden');
        document.getElementById('app-shell')!.style.opacity = '1';
        updateUI();
    });

    document.getElementById('toggle-settings')?.addEventListener('click', () => {
        document.getElementById('creator-panel')?.classList.remove('translate-x-full');
    });

    document.getElementById('close-settings')?.addEventListener('click', () => {
        document.getElementById('creator-panel')?.classList.add('translate-x-full');
    });

    document.getElementById('mobile-menu-toggle')?.addEventListener('click', (e) => {
        e.stopPropagation();
        localState.isMenuOpen = !localState.isMenuOpen;
        toggleSidebar(localState.isMenuOpen);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        const sidebar = document.getElementById('sidebar');
        const menuBtn = document.getElementById('mobile-menu-toggle');
        if (localState.isMenuOpen && sidebar && !sidebar.contains(e.target as Node) && !menuBtn?.contains(e.target as Node)) {
            localState.isMenuOpen = false;
            toggleSidebar(false);
        }
    });

    document.querySelectorAll('.rating-star').forEach(star => {
        star.addEventListener('click', (e) => {
            const val = parseInt((e.currentTarget as HTMLElement).dataset.star || '0');
            localState.rating = val;
            updateRatingUI();
        });
    });

    document.getElementById('logout-trigger')?.addEventListener('click', () => window.location.reload());
}

function toggleSidebar(open: boolean) {
    const sidebar = document.getElementById('sidebar');
    if (open) sidebar?.classList.remove('-translate-x-full');
    else sidebar?.classList.add('-translate-x-full');
}

function updateRatingUI() {
    const stars = document.querySelectorAll('.rating-star');
    stars.forEach((star, idx) => {
        if (idx < localState.rating) {
            star.classList.add('text-amber-400');
            star.classList.remove('text-slate-600');
        } else {
            star.classList.remove('text-amber-400');
            star.classList.add('text-slate-600');
        }
    });
}

function cycleQuotes() {
    const q = MATH_QUOTES[Math.floor(Math.random() * MATH_QUOTES.length)];
    const textEl = document.getElementById('math-quote-text');
    const authorEl = document.getElementById('math-quote-author');
    if (textEl && authorEl) {
        textEl.innerText = `"${q.text}"`;
        authorEl.innerText = `— ${q.author}`;
    }
    setTimeout(cycleQuotes, 10000);
}

function renderNav() {
    const nav = document.getElementById('nav-container');
    const navMobile = document.getElementById('nav-container-mobile');
    
    const createBtn = (d: any) => {
        const btn = document.createElement('button');
        btn.className = `amazing-btn amazing-btn-${d.color} ${localState.domain === d.id ? 'active' : ''}`;
        btn.innerHTML = `<i data-lucide="${d.icon}" class="w-4 h-4"></i><span class="amazing-label">${d.label}</span>`;
        btn.onclick = () => { 
            localState.domain = d.id; 
            localState.lesson = LAB_MAP[d.id][0]; 
            updateUI(); 
            // Close sidebar when navigating
            localState.isMenuOpen = false;
            toggleSidebar(false);
        };
        return btn;
    };

    if (nav) {
        nav.innerHTML = '';
        DOMAINS.forEach(d => nav.appendChild(createBtn(d)));
    }
    if (navMobile) {
        navMobile.innerHTML = '';
        DOMAINS.forEach(d => navMobile.appendChild(createBtn(d)));
    }
}

function updateUI() {
    renderNav();
    const list = document.getElementById('lesson-list');
    if (list) {
        list.innerHTML = '';
        LAB_MAP[localState.domain].forEach(name => {
            const status = localState.workflow[name] || 'idle';
            const isActive = localState.lesson === name;
            
            const btn = document.createElement('button');
            btn.className = `topic-card ${isActive ? 'topic-card-active' : ''}`;
            
            let wkIndicator = '';
            if (isActive) wkIndicator = `<div class="mt-2 flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span><span class="text-[7px] font-black text-emerald-500 uppercase tracking-widest">Active Workflow</span></div>`;
            else if (status === 'complete') wkIndicator = `<div class="mt-2 flex items-center gap-2 text-emerald-500/50"><i data-lucide="check" class="w-2 h-2"></i><span class="text-[7px] font-bold uppercase">Mastered</span></div>`;

            btn.innerHTML = `
                <h4 class="text-[10px] font-black uppercase text-white">${name}</h4>
                ${wkIndicator}
            `;
            
            btn.onclick = () => { 
                if (localState.lesson !== name) {
                    localState.workflow[localState.lesson] = 'complete';
                }
                localState.lesson = name; 
                localState.workflow[name] = 'active';
                updateUI(); 
                // Close sidebar when topic selected
                localState.isMenuOpen = false;
                toggleSidebar(false);
            };
            list.appendChild(btn);
        });
    }

    const data = LESSON_DB[localState.lesson] || { title: "Topic Detail", desc: "Select a module to begin visualization.", steps: ["Click any sub-topic on the left."] };
    document.getElementById('view-lesson-title')!.innerText = data.title;
    document.getElementById('lab-desc')!.innerText = data.desc;
    
    const explanationEl = document.getElementById('explanation-steps');
    if(explanationEl) {
        explanationEl.innerHTML = data.steps.map((s: string) => `
            <li class="explanation-li group">
                <div class="li-bullet"></div>
                <span class="li-text">${s}</span>
            </li>
        `).join('');
    }

    draw();
    if ((window as any).lucide) (window as any).lucide.createIcons();
}

const getDist = (p1: any, p2: any) => Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
const toC = (v: number) => Math.round((v - 250) / 40);

function draw() {
    const d3 = (window as any).d3;
    const svg = d3.select('#canvas');
    svg.selectAll('*').remove();

    const addLabel = (x: number, y: number, text: string, color: string = 'rgba(255,255,255,0.6)') => {
        svg.append('text').attr('x', x).attr('y', y).attr('fill', color).attr('font-size', '9px').attr('font-family', 'JetBrains Mono').attr('font-weight', 'bold').text(text);
    };

    switch(localState.domain) {
        case 'coordinates': drawCoordinates(svg, addLabel); break;
        case 'triangle': drawTriangle(svg, addLabel); break;
        case 'circle': drawCircle(svg, addLabel); break;
        case 'lines': drawLines(svg, addLabel); break;
        case 'quads': drawQuads(svg, addLabel); break;
        case 'congruence': drawCongruence(svg, addLabel); break;
    }
}

// --- Specific Lab Implementation ---
function drawCoordinates(svg: any, addLabel: any) {
    const { p1, p2 } = localState.points;
    for(let i=10; i<=490; i+=40) {
        svg.append('line').attr('x1', i).attr('y1', 10).attr('x2', i).attr('y2', 490).attr('stroke', 'rgba(56, 189, 248, 0.05)');
        svg.append('line').attr('x1', 10).attr('y1', i).attr('x2', 490).attr('y2', i).attr('stroke', 'rgba(56, 189, 248, 0.05)');
    }
    svg.append('line').attr('x1', 0).attr('y1', 250).attr('x2', 500).attr('y2', 250).attr('stroke', 'rgba(56, 189, 248, 0.3)').attr('stroke-width', 2);
    svg.append('line').attr('x1', 250).attr('y1', 0).attr('x2', 250).attr('y2', 500).attr('stroke', 'rgba(56, 189, 248, 0.3)').attr('stroke-width', 2);

    svg.append('line').attr('x1', p1.x).attr('y1', p1.y).attr('x2', p2.x).attr('y2', p2.y).attr('stroke', '#0ea5e9').attr('stroke-width', 4).attr('stroke-linecap', 'round');
    
    if (localState.lesson === 'Midpoint Law') {
        const m = { x: (p1.x + p2.x)/2, y: (p1.y + p2.y)/2 };
        svg.append('circle').attr('cx', m.x).attr('cy', m.y).attr('r', 8).attr('fill', 'white').attr('class', 'animate-pulse');
        addLabel(m.x + 10, m.y - 10, "CENTER M");
    }

    const drag = (k: string) => (window as any).d3.drag().on('drag', (e: any) => {
        (localState.points as any)[k] = { x: Math.max(10, Math.min(490, e.x)), y: Math.max(10, Math.min(490, e.y)) };
        draw();
    });

    [p1, p2].forEach((p, i) => {
        const k = i === 0 ? 'p1' : 'p2';
        svg.append('circle').attr('cx', p.x).attr('cy', p.y).attr('r', 10).attr('fill', '#0ea5e9').attr('stroke', 'white').call(drag(k));
        addLabel(p.x + 12, p.y + 20, `(${toC(p.x)}, ${toC(500-p.y)})`);
    });
}

function drawTriangle(svg: any, addLabel: any) {
    const { t1a, t1b, t1c } = localState.points;
    svg.append('path').attr('d', `M${t1a.x},${t1a.y} L${t1b.x},${t1b.y} L${t1c.x},${t1c.y} Z`).attr('fill', 'rgba(16, 185, 129, 0.1)').attr('stroke', '#10b981').attr('stroke-width', 4);
    if (localState.lesson === 'Right Angle Δ') {
        svg.append('path').attr('d', `M${t1b.x},${t1b.y} L${t1b.x+15},${t1b.y} L${t1b.x+15},${t1b.y-15} L${t1b.x},${t1b.y-15}`).attr('fill', 'none').attr('stroke', '#10b981');
    }
    const drag = (k: string) => (window as any).d3.drag().on('drag', (e: any) => { (localState.points as any)[k] = { x: e.x, y: e.y }; draw(); });
    ['t1a', 't1b', 't1c'].forEach(k => {
        const p = (localState.points as any)[k];
        svg.append('circle').attr('cx', p.x).attr('cy', p.y).attr('r', 12).attr('fill', '#10b981').attr('stroke', 'white').call(drag(k));
    });
    addLabel(t1a.x, t1a.y-15, "A"); addLabel(t1b.x-15, t1b.y+15, "B"); addLabel(t1c.x+10, t1c.y+15, "C");
}

function drawLines(svg: any, addLabel: any) {
    const { lineA, lineB, trans } = localState.points;
    svg.append('line').attr('x1', 50).attr('y1', lineA.y).attr('x2', 450).attr('y2', lineA.y).attr('stroke', '#f43f5e').attr('stroke-width', 4).attr('opacity', 0.8);
    svg.append('line').attr('x1', 50).attr('y1', lineB.y).attr('x2', 450).attr('y2', lineB.y).attr('stroke', '#f43f5e').attr('stroke-width', 4).attr('opacity', 0.8);
    svg.append('line').attr('x1', trans.x1).attr('y1', 50).attr('x2', trans.x2).attr('y2', 450).attr('stroke', '#38bdf8').attr('stroke-width', 4);
    if (localState.lesson === 'Alternate Interior') {
        svg.append('path').attr('d', `M100,${lineA.y} L180,${lineA.y} L320,${lineB.y} L400,${lineB.y}`).attr('fill', 'none').attr('stroke', '#facc15').attr('stroke-width', 6).attr('opacity', 0.3).attr('stroke-dasharray', '5,5');
        addLabel(190, lineA.y + 15, "∠1", "#facc15"); addLabel(270, lineB.y - 10, "∠2", "#facc15");
    }
    const dragY = (k: string) => (window as any).d3.drag().on('drag', (e: any) => { (localState.points as any)[k].y = e.y; draw(); });
    svg.append('circle').attr('cx', 250).attr('cy', lineA.y).attr('r', 10).attr('fill', '#f43f5e').call(dragY('lineA'));
    svg.append('circle').attr('cx', 250).attr('cy', lineB.y).attr('r', 10).attr('fill', '#f43f5e').call(dragY('lineB'));
}

function drawQuads(svg: any, addLabel: any) {
    const { q1, q2, q3, q4 } = localState.points;
    svg.append('path').attr('d', `M${q1.x},${q1.y} L${q2.x},${q2.y} L${q3.x},${q3.y} L${q4.x},${q4.y} Z`).attr('fill', 'rgba(99, 102, 241, 0.1)').attr('stroke', '#6366f1').attr('stroke-width', 4);
    if (localState.lesson === 'Mid-point Theorem') {
        const m1 = { x: (q1.x + q2.x)/2, y: (q1.y + q2.y)/2 };
        const m2 = { x: (q2.x + q3.x)/2, y: (q2.y + q3.y)/2 };
        svg.append('line').attr('x1', m1.x).attr('y1', m1.y).attr('x2', m2.x).attr('y2', m2.y).attr('stroke', '#f43f5e').attr('stroke-width', 4).attr('stroke-dasharray', '4,2');
        addLabel(m1.x, m1.y - 10, "MID-1"); addLabel(m2.x + 10, m2.y, "MID-2");
    }
    const drag = (k: string) => (window as any).d3.drag().on('drag', (e: any) => { (localState.points as any)[k] = { x: e.x, y: e.y }; draw(); });
    ['q1', 'q2', 'q3', 'q4'].forEach(k => svg.append('circle').attr('cx', (localState.points as any)[k].x).attr('cy', (localState.points as any)[k].y).attr('r', 12).attr('fill', '#6366f1').attr('stroke', 'white').call(drag(k)));
}

function drawCongruence(svg: any, addLabel: any) {
    const { t2a, t2b, t2c, t3a, t3b, t3c } = localState.points;
    const drawTri = (p: any, color: string, name: string) => {
        svg.append('path').attr('d', `M${p[0].x},${p[0].y} L${p[1].x},${p[1].y} L${p[2].x},${p[2].y} Z`).attr('fill', 'none').attr('stroke', color).attr('stroke-width', 3);
        addLabel(p[0].x, p[0].y - 12, name, color);
    };
    drawTri([t2a, t2b, t2c], '#f59e0b', "TRIANGLE-1");
    drawTri([t3a, t3b, t3c], '#8b5cf6', "TRIANGLE-2");
    const drag = (k: string) => (window as any).d3.drag().on('drag', (e: any) => { (localState.points as any)[k] = { x: e.x, y: e.y }; draw(); });
    ['t2a', 't2b', 't2c', 't3a', 't3b', 't3c'].forEach(k => svg.append('circle').attr('cx', (localState.points as any)[k].x).attr('cy', (localState.points as any)[k].y).attr('r', 10).attr('fill', k.includes('t2') ? '#f59e0b' : '#8b5cf6').attr('stroke', 'white').call(drag(k)));
}

function drawCircle(svg: any, addLabel: any) {
    const { c1, r1 } = localState.points;
    svg.append('circle').attr('cx', c1.x).attr('cy', c1.y).attr('r', r1).attr('fill', 'rgba(139, 92, 246, 0.1)').attr('stroke', '#8b5cf6').attr('stroke-width', 4);
    if (localState.lesson === 'Tangent Axiom') {
        const tx = c1.x + r1;
        svg.append('line').attr('x1', tx).attr('y1', 50).attr('x2', tx).attr('y2', 450).attr('stroke', '#f43f5e').attr('stroke-width', 3);
        addLabel(tx + 10, c1.y, "TANGENT PT", "#f43f5e");
        svg.append('path').attr('d', `M${tx},${c1.y} L${tx-10},${c1.y} L${tx-10},${c1.y+10} L${tx},${c1.y+10}`).attr('fill', 'none').attr('stroke', '#f43f5e').attr('stroke-width', 1);
    }
    const dC = (window as any).d3.drag().on('drag', (e: any) => { localState.points.c1 = { x: e.x, y: e.y }; draw(); });
    const dR = (window as any).d3.drag().on('drag', (e: any) => { localState.points.r1 = Math.max(20, Math.min(230, getDist(c1, {x: e.x, y: e.y}))); draw(); });
    svg.append('circle').attr('cx', c1.x).attr('cy', c1.y).attr('r', 10).attr('fill', '#8b5cf6').attr('stroke', 'white').call(dC);
    svg.append('circle').attr('cx', c1.x + r1).attr('cy', c1.y).attr('r', 12).attr('fill', '#f43f5e').attr('stroke', 'white').call(dR);
}

init();
