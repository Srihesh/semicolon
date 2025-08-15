const COMMON_PATTERNS = [
    { name: 'Email', pattern: '^[\\w.-]+@([\\w-]+\\.)+[\\w-]{2,4}$', category: 'Web' },
    { name: 'URL (HTTP/S)', pattern: 'https?:\/\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)', category: 'Web' },
    { name: 'IPv4 Address', pattern: '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$', category: 'Network' },
    { name: 'Password (Strong)', pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$', category: 'Security' },
    { name: 'Username', pattern: '^[a-zA-Z0-9_-]{3,16}$', category: 'User Data' },
    { name: 'Slug (URL-friendly)', pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$', category: 'Web' },
    { name: 'Date (YYYY-MM-DD)', pattern: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$', category: 'Data' },
    { name: 'Hex Color Code', pattern: '^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$', category: 'Graphics' },
    { name: 'US Phone Number', pattern: '^(?:\\(\\d{3}\\)|\\d{3})[-.\\s]?\\d{3}[-.\\s]?\\d{4}$', category: 'User Data' },
    { name: 'Credit Card (Visa, MC, Amex)', pattern: '^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13})$', category: 'Security' },
    { name: 'JSON Web Token (JWT)', pattern: '^[A-Za-z0-9-_=]+\\.[A-Za-z0-9-_=]+\\.?[A-Za-z0-9-_.+/=]*$', category: 'Security'},
    { name: 'UUID', pattern: '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$', category: 'Data'}
];

const CHEATSHEET_DATA = [
    { title: 'Characters', tokens: [
        { t: '\\d', d: 'Any digit', ex: 'd1g1t' }, { t: '\\w', d: 'Any word character', ex: 'a_b-c' },
        { t: '\\s', d: 'Any whitespace', ex: 'a b' }, { t: '.', d: 'Any char except newline', ex: 'a.c' }
    ]},
    { title: 'Quantifiers', tokens: [
        { t: '*', d: '0 or more', ex: 'a*' }, { t: '+', d: '1 or more', ex: 'a+' },
        { t: '?', d: '0 or 1', ex: 'a?' }, { t: '{n,m}', d: 'Range', ex: 'a{1,2}' }
    ]},
    { title: 'Anchors & Boundaries', tokens: [
        { t: '^', d: 'Start of string', ex: '^a' }, { t: '$', d: 'End of string', ex: 'a$' },
        { t: '\\b', d: 'Word boundary', ex: '\\bword\\b' }
    ]},
    { title: 'Groups & Lookarounds', tokens: [
        { t: '(...)', d: 'Capturing group', ex: '(ab)c' }, { t: '(?:...)', d: 'Non-capturing group', ex: '(?:ab)c' },
        { t: '(?=...)', d: 'Positive lookahead', ex: 'a(?=b)' }
    ]}
];

const CHALLENGES_DATA = [
    { name: 'Simple Start', desc: 'Match strings that contain "abc".', match: ['abc', 'zzabcde', 'xyzabc'], reject: ['acb', 'xyz', 'ab c'] },
    { name: 'Three Numbers', desc: 'Match exactly three consecutive digits.', match: ['123', 'a456b', '987'], reject: ['12', 'ab1234c', '1a2'] },
    { name: 'No Vowels', desc: 'Match words that contain no vowels (a, e, i, o, u).', match: ['rhythm', 'sky', 'tryst'], reject: ['hello', 'world', 'regex'] },
    { name: 'Email Usernames', desc: 'Match the username part of an email.', match: ['user@', 'admin@', 'test.name@'], reject: ['@domain.com', 'user', 'user@domain'] },
    { name: 'Hex Colors', desc: 'Match 3 or 6-digit hex color codes.', match: ['#FFF', '#ff0000', '#AABBCC'], reject: ['#12345', 'FFF', 'AABBGG'] },
    { name: 'HTML Tags', desc: 'Match simple opening and closing HTML tags.', match: ['<p>', '</div>', '<span>'], reject: ['<p', 'div>', '<span/>'] },
    { name: 'File Names', desc: 'Match valid file names (alphanumeric, dots, underscores).', match: ['image.jpg', 'doc_1.pdf', 'archive.zip'], reject: ['file name.txt', 'image/jpg', 'doc|1.pdf'] },
    { name: 'Same Start/End', desc: 'Match words that start and end with the same letter.', match: ['anna', 'level', 'rotor'], reject: ['alpha', 'beta', 'gamma'] }
];

document.addEventListener('DOMContentLoaded', () => {
    const app = new RegexVoyagerApp();
    app.init();
});

class RegexVoyagerApp {
    constructor() {
        this.pageHandlers = {
            '.home-section': this.initHomePage.bind(this),
            '.archive-section': this.initArchivePage.bind(this),
            '.playground-section': this.initPlaygroundPage.bind(this),
            '.visualization-section': this.initVisualizerPage.bind(this),
            '.challenges-section': this.initChallengesPage.bind(this),
            '.about-section': this.initAboutPage.bind(this)
        };
        this.audioCtx = null;
        this.sounds = {};
    }

    init() {
        this.initTheme();
        this.initPreloader();
        this.initAudio();
        this.initNavbarClock();
        this.initScrollAnimations();
        this.initCursorLight();
        this.initMouseParallax();

        for (const selector in this.pageHandlers) {
            if (document.querySelector(selector)) {
                this.pageHandlers[selector]();
                break;
            }
        }
    }

    initPreloader() {
        const preloader = document.getElementById('preloader');
        const glitchText = preloader ? preloader.querySelector('.glitch-text') : null;
        if(!glitchText) return;
        
        const originalText = glitchText.dataset.text;
        const chars = "!<>-_\\/[]{}—=+*^?#________";
        let interval = null;

        const decodeEffect = () => {
            let iteration = 0;
            clearInterval(interval);
            interval = setInterval(() => {
                glitchText.innerText = originalText.split("")
                    .map((letter, index) => {
                        if(index < iteration) return originalText[index];
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join("");
                if(iteration >= originalText.length) clearInterval(interval);
                iteration += 1 / 3;
            }, 30);
        };
        decodeEffect();

        window.addEventListener('load', () => {
            preloader.style.opacity = '0';
            setTimeout(() => preloader.style.display = 'none', 500);
        });
    }

    initTheme() {
        const toggle = document.getElementById('settings-toggle');
        const panel = document.getElementById('settings-panel');
        if(!toggle || !panel) return;
        
        toggle.addEventListener('click', () => {
            this.playSound('click');
            panel.classList.toggle('visible');
        });

        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.playSound('switch');
                const theme = e.target.dataset.theme;
                document.body.className = theme;
                localStorage.setItem('regexVoyagerTheme', theme);
                panel.classList.remove('visible');
            });
        });

        const savedTheme = localStorage.getItem('regexVoyagerTheme') || 'theme-cyber';
        document.body.className = savedTheme;
    }
    
    initNavbarClock() {
        const clockEl = document.getElementById('navbar-clock');
        if (!clockEl) return;
        const updateClock = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
            clockEl.textContent = timeString;
        };
        updateClock();
        setInterval(updateClock, 1000);
    }

    initAudio() {
        document.body.addEventListener('click', () => {
            if (!this.audioCtx) {
                try {
                    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                    this.sounds.click = this.createSound(220, 0.1, 'square');
                    this.sounds.hover = this.createSound(440, 0.05, 'sine', 0.1);
                    this.sounds.switch = this.createSound(660, 0.1, 'sawtooth');
                } catch(e) { console.error("Web Audio API is not supported."); }
            }
        }, { once: true });
        
        document.addEventListener('mouseover', (e) => {
            if (e.target.matches('a, button, [data-tilt], .token-card')) this.playSound('hover');
        });
        document.addEventListener('click', (e) => {
            if (e.target.matches('a, button, [data-tilt], .token-card')) this.playSound('click');
        });
    }

    createSound(freq, duration, type, vol = 0.3) {
        return () => {
            if (!this.audioCtx) return;
            const oscillator = this.audioCtx.createOscillator();
            const gainNode = this.audioCtx.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(this.audioCtx.destination);
            oscillator.type = type;
            oscillator.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
            gainNode.gain.setValueAtTime(vol, this.audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);
            oscillator.start(this.audioCtx.currentTime);
            oscillator.stop(this.audioCtx.currentTime + duration);
        };
    }
    
    playSound(sound) {
        if (this.sounds[sound]) this.sounds[sound]();
    }
    
    initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.anim-fade-in');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        animatedElements.forEach(el => observer.observe(el));
    }
    
    initCursorLight() {
        const light = document.getElementById('cursor-light');
        if (!light) return;
        window.addEventListener('mousemove', e => {
            light.style.top = `${e.clientY}px`;
            light.style.left = `${e.clientX}px`;
        });
    }

    initMouseParallax() {
        window.addEventListener('mousemove', e => {
            const x = (e.clientX / window.innerWidth) - 0.5;
            const y = (e.clientY / window.innerHeight) - 0.5;
            document.body.style.setProperty('--mouse-x', x);
            document.body.style.setProperty('--mouse-y', y);
        });
    }

    initTiltEffect() {
        document.querySelectorAll('[data-tilt]').forEach(el => {
            el.addEventListener('mousemove', e => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const { width, height } = rect;
                const rotateX = (y / height - 0.5) * -20;
                const rotateY = (x / width - 0.5) * 20;
                el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
            });
            el.addEventListener('mouseleave', () => {
                el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });
    }

    initHomePage() {
        this.initTiltEffect();
        const typingTextElement = document.getElementById('typing-text');
        if (!typingTextElement) return;
        const text = "The Regex Engine";
        let index = 0;
        const type = () => {
            if (index < text.length) {
                typingTextElement.textContent += text.charAt(index);
                index++;
                setTimeout(type, 150);
            }
        };
        type();
    }

    initArchivePage() {
        const patternLibrary = document.getElementById('pattern-library');
        if (patternLibrary) {
            patternLibrary.innerHTML = COMMON_PATTERNS.map(pat => `
                <div class="pattern-card" data-tilt data-pattern="${this.escapeHTML(pat.pattern)}" title="Click to copy">
                    <div class="card-category">${pat.category}</div>
                    <h3>${pat.name}</h3>
                    <code>${this.escapeHTML(pat.pattern)}</code>
                    <div class="copy-feedback">COPIED</div>
                </div>
            `).join('');
            document.querySelectorAll('.pattern-card').forEach(card => {
                card.addEventListener('click', () => {
                    navigator.clipboard.writeText(card.dataset.pattern).then(() => {
                        card.classList.add('copied');
                        setTimeout(() => card.classList.remove('copied'), 1500);
                    });
                });
            });
        }

        const grid = document.getElementById('cheatsheet-grid'), modal = document.getElementById('cheatsheet-modal'), modalToken = document.getElementById('modal-token'), modalDesc = document.getElementById('modal-desc'), modalDemo = document.getElementById('modal-demo');
        if (grid && modal) {
            grid.innerHTML = CHEATSHEET_DATA.map(group => `<div class="cheatsheet-group"><h3>${group.title}</h3><div class="token-container">${group.tokens.map(token => `<div class="token-card" data-token='${JSON.stringify(token)}'><code>${this.escapeHTML(token.t)}</code><span>${token.d}</span></div>`).join('')}</div></div>`).join('');
            grid.querySelectorAll('.token-card').forEach(card => card.addEventListener('click', () => {
                const data = JSON.parse(card.dataset.token);
                modalToken.innerHTML = `<code>${this.escapeHTML(data.t)}</code>`;
                modalDesc.textContent = data.d;
                try { modalDemo.innerHTML = this.escapeHTML(data.ex).replace(new RegExp(data.t.replace(/\\/g, '\\\\'), 'g'), match => `<span class="highlight">${match}</span>`); } catch(e) { modalDemo.innerHTML = `<span class="fail">Error in demo regex.</span>`; }
                modal.classList.add('visible');
            }));
            modal.querySelector('.modal-close').addEventListener('click', () => modal.classList.remove('visible'));
            modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('visible'); });
        }
        
        this.initTiltEffect();
    }

    initPlaygroundPage() {
        const patternInput = document.getElementById('playground-pattern');
        const testsInput = document.getElementById('playground-tests');
        const subInput = document.getElementById('playground-sub');
        const testBtn = document.getElementById('playground-test-btn');
        const shareBtn = document.getElementById('playground-share-btn');
        const resultDiv = document.getElementById('playground-result');
        const subResultDiv = document.getElementById('playground-sub-result');
        const runTests = () => {
            const pattern = patternInput.value;
            const subPattern = subInput.value;
            const testCases = testsInput.value.split('\n').map(s => s.trim()).filter(Boolean);
            resultDiv.innerHTML = '<h4>Match Results:</h4>';
            subResultDiv.innerHTML = '<h4>Substitution Results:</h4>';
            if (!pattern || testCases.length === 0) { resultDiv.innerHTML += '<p class="error">Please provide a pattern and test cases.</p>'; return; }
            let re; try { re = new RegExp(pattern, 'g'); } catch (e) { resultDiv.innerHTML += `<p class="error">Invalid Regex: ${e.message}</p>`; return; }
            resultDiv.innerHTML += '<ul>' + testCases.map(tc => new RegExp(pattern).test(tc) ? `<li><span class="pass">✔ PASS:</span> <code>${this.escapeHTML(tc)}</code></li>` : `<li><span class="fail">✖ FAIL:</span> <code>${this.escapeHTML(tc)}</code></li>`).join('') + '</ul>';
            if (subPattern) {
                subResultDiv.innerHTML += '<ul>' + testCases.map(tc => `<li><code>${this.escapeHTML(tc)}</code> → <code>${this.escapeHTML(tc.replace(re, subPattern))}</code></li>`).join('') + '</ul>';
            } else { subResultDiv.innerHTML = ''; }
        };
        testBtn.onclick = runTests;
        shareBtn.onclick = () => {
            this.playSound('switch');
            if(!patternInput.value && !testsInput.value) { shareBtn.textContent = 'Fields empty!'; setTimeout(() => { shareBtn.textContent = 'Share Pattern' }, 2000); return; }
            const url = new URL(window.location.origin + window.location.pathname);
            url.searchParams.set('pattern', btoa(patternInput.value));
            url.searchParams.set('tests', btoa(testsInput.value));
            url.searchParams.set('sub', btoa(subInput.value));
            navigator.clipboard.writeText(url.href).then(() => { shareBtn.textContent = 'URL Copied!'; setTimeout(() => { shareBtn.textContent = 'Share Pattern' }, 2000); });
        };
        const params = new URLSearchParams(window.location.search);
        if (params.has('pattern')) try { patternInput.value = atob(params.get('pattern')); } catch(e){}
        if (params.has('tests')) try { testsInput.value = atob(params.get('tests')); } catch(e){}
        if (params.has('sub')) try { subInput.value = atob(params.get('sub')); } catch(e){}
        if (params.has('pattern')) runTests();
    }

    initVisualizerPage() {
        const regexInput = document.getElementById('regex-pattern'), testStringInput = document.getElementById('test-string'), visualizeBtn = document.getElementById('visualize-btn'), patternVisual = document.getElementById('pattern-visual'), stringVisual = document.getElementById('string-visual'), explanationLog = document.getElementById('explanation-log'), prevStepBtn = document.getElementById('prev-step'), nextStepBtn = document.getElementById('next-step'), autoPlayBtn = document.getElementById('auto-play'), resetBtn = document.getElementById('reset');
        let steps = [], currentStep = 0, autoPlayInterval = null;

        const isPatternComplex = (pattern) => /[\(\[]\?|\[.*-.*\]|\{.*,\}/.test(pattern);

        const generateStepsSimple = (pattern, testStr) => {
            const genSteps = [];
            genSteps.push({ type: 'INFO', text: 'Complex pattern detected. Switching to simplified match-only visualization.', rp: -1, sp: -1 });
            let re;
            try { re = new RegExp(pattern, 'g'); } catch (e) { return [{ type: 'ERROR', text: `Invalid Regex: ${e.message}` }]; }
            let match;
            let found = false;
            while ((match = re.exec(testStr)) !== null) {
                found = true;
                genSteps.push({ type: 'MATCH', text: `Pattern signature locked: <code>${this.escapeHTML(match[0])}</code>`, rp: -1, sp: match.index, finalMatch: match[0] });
            }
            if (!found) {
                genSteps.push({ type: 'FAIL', text: 'Scan complete. No matching signature found.', rp: -1, sp: -1 });
            }
            return genSteps;
        };

        const generateStepsDetailed = (pattern, testStr) => {
            let genSteps = [];
            genSteps.push({ type: 'INFO', text: 'Core Engaged. Scanning string for pattern signature...', rp: -1, sp: -1 });
            let matchFound = false;
            const startPositions = pattern.startsWith('^') ? [0] : Array.from({length: testStr.length + 1}, (_, i) => i);

            for (const startPos of startPositions) {
                if (matchFound) break;
                let rp = 0;
                let sp = startPos;
                genSteps.push({ type: 'INFO', text: `Starting scan at string index ${startPos}.`, rp: -1, sp: startPos });

                if (pattern[rp] === '^') {
                    if (sp === 0) {
                        genSteps.push({ type: 'MATCH', text: `Anchor '^' matches start of string.`, rp, sp });
                        rp++;
                    } else {
                        genSteps.push({ type: 'FAIL', text: `Anchor '^' fails to match at string index ${sp}.`, rp, sp });
                        continue;
                    }
                }
                
                let match = this.tryMatch(pattern, testStr, rp, sp, genSteps);
                if (match.success) {
                    const matchedText = testStr.substring(startPos, match.sp);
                    genSteps.push({ type: 'MATCH', text: `Pattern signature locked: <code>${this.escapeHTML(matchedText)}</code>`, rp: -1, sp: startPos, finalMatch: matchedText });
                    matchFound = true;
                }
            }

            if (!matchFound) {
                genSteps.push({ type: 'FAIL', text: 'Scan complete. No matching signature found.', rp: -1, sp: -1 });
            }
            return genSteps;
        };
        
        this.tryMatch = (pattern, testStr, initialRp, initialSp, genSteps) => {
            let rp = initialRp;
            let sp = initialSp;

            while (rp < pattern.length) {
                const p = pattern[rp];
                const char = testStr[sp];
                const pNext = pattern[rp+1];

                if (p === '$') {
                    if (sp === testStr.length) {
                        genSteps.push({ type: 'MATCH', text: `Anchor '$' matches end of string.`, rp, sp });
                        rp++; continue;
                    } else {
                        genSteps.push({ type: 'FAIL', text: `Anchor '$' fails to match at string index ${sp}.`, rp, sp });
                        return {success: false};
                    }
                }

                if (pNext === '*' || pNext === '+' || pNext === '?') {
                    let min = (pNext === '+') ? 1 : 0;
                    let max = (pNext === '*') ? Infinity : 1;
                    let count = 0;
                    let subMatchSp = sp;
                    while (count < max && this.charMatch(p, testStr[subMatchSp])) {
                        genSteps.push({ type: 'MATCH', text: `Token '${p}' matches '${testStr[subMatchSp]}'`, rp, sp: subMatchSp });
                        subMatchSp++;
                        count++;
                    }
                    if (count >= min) {
                         genSteps.push({ type: 'INFO', text: `Quantifier '${pNext}' satisfied with ${count} matches.`, rp: rp + 1, sp: subMatchSp });
                         rp += 2;
                         sp = subMatchSp;
                         continue;
                    } else {
                        genSteps.push({ type: 'FAIL', text: `Token '${p}${pNext}' failed to satisfy minimum of ${min} matches.`, rp, sp });
                        return {success: false};
                    }
                }
                
                if (this.charMatch(p, char)) {
                    genSteps.push({ type: 'MATCH', text: `Token '${p}' matches '${char}'`, rp, sp });
                    rp++;
                    sp++;
                } else {
                    genSteps.push({ type: 'FAIL', text: `Token '${p}' failed to match '${char || 'end of string'}'`, rp, sp });
                    return {success: false, rp, sp};
                }
            }
            return {success: true, rp, sp};
        };

        this.charMatch = (p, char) => {
            if (char === undefined) return false;
            if (p === '.') return true;
            if (p === '\\d') return /\d/.test(char);
            if (p === '\\w') return /\w/.test(char);
            if (p === '\\s') return /\s/.test(char);
            return p === char;
        };

        const renderStep = (idx) => {
            const step = steps[idx]; if (!step) return;
            explanationLog.innerHTML = steps.slice(0, idx + 1).map(s => `<div class="${s.type.toLowerCase()}">${s.text}</div>`).join('');
            explanationLog.scrollTop = explanationLog.scrollHeight;
            
            let patternHtml = this.escapeHTML(regexInput.value);
            if(step.rp > -1 && step.rp < patternHtml.length) {
                patternHtml = patternHtml.substring(0, step.rp) + `<span class="char-pointer">${patternHtml[step.rp]}</span>` + patternHtml.substring(step.rp + 1);
            }
            patternVisual.innerHTML = patternHtml;

            let stringHtml = this.escapeHTML(testStringInput.value);
            if(step.finalMatch) {
                stringHtml = this.escapeHTML(testStringInput.value.substring(0, step.sp)) + `<span class="char-highlight">${this.escapeHTML(step.finalMatch)}</span>` + this.escapeHTML(testStringInput.value.substring(step.sp + step.finalMatch.length));
            } else if(step.sp > -1) {
                if(step.sp < testStringInput.value.length) {
                    stringHtml = this.escapeHTML(testStringInput.value.substring(0, step.sp)) + `<span class="char-pointer">${this.escapeHTML(testStringInput.value[step.sp])}</span>` + this.escapeHTML(testStringInput.value.substring(step.sp + 1));
                } else {
                     stringHtml += `<span class="char-pointer"> </span>`;
                }
            }
            stringVisual.innerHTML = stringHtml;

            prevStepBtn.disabled = idx === 0; nextStepBtn.disabled = idx >= steps.length - 1; autoPlayBtn.disabled = steps.length <= 1; resetBtn.disabled = steps.length === 0;
        };
        const goToStep = (idx) => { currentStep = Math.max(0, Math.min(idx, steps.length - 1)); renderStep(currentStep); };
        const nextStep = () => { if (currentStep < steps.length - 1) goToStep(currentStep + 1); else stopAutoPlay(); };
        const stopAutoPlay = () => { clearInterval(autoPlayInterval); autoPlayInterval = null; autoPlayBtn.textContent = 'Auto'; };
        visualizeBtn.onclick = () => {
            stopAutoPlay();
            const pattern = regexInput.value;
            const testStr = testStringInput.value;
            if (isPatternComplex(pattern)) {
                steps = generateStepsSimple(pattern, testStr);
            } else {
                steps = generateStepsDetailed(pattern, testStr);
            }
            goToStep(0);
        };
        prevStepBtn.onclick = () => goToStep(currentStep - 1);
        nextStepBtn.onclick = nextStep;
        resetBtn.onclick = () => { stopAutoPlay(); goToStep(0); };
        autoPlayBtn.onclick = () => { if (autoPlayInterval) { stopAutoPlay(); } else { if (currentStep >= steps.length - 1) goToStep(0); autoPlayInterval = setInterval(nextStep, 250); autoPlayBtn.textContent = 'Stop'; } };
    }
    
    initChallengesPage() {
        const select = document.getElementById('challenge-select'), description = document.getElementById('challenge-description'), input = document.getElementById('challenge-input'), charCount = document.getElementById('char-count'), matchList = document.getElementById('match-list'), rejectList = document.getElementById('reject-list');
        CHALLENGES_DATA.forEach((chal, index) => select.add(new Option(chal.name, index)));
        const loadChallenge = (index) => {
            const chal = CHALLENGES_DATA[index];
            description.textContent = chal.desc;
            matchList.innerHTML = chal.match.map(item => `<li data-text="${this.escapeHTML(item)}">${this.escapeHTML(item)}</li>`).join('');
            rejectList.innerHTML = chal.reject.map(item => `<li data-text="${this.escapeHTML(item)}">${this.escapeHTML(item)}</li>`).join('');
            input.value = '';
            validate();
        };
        const validate = () => {
            const pattern = input.value;
            charCount.textContent = `Length: ${pattern.length}`;
            let re; try { re = new RegExp(pattern); } catch (e) { return; }
            if (!pattern) { matchList.querySelectorAll('li').forEach(li => li.className = ''); rejectList.querySelectorAll('li').forEach(li => li.className = ''); return; }
            let allPassed = true;
            matchList.querySelectorAll('li').forEach(li => { const pass = re.test(li.dataset.text); li.className = pass ? 'pass' : 'fail'; if (!pass) allPassed = false; });
            rejectList.querySelectorAll('li').forEach(li => { const pass = !re.test(li.dataset.text); li.className = pass ? 'pass' : 'fail'; if (!pass) allPassed = false; });
            if(allPassed) this.playSound('switch');
        };
        select.addEventListener('change', () => loadChallenge(select.value));
        input.addEventListener('input', validate);
        loadChallenge(0);
    }
    
    initAboutPage() { }
    
    escapeHTML(str) {
        if (!str) return '';
        return str.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
    }
}