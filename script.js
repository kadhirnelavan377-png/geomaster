
// App State
let state = {
    isLoggedIn: false,
    name: '',
    activeLab: 'triangle', // 'triangle' or 'circle'
    activeLesson: 'The Incenter',
    triangle: { a: { x: 200, y: 80 }, b: { x: 80, y: 320 }, c: { x: 320, y: 320 } },
    circle: { center: { x: 200, y: 200 }, radius: 100 }
};

// Lessons Data
const LESSONS = {
    triangle: ['The Incenter', 'The Inradius', 'Area & Inradius'],
    circle: ['Radius & Diameter', 'Tangents', 'Sectors']
};

// Initialize Lucide Icons
lucide.createIcons();

// --- Auth Functions ---
document.getElementById('start-btn').addEventListener('click', () => {
    const nameInput = document.getElementById('user-name');
    if (nameInput.value.trim()) {
        state.name = nameInput.value.trim();
        login();
    }
});

function login() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    renderLessons();
    drawGeometry();
}

function logout() {
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('dashboard').classList.add('hidden');
}

// --- Navigation ---
function switchLab(lab) {
    state.activeLab = lab;
    state.activeLesson = LESSONS[lab][0];
    
    // UI Classes
    const btns = document.querySelectorAll('.lab-btn');
    btns.forEach(b => b.classList.remove('bg-emerald-600', 'bg-violet-600', 'text-white'));
    btns.forEach(b => b.classList.add('text-slate-500'));
    
    const activeBtn = document.getElementById(`btn-${lab}`);
    activeBtn.classList.remove('text-slate-500');
    activeBtn.classList.add(lab === 'triangle' ? 'bg-emerald-600' : 'bg-violet-600', 'text-white');

    document.getElementById('lab-title').innerText = lab === 'triangle' ? 'Triangle Incircle Lab' : 'Circle Mastery Lab';
    document.getElementById('current-lesson-text').innerText = state.activeLesson;
    document.getElementById('current-lesson-text').className = lab === 'triangle' ? 'text-emerald-500' : 'text-violet-500';

    renderLessons();
    drawGeometry();
}

function renderLessons() {
    const list = document.getElementById('lesson-list');
    list.innerHTML = '';
    
    LESSONS[state.activeLab].forEach(lesson => {
        const btn = document.createElement('button');
        const isActive = state.activeLesson === lesson;
        
        btn.className = `lesson-card w-full text-left p-5 rounded-2xl border transition-all relative group overflow-hidden ${
            isActive ? (state.activeLab === 'triangle' ? 'active shadow-lg' : 'active active-circle shadow-lg') : 'bg-slate-900/50 border-white/5 hover:border-white/20 hover:bg-white/5'
        }`;
        
        btn.innerHTML = `
            <div class="flex items-center gap-3">
                <div class="p-2 rounded-lg ${isActive ? 'bg-white/20' : 'bg-slate-800'}">
                    <i data-lucide="book-open" class="${isActive ? 'text-white' : (state.activeLab === 'triangle' ? 'text-emerald-500' : 'text-violet-500')} w-4 h-4"></i>
                </div>
                <h4 class="font-black text-xs tracking-tight uppercase ${isActive ? 'text-white' : 'text-slate-400'}">${lesson}</h4>
            </div>
        `;
        
        btn.onclick = () => {
            state.activeLesson = lesson;
            document.getElementById('current-lesson-text').innerText = lesson;
            renderLessons();
            drawGeometry();
        };
        list.appendChild(btn);
    });
    lucide.createIcons();
}

// --- Geometry Drawing (D3.js) ---
function drawGeometry() {
    const svg = d3.select('#geometry-svg');
    svg.selectAll("*").remove();
    
    if (state.activeLab === 'triangle') {
        drawTriangleLab(svg);
    } else {
        drawCircleLab(svg);
    }
}

