document.addEventListener('DOMContentLoaded', function () {
    // ========== 移动端菜单侧滑切换 ==========
    const menuToggle = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                if (navMenu.classList.contains('active')) {
                    icon.classList.remove('ri-menu-line');
                    icon.classList.add('ri-close-line');
                } else {
                    icon.classList.remove('ri-close-line');
                    icon.classList.add('ri-menu-line');
                }
            }
        });
    }

    // 点击导航链接后关闭移动端菜单
    const navLinks = document.querySelectorAll('.nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const icon = menuToggle?.querySelector('i');
                if (icon) {
                    icon.classList.remove('ri-close-line');
                    icon.classList.add('ri-menu-line');
                }
            }
        });
    });

    // 当前页面高亮
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });

    // ========== 表单提交（首页） ==========
    const form = document.getElementById('quoteFormHome');
    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;

            const formData = new FormData(form);
            formData.append('_from', 'Guangbo Website Homepage');

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();
                if (result.success) {
                    alert('Thank you! We will get back to you within 24 hours.');
                    form.reset();
                } else {
                    alert('Submission failed. Please try again or contact us directly.');
                    console.error('Web3Forms error:', result);
                }
            } catch (error) {
                console.error('Network error:', error);
                alert('A network error occurred. Please check your connection and try again.');
            } finally {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // ========== 移动端 Products 下拉菜单 ==========
    const dropdowns = document.querySelectorAll('.nav-item-dropdown');
    dropdowns.forEach(dropdown => {
        const triggerLink = dropdown.querySelector('a:first-child');
        if (!triggerLink) return;

        triggerLink.addEventListener('click', function (e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdowns.forEach(other => {
                    if (other !== dropdown && other.classList.contains('open')) {
                        other.classList.remove('open');
                    }
                });
                dropdown.classList.toggle('open');
            }
        });
    });

    // ========== 滚动连续渐变动画（跟随滚动实时更新，不一次性固定） ==========
    // 获取所有需要动画的元素
    const animatedElements = document.querySelectorAll('.reveal-on-scroll');
    if (animatedElements.length === 0) return;

    // 动画范围：元素中心点距离视口中心超过此值（px）时完全隐藏，否则按比例显示
    // 采用视口高度的 60% 作为过渡范围，使动画更自然
    let range = window.innerHeight * 0.6;
    let ticking = false;

    // 更新范围（窗口大小改变时重新计算）
    function updateRange() {
        range = window.innerHeight * 0.6;
    }

    // 核心动画函数：计算每个元素的透明度与位移
    function updateAnimation() {
        const viewportHeight = window.innerHeight;
        const viewportCenter = viewportHeight / 2;

        animatedElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const elementCenter = (rect.top + rect.bottom) / 2;
            // 元素中心点到视口中线的距离
            let distance = Math.abs(elementCenter - viewportCenter);
            // 进度: 0 = 完全隐藏 (距离超过 range), 1 = 完全显示 (中心点与中线重合)
            let progress = 1 - Math.min(1, distance / range);
            // 使用缓动曲线让动画更平滑
            progress = 1 - Math.pow(1 - progress, 3);

            // 透明度 (0 到 1)
            const opacity = progress;
            // 位移 (从 30px 到 0px)
            const translateY = (1 - progress) * 30;

            // 直接设置内联样式，覆盖 CSS 的初始类样式
            el.style.opacity = opacity;
            el.style.transform = `translateY(${translateY}px)`;
        });

        ticking = false;
    }

    // 滚动和 resize 事件节流
    function requestUpdate() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateAnimation();
                ticking = false;
            });
            ticking = true;
        }
    }

    // 监听滚动和窗口大小变化
    window.addEventListener('scroll', requestUpdate);
    window.addEventListener('resize', () => {
        updateRange();
        requestUpdate();
    });

    // 立即执行一次初始动画
    updateAnimation();
});