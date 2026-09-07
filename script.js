        // Pipeline Stage Descriptions
        const stepDescriptions = {
            1: "Stage 01 (IDEA SIGNAL — $490): Is there enough signal to investigate this idea further?",
            2: "Stage 02 (PRODUCT AUTOPSY — $2,490): Market, technical and economic risk analysis — a BUILD / BUILD WITH CONDITIONS / PIVOT / KILL verdict.",
            3: "Stage 03 (PRODUCT BLUEPRINT — $4,900): 18-document build-ready specification — PRD, architecture, AI Build Pack.",
            4: "Stage 04 (0→1 PRODUCT DEVELOPMENT — Selected): Turn a completed Blueprint or Hardware Feasibility into a working product."
        };

        let currentAutoStage = 1;
        let autoStageInterval = null;

        function highlightStep(stepNum, isManual = true) {
            if (isManual && autoStageInterval) {
                clearInterval(autoStageInterval);
            }

            for (let i = 1; i <= 4; i++) {
                const node = document.getElementById(`step-node-${i}`);
                const accent = document.getElementById(`step-accent-${i}`);
                const stageText = node.querySelector('.font-mono');
                const descText = node.querySelector('.text-xs');

                if (i === stepNum) {
                    node.className = 'cursor-pointer group p-4 rounded-xl bg-emerald-500/10 border border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all text-center relative overflow-hidden';
                    if (accent) accent.classList.remove('hidden');
                    if (stageText) {
                        stageText.classList.remove('text-slate-500');
                        stageText.classList.add('text-emerald-400');
                    }
                    if (descText) {
                        descText.classList.remove('text-slate-400');
                        descText.classList.add('text-slate-300');
                    }
                } else {
                    node.className = 'cursor-pointer group p-4 rounded-xl bg-dark-bg/80 border border-dark-border/80 hover:border-slate-600 transition-all text-center relative overflow-hidden opacity-70 hover:opacity-100';
                    if (accent) accent.classList.add('hidden');
                    if (stageText) {
                        stageText.classList.remove('text-emerald-400');
                        stageText.classList.add('text-slate-500');
                    }
                    if (descText) {
                        descText.classList.remove('text-slate-300');
                        descText.classList.add('text-slate-400');
                    }
                }
            }
            
            document.getElementById('pipeline-desc').innerText = stepDescriptions[stepNum];
            document.getElementById('pipeline-active-tag').innerText = `Active Trace: Stage 0${stepNum}`;
        }

        function startPipelineAutoSignal() {
            autoStageInterval = setInterval(() => {
                currentAutoStage = (currentAutoStage % 4) + 1;
                highlightStep(currentAutoStage, false);
            }, 3500);
        }

        // Technical Canvas Motion
        function initEngineeringMotion() {
            const canvas = document.getElementById('tech-canvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');

            let width = canvas.width = window.innerWidth;
            let height = canvas.height = window.innerHeight;

            window.addEventListener('resize', () => {
                width = canvas.width = window.innerWidth;
                height = canvas.height = window.innerHeight;
            });

            const trail = [];
            const maxTrailLength = 14;
            let mouseX = -100;
            let mouseY = -100;
            let activePulseTarget = null;
            let currentPulseTarget = null;
            let pulseOpacity = 0;
            let pulsePhase = 0;
            let activeCursorMode = 'product';

            window.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;

                trail.unshift({
                    x: mouseX,
                    y: mouseY,
                    time: Date.now(),
                    size: Math.random() * 2 + 1.5,
                    mode: activeCursorMode
                });

                if (trail.length > maxTrailLength) {
                    trail.pop();
                }

                let foundTarget = null;
                const techNodes = document.querySelectorAll('[data-tech-keyword]');
                techNodes.forEach(node => {
                    const rect = node.getBoundingClientRect();
                    if (
                        mouseX >= rect.left - 10 &&
                        mouseX <= rect.right + 10 &&
                        mouseY >= rect.top - 10 &&
                        mouseY <= rect.bottom + 10
                    ) {
                        foundTarget = {
                            x: rect.left + rect.width / 2,
                            y: rect.top + rect.height / 2,
                            width: rect.width,
                            height: rect.height,
                            label: node.getAttribute('data-tech-keyword')
                        };
                        const mode = node.getAttribute('data-cursor-mode');
                        if (mode) activeCursorMode = mode;
                    }
                });
                activePulseTarget = foundTarget;
            });

            function draw() {
                ctx.clearRect(0, 0, width, height);

                // Pulse target on hover keyword
                if (activePulseTarget) {
                    currentPulseTarget = activePulseTarget;
                    pulseOpacity = Math.min(1, pulseOpacity + 0.1);
                } else {
                    pulseOpacity = Math.max(0, pulseOpacity - 0.08);
                }

                if (currentPulseTarget && pulseOpacity > 0.01) {
                    pulsePhase += 0.05;
                    const expand = Math.sin(pulsePhase) * 3 + 6;

                    ctx.save();
                    ctx.strokeStyle = `rgba(16, 185, 129, ${pulseOpacity * 0.4})`;
                    ctx.lineWidth = 1;
                    ctx.setLineDash([3, 3]);
                    ctx.strokeRect(
                        currentPulseTarget.x - currentPulseTarget.width / 2 - expand,
                        currentPulseTarget.y - currentPulseTarget.height / 2 - expand,
                        currentPulseTarget.width + expand * 2,
                        currentPulseTarget.height + expand * 2
                    );

                    ctx.font = '10px JetBrains Mono, monospace';
                    ctx.fillStyle = `rgba(16, 185, 129, ${pulseOpacity * 0.9})`;
                    ctx.fillText(
                        `SYS_SIGNAL: ${currentPulseTarget.label}`, 
                        currentPulseTarget.x - currentPulseTarget.width / 2 - expand, 
                        currentPulseTarget.y - currentPulseTarget.height / 2 - expand - 6
                    );
                    ctx.restore();
                }

                // Layer 3: Context-Adaptive Cursor Trail
                if (trail.length > 1) {
                    ctx.beginPath();
                    ctx.moveTo(trail[0].x, trail[0].y);

                    if (activeCursorMode === 'hardware') {
                        for (let i = 1; i < trail.length; i++) {
                            ctx.lineTo(trail[i-1].x, trail[i].y);
                            ctx.lineTo(trail[i].x, trail[i].y);
                        }
                        ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
                    } else if (activeCursorMode === 'software') {
                        for (let i = 1; i < trail.length; i++) {
                            const xc = (trail[i].x + trail[i - 1].x) / 2;
                            const yc = (trail[i].y + trail[i - 1].y) / 2;
                            ctx.quadraticCurveTo(trail[i - 1].x, trail[i - 1].y, xc, yc);
                        }
                        ctx.strokeStyle = 'rgba(16, 185, 129, 0.25)';
                    } else {
                        for (let i = 1; i < trail.length; i++) {
                            ctx.lineTo(trail[i].x, trail[i].y);
                        }
                        ctx.strokeStyle = 'rgba(16, 185, 129, 0.18)';
                    }

                    ctx.lineWidth = 1;
                    ctx.stroke();

                    for (let i = 0; i < trail.length; i++) {
                        const point = trail[i];
                        const age = Date.now() - point.time;
                        const life = Math.max(0, 1 - age / 500);

                        if (life <= 0) continue;

                        ctx.save();
                        if (activeCursorMode === 'software' && i % 3 === 0) {
                            ctx.font = '9px JetBrains Mono, monospace';
                            ctx.fillStyle = `rgba(16, 185, 129, ${life * 0.7})`;
                            ctx.fillText(i % 2 === 0 ? '01' : 'ACK', point.x + 4, point.y + 4);
                        } else if (activeCursorMode === 'production' && i % 2 === 0) {
                            ctx.strokeStyle = `rgba(168, 85, 247, ${life * 0.6})`;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(point.x - 3, point.y); ctx.lineTo(point.x + 3, point.y);
                            ctx.moveTo(point.x, point.y - 3); ctx.lineTo(point.x, point.y + 3);
                            ctx.stroke();
                        } else {
                            ctx.beginPath();
                            ctx.arc(point.x, point.y, point.size * life, 0, Math.PI * 2);
                            ctx.fillStyle = i === 0 
                                ? 'rgba(52, 211, 153, 0.8)' 
                                : `rgba(16, 185, 129, ${life * 0.35})`;
                            ctx.fill();
                        }
                        ctx.restore();
                    }
                }

                requestAnimationFrame(draw);
            }

            draw();
        }

        window.addEventListener('load', () => {
            initEngineeringMotion();
            startPipelineAutoSignal();
        });

        // Sample Request Modal (email-gated deliverable samples)
        const sampleLabels = {
            'Idea Signal': 'Get the Idea Signal sample',
            'Product Autopsy': 'Get the Product Autopsy sample',
            'Product Blueprint': 'Get the Product Blueprint sample',
            'Hardware Feasibility': 'Get the Hardware Feasibility sample'
        };
        let currentSampleRequest = null;

        function openSampleModal(sampleName) {
            currentSampleRequest = sampleName;
            const modal = document.getElementById('sample-modal');
            const title = document.getElementById('sample-modal-title');
            title.innerText = sampleLabels[sampleName] || 'Get the sample by email';
            modal.classList.remove('hidden');

            if (typeof gtag === 'function') {
                gtag('event', 'sample_request_opened', { 'sample_name': sampleName });
            } else {
                console.log(`[Analytics Event] sample_request_opened: sample=${sampleName}`);
            }
        }

        function closeSampleModal() {
            const modal = document.getElementById('sample-modal');
            modal.classList.add('hidden');
            document.getElementById('sample-form').classList.remove('hidden');
            document.getElementById('sample-modal-success').classList.add('hidden');
            document.getElementById('sample-form').reset();
        }

        function handleSampleFormSubmit(e) {
            e.preventDefault();
            // NOTE: This is a front-end stub only. No email is actually sent yet —
            // wiring this to a real delivery service (e.g. a form backend + mailer)
            // is a follow-up integration step.
            const productType = document.getElementById('sample-product-type').value;
            const role = document.getElementById('sample-role').value;
            const stage = document.getElementById('sample-stage').value;

            if (typeof gtag === 'function') {
                gtag('event', 'sample_requested', {
                    'sample_name': currentSampleRequest,
                    'product_type': productType,
                    'role': role,
                    'product_stage': stage
                });
            } else {
                console.log(`[Analytics Event] sample_requested: sample=${currentSampleRequest}, product_type=${productType}, role=${role}, stage=${stage}`);
            }
            document.getElementById('sample-form').classList.add('hidden');
            document.getElementById('sample-modal-success').classList.remove('hidden');
            showToast(`Sample request received for ${currentSampleRequest || 'this package'}`);
        }

        function showToast(message) {
            const container = document.getElementById('toast-container');
            const toast = document.createElement('div');
            toast.className = 'pointer-events-auto bg-dark-card border border-emerald-500/60 text-white px-4 py-3 rounded-xl shadow-2xl font-mono text-xs flex items-center gap-3 transition-all transform translate-y-2 opacity-0';
            toast.innerHTML = `
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                <span>${message}</span>
            `;
            container.appendChild(toast);

            setTimeout(() => {
                toast.classList.remove('translate-y-2', 'opacity-0');
            }, 10);

            setTimeout(() => {
                toast.classList.add('opacity-0', 'translate-y-2');
                setTimeout(() => toast.remove(), 300);
            }, 4000);
        }

        function openDiscoveryModal(preselectTier = null) {
            const modal = document.getElementById('discovery-modal');
            modal.classList.remove('hidden');
            
            if (preselectTier) {
                const stageSelect = document.getElementById('product-stage');
                if (preselectTier.includes('Idea Signal')) stageSelect.value = 'signal';
                else if (preselectTier.includes('Autopsy')) stageSelect.value = 'raw';
                else if (preselectTier.includes('Hardware Feasibility')) stageSelect.value = 'hardware';
                else if (preselectTier.includes('Blueprint')) stageSelect.value = 'validated';
                else if (preselectTier.includes('Dev')) stageSelect.value = 'ready-to-build';
            }
        }

        function closeDiscoveryModal() {
            const modal = document.getElementById('discovery-modal');
            modal.classList.add('hidden');
            document.getElementById('discovery-form').classList.remove('hidden');
            document.getElementById('modal-success').classList.add('hidden');
        }

        function handleFormSubmit(e) {
            e.preventDefault();
            document.getElementById('discovery-form').classList.add('hidden');
            document.getElementById('modal-success').classList.remove('hidden');
        }
    