function drawTriangleLab(svg) {
    const { a, b, c } = state.triangle;
    
    const getDist = (p1, p2) => Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
    const sA = getDist(b, c);
    const sB = getDist(a, c);
    const sC = getDist(a, b);
    const perim = sA + sB + sC;
    const semi = perim / 2;
    const area = Math.sqrt(Math.max(0, semi * (semi - sA) * (semi - sB) * (semi - sC)));
    const radius = area / semi;
    const incenter = {
        x: (sA * a.x + sB * b.x + sC * c.x) / perim,
        y: (sA * a.y + sB * b.y + sC * c.y) / perim
    };

    // Draw Triangle
    svg.append('path')
        .attr('d', `M ${a.x} ${a.y} L ${b.x} ${b.y} L ${c.x} ${c.y} Z`)
        .attr('fill', 'rgba(16, 185, 129, 0.05)')
        .attr('stroke', '#10b981').attr('stroke-width', 4).attr('stroke-linejoin', 'round');

    // Draw Incircle
    svg.append('circle')
        .attr('cx', incenter.x).attr('cy', incenter.y).attr('r', radius)
        .attr('fill', 'rgba(56, 189, 248, 0.1)')
        .attr('stroke', '#38bdf8').attr('stroke-width', 3).attr('stroke-dasharray', '5,5');

    // Draw Bisectors
    const drawLine = (p1, p2) => {
        svg.append('line')
            .attr('x1', p1.x).attr('y1', p1.y).attr('x2', p2.x).attr('y2', p2.y)
            .attr('stroke', 'rgba(255,255,255,0.2)')
            .attr('stroke-width', 1).attr('stroke-dasharray', '2,2');
    };
    drawLine(a, incenter);
    drawLine(b, incenter);
    drawLine(c, incenter);

    // Draggable Corners
    const dragHandler = d3.drag().on('drag', function(event, d) {
        state.triangle[d].x = Math.max(20, Math.min(380, event.x));
        state.triangle[d].y = Math.max(20, Math.min(380, event.y));
        drawGeometry();
    });

    ['a', 'b', 'c'].forEach(key => {
        svg.append('circle')
            .datum(key)
            .attr('cx', state.triangle[key].x).attr('cy', state.triangle[key].y).attr('r', 12)
            .attr('fill', '#10b981').attr('stroke', 'white').attr('stroke-width', 2)
            .style('cursor', 'pointer').call(dragHandler);
    });

    svg.append('circle').attr('cx', incenter.x).attr('cy', incenter.y).attr('r', 6).attr('fill', '#38bdf8').attr('stroke', 'white');

    updateStatsPanel([
        { label: 'Inradius (r)', value: Math.round(radius), color: 'text-sky-400' },
        { label: 'Area (A)', value: Math.round(area), color: 'text-emerald-400' },
        { label: 'Semiperimeter (s)', value: Math.round(semi), color: 'text-amber-400' },
        { label: 'Equation Check', value: `${Math.round(radius)} × ${Math.round(semi)} = ${Math.round(radius * semi)}`, color: 'text-white' }
    ], 'Area = r × s');
}

function drawCircleLab(svg) {
    const { center, radius } = state.circle;
    const circ = 2 * Math.PI * radius;
    const area = Math.PI * radius * radius;

    svg.append('circle')
        .attr('cx', center.x).attr('cy', center.y).attr('r', radius)
        .attr('fill', 'rgba(139, 92, 246, 0.08)')
        .attr('stroke', '#8b5cf6').attr('stroke-width', 3);

    // Tangent Visual
    if (state.activeLesson === 'Tangents') {
        const angle = Math.PI / 4;
        const tx = center.x + radius * Math.cos(angle);
        const ty = center.y + radius * Math.sin(angle);
        const lineLen = 150;
        const x1 = tx - lineLen * Math.sin(angle);
        const y1 = ty + lineLen * Math.cos(angle);
        const x2 = tx + lineLen * Math.sin(angle);
        const y2 = ty - lineLen * Math.cos(angle);
        svg.append('line').attr('x1', x1).attr('y1', y1).attr('x2', x2).attr('y2', y2).attr('stroke', '#f43f5e').attr('stroke-width', 4);
        svg.append('circle').attr('cx', tx).attr('cy', ty).attr('r', 6).attr('fill', '#f43f5e');
    }

    // Sector Visual
    if (state.activeLesson === 'Sectors') {
        const arcPath = `M ${center.x} ${center.y} L ${center.x + radius} ${center.y} A ${radius} ${radius} 0 0 1 ${center.x + radius * Math.cos(Math.PI/3)} ${center.y - radius * Math.sin(Math.PI/3)} Z`;
        svg.append('path').attr('d', arcPath).attr('fill', 'rgba(16, 185, 129, 0.2)').attr('stroke', '#10b981').attr('stroke-width', 2);
    }

    const dragCenter = d3.drag().on('drag', (event) => {
        state.circle.center.x = Math.max(radius, Math.min(400 - radius, event.x));
        state.circle.center.y = Math.max(radius, Math.min(400 - radius, event.y));
        drawGeometry();
    });

    const dragRadius = d3.drag().on('drag', (event) => {
        const dx = event.x - center.x;
        const dy = event.y - center.y;
        state.circle.radius = Math.max(20, Math.min(180, Math.sqrt(dx*dx + dy*dy)));
        drawGeometry();
    });

    svg.append('circle').attr('cx', center.x).attr('cy', center.y).attr('r', 8).attr('fill', '#8b5cf6').attr('stroke', 'white').style('cursor', 'move').call(dragCenter);
    svg.append('circle').attr('cx', center.x + radius).attr('cy', center.y).attr('r', 12).attr('fill', '#f43f5e').attr('stroke', 'white').style('cursor', 'ew-resize').call(dragRadius);

    updateStatsPanel([
        { label: 'Radius', value: Math.round(radius), color: 'text-rose-400' },
        { label: 'Diameter', value: Math.round(radius * 2), color: 'text-indigo-400' },
        { label: 'Circumference', value: Math.round(circ), color: 'text-violet-400' },
        { label: 'Area', value: Math.round(area), color: 'text-emerald-400' }
    ], 'C = 2πr');
}

