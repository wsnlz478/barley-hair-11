/* ============================================================================
 * Barley Hair Transplant — Main JavaScript
 * ----------------------------------------------------------------------------
 * 全站公共交互脚本（66 个页面共用）。
 *
 * 职责分区：
 *   1. 工具函数        — shuffleArray
 *   2. 图片/文案数据源  — hero / before-after / photos / hospital / 评价 / FAQ
 *   3. 渲染函数        — 随机轮播图库、评价、FAQ
 *   4. 交互函数        — FAQ 折叠、复制、分类标签、汉堡菜单、返回顶部
 *   5. 初始化          — DOMContentLoaded 统一挂载
 *
 * 注意：联系表单（form.js / ZF_FORM_CONFIG）由各页面独立内联，不在本文件内。
 * ========================================================================== */

(function () {
    'use strict';

    /* ------------------------------------------------------------------------
     * 1. 工具函数
     * ---------------------------------------------------------------------- */

    /**
     * Fisher–Yates 洗牌，返回打乱后的新数组（不修改原数组）。
     * @param {Array} array
     * @returns {Array}
     */
    function shuffleArray(array) {
        const arr = array.slice();
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    /* ------------------------------------------------------------------------
     * 2. 数据源
     * ---------------------------------------------------------------------- */

    // 首屏 Banner：hero-1 … hero-23
    const heroImages = Array.from({ length: 23 }, (_, i) => `Banner/hero-${i + 1}.jpg`);

    // 首屏文案兜底（当页面无静态 hero 结构时渲染）
    const heroTexts = [
        { title: "Hair Transplant in China", subtitle: "Experience world-class hair restoration - China's pioneer and leader in microneedle hair transplant technology since 2006." },
        { title: "Natural Results That Last", subtitle: "With 30+ direct-operated clinics, 10+ patented technologies, and Sullivan-certified excellence, we deliver remarkable results for patients from around the globe." },
        { title: "Transform Your Look Today", subtitle: "Free consultation available in English! Contact us now to start your hair restoration journey." },
        { title: "Microneedle Technology Leader", subtitle: "Our revolutionary implant pen ensures 360° rotation for natural direction and minimal trauma." },
        { title: "18+ Years of Excellence", subtitle: "Trust the pioneer and leader of microneedle hair transplant in China." }
    ];

    // 植发前后对比图库：5 组来源共 101 张
    const beforeAfterImages = [];
    for (let i = 1; i <= 5; i++) beforeAfterImages.push({ path: `Beard/Beard-${i}.jpg`, type: 'Beard' });
    for (let i = 1; i <= 2; i++) beforeAfterImages.push({ path: `Eyebrow/Eyebrow-${i}.jpg`, type: 'Eyebrow' });
    for (let i = 1; i <= 26; i++) beforeAfterImages.push({ path: `manBald/manBald-${i}.jpg`, type: 'Male Baldness' });
    for (let i = 1; i <= 35; i++) beforeAfterImages.push({ path: `manHairline/manHairline-${i}.jpg`, type: 'Male Hairline' });
    for (let i = 1; i <= 33; i++) beforeAfterImages.push({ path: `women/women-${i}.jpg`, type: 'Female Hair' });

    const beforeAfterCaptions = [
        { title: "Amazing Transformation", desc: "Before and after comparison" },
        { title: "Natural Results", desc: "Real patient transformation" },
        { title: "Transformation Complete", desc: "Remarkable results" },
        { title: "Dramatic Improvement", desc: "Before and after photos" },
        { title: "Natural Looking", desc: "Professional hair restoration" },
        { title: "Perfect Density", desc: "Outstanding results" },
        { title: "Remarkable Transformation", desc: "Before and after comparison" },
        { title: "New Look, New Life", desc: "Patient success story" },
        { title: "Remarkable Results", desc: "Real patient photos" },
        { title: "Excellent Results", desc: "Before and after comparison" }
    ];

    // 医患合影：Photos-1 … Photos-76
    const doctorPatientPhotos = Array.from({ length: 76 }, (_, i) => `Photos/Photos-${i + 1}.jpg`);
    const photoCaptions = [
        { title: "Happy Patient", desc: "Posing with our medical team after successful procedure" },
        { title: "Grateful Patient", desc: "Celebrating fantastic results with our doctors" },
        { title: "Success Story", desc: "Another satisfied patient shares their joy" },
        { title: "Smile Restored", desc: "Patient with our specialist before discharge" },
        { title: "Natural Look Restored", desc: "Happy patient with Dr. Chen post-treatment" },
        { title: "Transformation Success", desc: "Excited patient showing their new look" },
        { title: "Confidence Regained", desc: "Patient delighted with their transformation" },
        { title: "New Journey Begins", desc: "Patient starting fresh with amazing results" }
    ];

    // 医院环境：Hospital-1 … Hospital-73
    const hospitalImages = Array.from({ length: 73 }, (_, i) => `Hospital/Hospital-${i + 1}.jpg`);
    const hospitalCaptions = [
        { title: "Modern Clinic", desc: "Our state-of-the-art facility" },
        { title: "Comfortable Waiting Area", desc: "Relax in our premium lounge" },
        { title: "Operating Room", desc: "Sterile and advanced" },
        { title: "Consultation Room", desc: "Private and professional" },
        { title: "Recovery Area", desc: "Comfortable post-op space" },
        { title: "Reception", desc: "Welcoming entrance" },
        { title: "Treatment Room", desc: "Well-equipped and clean" },
        { title: "Doctor's Office", desc: "Professional workspace" },
        { title: "Clinic Interior", desc: "Modern and welcoming" },
        { title: "Modern Facilities", desc: "Designed for your comfort" }
    ];

    // 患者评价（仅当页面无静态评价时兜底渲染）
    const testimonialsData = [
        { name: "James Wilson", country: "USA", text: "Amazing results! The team at Barley was incredibly professional and the results exceeded all my expectations. Highly recommend to anyone considering hair transplant.", initials: "JW" },
        { name: "Sarah Chen", country: "Canada", text: "From start to finish, the experience was wonderful. The doctors were so knowledgeable and the staff spoke excellent English. My hair looks completely natural!", initials: "SC" },
        { name: "Michael Brown", country: "UK", text: "I traveled from London to Shanghai for my procedure and it was worth every mile. The microneedle technology is incredible and recovery was much faster than I expected.", initials: "MB" },
        { name: "David Kim", country: "South Korea", text: "Professional, friendly, and the results speak for themselves. I'm so happy with my decision to choose Barley. The aftercare was also fantastic!", initials: "DK" },
        { name: "Emma Johnson", country: "Australia", text: "Best decision ever! The team made me feel so comfortable throughout the entire process. My hairline looks amazing and I feel so much more confident.", initials: "EJ" },
        { name: "Robert Taylor", country: "Germany", text: "Exceptional service from beginning to end. The doctors are true experts in their field. I couldn't be happier with the results!", initials: "RT" }
    ];

    // FAQ 兜底数据（仅当页面无静态 FAQ 时渲染）
    const faqData = [
        { q: "How long does a hair transplant procedure take?", a: "The duration depends on the number of grafts needed. Typically, a procedure takes 4-8 hours. Our team will provide you with a precise timeline during your consultation." },
        { q: "When will I see results?", a: "You'll start seeing new hair growth at 3-4 months. Maximum results are typically visible at 12-18 months post-procedure as the hair continues to thicken and mature." },
        { q: "Is the procedure painful?", a: "We use local anesthesia to ensure you're comfortable throughout the procedure. Most patients report minimal discomfort and can watch movies or listen to music during treatment." },
        { q: "How soon can I return to work?", a: "Most patients can return to desk work within 2-3 days. For more physical jobs, we recommend waiting 7-10 days. Our team will provide specific aftercare instructions." },
        { q: "Are the results permanent?", a: "Yes! The transplanted hair is taken from the donor area (back of the head) which is genetically resistant to DHT and hair loss. These hairs will continue to grow naturally for a lifetime." },
        { q: "Do you offer consultations in English?", a: "Absolutely! We have English-speaking staff available for consultations and throughout your treatment journey to ensure clear communication." },
        { q: "What is microneedle hair transplant?", a: "Microneedle transplant uses a specialized implant pen that allows 360° rotation for natural hair direction. It results in smaller incisions (0.6-1.0mm), faster recovery, and higher density." },
        { q: "Can I wash my hair after the procedure?", a: "Yes! With our microneedle technology, most patients can wash their hair gently within 24 hours. We'll provide you with detailed instructions for proper care." },
        { q: "What is the cost of hair transplant?", a: "The cost varies depending on the number of grafts needed and the specific procedure. We offer competitive pricing and flexible payment options. Contact us for a personalized quote." },
        { q: "Do you have clinics in other cities?", a: "Yes! We have 30+ direct-operated clinics across major Chinese cities including Beijing, Shanghai, Shenzhen, Guangzhou, Chengdu, and many more." }
    ];

    /* ------------------------------------------------------------------------
     * 3. 渲染函数
     * ---------------------------------------------------------------------- */

    /** 首屏：已有静态 slide 时仅替换图片 src，保留页面原生文案（利于 SEO）。 */
    function renderHero() {
        const container = document.getElementById('heroSlides');
        if (!container) return;
        const selected = shuffleArray(heroImages).slice(0, 3);

        const existing = container.querySelectorAll('.hero-slide');
        if (existing.length > 0) {
            existing.forEach((slide, index) => {
                const img = slide.querySelector('img');
                if (img && selected[index]) img.src = selected[index];
            });
            return;
        }

        container.innerHTML = selected.map((img, index) => {
            const text = heroTexts[index % heroTexts.length];
            return `
                <div class="hero-slide">
                    <img src="${img}" alt="Hero ${index + 1}" loading="eager" fetchpriority="high">
                    <div class="hero-overlay">
                        <div class="hero-content">
                            <h1>${text.title}</h1>
                            <p>${text.subtitle}</p>
                            <a href="contact.html" class="btn">Get Free Consultation</a>
                        </div>
                    </div>
                </div>`;
        }).join('');
    }

    /** 植发前后对比：每次刷新随机取 6 张。 */
    function renderBeforeAfter() {
        const container = document.getElementById('beforeAfterGallery');
        if (!container) return;
        const selected = shuffleArray(beforeAfterImages).slice(0, 6);
        container.innerHTML = selected.map((item, index) => {
            const caption = beforeAfterCaptions[index % beforeAfterCaptions.length];
            return `
                <div class="gallery-item">
                    <img src="${item.path}" alt="${item.type}" loading="lazy" decoding="async">
                    <div class="gallery-overlay">
                        <h4>${caption.title}</h4>
                        <p>${caption.desc}</p>
                    </div>
                </div>`;
        }).join('');
    }

    /** 医患合影：每次刷新随机取 8 张。 */
    function renderDoctorPatientPhotos() {
        const container = document.getElementById('doctorPatientPhotos');
        if (!container) return;
        const selected = shuffleArray(doctorPatientPhotos).slice(0, 8);
        container.innerHTML = selected.map((path, index) => {
            const caption = photoCaptions[index % photoCaptions.length];
            return `
                <div class="photo-item">
                    <img src="${path}" alt="Patient Photo ${index + 1}" loading="lazy" decoding="async">
                    <div class="photo-caption">
                        <h4>${caption.title}</h4>
                        <p>${caption.desc}</p>
                    </div>
                </div>`;
        }).join('');
    }

    /** 医院环境：每次刷新随机取 6 张。 */
    function renderHospitalGallery() {
        const container = document.getElementById('hospitalGallery');
        if (!container) return;
        const selected = shuffleArray(hospitalImages).slice(0, 6);
        container.innerHTML = selected.map((path, index) => {
            const caption = hospitalCaptions[index % hospitalCaptions.length];
            return `
                <div class="hospital-item">
                    <img src="${path}" alt="Hospital ${index + 1}" loading="lazy" decoding="async">
                    <div class="hospital-caption">
                        <h4>${caption.title}</h4>
                        <p>${caption.desc}</p>
                    </div>
                </div>`;
        }).join('');
    }

    /** 患者评价：页面已有静态评价则不覆盖（各页定制内容优先）。 */
    function renderTestimonials() {
        const container = document.getElementById('testimonials');
        if (!container || container.querySelector('.testimonial-card')) return;
        container.innerHTML = testimonialsData.map(t => `
            <div class="testimonial-card">
                <div class="testimonial-stars">
                    <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                    <i class="fas fa-star"></i><i class="fas fa-star"></i>
                </div>
                <p class="testimonial-text">"${t.text}"</p>
                <div class="testimonial-author">
                    <div class="testimonial-avatar">${t.initials}</div>
                    <div class="testimonial-info">
                        <h4>${t.name}</h4>
                        <p><i class="fas fa-map-marker-alt"></i> ${t.country}</p>
                    </div>
                </div>
            </div>`).join('');
    }

    /** FAQ：页面已有静态问答则不覆盖。 */
    function renderFAQ() {
        const container = document.getElementById('faqContainer');
        if (!container || container.querySelector('.faq-item')) return;
        container.innerHTML = faqData.map((faq, index) => `
            <div class="faq-item ${index === 0 ? 'active' : ''}">
                <div class="faq-question" onclick="toggleFAQ(this)">
                    <span>${faq.q}</span><i class="fas fa-chevron-down"></i>
                </div>
                <div class="faq-answer">${faq.a}</div>
            </div>`).join('');
    }

    /* ------------------------------------------------------------------------
     * 4. 交互函数
     * ---------------------------------------------------------------------- */

    /**
     * FAQ 折叠切换（统一入口，合并原 toggleFAQ / toggleFAQElement 的重复逻辑）。
     * 兼容两种调用：传入 DOM 元素（onclick="toggleFAQ(this)"）或数字索引。
     * @param {HTMLElement|number} target
     */
    function toggleFAQ(target) {
        if (typeof target === 'number') {
            const items = document.querySelectorAll('.faq-item');
            if (items[target]) items[target].classList.toggle('active');
            return;
        }
        if (!target) return;
        const faqItem = target.closest ? target.closest('.faq-item') : null;
        if (faqItem) faqItem.classList.toggle('active');
    }

    /** 兼容旧引用名：转发到统一入口，避免任何页面的调用失效。 */
    function toggleFAQElement(element) {
        toggleFAQ(element);
    }

    /** 复制文本到剪贴板，失败时降级到 execCommand。 */
    function copyToClipboard(text, label) {
        // navigator.clipboard 仅在 HTTPS / localhost 可用；HTTP 环境直接走 execCommand 降级
        if (!navigator.clipboard || !navigator.clipboard.writeText) {
            legacyCopy(text, label);
            return;
        }
        navigator.clipboard.writeText(text).then(function () {
            showCopySuccess(label);
        }).catch(function () {
            legacyCopy(text, label);
        });
    }

    /** 旧浏览器 / HTTP 环境下的复制降级方案。 */
    function legacyCopy(text, label) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            if (document.execCommand('copy')) {
                showCopySuccess(label);
            } else {
                console.warn('Copy command was rejected by the browser.');
            }
        } catch (e) {
            console.error('Copy failed:', e);
        }
        document.body.removeChild(textarea);
    }

    /** 显示“已复制”轻提示，2.5 秒后自动隐藏。 */
    function showCopySuccess(label) {
        let notification = document.getElementById('copy-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'copy-notification';
            notification.className = 'copy-notification';
            notification.innerHTML = '<i class="fas fa-check-circle"></i> <span id="copy-text"></span>';
            document.body.appendChild(notification);
        }
        const copyText = document.getElementById('copy-text');
        if (copyText) copyText.textContent = `${label} copied!`;
        notification.classList.add('show');
        setTimeout(() => notification.classList.remove('show'), 2500);
    }

    /** FAQ 分类标签切换。 */
    function initFAQCategories() {
        const tabs = document.querySelectorAll('.category-tab');
        const categories = document.querySelectorAll('.faq-category');
        if (tabs.length === 0 || categories.length === 0) return;

        categories.forEach(cat => cat.classList.add('active'));
        tabs.forEach(tab => {
            tab.addEventListener('click', function () {
                const categoryId = this.getAttribute('data-category');
                tabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                if (categoryId === 'all') {
                    categories.forEach(cat => cat.classList.add('active'));
                } else {
                    categories.forEach(cat => cat.classList.remove('active'));
                    const target = document.getElementById(categoryId);
                    if (target) target.classList.add('active');
                }
            });
        });
    }

    /** 移动端汉堡菜单开合（打开时锁定页面滚动）。 */
    function toggleHamburger() {
        const hamburger = document.querySelector('.hamburger');
        const nav = document.querySelector('nav');
        if (!hamburger || !nav) return;
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    }

    /** 返回顶部按钮：滚动超过 300px 显示，点击平滑滚动回顶。 */
    function initBackToTop() {
        const btn = document.createElement('button');
        btn.className = 'back-to-top';
        btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        document.body.appendChild(btn);

        window.addEventListener('scroll', function () {
            btn.classList.toggle('show', window.scrollY > 300);
        }, { passive: true });

        btn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ------------------------------------------------------------------------
     * 5. 初始化
     * ---------------------------------------------------------------------- */
    document.addEventListener('DOMContentLoaded', function () {
        renderHero();
        renderBeforeAfter();
        renderDoctorPatientPhotos();
        renderTestimonials();
        renderHospitalGallery();
        renderFAQ();
        initFAQCategories();
        initBackToTop();

        const hamburger = document.querySelector('.hamburger');
        if (hamburger) hamburger.addEventListener('click', toggleHamburger);

        // 点击导航链接后自动收起移动端菜单
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', function () {
                const hamburger = document.querySelector('.hamburger');
                const nav = document.querySelector('nav');
                if (hamburger && nav) {
                    hamburger.classList.remove('active');
                    nav.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });
    });

    // 注意：原自动轮播 (setInterval(nextSlide, 5000)) 已被有意禁用，
    // 相关 goToSlide/nextSlide/currentSlide 死代码已移除；首屏静态展示 3 张。

    // 暴露为全局，兼容页面内联 onclick 调用（FAQ / 复制等）
    window.toggleFAQ = toggleFAQ;
    window.toggleFAQElement = toggleFAQElement;
    window.copyToClipboard = copyToClipboard;
})();