function updateStatsPanel(items, formula) {
    const panel = document.getElementById('stats-panel');
    let html = `<div class="grid grid-cols-2 gap-4">`;
    items.forEach(item => {
        html += `
            <div class="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p class="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">${item.label}</p>
                <p class="text-xl font-black ${item.color}">${item.value}</p>
            </div>
        `;
    });
    html += `</div>`;
    html += `
        <div class="p-6 ${state.activeLab === 'triangle' ? 'bg-emerald-600/10 border-emerald-500/20' : 'bg-violet-600/10 border-violet-500/20'} border rounded-3xl space-y-3">
             <h4 class="text-[10px] font-black uppercase tracking-[0.2em] ${state.activeLab === 'triangle' ? 'text-emerald-400' : 'text-violet-400'}">Key Relation</h4>
             <div class="text-3xl font-black text-white italic text-center py-4 border-y border-white/5">${formula}</div>
             <p class="text-[10px] text-slate-500 text-center uppercase font-bold tracking-widest">Master this concept without doubt!</p>
        </div>
    `;
    panel.innerHTML = html;
}

// --- Modal Functions ---
function showModal() {
    const modal = document.getElementById('modal');
    const content = document.getElementById('modal-content');
    const title = document.getElementById('modal-title');
    const iconBg = document.getElementById('modal-icon-bg');
    const header = document.getElementById('modal-header');
    const closeBtn = document.getElementById('modal-close-btn');
    
    if (state.activeLab === 'triangle') {
        title.innerText = 'Triangle Incircle Guide';
        header.className = 'p-6 border-b border-white/5 flex justify-between items-center bg-emerald-600/10';
        iconBg.className = 'p-3 rounded-xl bg-emerald-600';
        closeBtn.className = 'px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl transition-all shadow-lg uppercase tracking-widest text-xs';
        content.innerHTML = `
            <div class="space-y-6">
                <p class="text-lg text-emerald-400 font-bold">The Incircle is the largest circle that can fit inside a triangle.</p>
                <div class="space-y-4">
                    <div class="bg-white/5 p-6 rounded-2xl border border-white/5">
                        <h3 class="text-white font-black uppercase text-sm mb-2">1. The Incenter</h3>
                        <p>The exact center of the circle is where all three <strong>Angle Bisectors</strong> cross paths.</p>
                    </div>
                    <div class="bg-white/5 p-6 rounded-2xl border border-white/5">
                        <h3 class="text-white font-black uppercase text-sm mb-2">2. The Inradius (r)</h3>
                        <p>The distance from the center to any side. It is always 90° (perpendicular) to the triangle's edge.</p>
                    </div>
                    <div class="bg-white/5 p-6 rounded-2xl border border-white/5">
                        <h3 class="text-white font-black uppercase text-sm mb-2">3. The Magic Formula</h3>
                        <p class="text-2xl text-center py-4 text-white font-black italic">Area = r × s</p>
                    </div>
                </div>
            </div>
        `;
    } else {
        title.innerText = 'Circle Masterclass';
        header.className = 'p-6 border-b border-white/5 flex justify-between items-center bg-violet-600/10';
        iconBg.className = 'p-3 rounded-xl bg-violet-600';
        closeBtn.className = 'px-8 py-3 bg-violet-600 hover:bg-violet-500 text-white font-black rounded-xl transition-all shadow-lg uppercase tracking-widest text-xs';
        content.innerHTML = `
            <div class="space-y-6">
                <p class="text-lg text-violet-400 font-bold">A circle is a set of points equidistant from a single center point.</p>
                <div class="space-y-4">
                    <div class="bg-white/5 p-6 rounded-2xl border border-white/5">
                        <h3 class="text-white font-black uppercase text-sm mb-2">1. Radius vs Diameter</h3>
                        <p>The Radius (r) is the distance to the edge. The Diameter (d) is exactly twice the radius.</p>
                    </div>
                    <div class="bg-white/5 p-6 rounded-2xl border border-white/5">
                        <h3 class="text-white font-black uppercase text-sm mb-2">2. Tangents</h3>
                        <p>A line that touches the circle at only one single point. It always makes a 90° angle with the radius.</p>
                    </div>
                </div>
            </div>
        `;
    }
    modal.classList.remove('hidden');
    lucide.createIcons();
}

function hideModal() {
    document.getElementById('modal').classList.add('hidden');
}
